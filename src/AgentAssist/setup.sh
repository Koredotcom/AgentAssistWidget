#!/bin/sh
if [ $# -eq 0 ]
  then
    echo "File name as command line agrument is required."
    exit 1
    
fi
file_name=$1
if [ ! -f "../$file_name" ]; then
    echo "$file_name does not exist."
else
    echo "file exists...."
    cp "../$file_name" .env
fi
###################################################################
#######         Twilio Flex Bulid                           #######
###################################################################


[ ! -f .env ] || export $(grep -v '^#' .env | xargs)
echo "change in directory, current directory is $(pwd)"
export TWILIO_ACCOUNT_SID=$ACCOUNT_SID
export TWILIO_AUTH_TOKEN=$AUTH_TOKEN

# echo $TWILIO_ACCOUNT_SID
# echo $TWILIO_AUTH_TOKEN
echo
#export NODE_OPTIONS=--openssl-legacy-provider
npm i --legacy-peer-deps
npm install
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
echo "Flex has been deployed...."
echo
