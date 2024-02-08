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


  getTranscriptHistory(params){
//     let data : any = {
//       "result": [
//           {
//               "templateData": [],
//               "attachments": [
//                   {
//                       "_id": "123",
//                       "from": "salesforce"
//                   },
//                   {
//                       "_id": "1234",
//                       "from": "confluence"
//                   }
//               ],
//               "templatePayload": [
//                   {
//                       "abc": "def"
//                   }
//               ],
//               "conversationId": "c-4",
//               "sessionId": "",
//               "botId": "st-90",
//               "author": {
//                   "_id": "u-65",
//                   "firstName": "rajiv",
//                   "lastName": "kumar"
//               },
//               "from": "Agent",
//               "message": "testing latest change insert",
//               "experience": "chat",
//               "timestamp": "2023-04-28T07:15:14.303Z",
//               "isTemplate": true,
//               "isAttachment": true,
//               "type": "send",
//               "timestampValue": 1682670456005,
//               "createdAt": "2023-04-28T08:27:36.006Z",
//               "updatedAt": "2023-04-28T08:27:36.006Z",
//               "id": "644b8378d88b0099563a87bb"
//           },
//           {
//             "templateData": [],
//             "attachments": [
//                 {
//                     "_id": "123",
//                     "from": "salesforce"
//                 },
//                 {
//                     "_id": "1234",
//                     "from": "confluence"
//                 }
//             ],
//             "templatePayload": [
//                 {
//                     "abc": "def"
//                 }
//             ],
//             "conversationId": "c-4",
//             "sessionId": "",
//             "botId": "st-90",
//             "author": {
//                 "_id": "u-65",
//                 "firstName": "rajiv",
//                 "lastName": "kumar"
//             },
//             "from": "User",
//             "message": "testing latest change insert",
//             "experience": "chat",
//             "timestamp": "2023-04-28T07:15:14.303Z",
//             "isTemplate": true,
//             "isAttachment": true,
//             "type": "send",
//             "timestampValue": 1682670456005,
//             "createdAt": "2023-04-28T08:27:36.006Z",
//             "updatedAt": "2023-04-28T08:27:36.006Z",
//             "id": "644b8378d88b0099563a87bb"
//         },
//         {
//           "templateData": [],
//           "attachments": [
//               {
//                   "_id": "123",
//                   "from": "salesforce"
//               },
//               {
//                   "_id": "1234",
//                   "from": "confluence"
//               }
//           ],
//           "templatePayload": [
//               {
//                   "abc": "def"
//               }
//           ],
//           "conversationId": "c-4",
//           "sessionId": "",
//           "botId": "st-90",
//           "author": {
//               "_id": "u-65",
//               "firstName": "rajiv",
//               "lastName": "kumar"
//           },
//           "from": "User",
//           "message": "testing latest change insert",
//           "experience": "chat",
//           "timestamp": "2023-04-28T07:15:14.303Z",
//           "isTemplate": true,
//           "isAttachment": true,
//           "type": "send",
//           "timestampValue": 1682670456005,
//           "createdAt": "2023-04-28T08:27:36.006Z",
//           "updatedAt": "2023-04-28T08:27:36.006Z",
//           "id": "644b8378d88b0099563a87bb"
//       },
//       {
//               "templateData": [],
//               "attachments": [
//                   {
//                       "_id": "123",
//                       "from": "salesforce"
//                   },
//                   {
//                       "_id": "1234",
//                       "from": "confluence"
//                   }
//               ],
//               "templatePayload": [
//                   {
//                       "abc": "def"
//                   }
//               ],
//               "conversationId": "c-4",
//               "sessionId": "",
//               "botId": "st-90",
//               "author": {
//                   "_id": "u-65",
//                   "firstName": "rajiv",
//                   "lastName": "kumar"
//               },
//               "from": "User",
//               "message": "testing latest change insert",
//               "experience": "chat",
//               "timestamp": "2023-04-28T07:15:14.303Z",
//               "isTemplate": true,
//               "isAttachment": true,
//               "type": "send",
//               "timestampValue": 1682670456005,
//               "createdAt": "2023-04-28T08:27:36.006Z",
//               "updatedAt": "2023-04-28T08:27:36.006Z",
//               "id": "644b8378d88b0099563a87bb"
//           },
//           {
//               "templateData": [],
//               "attachments": [
//                   {
//                       "_id": "123",
//                       "from": "salesforce"
//                   },
//                   {
//                       "_id": "1234",
//                       "from": "confluence"
//                   }
//               ],
//               "templatePayload": [
//                   {
//                       "abc": "def"
//                   }
//               ],
//               "conversationId": "c-4",
//               "sessionId": "",
//               "botId": "st-90",
//               "author": {
//                   "_id": "u-65",
//                   "firstName": "rajiv",
//                   "lastName": "kumar"
//               },
//               "from": "User",
//               "message": "testing latest change insert",
//               "experience": "chat",
//               "timestamp": "2023-04-28T07:15:14.303Z",
//               "isTemplate": true,
//               "isAttachment": true,
//               "type": "send",
//               "timestampValue": 1682670456005,
//               "createdAt": "2023-04-28T08:27:36.006Z",
//               "updatedAt": "2023-04-28T08:27:36.006Z",
//               "id": "644b8378d88b0099563a87bb"
//           },
//           {
//               "templateData": [],
//               "attachments": [
//                   {
//                       "_id": "123",
//                       "from": "salesforce"
//                   },
//                   {
//                       "_id": "1234",
//                       "from": "confluence"
//                   }
//               ],
//               "templatePayload": [
//                   {
//                       "abc": "def"
//                   }
//               ],
//               "conversationId": "c-4",
//               "sessionId": "",
//               "botId": "st-90",
//               "author": {
//                   "_id": "u-65",
//                   "firstName": "rajiv",
//                   "lastName": "kumar"
//               },
//               "from": "User",
//               "message": "testing latest change insert",
//               "experience": "chat",
//               "timestamp": "2023-04-28T07:15:14.303Z",
//               "isTemplate": true,
//               "isAttachment": true,
//               "type": "send",
//               "timestampValue": 1682670456005,
//               "createdAt": "2023-04-28T08:27:36.006Z",
//               "updatedAt": "2023-04-28T08:27:36.006Z",
//               "id": "644b8378d88b0099563a87bb"
//           }
//       ],
//       "hasMore": true
//    }
    this.serviceInvoker.invoke('get.transcriptHistory', { convId: params.conversationId }, {}, { transcriptHistory: 'true', botId : params.botId }, params.agentassisturl).subscribe((data)=> {
      if(data && data?.result?.length > 0) {
        this.historyResponse = data.result;
      }
    });
  }

//   scrollToBottom() {
//     try {
//       this.transcriptScrollContainer.nativeElement.scrollTop = this.transcriptScrollContainer.nativeElement.scrollHeight;
//     } catch (err) { }
//   }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
