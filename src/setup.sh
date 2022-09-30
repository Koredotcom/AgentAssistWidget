#!/bin/sh -xv

bold=$(tput bold)
normal=$(tput sgr0)
echo
echo "${bold}Please make sure you have enabled the required settings in your Zendesk Account${normal}" 
echo 
read -r -p "Are You Sure? [Y/n] " input

case $input in
    [yY][eE][sS]|[yY])
    sudo apt-get install jq -y

    BASE_URL=$(jq -r '.zendeskBaseUrl' ./AAZ_app/assets/config.json);

    echo $BASE_URL
    echo "-------- base url ------------"
    URL="$BASE_URL/api/sunshine/objects/types";
    TOKEN=$(jq -r '.token' ./AAZ_app/assets/config.json);
    EMAIL=$(jq -r '.email' ./AAZ_app/assets/config.json);

    # echo "----------------------------------------"
    # echo "             $URL                       "
    # echo "             $EMAIL                     "
    # echo "----------------------------------------"
    
    for SCHEMA_FILE in schema.json
    do
      CREATE_SCHEMA="$(curl -X POST -H "Content-type: application/json" -u $EMAIL'/token:'$TOKEN --data @"$SCHEMA_FILE"  $URL)";
    echo "---------- schema -----------------"
    echo $CREATE_SCHEMA

    # if [ $CREATE_SCHEMA = "201" ]; then
        # echo "Schema has been created....";
    data=`cat './AAZ_app/assets/config.json' | jq '.data' `
    echo $data
    DATA_URL="$BASE_URL/api/sunshine/objects/records";
    for DATA_FILE in data.json
    do
      echo $DATA_FILE
      #POST_DATA="$(curl -o /dev/null -s -w '%{http_code}' -X POST -H "Content-type: application/json" -u $EMAIL'/token:'$TOKEN -d $data)";
      POST_DATA="$(curl -X POST -H "Content-type: application/json" -u $EMAIL'/token:'$TOKEN --data @"$DATA_FILE" "$DATA_URL")";
      echo "Zendesk Id: "
      id=$(echo "$POST_DATA" | jq '.data.id');
      echo $id
      echo "---------- ID -----------------"
      # jq '.dataUUID='$id ' < ./AAZ_app/assets/config.json'
      jq -c '. + { "dataUUID": '$id' }' ./AAZ_app/assets/config.json > tmp.$$.json && mv tmp.$$.json ./AAZ_app/assets/config.json

    done

    # else
    #     echo "Unable to save the schema..."
    #     exit 1
    # fi
    rbenv install 2.6.9
    rbenv global 2.6.9
    ruby -v
    source ~/.bashrc
    gem install rake
    gem install zendesk_apps_tools
    echo "ZAT Version: "
    zat -v
    cd AAZ_app
    zat validate
    zat package

    cd ../
    [ -e "tmp.*.json" ] && rm "tmp.*.json"
  done
        echo
        ;;
    [nN][oO]|[nN])
        echo "Aborted."
        exit 1
        ;;
    *)
    echo "Invalid input..."
        exit 1
        ;;
esac
