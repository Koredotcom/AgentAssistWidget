export const supportedLiveAgents = [
    {
    "label": "Service Now",
    "key": "serviceNow",
    "description": "Service Now Live Chat Agent",
    "icon": "https://files.kore.ai/api/getMediaStream/market/f-c903ec2a-9bbd-560e-94d2-bd98e8eb813f.png",
    "fields": [
        {
            "label": "Host",
            "key": "host",
            "type": "URL",
            "fieldType": "textbox",
            "placeholder": "https://kore.servicenow.com",
            "helpText": "Service Now Host URL",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "User Name",
            "key": "userId",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Username Ex: admin",
            "helpText": "Name of the Service Now user",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": "256"
        },
        {
            "label": "Password",
            "key": "password",
            "type": "password",
            "fieldType": "textbox",
            "placeholder": "Enter password",
            "helpText": "Name of the Service Now user",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": "256"
        },
        {
            "label": "Queue ID",
            "key": "queueId",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Queue ID Ex: 4bc7axxxxxxxxxxxxxxxxxxx81d3ae44",
            "helpText": "Identity for the Queue",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": "256"
        },
        {
            "label": "Webhook URL",
            "key": "webhookURL",
            "type": "string",
            "fieldType": "textbox",
            "helpText": "Webhook URL",
            "placeholder": "",
            "isEditable": false,
            "isRequired": true,
            "minLength": 1,
            "maxLength": "256"
        }
    ]
},
{
    "label": "SalesForce",
    "key": "salesForce",
    "description": "SalesForce Live Chat Agent",
    "icon": "https://files.kore.ai/api/getMediaStream/market/f-c903ec2a-9bbd-560e-94d2-bd98e8eb813f.png",
    "fields": [{
            "label": "Live Agent URL",
            "key": "liveAgentUrl",
            "type": "string",
            "defaultValue":"https://d.la2-c1-ia2.salesforceliveagent.com/chat/rest",
            "fieldType": "textbox",
            "placeholder": "",
            "helpText": "Live Agent URL",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Organization ID",
            "key": "organizationId",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "00D1Uxxxxxxu2eo",
            "helpText": "Id of Organization",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Deployment ID",
            "key": "deploymentId",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "5721UxxxxxxVBok",
            "helpText": "ID of Deployment",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Button ID",
            "key": "buttonId",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "5731UxxxxxxVDWQ",
            "helpText": "Id of Button",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "SFDC Token URL",
            "key": "SFDC_TOKEN_URL",
            "type": "string",
            "defaultValue":"",
            "fieldType": "textbox",
            "placeholder": "https://test.salesforce.com",
            "helpText": "SalesForce Dot Com Token URL",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "SFDC API URL",
            "key": "SFDC_API_URL",
            "type": "string",
            "defaultValue":"",
            "fieldType": "textbox",
            "placeholder": "https://someenv.my.salesforce.com",
            "helpText": "SalesForce Dot Com API URL",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Client ID",
            "key": "client_id",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "5731UxxxxxxVDWQ",
            "helpText": "Id of Button",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Client Secret",
            "key": "client_secret",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "5731UxxxxxxVDWQ",
            "helpText": "Id of Button",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        }
    ]
},
{
    "label": "Unblu",
    "key": "unblu",
    "description": "Unblu Live Chat Agent",
    "icon": "https://files.kore.ai/api/getMediaStream/market/f-c903ec2a-9bbd-560e-94d2-bd98e8eb813f.png",
    "fields": [{
            "label": "Unblu Host URL",
            "key": "unbluHostUrl",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Host URL",
            "helpText": "URL of your Unblu application. For example, use https://www.unblu.com/ for Unblu cloud.",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Unblu Account Username",
            "key": "username",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Username",
            "helpText": "Provide your Unblu account username",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Unblu Account Password",
            "key": "password",
            "type": "password",
            "fieldType": "textbox",
            "placeholder": "Enter password",
            "helpText": "Provide the password associated with your Unblu username",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Unblu Bot Name",
            "key": "name",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Unblu bot name",
            "helpText": "Provide a name you would like to use for your Unblu bot",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Unblu Bot Description",
            "key": "description",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Description",
            "helpText": "Provide a short description of your Unblu bot",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Bot Person",
            "key": "firstName",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter bot person name",
            "helpText": "Provide a Name to represent the Unblu bot to your users",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Secret Key",
            "key": "secret",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter secret key",
            "helpText": "Provide a confidential key to secure the communication between Unblu and Kore.ai bots",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Named Area",
            "key": "namedAreaNames",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Enter Named Area name",
            "helpText": "Provide the Named Area you would like to associated with your Kore.ai bot",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        }
    ]
},
{
    "label": "Custom",
    "key": "custom",
    "description": "Custom Integration with your own botkit",
    "icon": "https://files.kore.ai/api/getMediaStream/market/f-c903ec2a-9bbd-560e-94d2-bd98e8eb813f.png",
    "fields": [
        {
            "label": "App name",
            "key": "sdkClientId",
            "type": "string",
            "fieldType": "dynamiclist",
            "placeholder": "",
            "isEditable": true,
            "isRequired": true,
            "helpText": "",
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "CALLBACK URL",
            "key": "sdkHostUri",
            "type": "string",
            "fieldType": "textbox",
            "placeholder": "Callback url",
            "isEditable": true,
            "isRequired": true,
            "helpText": "",
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "PII Data",
            "key": "PIIMaskingDisabledForAgentTransfer",
            "type": "selection",
            "fieldType": "radio",
            "defaultValue": "true",
            "listOfValues": [
                {
                    key: "false",
                    label: "Mask and send sensitive data to Agent BotKit"
                },
                {
                    key: "true",
                    label: "Do not mask and send original data to Agent BotKit"
                }
            ],
            "helpText": "Define how sensitive information should be forwarded to Agent BotKit when PII redaction is enabled and agent session is in progress",
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        },
        {
            "label": "Access using a connector",
            "key": "connectorEnabled",
            "type": "selection",
            "fieldType": "radio",
            "defaultValue": "false",
            "listOfValues": [
                {
                    key: "false",
                    label: "No, all URLs are in public domain"
                },
                {
                    key: "true",
                    label: "Yes, URLs are behind a firewall and a connector has been setup"
                }
            ],
            "isEditable": true,
            "isRequired": true,
            "minLength": 1,
            "maxLength": 256
        }
    ]
}
]