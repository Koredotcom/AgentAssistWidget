#!/bin/sh

if [ $# -eq 0 ]
  then
    echo "File name as command line agrument is required."
    exit 1
    
fi
#Installing the twilio CLI
echo "Installing necessary plugins"
npm install -g twilio-cli

file_name=$1
echo "copying the configuration........"

#copy config to agentassit function, file should be in the .env file format
cp $file_name AgentAssist-function/.env
. ./$file_name

#echo $ACCOUNT_SID
#echo $AUTH_TOKEN
echo
pwd

###################################################################
#######    Agent Assist Function Deployement start          #######
###################################################################
cd AgentAssist-function
echo "changed directory $(pwd)"
npm i

#delete .twiliodeployinfo if exists
file=".twiliodeployinfo"

if [ -f "$file" ] ; then
    rm "$file"
    echo "$file has been removed......"
    echo
fi

export TWILIO_ACCOUNT_SID=$ACCOUNT_SID
export TWILIO_AUTH_TOKEN=$AUTH_TOKEN

sleep 5s
DEPLOY=$(npx twilio-run deploy)

###################################################################
#######    RUNTIME URL to Twilio Configuration              #######
###################################################################

#regex='/(?:(?:https?|ftp):\/\/)?[\w\/\-?=%.]+\.twil.io\/sts/gm'

DOMAIN=$(echo "$DEPLOY" | grep -oP 'https:\/\/?[\w\/\-?=%.]+\.twil.io\/sts')

echo "*****************************************"
echo "Your twilio serverless URL is $DOMAIN"
echo "*****************************************"
echo
FLEX_BODY=$(cat<<-EOF
		{
		    "account_sid": "$TWILIO_ACCOUNT_SID",
		    "attributes": {
			"kore_agent_assist": {
			    "runtime_service": "$DOMAIN"
			}
		    }
		}
		EOF
		)
echo "Selverless POST call body"
echo $FLEX_BODY

if [ "$(curl -sL -w '%{http_code}' -X POST https://flex-api.twilio.com/v1/Configuration -H "Content-Type: application/json" -d "$FLEX_BODY" --user "$ACCOUNT_SID:$AUTH_TOKEN" -o /dev/null)" = "200" ]; then
    echo "Serverless URL '$DOMAIN' has been saved to twilio configuration.........."
else
    echo "Unable to saved the configuration, please check..........."
    exit 1
fi
echo

###################################################################
#######         Twilio Flex Bulid                           #######
###################################################################
cd ../AgentAssist
echo "change in directory, current directory is $(pwd)"
export TWILIO_ACCOUNT_SID=$ACCOUNT_SID
export TWILIO_AUTH_TOKEN=$AUTH_TOKEN
export NODE_OPTIONS=--openssl-legacy-provider
sudo npm install
sleep 5s 
echo
echo "Node version ---------> $(node -v)"
echo "Twilio Flex build in progress........"
npx twilio flex:plugins:build
echo


###################################################################
#######         Twilio Flex Deploy                          #######
###################################################################
echo "twilio flex deploy about to start......"
sleep 5s
FLEX_DEPLOY=$(npx twilio flex:plugins:deploy --major --changelog "Setting up the environment" --description "Setting UP")
FLEX_RELEASE=$(echo $FLEX_DEPLOY | grep -oP 'twilio flex?[\w\/\-?=%.:@" ]+\."')

###################################################################
#######         Twilio Flex Release                         #######
###################################################################
echo "Deploying the flex application is completed, Now executing twilio release command"
sleep 5s
echo
eval "npx $FLEX_RELEASE"
