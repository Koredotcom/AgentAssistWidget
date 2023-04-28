import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-convs-history-logs',
  templateUrl: './convs-history-logs.component.html',
  styleUrls: ['./convs-history-logs.component.scss']
})
export class ConvsHistoryLogsComponent implements OnInit {

  @Output() onClose = new EventEmitter();
  @Input() conversationId;
  dropDownOptions = [
    {name: 'All suggestions', description:'All suggestions made by AgentAssist will be shown'},
    {name: 'Selected suggestions', description:'AgentAssist suggestions used by the agent will be shown'},
    {name: 'Hide suggestions', description:'AgentAssist suggestions used by the agent will be shown'}
  ]
  selectedElement = this.dropDownOptions[2].name;
  chatHistData = {
    "data": [
      {
        "author": {
          "id": "",
          "type": "agent",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "How are you, welcome!",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }, {
        "author": {
          "id": "",
          "type": "user",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "hello, How to reset password?.",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }, {
        "author": {
          "id": "",
          "type": "agent",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "You need to login first.",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      },
      {
        "author": {
          "id": "",
          "type": "user",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "I have already logged in.",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      },
      {
        "author": {
          "id": "",
          "type": "agent",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "open profile and go to settings -> change password",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }, {
        "author": {
          "id": "",
          "type": "user",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "okay",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }, {
        "author": {
          "id": "",
          "type": "agent",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "Is it resolved? how may i help you",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      },
      {
        "author": {
          "id": "",
          "type": "user",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "No it is not resolved",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      },
      {
        "author": {
          "id": "",
          "type": "agent",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "Can you please let me know what is the issue you are facing?",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }, {
        "author": {
          "id": "",
          "type": "user",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "Wait.",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }, {
        "author": {
          "id": "",
          "type": "agent",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "Sure",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      },
      {
        "author": {
          "id": "",
          "type": "user",
          "firstName": "",
          "lastName": "",
          "profImage": ""
        },
        "botId": "",
        "sessionId": "",
        "conversationId": "",
        "timestamp": "2023-04-28T06:03:37.000Z",
        "message": "It is saying 'you are not allowed to do this'",
        "isTemplate": false,
        "isAttachement": false,
        "attachmentDetails": [{
          "fileName": "",
          "fileUrl": "",
          "fileType": ""
        }],
        "templatePayload": [],
        "sentType": ""
      }
    ],
    "channel": "chat",
    "startedOn": 1670419522574,
    "endedOn": 1670419674594,
    "conversationId": "c-639094425f9bd6639428b7c5",
    "duration": 152020
  };
  constructor(private service: ServiceInvokerService) { }

  ngOnInit(): void {
    // this.getclickedConversationHistory()
  }

  close() {
    this.onClose.emit();
  }

  getclickedConversationHistory(){
    let params = {
      botId:'dsfdf',
      convId: this.conversationId
    }
    this.service.invoke('conversation.history',params).subscribe(res=>{
      console.log('xxxxxxxxxxxxxx', res);
      this.chatHistData = res;
    })
  }

  selectedDropDown(data){
    this.selectedElement = data.name;
  }
}
