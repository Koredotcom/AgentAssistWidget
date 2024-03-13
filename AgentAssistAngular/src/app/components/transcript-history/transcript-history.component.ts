import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-transcript-history',
  templateUrl: './transcript-history.component.html',
  styleUrls: ['./transcript-history.component.scss']
})
export class TranscriptHistoryComponent implements OnInit, OnDestroy{

// @ViewChild('transcriptScrollContainer', {static: false}) private transcriptScrollContainer: ElementRef<HTMLDivElement>

  subs = new SubSink();
  connectionDetails : any;
  historyResponse : any = [];
  parsedCustomData : any;
  projConstants : any = ProjConstants;

  constructor(private serviceInvoker: ServiceInvokerService,
    private rootService : RootService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails = this.rootService.getConnectionDetails();
        this.getTranscriptHistory(this.connectionDetails);
        this.parsedCustomData = Object.assign({},this.connectionDetails.customData);
      }
    });
  }

  userBotHostory = [];
  userAgentHistory = [];
  getTranscriptHistory(params){
    this.serviceInvoker.invoke('get.transcriptHistory', { convId: params.conversationId }, {}, { botId : params.botId }, params.agentassisturl).subscribe((data)=> {
      if(data) {
        data = {
          "userAgentMessages": {
              "result": [
                  {
                      "_id": "ms-5f2c179d-f342-5b5a-9d53-65f5a8499cc2",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-3dc3b50f-bf3d-57e3-8034-b9192a36517d",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:30:28.465Z",
                      "lmodifiedOn": "2024-02-07T14:30:28.465Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-369dcd3c-df85-52f5-9fbc-0cda5ef1982f",
                              "cT": "text",
                              "data": {
                                  "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"button\",\"text\":\"Please choose the account type\",\"buttons\":[{\"type\":\"postback\",\"title\":\"Salary\",\"payload\":\"Salary\"},{\"type\":\"postback\",\"title\":\"Saving\",\"payload\":\"Saving\"},{\"type\":\"postback\",\"title\":\"Checking\",\"payload\":\"Checking\"}]}}"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Show Balance",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-o2cw0v7k4v",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "Show Balance",
                          "entityRequest": true,
                          "entityName": "AccountType",
                          "newEntityDisplayName": "AccountType",
                          "newEntityType": "list_of_values",
                          "newEntityName": "AccountType",
                          "componentType": "entity",
                          "applyDefaultTemplate": true,
                          "isPrompt": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:30:28.000Z",
                      "timestampValue": 1707316228466,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "USER"
                  },
                  {
                      "_id": "ms-2c25852c-b026-52f3-8a6d-8483fa7b7928",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-8e6ddb62-6b53-5202-b541-fed6f0a421a7",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:36:23.455Z",
                      "lmodifiedOn": "2024-02-07T14:36:23.455Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-eb4402fe-ad29-52c0-8503-cedf9d877dda",
                              "cT": "text",
                              "data": {
                                  "text": "Ok, I am discarding the task for now. We can start over whenever you are ready."
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "discard all",
                          "endReason": 2,
                          "endOfTask": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:36:23.000Z",
                      "timestampValue": 1707316583457,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "AGENT"
                  },
                  {
                      "_id": "ms-b179db95-ee93-557e-bd63-ac6a04eefac3",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-8e6ddb62-6b53-5202-b541-fed6f0a421a7",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:36:23.789Z",
                      "lmodifiedOn": "2024-02-07T14:36:23.789Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-a09881de-737b-5a07-bb22-088ea6e5c631",
                              "cT": "text",
                              "data": {
                                  "text": "thanks for contacting, please visit us again"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "eod",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-myyutu9dkwg",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "discard all",
                          "isPrompt": false
                      },
                      "__lModifiedOn__": "2024-02-07T14:36:23.000Z",
                      "timestampValue": 1707316583791,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "USER"
                  },
                  {
                      "_id": "ms-1710e2eb-bac1-5dbe-a1da-caf7728b5af9",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-503bbaa3-021d-5194-9541-8eeff9b80818",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:36:24.559Z",
                      "lmodifiedOn": "2024-02-07T14:36:24.559Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-8a6369da-eaef-54f0-9e95-73b34b3767b3",
                              "cT": "text",
                              "data": {
                                  "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"button\",\"text\":\"What operating system are you looking for?\",\"buttons\":[{\"type\":\"postback\",\"title\":\"iOS\",\"payload\":\"iOS\"},{\"type\":\"postback\",\"title\":\"Android\",\"payload\":\"Android\"},{\"type\":\"postback\",\"title\":\"Windows\",\"payload\":\"Windows\"}]}}"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Mobile Enquiry",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-myyutu9dkwg",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "Mobile Enquiry",
                          "entityRequest": true,
                          "entityName": "Entity_OS",
                          "newEntityDisplayName": "",
                          "newEntityType": "list_of_values",
                          "newEntityName": "Entity_OS",
                          "componentType": "entity",
                          "applyDefaultTemplate": true,
                          "isPrompt": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:36:24.000Z",
                      "timestampValue": 1707316584560,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "AGENT"
                  },
                  {
                      "_id": "ms-e9a0c42b-9103-5492-9644-2b3c4bdd21ec",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-1bcf59f4-c314-537d-81cd-dcffe2e35580",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:39:09.248Z",
                      "lmodifiedOn": "2024-02-07T14:39:09.248Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-62beb8c0-3dd7-52a8-bb64-7fae0f0cb59c",
                              "cT": "text",
                              "data": {
                                  "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"button\",\"text\":\"What operating system are you looking for?\",\"buttons\":[{\"type\":\"postback\",\"title\":\"iOS\",\"payload\":\"iOS\"},{\"type\":\"postback\",\"title\":\"Android\",\"payload\":\"Android\"},{\"type\":\"postback\",\"title\":\"Windows\",\"payload\":\"Windows\"}]}}"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Mobile Enquiry",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-42pdcbfsli",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "Mobile Enquiry",
                          "entityRequest": true,
                          "entityName": "Entity_OS",
                          "newEntityDisplayName": "",
                          "newEntityType": "list_of_values",
                          "newEntityName": "Entity_OS",
                          "componentType": "entity",
                          "applyDefaultTemplate": true,
                          "isPrompt": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:39:09.000Z",
                      "timestampValue": 1707316749250,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "USER"
                  },
                  {
                      "_id": "ms-a9e17cf8-0977-5237-980d-83591566efa8",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-77fca103-eba6-54bf-ab5d-676c4f4c4e32",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:39:14.273Z",
                      "lmodifiedOn": "2024-02-07T14:39:14.273Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-83ebf7ad-28a1-5bcd-92b4-9a61ef8a8acc",
                              "cT": "text",
                              "data": {
                                  "text": ""
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Mobile Enquiry",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-42pdcbfsli",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "iOS",
                          "isPrompt": false,
                          "entityResponse": true,
                          "entityName": "Preparequery",
                          "entityValue": "iOS",
                          "skipMessageDelivery": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:39:14.000Z",
                      "timestampValue": 1707316754275,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "AGENT"
                  },
                  {
                      "_id": "ms-ceb03155-e85b-5d4d-a8ca-fe564a24cfde",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-77fca103-eba6-54bf-ab5d-676c4f4c4e32",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:39:15.974Z",
                      "lmodifiedOn": "2024-02-07T14:39:15.974Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-790556b8-fc9f-5909-87a9-7477dee1c122",
                              "cT": "text",
                              "data": {
                                  "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"button\",\"text\":\"Which iPhone model are you interested in?\",\"buttons\":[{\"type\":\"postback\",\"title\":\"X\",\"payload\":\"X\"}]}}"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Mobile Enquiry",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-42pdcbfsli",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "",
                          "entityRequest": true,
                          "entityName": "Entity_version",
                          "newEntityDisplayName": "",
                          "newEntityType": "list_of_values",
                          "newEntityName": "Entity_version",
                          "componentType": "entity",
                          "applyDefaultTemplate": true,
                          "isPrompt": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:39:15.000Z",
                      "timestampValue": 1707316755975,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "USER"
                  },
                  {
                      "_id": "ms-78378312-08f6-5e6f-93b4-55b0c226cf74",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-a692c91c-03de-5667-ba33-228bad9d1283",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:39:18.971Z",
                      "lmodifiedOn": "2024-02-07T14:39:18.971Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-212f7584-158c-55cd-b93c-05c6bd33be8b",
                              "cT": "text",
                              "data": {
                                  "text": "What color iPhone X would you prefer?"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Mobile Enquiry",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-42pdcbfsli",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "X",
                          "entityRequest": true,
                          "entityName": "setvalues",
                          "newEntityDisplayName": "",
                          "newEntityType": "color",
                          "newEntityName": "Entity_color",
                          "componentType": "entity",
                          "applyDefaultTemplate": false,
                          "isPrompt": true,
                          "entityResponse": true,
                          "entityValue": "X"
                      },
                      "__lModifiedOn__": "2024-02-07T14:39:18.000Z",
                      "timestampValue": 1707316758972,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "AGENT"
                  }
              ],
              "hasMore": false
          },
          "userBotMessages": {
            "result": [
                  {
                      "_id": "ms-5f2c179d-f342-5b5a-9d53-65f5a8499cc2",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-3dc3b50f-bf3d-57e3-8034-b9192a36517d",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:30:28.465Z",
                      "lmodifiedOn": "2024-02-07T14:30:28.465Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-369dcd3c-df85-52f5-9fbc-0cda5ef1982f",
                              "cT": "text",
                              "data": {
                                  "text": "{\"type\":\"template\",\"payload\":{\"template_type\":\"button\",\"text\":\"Please choose the account type\",\"buttons\":[{\"type\":\"postback\",\"title\":\"Salary\",\"payload\":\"Salary\"},{\"type\":\"postback\",\"title\":\"Saving\",\"payload\":\"Saving\"},{\"type\":\"postback\",\"title\":\"Checking\",\"payload\":\"Checking\"}]}}"
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "tN": "Show Balance",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "positionId": "dg-o2cw0v7k4v",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "Show Balance",
                          "entityRequest": true,
                          "entityName": "AccountType",
                          "newEntityDisplayName": "AccountType",
                          "newEntityType": "list_of_values",
                          "newEntityName": "AccountType",
                          "componentType": "entity",
                          "applyDefaultTemplate": true,
                          "isPrompt": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:30:28.000Z",
                      "timestampValue": 1707316228466,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "BOT"
                  },
                  {
                      "_id": "ms-2c25852c-b026-52f3-8a6d-8483fa7b7928",
                      "channels": [
                          {
                              "app_token": "865cfb5d100ba7e22aa1c596de96415e9faebbe61976794a40a280cf52929816",
                              "post_url": "http://localhost/api/v1/internal/aaresponse",
                              "to": "64dcb7e820c313e24b30918e/agentassist/p-4",
                              "from": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                              "type": "agentassist",
                              "isAsync": true,
                              "reqId": "cbr-8e6ddb62-6b53-5202-b541-fed6f0a421a7",
                              "isGroup": false,
                              "channelDispName": "AgentAssistV2",
                              "preferredChannelForResponse": "rtm"
                          }
                      ],
                      "type": "outgoing",
                      "status": "pending",
                      "createdOn": "2024-02-07T14:36:23.455Z",
                      "lmodifiedOn": "2024-02-07T14:36:23.455Z",
                      "createdBy": "u-4c3ef9be-91f8-5470-8ac0-b8c6e940a16f",
                      "components": [
                          {
                              "_id": "cp-eb4402fe-ad29-52c0-8503-cedf9d877dda",
                              "cT": "text",
                              "data": {
                                  "text": "Ok, I am discarding the task for now. We can start over whenever you are ready."
                              },
                              "thumbnails": []
                          }
                      ],
                      "botId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                      "orgId": "o-645ed0da-3b6c-5c03-981a-b17501145991",
                      "accountId": "64dcb7e820c313e24b30918e",
                      "isBB": 0,
                      "ms": 1,
                      "chnl": "agentassist",
                      "isD": 0,
                      "lang": "en",
                      "conversationId": "p-4",
                      "agentAssistDetails": {
                          "streamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "srcChannel": "",
                          "childBotStreamId": "st-b66119dd-5b2d-5598-868d-e342b7d8e7db",
                          "experience": "",
                          "userInput": "discard all",
                          "endReason": 2,
                          "endOfTask": true
                      },
                      "__lModifiedOn__": "2024-02-07T14:36:23.000Z",
                      "timestampValue": 1707316583457,
                      "__v": 0,
                      "sT": 1,
                      "sessionId": "65c394033ca7fd4bd1d4f788",
                      "resourceid": "messagestore",
                      "msgType": "USER"
                  },
      ],
              "hasMore": false
          },
          "summary": {
              "status": 400,
              "message": "Unable to fetch the summary. Please try after some time."
          }
      }
        this.historyResponse = data.result;
        this.userBotHostory = data.userBotMessages?.result;
        this.userAgentHistory = data.userAgentMessages?.result;
      }
    });
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
