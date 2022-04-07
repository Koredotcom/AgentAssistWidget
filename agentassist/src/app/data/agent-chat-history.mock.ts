
export const AGENT_DATA = {
  "conversationInfo": {
    "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
    "callId": "c123345567787978957636346436346346",
    "sessionStartTime": "2020-10-01T13:41:25.612Z",
    "agentHandOffTime": "2020-10-01T13:51:20.805Z",
    "userDetails": {
      "phoneNumber": "",
      "firstName": "",
      "lastName": ""
    },
    "currentTask": "connecttoagent",
    "sentimentAnalysis": {
      "messageTone": [
        {
          "tone_name": "positive",
          "level": -2,
          "count": 1
        }
      ],
      "dialogTone": [
        {
          "tone_name": "positive",
          "level": -2,
          "count": 2
        }
      ]
    },
    "conversationDetails": [
      {
        "channel": "twiliovoice",
        "conversationInfo": {
          "sessionTags": [
            {
              "tagName": "welcomeMessageTwilio",
              "tagValue": "1"
            },
            {
              "tagName": "voiceAutomation",
              "tagValue": "1"
            },
            {
              "tagName": "voiceAutomationSuccess",
              "tagValue": "1"
            },
            {
              "tagName": "phoneNumberStart",
              "tagValue": "1"
            },
            {
              "tagName": "smsNodeStart",
              "tagValue": "1"
            },
            {
              "tagName": "smsNodeEnd",
              "tagValue": "1"
            },
            {
              "tagName": "smsNodeExecuted",
              "tagValue": "1"
            }
          ],
          "conversationFlow": [
            {
              "status": "unidentifiedIntent",
              "messageStoreId": "ms-ae93c873-89ae-56c3-98cb-9363b2edd517",
              "userInput": "Committed the movie."
            },
            {
              "status": "completedTask",
              "messageStoreId": "ms-7cb468df-e3cb-5e40-a516-1780e8bf667a",
              "taskName": "welcomeDialog"
            },
            {
              "status": "identifiedIntent",
              "userInput": "What can you do?",
              "messageStoreId": "ms-7cb468df-e3cb-5e40-a516-1780e8bf667a",
              "taskName": "smalltalk Matched"
            }
          ],
          "sentimentAnalysis": {
            "messageTone": [
              {
                "tone_name": "positive",
                "level": -2,
                "count": 1
              }
            ],
            "dialogTone": [
              {
                "tone_name": "positive",
                "level": -2,
                "count": 2
              }
            ]
          },
          "userDetails": {},
          "userTags": [
            {
              "tagName": "callerNumber",
              "tagValue": "+266696687"
            }
          ],
          "sessionStartTime": "2020-10-01T13:41:25.612Z"
        }
      },
      {
        "channel": "rtm",
        "conversationInfo": {
          "sessionTags": [],
          "conversationFlow": [
            {
              "status": "unidentifiedIntent",
              "messageStoreId": "ms-ae93c873-89ae-56c3-98cb-9363b2edd517",
              "userInput": "Committed the movie."
            },
            {
              "status": "completedTask",
              "messageStoreId": "ms-7cb468df-e3cb-5e40-a516-1780e8bf667a",
              "taskName": "welcomeDialog"
            },
            {
              "status": "identifiedIntent",
              "userInput": "What can you do?",
              "messageStoreId": "ms-7cb468df-e3cb-5e40-a516-1780e8bf667a",
              "taskName": "smalltalk Matched"
            }
          ],
          "sentimentAnalysis": {
            "messageTone": [
              {
                "tone_name": "positive",
                "level": -2,
                "count": 1
              }
            ],
            "dialogTone": [
              {
                "tone_name": "positive",
                "level": -2,
                "count": 2
              }
            ]
          },
          "userDetails": {},
          "userTags": [
            {
              "tagName": "callerNumber",
              "tagValue": "+266696687"
            }
          ],
          "sessionStartTime": "2020-10-01T13:44:58.737Z",
          "currentTask": "connecttoagent"
        }
      }
    ]
  },
  "chatHistory": [
    {
      "_id": "ms-fe89d993-e770-5700-8085-7d805d1fb2a0",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "ringing",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:41:27.390Z",
      "lmodifiedOn": "2020-10-01T13:41:27.390Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-d7d6694e-e78d-5d3a-847a-919b7a9ad19a",
          "cT": "text",
          "data": {
            "text": "Hello. I am your Virtual Assistant. How can I help you today"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "welcomeDialog",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559687402,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-a2c64bd1-ae96-52e3-ade3-bf62eedfcd79",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "What can you do?",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.98762906",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "What can you do?",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "07q2ZqigG8-B2jtF29RSrA$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:41:38.288Z",
      "lmodifiedOn": "2020-10-01T13:41:38.556Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-5ba46c80-d0b5-51a6-8e2d-862258e125bc",
          "cT": "text",
          "data": {
            "text": "What can you do?"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559698292,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "tr0_I": "help_ff92eb29",
      "tr_isSS": 1,
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-61a280cb-c1ed-56e5-9061-65787c7ae2f1",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.98762906",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "What can you do?",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:41:39.899Z",
      "lmodifiedOn": "2020-10-01T13:41:39.899Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-69759e7f-cb44-5019-8e0e-0ca934df2e12",
          "cT": "text",
          "data": {
            "text": "I can help you with the Tasks which are avaiable."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559699904,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-92d679cb-ec1a-5ab9-b55c-69acc6c8e1da",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "very sarcastic",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.76504374",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "very sarcastic",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "vzQjv4VGfkgxLEbPt3EJlQ$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:41:47.936Z",
      "lmodifiedOn": "2020-10-01T13:41:48.071Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-db5864b4-b4ff-5782-b8ab-d034a7b05943",
          "cT": "text",
          "data": {
            "text": "very sarcastic"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559707941,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "nodeType": 0,
      "path": "dg-1e4574ee-e245-5962-9889-760f3fee1c20:entity17>dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0>dg-57e3c547-8e08-543d-ba1a-2f9758524266:script11",
      "tr0_I": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0:7179a0cd23136969c73ca329e609f24c",
      "tr0_O": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:dialogAct2:522d821e7dc4c41ed8bc83e80081a581",
      "tr0_T": "0",
      "tr_pId": "help_ff92eb29",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-22d29dff-2138-51ea-a0ea-de0f5e35df6a",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.76504374",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "very sarcastic",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:41:48.741Z",
      "lmodifiedOn": "2020-10-01T13:41:48.741Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-2e2e6760-badc-596e-9657-c4867fc8a459",
          "cT": "text",
          "data": {
            "text": "Sorry, I am unable to find a suitable answer. Would you like to get connected to an agent"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "IntentNotIdentified",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559708747,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-b4af7345-2d05-52bd-b949-56b765715c99",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "Can you please help me in Booking ticket?",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.961346",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "Can you please help me in Booking ticket?",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "Qkn6QBcx3YXPjzkakF1yJQ$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:42:01.422Z",
      "lmodifiedOn": "2020-10-01T13:42:01.589Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-852d64fc-36f2-54ec-8173-afc8e97fede2",
          "cT": "text",
          "data": {
            "text": "Can you please help me in Booking ticket?"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559721425,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "path": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:intent0",
      "tr0_I": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:dialogAct2:522d821e7dc4c41ed8bc83e80081a581",
      "tr0_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:intent0:050b8bd0978c2d4a21c1e9b5f5a83651",
      "tr0_T": "7",
      "tr1_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:intent0:050b8bd0978c2d4a21c1e9b5f5a83651",
      "tr1_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity1:b80144673dec00cbe1b656d02da238fc",
      "tr1_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-2721c42c-4675-5ec6-bf47-ac6e4035c87e",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.961346",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "Can you please help me in Booking ticket?",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:42:02.568Z",
      "lmodifiedOn": "2020-10-01T13:42:02.568Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-ff3fc795-1cf1-5eb3-bd43-44ae831b8d01",
          "cT": "text",
          "data": {
            "text": "I will help you for sure. Please let me know the movie name."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559722569,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-c832adb1-0056-5973-809c-d8a46191c9eb",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "cement",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.8891759",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "cement",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "Qj9NSf4qVu3aSFoXzq-Ahg$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:42:10.736Z",
      "lmodifiedOn": "2020-10-01T13:42:10.846Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-df62bd58-98e8-54dd-bb33-ac2388545a03",
          "cT": "text",
          "data": {
            "text": "cement"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559730739,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity1:b80144673dec00cbe1b656d02da238fc",
      "tr0_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:dialogAct3:6c21d12aab9f8b7fee444210d8bb5dc4",
      "tr0_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-947801ce-7982-5924-9fec-90e359536b12",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.8891759",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "cement",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:42:11.288Z",
      "lmodifiedOn": "2020-10-01T13:42:11.288Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-0af4c883-26d2-5ee2-a97f-b590e6b0de3d",
          "cT": "text",
          "data": {
            "text": "Only Balcony Seats are available. Please confirm."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559731293,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-0b22a004-a3eb-530d-b8d3-bfce244cdfd7",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "No.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.0",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "No.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "DlwqfJPenWvrnHqAUipILw$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:42:23.809Z",
      "lmodifiedOn": "2020-10-01T13:42:23.912Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-95da45fa-9314-59e6-a42a-e7b36940643e",
          "cT": "text",
          "data": {
            "text": "No."
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559743812,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:dialogAct3:6c21d12aab9f8b7fee444210d8bb5dc4",
      "tr0_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity7:fa0f103472c25617879819e9e7c5e50e",
      "tr0_T": "0",
      "path": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:message6",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-0d37085e-bdc9-54a2-a7b0-44894d1eea34",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.0",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "No.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:42:24.418Z",
      "lmodifiedOn": "2020-10-01T13:42:24.418Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-902556bd-8754-5264-a1c9-ceeeea708b86",
          "cT": "text",
          "data": {
            "text": "your booking cancelled."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559744423,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-732c5e8a-555c-5160-83cc-228b9fdbcd13",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.0",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "No.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:42:24.925Z",
      "lmodifiedOn": "2020-10-01T13:42:24.925Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-9fba3bc0-eb25-5e03-894f-31da5ffeeac2",
          "cT": "text",
          "data": {
            "text": "Hello. I am your Virtual Assistant. How can I help you today"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559744927,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-3c6bdb89-c68e-534f-9c90-79ef4cdf1d1f",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "You are very irritating.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.9709201",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "You are very irritating.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "gnB7TJJAtywwgobVepwgIg$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:42:37.426Z",
      "lmodifiedOn": "2020-10-01T13:42:37.542Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-dc6128b5-a1e8-5f5a-94c7-08eb7f1db579",
          "cT": "text",
          "data": {
            "text": "You are very irritating."
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559757431,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "path": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:message6>dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity7>dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0>dg-57e3c547-8e08-543d-ba1a-2f9758524266:script11",
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity7:fa0f103472c25617879819e9e7c5e50e",
      "tr0_O": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0:2c2bd3bb3cf6a50fb226628c2e9ec04d",
      "tr0_T": "7",
      "tr1_I": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0:2c2bd3bb3cf6a50fb226628c2e9ec04d",
      "tr1_O": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:dialogAct2:99647321beb59ded8dd05162734ff3a1",
      "tr1_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-c12e5dbc-3944-5bbc-9a5e-65bd754189f7",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.9709201",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "You are very irritating.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:42:38.509Z",
      "lmodifiedOn": "2020-10-01T13:42:38.509Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-d7c0bd11-2e43-52f8-b05b-09ed9e042002",
          "cT": "text",
          "data": {
            "text": "Sorry, I am unable to find a suitable answer. Would you like to get connected to an agent"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "IntentNotIdentified",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559758512,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-379faf8b-dce8-5264-b2f2-759dacb31d75",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "weather",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.0",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "weather",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "OGjlCpnzDUtjjJ87JNQ90w$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:42:53.753Z",
      "lmodifiedOn": "2020-10-01T13:42:53.855Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-86843ba1-cc02-5151-aff9-01470f3b962c",
          "cT": "text",
          "data": {
            "text": "weather"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559773756,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "tr0_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-9e24f1be-0ad8-59d1-9871-64e0905c00df",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.0",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "weather",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:42:54.261Z",
      "lmodifiedOn": "2020-10-01T13:42:54.261Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-936a7991-eb1b-5ca8-ae2f-900515eb855b",
          "cT": "text",
          "data": {
            "text": "Sorry, I am unable to find a suitable answer. Would you like to get connected to an agent"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "IntentNotIdentified",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559774264,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-1dade66c-c6fe-5534-b94f-f1b90703dc6e",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "Okay.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.97525406",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "Okay.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "mOnqzPVZ2KcQEbIXeuf4Sw$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:43:06.821Z",
      "lmodifiedOn": "2020-10-01T13:43:06.921Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-45b87a71-e755-53f8-bbd7-3178b62fd6fc",
          "cT": "text",
          "data": {
            "text": "Okay."
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559786824,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "path": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:script4>dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:intent0",
      "tr0_I": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:dialogAct2:99647321beb59ded8dd05162734ff3a1",
      "tr0_O": "dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:intent0:3fcb68b593b9e9e8064ab398206601a2",
      "tr0_T": "5",
      "tr1_I": "dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:intent0:3fcb68b593b9e9e8064ab398206601a2",
      "tr1_O": "dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:entity12:f9e07023bd852eb89ed00a733b373595",
      "tr1_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-3e5cfe18-a658-5126-af3c-9e576bcb0414",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Confidence": "0.97525406",
            "Direction": "inbound",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "Language": "en-US",
            "SpeechResult": "Okay.",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:43:08.047Z",
      "lmodifiedOn": "2020-10-01T13:43:08.047Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-e68986b2-26f1-5306-a38f-34967cd15ca9",
          "cT": "text",
          "data": {
            "text": "You can chat with our agent to get your queries resolved. Please provide your phone number so that we can send you a message with a link to continue the conversation."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "DeflectionProcess",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559788049,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-8c997177-0cd7-5034-94c3-5b435cf77af9",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "918125859512",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Digits": "918125859512",
            "Direction": "inbound",
            "FinishedOnKey": "",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "msg": "Gather End",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "iKMyovA0XmDlxnayBfo3gw$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:43:27.059Z",
      "lmodifiedOn": "2020-10-01T13:43:27.171Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-bff3fa91-50fd-5df6-8338-7fa38ea8eee2",
          "cT": "text",
          "data": {
            "text": "918125859512"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559807063,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "path": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:script4>dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:intent0>dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:entity12",
      "tr0_I": "dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:entity12:f9e07023bd852eb89ed00a733b373595",
      "tr0_O": "dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:dialogAct10:4236c0cebbd2d7938fc5df168f1cca0f",
      "tr0_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-2e2401b3-b91f-5be3-be34-caa51dd00c42",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Digits": "918125859512",
            "Direction": "inbound",
            "FinishedOnKey": "",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "msg": "Gather End",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:43:27.642Z",
      "lmodifiedOn": "2020-10-01T13:43:27.642Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-5933875b-2b67-5882-b552-0c058747e003",
          "cT": "text",
          "data": {
            "text": "You have entered 9 1 8 1 2 5 8 5 9 5 1 2. Please press 1 to confirm or 2 to modify."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "DeflectionProcess",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559807647,
      "__v": 0,
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-200ed8f4-c850-5a9e-9130-3b0443aaf113",
      "channels": [
        {
          "type": "twiliovoice",
          "to": "+12058963971",
          "from": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "body": "1",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Digits": "1",
            "Direction": "inbound",
            "FinishedOnKey": "",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "msg": "Gather End",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "accessToken": "FEu7WMSKacQozocU3X2NMA$$",
          "isAppScoped": true,
          "appId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
          "enable": true,
          "message": "The bot is disabled via Twilio Voice. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:43:40.646Z",
      "lmodifiedOn": "2020-10-01T13:43:40.782Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-967122da-a5b0-521c-8ea2-c254e5b91925",
          "cT": "text",
          "data": {
            "text": "1"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559820649,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dc854a2e664cfa7dd583",
      "tr0_I": "dg-e5eeb375-6168-50fd-8fea-a9855a0f86d5:dialogAct10:4236c0cebbd2d7938fc5df168f1cca0f",
      "tr0_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-3fa19d60-bf06-5392-9789-dea77685d84b",
      "channels": [],
      "type": "event",
      "status": "received",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedOn": "2020-10-01T13:44:59.359Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "components": [
        {
          "_id": "cp-bb769f6d-b228-5e62-8235-e92eee31091e",
          "cT": "text",
          "data": {
            "text": "On Connect"
          },
          "thumbnails": []
        }
      ],
      "createdOn": "2020-10-01T13:44:59.361Z",
      "timestampValue": 1601559899361,
      "__v": 0,
      "lang": "en",
      "nodeType": 0,
      "tr0_I": "dg-54813748-2c89-58e3-8de5-91cce930e476:intent0",
      "tr0_O": "dg-bd1a5235-b350-5f2f-9d08-47da2f4d096f:entity3:7cbb51170f6c1869438b831f4b1086d0",
      "tr0_T": "5",
      "tr_isSS": 1,
      "path": "dg-54813748-2c89-58e3-8de5-91cce930e476:message2>dg-54813748-2c89-58e3-8de5-91cce930e476:script4>dg-bd1a5235-b350-5f2f-9d08-47da2f4d096f:intent0>dg-bd1a5235-b350-5f2f-9d08-47da2f4d096f:script2",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-b2b667c3-5455-50f9-95da-c13380bebd7e",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "type": "welcome",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "trace": {
              "isNew": true,
              "idPrefix": "RTM-ONCLIENT-TRACE",
              "useRemoting": true,
              "connector": {
                "host": "localhost",
                "metadata": {
                  "name": "eventlog",
                  "options": {
                    "password": "redispass",
                    "host": "localhost",
                    "port": 6379
                  }
                },
                "type": "redis"
              },
              "traceMeta": {
                "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
                "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
                "channelId": "RTM",
                "start": 1601559898277,
                "status": 0
              },
              "id": "RTM-ONCLIENT-TRACE-NYFPIISZM"
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:44:59.540Z",
      "lmodifiedOn": "2020-10-01T13:44:59.540Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-e10dcab0-deda-58b2-9dab-58bbc899ad0e",
          "cT": "text",
          "data": {
            "text": "Welcome back."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "ChatInvocationThroughLink",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559899548,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-5f3095c7-4369-5278-a004-3a6f9700d207",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "type": "welcome",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "trace": {
              "isNew": true,
              "idPrefix": "RTM-ONCLIENT-TRACE",
              "useRemoting": true,
              "connector": {
                "host": "localhost",
                "metadata": {
                  "name": "eventlog",
                  "options": {
                    "password": "redispass",
                    "host": "localhost",
                    "port": 6379
                  }
                },
                "type": "redis"
              },
              "traceMeta": {
                "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
                "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
                "channelId": "RTM",
                "start": 1601559898277,
                "status": 0
              },
              "id": "RTM-ONCLIENT-TRACE-NYFPIISZM"
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:00.624Z",
      "lmodifiedOn": "2020-10-01T13:45:00.624Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-8af7d56d-1cf6-5c0e-acfd-ae5c92aac669",
          "cT": "text",
          "data": {
            "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"quick_replies\",\"text\":\"How would you like to connect to our agent? Please choose an option\",\"quick_replies\":[{\"content_type\":\"text\",\"title\":\"Submit Request\",\"payload\":\"write to us\"},{\"content_type\":\"text\",\"title\":\"Connect to an Agent\",\"payload\":\"ConnectToAgent\"}]}}"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "HandOffProcess",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559900632,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-6b12f2c1-b1cc-59f4-a926-b545cb0b9783",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-OURŌSBYI2",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "clear",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:05.304Z",
      "lmodifiedOn": "2020-10-01T13:45:05.657Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "components": [
        {
          "_id": "cp-4b1e0edb-0c0d-59d3-aa3a-df26e65a912d",
          "cT": "text",
          "data": {
            "text": "clear"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559905365,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "lang": "en",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-0199a372-6a4e-530d-bb1f-fd2d9142aa6a",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-OURŌSBYI2",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-PQSLTVKK64",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:08.114Z",
      "lmodifiedOn": "2020-10-01T13:45:08.114Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-00918890-b290-596a-b09f-23505caf0f4f",
          "cT": "text",
          "data": {
            "text": "Ok, I am discarding the task for now. We can start over whenever you are ready."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559908119,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-843c9e80-5b11-5ef9-89c7-ca45343a7a9b",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-CASJQSSYV",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "help me with tickets",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:12.776Z",
      "lmodifiedOn": "2020-10-01T13:45:12.959Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "components": [
        {
          "_id": "cp-702810b6-24c3-581d-b3cb-e559b8fee8a6",
          "cT": "text",
          "data": {
            "text": "help me with tickets"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559912792,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "nodeType": 0,
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:intent0",
      "tr0_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity1:7edd445a05bab2951c85860b95926e12",
      "tr0_T": "0",
      "tr_isSS": 1,
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-6cf607ea-be30-5ef3-8443-baf554016b10",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-CASJQSSYV",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-HTQLFĀLZ2O",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:13.699Z",
      "lmodifiedOn": "2020-10-01T13:45:13.699Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-b63d70ba-0227-5a38-8224-59ebbbaeeea8",
          "cT": "text",
          "data": {
            "text": "I will help you for sure. Please let me know the movie name."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559913705,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-04e7c679-0c10-5b7a-9189-42153288e942",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-XMQCBIĀF6",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "solar",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:19.050Z",
      "lmodifiedOn": "2020-10-01T13:45:19.228Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "components": [
        {
          "_id": "cp-2b36fbdc-b07c-5012-9035-72b95875a9e7",
          "cT": "text",
          "data": {
            "text": "solar"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559919063,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity1:7edd445a05bab2951c85860b95926e12",
      "tr0_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:dialogAct3:af692bcbc37e4d723483c4486949f550",
      "tr0_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-d8c93de0-7abf-5db7-a0fe-55df9fa6a119",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-XMQCBIĀF6",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-1TZTEQ9FVS",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:19.817Z",
      "lmodifiedOn": "2020-10-01T13:45:19.817Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-2a28fb9b-9310-5238-922b-f94dbdc19d52",
          "cT": "text",
          "data": {
            "text": "Only Balcony Seats are available. Please confirm."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559919820,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-a4a138da-80c4-50ed-a2b6-f0217c648c49",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-IMAKGKOVS",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "No",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:22.095Z",
      "lmodifiedOn": "2020-10-01T13:45:22.319Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "components": [
        {
          "_id": "cp-dd890076-1aac-5c58-b35b-14847334a55d",
          "cT": "text",
          "data": {
            "text": "No"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559922103,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:dialogAct3:af692bcbc37e4d723483c4486949f550",
      "tr0_O": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity7:2a17bd147fffd91cef14ad8105a101a4",
      "tr0_T": "0",
      "path": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:message6",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-b7e2a19f-3c8a-536e-be27-29b4edcffb6c",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-IMAKGKOVS",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-LŌMUOWLARP",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:22.876Z",
      "lmodifiedOn": "2020-10-01T13:45:22.876Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-3860d9e0-6325-5353-a663-8b25a3c408dc",
          "cT": "text",
          "data": {
            "text": "your booking cancelled."
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559922878,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-5aaa695d-fe0a-5380-ae80-880f402c5595",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-IMAKGKOVS",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-LŌMUOWLARP",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:23.565Z",
      "lmodifiedOn": "2020-10-01T13:45:23.565Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-c51861cd-8995-5754-9462-bffa6625e182",
          "cT": "text",
          "data": {
            "text": "Hello. I am your Virtual Assistant. How can I help you today"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "book tickets",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559923569,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-12952a6c-deae-5175-8336-8c3604e30b30",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-AOYH5R6TQ",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "get lost",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:26.590Z",
      "lmodifiedOn": "2020-10-01T13:45:26.755Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "components": [
        {
          "_id": "cp-35b17478-afb8-51fa-bf98-c5b97be4aaa3",
          "cT": "text",
          "data": {
            "text": "get lost"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559926609,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "path": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:message6>dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity7>dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0>dg-57e3c547-8e08-543d-ba1a-2f9758524266:script11",
      "tr0_I": "dg-0489ed2f-466c-518a-ad56-4485a7757c9b:entity7:2a17bd147fffd91cef14ad8105a101a4",
      "tr0_O": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0:04ad97b7c53f0f8cb63a7be2d517f079",
      "tr0_T": "7",
      "tr1_I": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:intent0:04ad97b7c53f0f8cb63a7be2d517f079",
      "tr1_O": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:dialogAct2:dd391d6f37622a11a0498a283b50322d",
      "tr1_T": "0",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-8b355ad9-2299-5a6c-a90a-0b83c574a232",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-AOYH5R6TQ",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-RLPPAANGTP",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:27.890Z",
      "lmodifiedOn": "2020-10-01T13:45:27.890Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-d850a94c-290e-53f7-96e6-6bf5d2fdb3a2",
          "cT": "text",
          "data": {
            "text": "Sorry, I am unable to find a suitable answer. Would you like to get connected to an agent"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "IntentNotIdentified",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559927892,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-f34b4e89-f54d-5dc0-a895-6f0a3066066b",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-UPD5ESDKG",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "You are very rude",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:36.576Z",
      "lmodifiedOn": "2020-10-01T13:45:36.748Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "components": [
        {
          "_id": "cp-40dc7d72-4a4b-5a25-ac88-1e02f7def4bb",
          "cT": "text",
          "data": {
            "text": "You are very rude"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559936589,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "tr0_T": "0",
      "EOD": 0,
      "tr_errNId": "tF",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-91754599-f89e-5702-8ff3-19636c37a0de",
      "channels": [
        {
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-UPD5ESDKG",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            },
            "span": {
              "id": "RTM-WAIT-IN-QUEUE-KSGQTLK9XS",
              "idPrefix": "RTM-WAIT-IN-QUEUE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "type": "rtm",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:37.430Z",
      "lmodifiedOn": "2020-10-01T13:45:37.430Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-6ab5b488-6053-5c08-85bb-bd0b5832f91f",
          "cT": "text",
          "data": {
            "text": "Sorry, I am unable to find a suitable answer. Would you like to get connected to an agent"
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "tN": "IntentNotIdentified",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559937431,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-215730e7-f8b3-5497-a335-bcad2e9f360f",
      "channels": [
        {
          "handle": {
            "AccountSid": "ACcea0991dae7309b636cbbc26e1eeff27",
            "ApiVersion": "2010-04-01",
            "ApplicationSid": "APc8f4846a12fdb7071d03db4f6baf9502",
            "CallSid": "ca66967043fd3fc1df4630bda8f5615d38",
            "CallStatus": "in-progress",
            "Called": "+12058963971",
            "CalledCity": "CAMP HILL",
            "CalledCountry": "US",
            "CalledState": "AL",
            "CalledZip": "36850",
            "Caller": "+266696687",
            "CallerCity": "",
            "CallerCountry": "LS",
            "CallerState": "",
            "CallerZip": "",
            "Digits": "1",
            "Direction": "inbound",
            "FinishedOnKey": "",
            "From": "ca66967043fd3fc1df4630bda8f5615d38",
            "FromCity": "",
            "FromCountry": "LS",
            "FromState": "",
            "FromZip": "",
            "To": "+12058963971",
            "ToCity": "CAMP HILL",
            "ToCountry": "US",
            "ToState": "AL",
            "ToZip": "36850",
            "msg": "Gather End",
            "fromPhoneNumber": "266696687",
            "requestId": "tcbr-ca66967043fd3fc1df4630bda8f5615d38"
          },
          "to": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38",
          "from": "+12058963971",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "type": "twiliovoice"
        }
      ],
      "type": "outgoing",
      "status": "pending",
      "createdOn": "2020-10-01T13:45:41.440Z",
      "lmodifiedOn": "2020-10-01T13:45:41.440Z",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "components": [
        {
          "_id": "cp-ee554a6c-234c-535e-8192-92739ee59384",
          "cT": "text",
          "data": {
            "text": ""
          },
          "thumbnails": []
        }
      ],
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "twiliovoice",
      "isD": 0,
      "lang": "en",
      "timestampValue": 1601559941448,
      "__v": 0,
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "resourceid": "messagestore"
    },
    {
      "_id": "ms-d25c0a4f-07aa-5967-8f38-fe30f653aaf6",
      "channels": [
        {
          "type": "rtm",
          "from": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "botInfo": {
            "chatBot": "SmartAssist AI 1599671152125",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb"
          },
          "handle": {
            "handleId": "67d1fdbf-877d-4bca-a5ce-bf9b1e88f440",
            "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
            "clientId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e",
            "taskBotId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
            "traceId": "7e962017a9d666c4",
            "spanId": "7e962017a9d666c4",
            "trace": {
              "id": "RTM-TRACE-WDKNRH46K",
              "idPrefix": "RTM-TRACE",
              "isNew": true,
              "useRemoting": true
            }
          },
          "client": "sdk",
          "body": "ConnectToAgent useless",
          "enable": true,
          "isAlertsEnabled": false,
          "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Kore Messenger, Web/Mobile Client, Twilio Voice.",
          "activeChannels": "Kore Messenger,Web/Mobile Client,Twilio Voice.",
          "streamId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
          "tokens": [],
          "userId": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
          "channelUId": "cs-f796f5ae-6266-5efe-a4eb-6666083eb00e/ca66967043fd3fc1df4630bda8f5615d38"
        }
      ],
      "type": "incoming",
      "status": "sent to cs",
      "createdBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "lmodifiedBy": "u-f8cd4073-c490-5c51-85e2-8e911a6c949b",
      "createdOn": "2020-10-01T13:45:49.896Z",
      "lmodifiedOn": "2020-10-01T13:45:50.040Z",
      "botId": "st-152014ab-95b4-5fe0-8696-aa7f17360edb",
      "orgId": "o-168dd144-df1c-510e-a7d2-0b10f5249f0d",
      "accountId": "5f58c359d0b83b4c32537005",
      "isBB": 0,
      "ms": 1,
      "chnl": "rtm",
      "isD": 0,
      "components": [
        {
          "_id": "cp-de547ca4-1bef-56e8-b6ea-8cc4fea8d253",
          "cT": "text",
          "data": {
            "text": "ConnectToAgent useless"
          },
          "thumbnails": []
        }
      ],
      "timestampValue": 1601559949901,
      "__v": 0,
      "lang": "en",
      "sessionId": "5f75dd5a4a2e664cfa7dd591",
      "EOD": 0,
      "nodeType": 0,
      "path": "dg-309f3385-9f0f-599b-ae2d-56ac7f4cd4e9:script3>dg-309f3385-9f0f-599b-ae2d-56ac7f4cd4e9:script4>dg-309f3385-9f0f-599b-ae2d-56ac7f4cd4e9:script5",
      "tr0_I": "dg-309f3385-9f0f-599b-ae2d-56ac7f4cd4e9:intent0:934f16524e1abef5aead19982d3aaaad",
      "tr0_O": "dg-309f3385-9f0f-599b-ae2d-56ac7f4cd4e9:agentTransfer2:fe0a2f06836ee9fff4c994feda92057e",
      "tr0_T": "10",
      "tr_pId": "dg-57e3c547-8e08-543d-ba1a-2f9758524266:dialogAct2:dd391d6f37622a11a0498a283b50322d",
      "resourceid": "messagestore"
    }
  ]
};