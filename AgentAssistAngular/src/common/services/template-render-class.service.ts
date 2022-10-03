import { Injectable } from '@angular/core';
declare const $: any;
declare const agentAssistChat: any;
declare const agentAssistCustomTemplate: any;

@Injectable({
  providedIn: 'root'
})
export class TemplateRenderClassService {
  botOptions = {};
  AgentChatInitialize;
  chatConfig={
      "chatTitle": "Kore.ai Bot Chat",
      "container": "body",
      botOptions: this.botOptions,
      agentAssistUrl : "https://dev-smartassist.kore.ai",
      agentAssist: true,
      
  };
  constructor() {
    this.botOptions['botInfo'] = { name: "sample Bot", "_id": 'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d' }; // bot name is case sensitive
    this.botOptions['clientId'] = "";
    this.botOptions['clientSecret'] = "";
    this.chatConfig.botOptions = this.botOptions;
    var agentAssistv2 = agentAssistChat();
    this.AgentChatInitialize = new agentAssistv2.chatWindow(this.chatConfig);
    this.AgentChatInitialize.customTemplateObj = new agentAssistCustomTemplate(this.chatConfig, this.AgentChatInitialize);
   }

   getResponseUsingTemplate(res) {
    let _msgsResponse = {
      "type": "bot_response",
      "from": "bot",
      "message": [

      ],
      "messageId": res?.id + "-" + (new Date()).getTime(),
      "botInfo": {
        "chatBot":  'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d',
        "taskBotId": 'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d'
      }
    }
    res?.buttons?.forEach((elem) => {
      let parsedPayload;
      let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");

      if (payloadType.indexOf('text') !== -1|| payloadType.indexOf('payload')!==-1) {
        let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
        parsedPayload = JSON.parse(withoutSpecials);
      }

      let body = {};
      body['type'] = elem.type;
      if (!parsedPayload) {
        body['component'] = {
          "type": elem.type,
          "payload": {
            "type": elem.type,
            "text": elem.value
          }
        };
        body['cInfo'] = {
          "body": elem.value
        };
        elem['copyFlag'] = true;
        
      } else {
        body['component'] = parsedPayload.payload? parsedPayload: parsedPayload.text;
        if(parsedPayload?.type === 'message'){
          body['cInfo'] = {
            "body": ''
          };
          elem['copyFlag'] = false;
        }else if(parsedPayload?.text) {
          body['cInfo'] = {
            "body": parsedPayload.text
          };
          elem['copyFlag'] = true;
        } else {
          body['cInfo'] = {
            "body": parsedPayload
          };
          elem['copyFlag'] = false;
        }
       
      }
      _msgsResponse.message[0] = body;  
    })
    return _msgsResponse;

   }
   

}
