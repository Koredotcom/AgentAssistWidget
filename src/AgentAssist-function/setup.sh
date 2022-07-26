# !/bin/sh
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)

# echo $ACCOUNT_SID
# echo $AUTH_TOKEN
echo

###################################################################
#######    Agent Assist Function Deployement start          #######
###################################################################
echo "current directory $(pwd)"
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
echo
if [ "$(curl -sL -w '%{http_code}' -X POST https://flex-api.twilio.com/v1/Configuration -H "Content-Type: application/json" -d "$FLEX_BODY" --user "$ACCOUNT_SID:$AUTH_TOKEN" -o /dev/null)" = "200" ]; then
    echo "Serverless URL '$DOMAIN' has been saved to twilio configuration.........."
else
    echo "Unable to saved the configuration, please check..........."
    exit 1
fi
echo
