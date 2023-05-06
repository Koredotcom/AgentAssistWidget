import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }
  getHistoryData() {
    return of({
      "conversationInfo": {
        "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
        "callId": "",
        "sessionStartTime": "",
        "agentHandOffTime": "",
        "userDetails": {
          "firstName": "usecases",
          "lastName": "bug",
          "phoneNumber": null
        },
        "currentTask": "",
        "sentimentAnalysis": {},
        "conversationDetails": []
      },
      "chatHistory": [
        {
          "_id": "ms-45e672fb-5f30-52fb-9fab-5985eb606c5c",
          "channels": [
            {
              "handle": {
                "handleId": "0a8da528-8665-4895-aa04-47df75cbafca",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "72ce0b72989f8e6f",
                "spanId": "72ce0b72989f8e6f",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T09:52:33.654Z",
          "lmodifiedOn": "2023-04-11T09:52:33.654Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-8ee24724-74a7-548b-9649-983c1005e112",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681206753657,
          "__v": 0,
          "sT": 0,
          "sessionId": "64352de13daa687d2b726601",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-37ba63c6-bad2-59c0-94fb-690b8d3af7ba",
          "channels": [
            {
              "handle": {
                "handleId": "0a8da528-8665-4895-aa04-47df75cbafca",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "72ce0b72989f8e6f",
                "spanId": "72ce0b72989f8e6f",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T09:52:33.865Z",
          "lmodifiedOn": "2023-04-11T09:52:33.865Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-28b8e799-65b9-5d05-a523-459610c4eda6",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681206753866,
          "__v": 0,
          "sT": 0,
          "sessionId": "64352de13daa687d2b726601",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-19051e87-5d89-58ae-a307-6ecef3e3b409",
          "channels": [
            {
              "handle": {
                "handleId": "3538ca97-72b4-4e3e-b80e-c94999fdb009",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "999150c2dde57978",
                "spanId": "999150c2dde57978",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:00:01.567Z",
          "lmodifiedOn": "2023-04-11T10:00:01.567Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-c1657825-ff1a-5baf-a487-2b28b06e43ad",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681207201568,
          "__v": 0,
          "sT": 1,
          "sessionId": "64352fa14c3c507d1e8379ee",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-d7d8af77-95e4-5d7c-ad53-46d6344aa6ad",
          "channels": [
            {
              "handle": {
                "handleId": "3538ca97-72b4-4e3e-b80e-c94999fdb009",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "999150c2dde57978",
                "spanId": "999150c2dde57978",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:00:01.684Z",
          "lmodifiedOn": "2023-04-11T10:00:01.684Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-af1b9362-bf31-586e-80e7-cd70cc075c98",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681207201685,
          "__v": 0,
          "sT": 1,
          "sessionId": "64352fa14c3c507d1e8379ee",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-aa6af9ef-4a1c-5f1d-95be-09766cc221a8",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "3538ca97-72b4-4e3e-b80e-c94999fdb009",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "999150c2dde57978",
                "spanId": "999150c2dde57978"
              },
              "client": "sdk",
              "body": "Connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:00:15.038Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:00:15.183Z",
          "lmodifiedOn": "2023-04-11T10:00:15.183Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-73a61036-ba4d-5f27-8fc7-5fe3c96a48a9",
              "cT": "text",
              "data": {
                "text": "Connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681207215187,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64352fa14c3c507d1e8379ee",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-d748d18e-1ff8-5a79-ac4c-b8b33e73776a",
          "channels": [
            {
              "handle": {
                "handleId": "7de756b6-0273-416b-9252-c0752d346912",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "1356e00f55b1322c",
                "spanId": "1356e00f55b1322c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:00:34.322Z",
          "lmodifiedOn": "2023-04-11T10:00:34.322Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-3b6b3d42-62c8-5aea-b3de-fe43ea2ea7fc",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681207234324,
          "__v": 0,
          "sT": 1,
          "sessionId": "64352fc24c3c507d1e837b28",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-9d9dce64-35cd-59b4-9ab0-2fc0e2d88644",
          "channels": [
            {
              "handle": {
                "handleId": "7de756b6-0273-416b-9252-c0752d346912",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "1356e00f55b1322c",
                "spanId": "1356e00f55b1322c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:00:34.487Z",
          "lmodifiedOn": "2023-04-11T10:00:34.487Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-cb152128-635d-5304-b1eb-cd2957c8e88b",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681207234510,
          "__v": 0,
          "sT": 1,
          "sessionId": "64352fc24c3c507d1e837b28",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-4d1571d4-4fdc-576e-b10f-6c38afd7cc07",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "7de756b6-0273-416b-9252-c0752d346912",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "1356e00f55b1322c",
                "spanId": "1356e00f55b1322c"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:00:46.245Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:00:46.352Z",
          "lmodifiedOn": "2023-04-11T10:00:46.352Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-2f80da0e-4d34-51a9-90e8-7a9b3242aa3b",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681207246355,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64352fc24c3c507d1e837b28",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-b82e77bd-c0a3-5b99-812c-63a18b6aea86",
          "channels": [
            {
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:03:45.296Z",
          "lmodifiedOn": "2023-04-11T10:03:45.296Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-bc8c587e-493b-5cfc-af1b-6e7e2010f11e",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681207425298,
          "__v": 0,
          "sT": 1,
          "sessionId": "643530800b575c88226469f7",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-ecc84f7e-be4f-54ec-b878-258af47e6e63",
          "channels": [
            {
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:03:45.586Z",
          "lmodifiedOn": "2023-04-11T10:03:45.586Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-68e6348c-bfc8-5760-87bb-25b46f5f34c9",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681207425587,
          "__v": 0,
          "sT": 1,
          "sessionId": "643530800b575c88226469f7",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-788a313f-aa0a-55b7-be06-9a3f049a1294",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:03:49.947Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:03:50.100Z",
          "lmodifiedOn": "2023-04-11T10:03:50.100Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-e23ae628-8415-5796-bc01-6b41bde36a83",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681207430105,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643530800b575c88226469f7",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f920d33e-188e-51f9-9c6a-d3ca609e934a",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce"
              },
              "client": "sdk",
              "body": "Show Balance",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:04:09.990Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:04:10.140Z",
          "lmodifiedOn": "2023-04-11T10:04:10.140Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-107c0d57-0e84-5fdf-8059-3fd31e8091b7",
              "cT": "text",
              "data": {
                "text": "Show Balance"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681207450144,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643530800b575c88226469f7",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-9fc625d2-c0ab-57a6-88fe-38746432ea67",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce"
              },
              "client": "sdk",
              "body": "feedback",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:04:24.410Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:04:24.507Z",
          "lmodifiedOn": "2023-04-11T10:04:24.507Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-b3b1a86b-f61b-5409-aea7-ca4fb0513e63",
              "cT": "text",
              "data": {
                "text": "feedback"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681207464511,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643530800b575c88226469f7",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-1c9690d3-edae-5c43-96d4-c95189d18503",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce"
              },
              "client": "sdk",
              "body": "sending a ctrl message to CS",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:04:24.410Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "requestId": "ms-9fc625d2-c0ab-57a6-88fe-38746432ea67",
              "botLanguage": "en",
              "requestContext": {
                "isRuntime": true,
                "isBB": true
              }
            }
          ],
          "type": "ctrlmsg",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedOn": "2023-04-11T10:19:52.811Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "chnl": "rtm",
          "accountId": "641d78ce8e022ea3d242a60f",
          "sessionId": "643530800b575c88226469f7",
          "isBB": 0,
          "isD": 1,
          "ms": 4,
          "sT": 1,
          "components": [
            {
              "_id": "cp-a7721d85-86ab-505a-8996-55b29dcabcea",
              "cT": "text",
              "data": {
                "text": "sending a ctrl message to CS"
              },
              "thumbnails": []
            }
          ],
          "createdOn": "2023-04-11T10:19:52.813Z",
          "timestampValue": 1681208392814,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-28215d1e-fbc6-5112-a048-1116a059b9dc",
          "channels": [
            {
              "handle": {
                "handleId": "51b74b3a-60a0-431c-a706-93b50de34fe9",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "dc914572afbdafce",
                "spanId": "dc914572afbdafce"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:19:53.341Z",
          "lmodifiedOn": "2023-04-11T10:19:53.341Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-f2edb0b2-de7f-5f9b-8fea-17c6d89341fa",
              "cT": "text",
              "data": {
                "text": "Ending your session as there is no activity. You can start over whenever you need "
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 1,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "lang": "en",
          "agentAssistDetails": {
            "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
            "srcChannel": "",
            "childBotStreamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
            "experience": "",
            "userInput": "sending a ctrl message to CS"
          },
          "timestampValue": 1681208393346,
          "__v": 0,
          "sT": 1,
          "sessionId": "643530800b575c88226469f7",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-4d970db1-6434-56f4-96d5-f819801a4795",
          "channels": [
            {
              "handle": {
                "handleId": "a3c38da3-636a-4a2a-adc6-5b19415383ad",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "4ef603d8001a7943",
                "spanId": "4ef603d8001a7943",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:46:45.246Z",
          "lmodifiedOn": "2023-04-11T10:46:45.246Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-db363457-1a53-502c-9288-ca846d4a92e9",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210005249,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353a950b575c8822646fb2",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-e5dd0490-fc9e-50e1-ad6e-ca9769b9fc78",
          "channels": [
            {
              "handle": {
                "handleId": "a3c38da3-636a-4a2a-adc6-5b19415383ad",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "4ef603d8001a7943",
                "spanId": "4ef603d8001a7943",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:46:45.496Z",
          "lmodifiedOn": "2023-04-11T10:46:45.496Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-5619d686-9ca7-5bc1-852c-ca91bcceed02",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210005497,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353a950b575c8822646fb2",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-fb066138-2c7d-5809-bf1d-1ca11723e65d",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "a3c38da3-636a-4a2a-adc6-5b19415383ad",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "4ef603d8001a7943",
                "spanId": "4ef603d8001a7943"
              },
              "client": "sdk",
              "body": "feedback",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:46:56.484Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:46:56.695Z",
          "lmodifiedOn": "2023-04-11T10:46:56.695Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-6e16babb-f06d-5910-80d2-a9420f9f01c7",
              "cT": "text",
              "data": {
                "text": "feedback"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210016698,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353a950b575c8822646fb2",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-0b2944ce-df3f-561c-a212-99f39de985e3",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "a3c38da3-636a-4a2a-adc6-5b19415383ad",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "4ef603d8001a7943",
                "spanId": "4ef603d8001a7943"
              },
              "client": "sdk",
              "body": "Show Balance",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:53:13.250Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:53:13.483Z",
          "lmodifiedOn": "2023-04-11T10:53:13.483Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-d7b91e40-c0b9-5b63-8759-0b41083a8065",
              "cT": "text",
              "data": {
                "text": "Show Balance"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210393495,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353a950b575c8822646fb2",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f445b390-8aa2-5e70-a39e-f49843025111",
          "channels": [
            {
              "handle": {
                "handleId": "4625afaf-d63a-4863-9412-add0e299bff0",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "8658a891dfdca461",
                "spanId": "8658a891dfdca461",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:53:31.748Z",
          "lmodifiedOn": "2023-04-11T10:53:31.748Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-f9af0c4e-d2b8-5c26-a851-4ab7d4651fef",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210411749,
          "__v": 0,
          "sT": 0,
          "sessionId": "64353c2bb488fc881aa8cfda",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-65293579-9b27-5197-93e3-4537abdadba4",
          "channels": [
            {
              "handle": {
                "handleId": "4625afaf-d63a-4863-9412-add0e299bff0",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "8658a891dfdca461",
                "spanId": "8658a891dfdca461",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:53:31.964Z",
          "lmodifiedOn": "2023-04-11T10:53:31.964Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-1ac6379f-4dca-5378-b777-55cae143bb72",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210411965,
          "__v": 0,
          "sT": 0,
          "sessionId": "64353c2bb488fc881aa8cfda",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-11f6ab14-cb41-508a-ac26-11169c53a083",
          "channels": [
            {
              "handle": {
                "handleId": "5daa87f7-f220-41e1-9f46-318dfeda7456",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "09cbe08a4d2fc4b4",
                "spanId": "09cbe08a4d2fc4b4",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:54:57.820Z",
          "lmodifiedOn": "2023-04-11T10:54:57.820Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-779255963149-55e1-9956-c93bad5a87ae",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210497824,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353c810b575c882264714e",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f0dbb8de-1ddb-5c51-a814-132107eea77f",
          "channels": [
            {
              "handle": {
                "handleId": "5daa87f7-f220-41e1-9f46-318dfeda7456",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "09cbe08a4d2fc4b4",
                "spanId": "09cbe08a4d2fc4b4",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:54:58.120Z",
          "lmodifiedOn": "2023-04-11T10:54:58.120Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-f73e8d9f-8e28-59b8-9992-094aa7009008",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210498121,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353c810b575c882264714e",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-577e770f-11fd-5129-83c7-d9fd904400e4",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "5daa87f7-f220-41e1-9f46-318dfeda7456",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "09cbe08a4d2fc4b4",
                "spanId": "09cbe08a4d2fc4b4"
              },
              "client": "sdk",
              "body": "Show Balance",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:55:05.659Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:55:05.813Z",
          "lmodifiedOn": "2023-04-11T10:55:05.813Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-35287b08-816d-525d-bacd-157a5c47cae5",
              "cT": "text",
              "data": {
                "text": "Show Balance"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210505816,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353c810b575c882264714e",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-7c88fc08-1932-595e-9314-a50c2737d832",
          "channels": [
            {
              "handle": {
                "handleId": "25f95eb1-b2b0-4e64-b461-beab2a16c079",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "9943296a793446d5",
                "spanId": "9943296a793446d5",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:57:57.308Z",
          "lmodifiedOn": "2023-04-11T10:57:57.308Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-9bb2ba33-f64b-5342-bb3c-5a11f487d1bb",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210677317,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353d34d33013ad1afa8555",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-435f1c7a-b225-5814-9d67-3f4a961d804c",
          "channels": [
            {
              "handle": {
                "handleId": "25f95eb1-b2b0-4e64-b461-beab2a16c079",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "9943296a793446d5",
                "spanId": "9943296a793446d5",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:57:57.757Z",
          "lmodifiedOn": "2023-04-11T10:57:57.757Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-22cf5623-4b63-5710-ab46-a44cb09ee054",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210677759,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353d34d33013ad1afa8555",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-e6e85066-787d-5abb-90f4-f44eb319344b",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "25f95eb1-b2b0-4e64-b461-beab2a16c079",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "9943296a793446d5",
                "spanId": "9943296a793446d5"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:58:03.478Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:58:03.783Z",
          "lmodifiedOn": "2023-04-11T10:58:03.783Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-7711b336-bb66-5ea8-9d0a-8e4680c8b30d",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210683788,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353d34d33013ad1afa8555",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f4ec0150-d756-5951-bcd6-7e8e8bdb62b3",
          "channels": [
            {
              "handle": {
                "handleId": "3b77fe3a-37a6-4102-9362-f456a98090bf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "0bfa119db11102ef",
                "spanId": "0bfa119db11102ef",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:58:36.016Z",
          "lmodifiedOn": "2023-04-11T10:58:36.016Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-7924bbd3-85a9-5577-9f58-088a9ab621c4",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210716019,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353d5bd33013ad1afa85d6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-7ac64d54-b314-5269-acf8-c063e566851f",
          "channels": [
            {
              "handle": {
                "handleId": "3b77fe3a-37a6-4102-9362-f456a98090bf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "0bfa119db11102ef",
                "spanId": "0bfa119db11102ef",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:58:36.204Z",
          "lmodifiedOn": "2023-04-11T10:58:36.204Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-ace0da2f-e15a-59ef-9b77-e58c6ed9f31d",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210716206,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353d5bd33013ad1afa85d6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-121e6360-d47e-56b3-b942-a0064f4426d8",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "3b77fe3a-37a6-4102-9362-f456a98090bf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0bfa119db11102ef",
                "spanId": "0bfa119db11102ef"
              },
              "client": "sdk",
              "body": "help",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T10:58:44.342Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T10:58:44.580Z",
          "lmodifiedOn": "2023-04-11T10:58:44.580Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-af0622124464-5a27-9dcd-9fc8859d84a0",
              "cT": "text",
              "data": {
                "text": "help"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210724585,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353d5bd33013ad1afa85d6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-9afde166-ec78-5404-b44f-f7028b1c903d",
          "channels": [
            {
              "handle": {
                "handleId": "082be4f4-a5bf-4202-bc7e-110c3838f2d4",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "c72b08309feba554",
                "spanId": "c72b08309feba554",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:59:53.122Z",
          "lmodifiedOn": "2023-04-11T10:59:53.122Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-894462d6-4498-5861-a9c6-c3a4d38bc505",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210793124,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353da8d33013ad1afa864f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-dc485970-702e-5943-b546-e49a92f4680e",
          "channels": [
            {
              "handle": {
                "handleId": "082be4f4-a5bf-4202-bc7e-110c3838f2d4",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "c72b08309feba554",
                "spanId": "c72b08309feba554",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T10:59:53.335Z",
          "lmodifiedOn": "2023-04-11T10:59:53.335Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-36c0a69a-1e7e-5b07-9a45-76e448398e93",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210793336,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353da8d33013ad1afa864f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-01456020-d43d-5ba6-a723-107b30bce452",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "082be4f4-a5bf-4202-bc7e-110c3838f2d4",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c72b08309feba554",
                "spanId": "c72b08309feba554"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:00:22.517Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:00:22.735Z",
          "lmodifiedOn": "2023-04-11T11:00:22.735Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-7ff750d5-44a8-5725-81615730020c44f6",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210822740,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353da8d33013ad1afa864f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-6d4ec086-5666-583d-893d-40999e3f8542",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "082be4f4-a5bf-4202-bc7e-110c3838f2d4",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c72b08309feba554",
                "spanId": "c72b08309feba554"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:00:51.499Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:00:51.700Z",
          "lmodifiedOn": "2023-04-11T11:00:51.700Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-480b9b46-fc6d-586a-94fb-07bcc249fa0b",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210851708,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353da8d33013ad1afa864f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f5774514-5d51-5e72-ad49-5094c4cdb22e",
          "channels": [
            {
              "handle": {
                "handleId": "d0f61c40-18fb-446f-b4c9-d72279752822",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "8fa32c6f128da419",
                "spanId": "8fa32c6f128da419",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:02:41.187Z",
          "lmodifiedOn": "2023-04-11T11:02:41.187Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-51294ebd-69a1-5d25-a6ec-ee56574be9c6",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210961193,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353e50c960a5ad28b27f83",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-5913c9fa-788d-5961-9597-08920c2c2b68",
          "channels": [
            {
              "handle": {
                "handleId": "d0f61c40-18fb-446f-b4c9-d72279752822",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "8fa32c6f128da419",
                "spanId": "8fa32c6f128da419",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:02:41.467Z",
          "lmodifiedOn": "2023-04-11T11:02:41.467Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-259a6dcc-ef13-53ca-87c4-30dbc2145c45",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681210961473,
          "__v": 0,
          "sT": 1,
          "sessionId": "64353e50c960a5ad28b27f83",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-e131a0fa-247d-5b97-9cfa-4579ac2899ec",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "d0f61c40-18fb-446f-b4c9-d72279752822",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "8fa32c6f128da419",
                "spanId": "8fa32c6f128da419"
              },
              "client": "sdk",
              "body": "help",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:02:47.916Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:02:48.135Z",
          "lmodifiedOn": "2023-04-11T11:02:48.135Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-13ba19bf-998f-57ad-aa60-7539a17871b2",
              "cT": "text",
              "data": {
                "text": "help"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681210968140,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64353e50c960a5ad28b27f83",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-a20276ff-4279-532f-98be-a47e24346908",
          "channels": [
            {
              "handle": {
                "handleId": "e0db3fb5-7702-416c-93e9-0d6fab9c2fdf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "387befb608d82e96",
                "spanId": "387befb608d82e96",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:13:36.758Z",
          "lmodifiedOn": "2023-04-11T11:13:36.758Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-c2612070-12f0-5a66-8e03-aff6d55f43e6",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681211616764,
          "__v": 0,
          "sT": 1,
          "sessionId": "643540e041bc6dbb4fa5b518",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-48d79dc1-4e7d-5418-9420-de3384d985cd",
          "channels": [
            {
              "handle": {
                "handleId": "e0db3fb5-7702-416c-93e9-0d6fab9c2fdf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "387befb608d82e96",
                "spanId": "387befb608d82e96",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:13:37.179Z",
          "lmodifiedOn": "2023-04-11T11:13:37.179Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-d272bc41-1849-5fee-be64-0c1b903f610e",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681211617182,
          "__v": 0,
          "sT": 1,
          "sessionId": "643540e041bc6dbb4fa5b518",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-474043db-5268-56ff-8e08-a45c1616ee6b",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "e0db3fb5-7702-416c-93e9-0d6fab9c2fdf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "387befb608d82e96",
                "spanId": "387befb608d82e96"
              },
              "client": "sdk",
              "body": "Connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:13:45.020Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:13:45.475Z",
          "lmodifiedOn": "2023-04-11T11:13:45.475Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-f5d6f572-e899-5d79-a427-8fc1bbb418d7",
              "cT": "text",
              "data": {
                "text": "Connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681211625488,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643540e041bc6dbb4fa5b518",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-908bbb37-d0a9-519c-a59d-5ee520c1eb4e",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "e0db3fb5-7702-416c-93e9-0d6fab9c2fdf",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "387befb608d82e96",
                "spanId": "387befb608d82e96"
              },
              "client": "sdk",
              "body": "Connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:14:00.988Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:14:01.210Z",
          "lmodifiedOn": "2023-04-11T11:14:01.210Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-394e9e41-ffb7-5bc9-808a-f6c1019f9cf6",
              "cT": "text",
              "data": {
                "text": "Connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681211641217,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643540e041bc6dbb4fa5b518",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-b1b6ce6d-73b9-5a7b-a3ec-e7696b1a2984",
          "channels": [
            {
              "handle": {
                "handleId": "ece3ba7c-fee5-4c04-88d4-2eb03ef228dc",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "499175ebd2e93624",
                "spanId": "499175ebd2e93624",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:15:32.207Z",
          "lmodifiedOn": "2023-04-11T11:15:32.207Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-8582721f-2c33-509c-afaf-6c9d0c511a24",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681211732209,
          "__v": 0,
          "sT": 1,
          "sessionId": "643541536102debb44e176b6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-90cfaec3-6774-504a-97f2-41f9b4e5d103",
          "channels": [
            {
              "handle": {
                "handleId": "ece3ba7c-fee5-4c04-88d4-2eb03ef228dc",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "499175ebd2e93624",
                "spanId": "499175ebd2e93624",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:15:32.505Z",
          "lmodifiedOn": "2023-04-11T11:15:32.505Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-dae4801b-1ed6-5b2c-af2d-758c15baeb1d",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681211732508,
          "__v": 0,
          "sT": 1,
          "sessionId": "643541536102debb44e176b6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-ae0d5b1e-9701-5934-a9c9-a15b1704db5f",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "ece3ba7c-fee5-4c04-88d4-2eb03ef228dc",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "499175ebd2e93624",
                "spanId": "499175ebd2e93624"
              },
              "client": "sdk",
              "body": "hi",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:15:38.058Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:15:38.236Z",
          "lmodifiedOn": "2023-04-11T11:15:38.236Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-5888a576-65b1-5e11-85ee-ff2658dbf9be",
              "cT": "text",
              "data": {
                "text": "hi"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681211738241,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643541536102debb44e176b6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-3757ac3f-ba02-5b79-ac67-b074f8ccf817",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "ece3ba7c-fee5-4c04-88d4-2eb03ef228dc",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "499175ebd2e93624",
                "spanId": "499175ebd2e93624"
              },
              "client": "sdk",
              "body": "hello",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:15:52.490Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:15:52.707Z",
          "lmodifiedOn": "2023-04-11T11:15:52.707Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-cdd6d3a9-cce5-5e01-b7c6-42d892ab635d",
              "cT": "text",
              "data": {
                "text": "hello"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681211752714,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643541536102debb44e176b6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-e00a001c-7f6e-5639-9d28-c489eba158f2",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "ece3ba7c-fee5-4c04-88d4-2eb03ef228dc",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "499175ebd2e93624",
                "spanId": "499175ebd2e93624"
              },
              "client": "sdk",
              "body": "sending a ctrl message to CS",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:15:52.490Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "requestId": "ms-3757ac3f-ba02-5b79-ac67-b074f8ccf817",
              "botLanguage": "en",
              "requestContext": {
                "isRuntime": true,
                "isBB": true
              }
            }
          ],
          "type": "ctrlmsg",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedOn": "2023-04-11T11:31:09.308Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "chnl": "rtm",
          "accountId": "641d78ce8e022ea3d242a60f",
          "sessionId": "643541536102debb44e176b6",
          "isBB": 0,
          "isD": 1,
          "ms": 4,
          "sT": 1,
          "components": [
            {
              "_id": "cp-5f0a7a27-3776-56cc-aca3-de318d383bca",
              "cT": "text",
              "data": {
                "text": "sending a ctrl message to CS"
              },
              "thumbnails": []
            }
          ],
          "createdOn": "2023-04-11T11:31:09.315Z",
          "timestampValue": 1681212669315,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-5d6b6850-b338-5eae-9808-56daee95c729",
          "channels": [
            {
              "handle": {
                "handleId": "ece3ba7c-fee5-4c04-88d4-2eb03ef228dc",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "499175ebd2e93624",
                "spanId": "499175ebd2e93624"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:31:10.611Z",
          "lmodifiedOn": "2023-04-11T11:31:10.611Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-b1c3b5da-759a-5f09-b8fe-7d689392ba30",
              "cT": "text",
              "data": {
                "text": "Ending your session as there is no activity. You can start over whenever you need "
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 1,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "lang": "en",
          "agentAssistDetails": {
            "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
            "srcChannel": "",
            "childBotStreamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
            "experience": "",
            "userInput": "sending a ctrl message to CS"
          },
          "timestampValue": 1681212670622,
          "__v": 0,
          "sT": 1,
          "sessionId": "643541536102debb44e176b6",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-2d185ee9-4bc1-5502-9abf-8f5995e76aa1",
          "channels": [
            {
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:32:10.090Z",
          "lmodifiedOn": "2023-04-11T11:32:10.090Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-247a0339-fa72-5b7c-a493-ce9d171f44b3",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681212730093,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-fd553ec3-81d8-51c1-9c5c-d7b85cb6ba74",
          "channels": [
            {
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:32:10.497Z",
          "lmodifiedOn": "2023-04-11T11:32:10.497Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-89a72070-74ca-5dc4-92a1-bf78b3518ad2",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681212730499,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-471be515-f62c-570d-8055-54935ca1330f",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:32:25.304Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:32:25.639Z",
          "lmodifiedOn": "2023-04-11T11:32:25.639Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-334651a5-e011-5fd7-a902-f3135114da6d",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681212745645,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-5e2414312107-5d81-a8ac-68251db81dd5",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "client": "sdk",
              "body": "feedback",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:32:44.648Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:32:44.914Z",
          "lmodifiedOn": "2023-04-11T11:32:44.914Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-3d3a6dbb-3bd6-56a2-a7dd-853403ca0795",
              "cT": "text",
              "data": {
                "text": "feedback"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681212764925,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-782f9ca8-60c5-5544-8096-5f2e0656a566",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "client": "sdk",
              "body": "Show Balance",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:33:09.686Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:33:10.047Z",
          "lmodifiedOn": "2023-04-11T11:33:10.047Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-b60e6203-4bf3-5131-9954-e8ac2054c60d",
              "cT": "text",
              "data": {
                "text": "Show Balance"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681212790053,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f3ca3b01-4ae4-5bcd-b5bd-b778b63d1c9c",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "client": "sdk",
              "body": "Connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:39:24.629Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:39:24.847Z",
          "lmodifiedOn": "2023-04-11T11:39:24.847Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-45562b6b-cc3c-5f4c-82a9-943648468cc2",
              "cT": "text",
              "data": {
                "text": "Connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681213164852,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-7d2d8def-da8f-59c1-b4c6-53b6f9c79675",
          "channels": [
            {
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:39:27.791Z",
          "lmodifiedOn": "2023-04-11T11:39:27.791Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-657ce6fb-25b9-5c71-9a4b-4d7cad6e8864",
              "cT": "text",
              "data": {
                "text": "You will be transferred to an agent."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 0,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681213167795,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-865cbcbf-4aff-5d1d-ba40-047c9a0fb9bb",
          "channels": [],
          "type": "timelinemsg",
          "status": "pending",
          "createdOn": "2023-04-11T11:39:27.955Z",
          "lmodifiedOn": "2023-04-11T11:39:27.955Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 1,
          "ms": 5,
          "chnl": "rtm",
          "components": [],
          "timestampValue": 1681213167955,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-d7867991-ff5c-53e0-be64-4c1e3cc71c52",
          "channels": [
            {
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:39:34.727Z",
          "lmodifiedOn": "2023-04-11T11:39:34.727Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-c1958a79-3f81-58e4-86f0-4d685225c6a4",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"Thank you for waiting. You are now connected with usecases\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-2b4ce7b-0096-45b5-a79a-9d76833a80d4",
          "timestampValue": 1681213174732,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-f18df4bf-13c6-5695-b830-4c4f75efa298",
          "channels": [
            {
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:40:02.364Z",
          "lmodifiedOn": "2023-04-11T11:40:02.364Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-efd2cfe6-5477-525a-8ee7-5261b28cac30",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"usecases has now closed this conversation. Please reach out to us if you need any assistance again.\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-2b4ce7b-0096-45b5-a79a-9d76833a80d4",
          "timestampValue": 1681213202367,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435453943bba9c989e119bf",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-ed1a890a-08de-5b93-8568-0b0c450731d1",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "f163a7ae-5e62-49bd-bfbd-9832dc62269b",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "0ecfa0c435f143b0",
                "spanId": "0ecfa0c435f143b0"
              },
              "client": "sdk",
              "body": "sending a ctrl message to CS",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:39:24.629Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "requestId": "ms-f3ca3b01-4ae4-5bcd-b5bd-b778b63d1c9c",
              "botLanguage": "en",
              "requestContext": {
                "isRuntime": true,
                "isBB": true
              },
              "externalReq": true,
              "discardCC": {
                "isDelete": true,
                "skipMessage": true
              }
            }
          ],
          "type": "ctrlmsg",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedOn": "2023-04-11T11:40:02.473Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "chnl": "rtm",
          "accountId": "641d78ce8e022ea3d242a60f",
          "sessionId": "6435453943bba9c989e119bf",
          "isBB": 0,
          "isD": 1,
          "ms": 4,
          "sT": 1,
          "components": [
            {
              "_id": "cp-dad4d0cd-6754-5877-8b1e-27b87010fc99",
              "cT": "text",
              "data": {
                "text": "sending a ctrl message to CS"
              },
              "thumbnails": []
            }
          ],
          "createdOn": "2023-04-11T11:40:02.480Z",
          "timestampValue": 1681213202480,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-1cbbadfa-51cd-5f63-85e9-1671ac21313d",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:42:00.219Z",
          "lmodifiedOn": "2023-04-11T11:42:00.219Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-789cac97-3aaa-5afb-9144-124eb19cfcf3",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681213320228,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-6b480ea2-1abc-500a-bb7b-805e7e1e128a",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:42:00.739Z",
          "lmodifiedOn": "2023-04-11T11:42:00.739Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-64e0fdee-dbd3-5d08-8afd-c2fddbe83544",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681213320742,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-30914ac3-1ae4-578f-9177-5dc7ce42c20b",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "client": "sdk",
              "body": "Connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T11:42:05.635Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T11:42:05.963Z",
          "lmodifiedOn": "2023-04-11T11:42:05.963Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-30cfa369-61f8-50cf-b5a6-f650295f17ed",
              "cT": "text",
              "data": {
                "text": "Connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681213325968,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-bae0df46-5b3f-5c55-b8df-2fd35f11b1b8",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:42:08.015Z",
          "lmodifiedOn": "2023-04-11T11:42:08.015Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-129b4da2-738b-529e-9814-1624c760fde7",
              "cT": "text",
              "data": {
                "text": "You will be transferred to an agent."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 0,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681213328018,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-bd223656-b305-5709-be7a-f2760f68a643",
          "channels": [],
          "type": "timelinemsg",
          "status": "pending",
          "createdOn": "2023-04-11T11:42:08.140Z",
          "lmodifiedOn": "2023-04-11T11:42:08.141Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 1,
          "ms": 5,
          "chnl": "rtm",
          "components": [],
          "timestampValue": 1681213328141,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-2b28633f-174a-50b5-a299-6d1227d856de",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:42:10.901Z",
          "lmodifiedOn": "2023-04-11T11:42:10.901Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-1e1899c2-3907-5255-894b-98e43a3fd558",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"Thank you for waiting. You are now connected with usecases\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681213330906,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-e4277cfc-a7e5-5b41-8c0f-dbee8590afc2",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:57:10.749Z",
          "lmodifiedOn": "2023-04-11T11:57:10.749Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-6ef421b8-1e6b-51a5-bb56-1b2a3992db53",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"usecases, the agent you were engaged with is unable to respond. We will add you back to the queue in the highest priority to connect with the next available agent.\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214230753,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-6a2834dc-0d67-5478-a564-426069262f46",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:57:10.869Z",
          "lmodifiedOn": "2023-04-11T11:57:10.869Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-958ec93c-3f60-5057-8fb7-9a60ef86cd11",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"Transferred to another agent now you are in Queue\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214230872,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-2082135f-61e7-5621-99b1-5d6db4dd1f73",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T11:58:41.041Z",
          "lmodifiedOn": "2023-04-11T11:58:41.041Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-e54024bc-84e3-5128-97cb-5582101e1b38",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"live_agent\",\"text\":\"All our agents are currently busy. Please wait while we get the next available agent. Your estimated wait time is 2 min.\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "SYSTEM"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214321042,
          "__v": 0,
          "sT": 1,
          "sessionId": "64354787b66cb4d2e1023d7c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-aedfcb14-f17c-56ca-abc4-ab7620613e0d",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:00:12.773Z",
          "lmodifiedOn": "2023-04-11T12:00:12.773Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-35a2e80c-7884-582c-8c10-42155fc44c88",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"live_agent\",\"text\":\"We apologize for the wait. All our agents are busy. Please wait while we get the next available agent.You are in 1 position.Your estimated wait time is 2 min\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "SYSTEM"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214412779,
          "__v": 0,
          "sT": 0,
          "sessionId": "64354b7ab66cb4d2e1023f11",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-dd481a1d-7924-5314-81b5-5e0baaba5c80",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:01:42.945Z",
          "lmodifiedOn": "2023-04-11T12:01:42.945Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-d9c86b65-dc8a-517e-a753-81b31289eddd",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"live_agent\",\"text\":\"All our agents are currently busy. Please wait while we get the next available agent. Your position in the queue is 1\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "SYSTEM"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214502946,
          "__v": 0,
          "sT": 0,
          "sessionId": "64354b7ab66cb4d2e1023f11",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-0b156f0a-5568-524c-84ff-9ba681fd7e8a",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:03:13.893Z",
          "lmodifiedOn": "2023-04-11T12:03:13.893Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-ec089f6f-8868-5917-b8ba-59139e78ac37",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"live_agent\",\"text\":\"All our agents are currently busy. Please wait while we get the next available agent. Your position in the queue is 1\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "SYSTEM"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214593894,
          "__v": 0,
          "sT": 0,
          "sessionId": "64354b7ab66cb4d2e1023f11",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-444998e3-8fb5-5a3d-95a3-23ad99d74882",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:04:44.585Z",
          "lmodifiedOn": "2023-04-11T12:04:44.585Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-58e2806f-9d5f-59c1-a670-5244e0f5e152",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"live_agent\",\"text\":\"All our agents are currently busy. Please wait while we get the next available agent. Your estimated wait time is 2 min.\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "SYSTEM"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214684586,
          "__v": 0,
          "sT": 0,
          "sessionId": "64354b7ab66cb4d2e1023f11",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-a851f355-1468-5801-88b8-635ae28f3917",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:06:14.825Z",
          "lmodifiedOn": "2023-04-11T12:06:14.825Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-9c0334bc-c4a8-5743-9970-1b885d42eb5a",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"live_agent\",\"text\":\"We apologize for the wait. All our agents are busy. Please wait while we get the next available agent.You are in 1 position.Your estimated wait time is 2 min\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "SYSTEM"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214774826,
          "__v": 0,
          "sT": 0,
          "sessionId": "64354b7ab66cb4d2e1023f11",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-c5297a27-46fc-5d96-956b-7a62cfed274d",
          "channels": [
            {
              "handle": {
                "handleId": "94cd0326-460f-459a-9392-74b9c06dfe5a",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "fd869ba02616c15c",
                "spanId": "fd869ba02616c15c"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:07:10.967Z",
          "lmodifiedOn": "2023-04-11T12:07:10.967Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-7a630518-235f-5912-a34b-aa653a49d838",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"I’m sorry. It seems like there are no agents that can help you at this time. Please reach out us a bit later.\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-e07b1de-2a01-4263-85b8-61e52084456b",
          "timestampValue": 1681214830968,
          "__v": 0,
          "sT": 0,
          "sessionId": "64354b7ab66cb4d2e1023f11",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-1b157f12-db1f-5049-9434-16d7153da10f",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "19694494-bb53-4f21-81ba-9cbec0bacd11",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "1350f876295c6837",
                "spanId": "1350f876295c6837",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "client": "botbuilder",
              "defaultLanguage": "en",
              "requestContext": {
                "isRuntime": true,
                "isBB": true
              },
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botLanguage": "en",
              "channel": "rtm",
              "botEvent": "ON_CONNECT_EVENT",
              "requestStartTime": "2023-04-11T11:58:50.038Z",
              "timestamp": 1681214330245,
              "productName": "Bots",
              "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "botName": "kore",
              "isDefaultSDKClient": true,
              "sendVcf": true,
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "body": "sending a ctrl message to CS",
              "externalReq": true,
              "discardCC": {
                "isDelete": true,
                "skipMessage": true
              }
            }
          ],
          "type": "ctrlmsg",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedOn": "2023-04-11T12:07:11.036Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "chnl": "rtm",
          "accountId": "641d78ce8e022ea3d242a60f",
          "sessionId": "64354787b66cb4d2e1023d7c",
          "isBB": 0,
          "isD": 1,
          "ms": 4,
          "sT": 1,
          "components": [
            {
              "_id": "cp-a4c314a0-96d7-5987-a2d7-504b56cfacdd",
              "cT": "text",
              "data": {
                "text": "sending a ctrl message to CS"
              },
              "thumbnails": []
            }
          ],
          "createdOn": "2023-04-11T12:07:11.043Z",
          "timestampValue": 1681214831043,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-3a9f38cd-840d-5cc3-b170-35db6ff949e4",
          "channels": [
            {
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:18:51.810Z",
          "lmodifiedOn": "2023-04-11T12:18:51.810Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-72da07e3-0bf9-58ce-bd05-0b922dc82603",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681215531813,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-388b31e7-50f1-5c78-8d38-4d65edf02ee5",
          "channels": [
            {
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:18:52.070Z",
          "lmodifiedOn": "2023-04-11T12:18:52.070Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-139df9ee-2f80-5ec7-bded-d3dc58dbd0c9",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681215532073,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-11f33373-5327-528d-953b-8896df4a419a",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:19:07.343Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T11:42:10.554Z",
                    "timespent": 2216.665,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:19:07.608Z",
          "lmodifiedOn": "2023-04-11T12:19:07.608Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-b734d2c1-bdc2-5e1a-bfe2-862672ff9685",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681215547615,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-5bc1c9cf-8f8d-5612-a6ef-ff7ebea2e603",
          "channels": [
            {
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:19:09.374Z",
          "lmodifiedOn": "2023-04-11T12:19:09.374Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-8b88e295-ab98-569c-aeba-e103cf993664",
              "cT": "text",
              "data": {
                "text": "You will be transferred to an agent."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 0,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681215549376,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-21703e09-bf4a-51ee-8a8c-c0a77b8d61a0",
          "channels": [],
          "type": "timelinemsg",
          "status": "pending",
          "createdOn": "2023-04-11T12:19:09.481Z",
          "lmodifiedOn": "2023-04-11T12:19:09.481Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 1,
          "ms": 5,
          "chnl": "rtm",
          "components": [],
          "timestampValue": 1681215549481,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-0ffe16b1-c575-5360-aca44158090501a8",
          "channels": [
            {
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:19:15.300Z",
          "lmodifiedOn": "2023-04-11T12:19:15.300Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-fa0cf788-05d8-56be-9020-85bbfc73a903",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"Thank you for waiting. You are now connected with usecases\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "timestampValue": 1681215555304,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-4bd20194-fc6d-5678-87ac-09d34eb61a1b",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "book ticket",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:20:06.659Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 51.672,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:20:06.951Z",
          "lmodifiedOn": "2023-04-11T12:20:06.951Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-8fe0d2bc-c295-5906-a5a6-132a6b0a8f40",
              "cT": "text",
              "data": {
                "text": "book ticket"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681215606956,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "author": {
            "id": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
            "type": "USER",
            "emailId": "localusecases@yopmail.com",
            "firstName": "usecases",
            "lastName": "bug",
            "profImage": "no-avatar"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-bd8c3b8f-893c-59b1-bea1-6399bb474469",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "reset password",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:20:22.256Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 67.22,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:20:22.451Z",
          "lmodifiedOn": "2023-04-11T12:20:22.451Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-d74d2570-1b93-5ddd-99dd-aa09e38cc908",
              "cT": "text",
              "data": {
                "text": "reset password"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681215622455,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "author": {
            "id": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
            "type": "USER",
            "emailId": "localusecases@yopmail.com",
            "firstName": "usecases",
            "lastName": "bug",
            "profImage": "no-avatar"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-7de060f2-d04b-5967-97db-5d565a0aa7e7",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "reset password",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:20:45.025Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 90.038,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:20:45.226Z",
          "lmodifiedOn": "2023-04-11T12:20:45.226Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-2cf0140b-c901-5e3b-a703-dce412dda57e",
              "cT": "text",
              "data": {
                "text": "reset password"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681215645233,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "author": {
            "id": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
            "type": "USER",
            "emailId": "localusecases@yopmail.com",
            "firstName": "usecases",
            "lastName": "bug",
            "profImage": "no-avatar"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-a90dca99-0d25-5b78-8d1d-dbc3b1ff87ca",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "Flight status",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:21:00.869Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 105.8,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:21:01.139Z",
          "lmodifiedOn": "2023-04-11T12:21:01.139Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-f749bbf8-09bd-5f00-bdc0-fe93904e6bb4",
              "cT": "text",
              "data": {
                "text": "Flight status"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681215661146,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "author": {
            "id": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
            "type": "USER",
            "emailId": "localusecases@yopmail.com",
            "firstName": "usecases",
            "lastName": "bug",
            "profImage": "no-avatar"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-a115021f-0951-529e-8e62-90a64f7f31a4",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "reset all details in it",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:21:16.663Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 121.689,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:21:16.895Z",
          "lmodifiedOn": "2023-04-11T12:21:16.895Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-7e8d8edc-432b-514d-a49e-6bd537228344",
              "cT": "text",
              "data": {
                "text": "reset all details in it"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681215676899,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "author": {
            "id": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
            "type": "USER",
            "emailId": "localusecases@yopmail.com",
            "firstName": "usecases",
            "lastName": "bug",
            "profImage": "no-avatar"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-0243176c-59dd-52d7-baf9-09514008ed56",
          "channels": [
            {
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:29:17.968Z",
          "lmodifiedOn": "2023-04-11T12:29:17.968Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-6a5fa580-a553-5891-afd8-0218265a9527",
              "cT": "text",
              "data": {
                "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"SYSTEM\",\"text\":\"usecases has now closed this conversation. Please reach out to us if you need any assistance again.\"}}"
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 0,
          "isA": true,
          "author": {
            "type": "EVENT"
          },
          "conversationId": "c-4de86e3-ead4-4178-a80b-e5a9dc184d9c",
          "timestampValue": 1681216157971,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-4a4ac8f9-c6cf-589d-afd4-1939109e0cf5",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "4e2c5700-ea5d-41e4-8173-43837c7937f1",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "c73400c546c82512",
                "spanId": "c73400c546c82512"
              },
              "client": "sdk",
              "body": "sending a ctrl message to CS",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:21:16.663Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 121.689,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "requestId": "ms-a115021f-0951-529e-8e62-90a64f7f31a4",
              "botLanguage": "en",
              "requestContext": {
                "isRuntime": true,
                "isBB": true
              },
              "externalReq": true,
              "discardCC": {
                "isDelete": true,
                "skipMessage": true
              }
            }
          ],
          "type": "ctrlmsg",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedOn": "2023-04-11T12:29:18.077Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "chnl": "rtm",
          "accountId": "641d78ce8e022ea3d242a60f",
          "sessionId": "6435502b52d57cd2ecca7bb9",
          "isBB": 0,
          "isD": 1,
          "ms": 4,
          "sT": 1,
          "components": [
            {
              "_id": "cp-f5ef5630-826b-5b27-b06b-80382c5ed9ec",
              "cT": "text",
              "data": {
                "text": "sending a ctrl message to CS"
              },
              "thumbnails": []
            }
          ],
          "createdOn": "2023-04-11T12:29:18.081Z",
          "timestampValue": 1681216158081,
          "__v": 0,
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-2b79119b-f8a5-5baf-bc1b-43b8e2c821eb",
          "channels": [
            {
              "handle": {
                "handleId": "78471f89-3ec4-4b4c-9156-fdff5c9a9475",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "ee11a78c2f57afa9",
                "spanId": "ee11a78c2f57afa9",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:30:50.543Z",
          "lmodifiedOn": "2023-04-11T12:30:50.543Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-cc1c7fce-14d2-5ec3-aded-bda33e8e671d",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216250546,
          "__v": 0,
          "sT": 1,
          "sessionId": "643552fab66cb4d2e1024d02",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-008da82c-a35d-5560-8c81-33b83a627674",
          "channels": [
            {
              "handle": {
                "handleId": "78471f89-3ec4-4b4c-9156-fdff5c9a9475",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "ee11a78c2f57afa9",
                "spanId": "ee11a78c2f57afa9",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:30:50.719Z",
          "lmodifiedOn": "2023-04-11T12:30:50.719Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-6a50a7ed-587d-533b-b190-586833297060",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216250720,
          "__v": 0,
          "sT": 1,
          "sessionId": "643552fab66cb4d2e1024d02",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-98f10e24-d784-5051-8fee-cf2f3d1a4710",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "78471f89-3ec4-4b4c-9156-fdff5c9a9475",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "ee11a78c2f57afa9",
                "spanId": "ee11a78c2f57afa9"
              },
              "client": "sdk",
              "body": "connection",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:30:56.953Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": [
                  {
                    "page": "SmartAssist",
                    "timestamp": "2023-04-11T12:19:14.873Z",
                    "timespent": 702.009,
                    "domain": "localhost"
                  }
                ]
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:30:57.131Z",
          "lmodifiedOn": "2023-04-11T12:30:57.131Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-215e9715-4c81-540c-9468-94b709ea1953",
              "cT": "text",
              "data": {
                "text": "connection"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681216257135,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643552fab66cb4d2e1024d02",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-ced3de49-227b-5d3f-b747-f0c5f7c71a4f",
          "channels": [
            {
              "handle": {
                "handleId": "d264cede-91c2-41a5-aaa0-e124153e5602",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "4276490ead890748",
                "spanId": "4276490ead890748",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:37:11.679Z",
          "lmodifiedOn": "2023-04-11T12:37:11.679Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-d84fad3c-7bbc-59c9-ac97-5c25b8dbcb80",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216631683,
          "__v": 0,
          "sT": 1,
          "sessionId": "64355477b66cb4d2e10251b0",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-ba7143fc-974c-56f6-be9d-e29314be40c0",
          "channels": [
            {
              "handle": {
                "handleId": "d264cede-91c2-41a5-aaa0-e124153e5602",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "4276490ead890748",
                "spanId": "4276490ead890748",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:37:11.872Z",
          "lmodifiedOn": "2023-04-11T12:37:11.872Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-34495269-010b-5dec-93df-e9aa96f5191b",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216631874,
          "__v": 0,
          "sT": 1,
          "sessionId": "64355477b66cb4d2e10251b0",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-50f4a7cb-9ae2-5ffe-be5c-1f9ca6aac03d",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "d264cede-91c2-41a5-aaa0-e124153e5602",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "4276490ead890748",
                "spanId": "4276490ead890748"
              },
              "client": "sdk",
              "body": "dialogforubat",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:37:46.448Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:37:46.599Z",
          "lmodifiedOn": "2023-04-11T12:37:46.599Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-3ad6299a-6aa0-535b-9b18-9e47f451abc0",
              "cT": "text",
              "data": {
                "text": "dialogforubat"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681216666615,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64355477b66cb4d2e10251b0",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-505246cf-932b-598d-ba3c-2d82d5ce26b5",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "d264cede-91c2-41a5-aaa0-e124153e5602",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "4276490ead890748",
                "spanId": "4276490ead890748"
              },
              "client": "sdk",
              "body": "hello",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:38:03.400Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:38:03.493Z",
          "lmodifiedOn": "2023-04-11T12:38:03.493Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-f47a6641-0388-572b-a515-ba449ff60c6e",
              "cT": "text",
              "data": {
                "text": "hello"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681216683496,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64355477b66cb4d2e10251b0",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-4e8d252e-07b0-5ebe-a869-0c703ab70503",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "d264cede-91c2-41a5-aaa0-e124153e5602",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "4276490ead890748",
                "spanId": "4276490ead890748"
              },
              "client": "sdk",
              "body": "help",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:38:32.738Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:38:32.838Z",
          "lmodifiedOn": "2023-04-11T12:38:32.838Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-cad947d5-77f7-5428-ae2c-4904b01a3c1f",
              "cT": "text",
              "data": {
                "text": "help"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681216712841,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "64355477b66cb4d2e10251b0",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-b23d01e1-c951-5d43-96c3-ff54096b5194",
          "channels": [
            {
              "handle": {
                "handleId": "0db885c8-001d-47a7-a1ea-4a7e190d42b6",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "ecac2f43571e2d81",
                "spanId": "ecac2f43571e2d81",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:39:27.927Z",
          "lmodifiedOn": "2023-04-11T12:39:27.927Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-9249165b-baa8-5879-8a99-296e2bb909fc",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216767929,
          "__v": 0,
          "sT": 1,
          "sessionId": "643554ffb66cb4d2e102528f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-2be91e66-de63-5ef0-b782-da8cbc9031a6",
          "channels": [
            {
              "handle": {
                "handleId": "0db885c8-001d-47a7-a1ea-4a7e190d42b6",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "ecac2f43571e2d81",
                "spanId": "ecac2f43571e2d81",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:39:28.149Z",
          "lmodifiedOn": "2023-04-11T12:39:28.149Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-6ae81f11-72b1-5adb-a45f-849c3adb725e",
              "cT": "text",
              "data": {
                "text": "How can I help you today."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216768151,
          "__v": 0,
          "sT": 1,
          "sessionId": "643554ffb66cb4d2e102528f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-5899a383-de80-50f5-b261-45d0817d353c",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "0db885c8-001d-47a7-a1ea-4a7e190d42b6",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "ecac2f43571e2d81",
                "spanId": "ecac2f43571e2d81"
              },
              "client": "sdk",
              "body": "hi",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:39:32.629Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:39:32.759Z",
          "lmodifiedOn": "2023-04-11T12:39:32.759Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-972e086a-acf9-5796-8365-ad013b85b912",
              "cT": "text",
              "data": {
                "text": "hi"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681216772763,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643554ffb66cb4d2e102528f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-a1a59b16-a20e-5429-92be-0a1d5abb7f51",
          "channels": [
            {
              "type": "rtm",
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": ""
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "handle": {
                "handleId": "0db885c8-001d-47a7-a1ea-4a7e190d42b6",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "traceId": "ecac2f43571e2d81",
                "spanId": "ecac2f43571e2d81"
              },
              "client": "sdk",
              "body": "help",
              "enable": true,
              "isAlertsEnabled": false,
              "message": "The bot is disabled via Web/Mobile Client. You can still talk to the bot via Web/Mobile Client, Webhook, AudioCodes.",
              "activeChannels": "Web/Mobile Client,Webhook,AudioCodes.",
              "streamId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
              "tokens": [],
              "__userInputTime": "2023-04-11T12:39:53.289Z",
              "__loopCount": 0,
              "agentDesktopMeta": {
                "pagesVisited": []
              },
              "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "channelUId": "localusecases@yopmail.com"
            }
          ],
          "type": "incoming",
          "status": "received",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "lmodifiedBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "createdOn": "2023-04-11T12:39:53.433Z",
          "lmodifiedOn": "2023-04-11T12:39:53.433Z",
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "orgId": "o-f07e849a-6b97-5c23-87c9-24484a702ae3",
          "accountId": "641d78ce8e022ea3d242a60f",
          "isBB": 0,
          "ms": 1,
          "chnl": "rtm",
          "isD": 1,
          "components": [
            {
              "_id": "cp-1f2c603a-15ea-574c-8cb7-22f8066dbb87",
              "cT": "text",
              "data": {
                "text": "help"
              },
              "thumbnails": []
            }
          ],
          "timestampValue": 1681216793437,
          "__v": 0,
          "lang": "en",
          "sT": 1,
          "sessionId": "643554ffb66cb4d2e102528f",
          "resourceid": "messagestore"
        },
        {
          "_id": "ms-34b9ffb9-53a4-5363-b09f-4bfecb547adc",
          "channels": [
            {
              "handle": {
                "handleId": "7b328287-5ccb-4582-a8d4-ca951bc3c8e2",
                "userId": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
                "type": "welcome",
                "traceId": "25b5406a841e87af",
                "spanId": "25b5406a841e87af",
                "clientId": "5a37bf24-fea0-4e6b-a816-f9602db08149"
              },
              "from": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
              "botInfo": {
                "chatBot": "kore",
                "taskBotId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
                "customData": [
                  {
                    "callFlowId": "cf-ee7a50d2-e17d-5c92-bc3f-fab3ccad1a9a",
                    "state": "configured"
                  }
                ],
                "hostDomain": "http://localhost",
                "os": "Linux",
                "device": "Other"
              },
              "type": "rtm"
            }
          ],
          "type": "outgoing",
          "status": "pending",
          "createdOn": "2023-04-11T12:41:04.790Z",
          "lmodifiedOn": "2023-04-11T12:41:04.790Z",
          "createdBy": "u-3d41bfa8-4ed0-5eaa-811b-8b6f06bbcd5c",
          "components": [
            {
              "_id": "cp-eb068acb-3f47-520e-9ac3-1c621c279955",
              "cT": "text",
              "data": {
                "text": "Hey Thanks for connecting with us."
              },
              "thumbnails": []
            }
          ],
          "botId": "st-9a848748-0e28-51e7-83a0-eee0570a7ab4",
          "isBB": 1,
          "chnl": "rtm",
          "isD": 0,
          "timestampValue": 1681216864793,
          "__v": 0,
          "sT": 1,
          "sessionId": "6435556052d57cd2ecca85ad",
          "resourceid": "messagestore"
        }
      ]
    })
  }
}
