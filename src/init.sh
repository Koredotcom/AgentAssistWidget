#!/bin/sh
if [ $# -eq 0 ]
  then
    echo "File name as command line agrument is required."
    exit 1
    
fi
#Installing the twilio CLI
echo "Installing necessary plugins"
#npm install -g twilio-cli

file_name=$1
echo "copying the configuration........"

#copy config to agentassit function, file should be in the .env file format
cp $file_name AgentAssist-function/.env
sleep 5s

echo "Agent assist function deployment starts............"
cd AgentAssist-function
sh setup.sh
echo "Agent Assist function deployed."
echo
cd ../AgentAssist
sh setup.sh