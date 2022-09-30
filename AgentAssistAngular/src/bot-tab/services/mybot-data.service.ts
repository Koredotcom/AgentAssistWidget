import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MybotDataService {

  constructor() { }

  getMybotMsgResponse(myBotuuids, botId) {
    return {
      "type": "bot_response",
      "from": "bot",
      "message": [],
      "messageId": myBotuuids,
      "botInfo": {
        "chatBot": "sample Bot",
        "taskBotId": botId
      },
      "createdOn": "2022-03-21T07:56:18.225Z",
      "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
      "traceId": "873209019a5adc26"
    }
  }
  prepareMybotMsgBody(elem){
    let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");
    let parsedPayload : any;
      try {
          if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
              let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
              parsedPayload = JSON.parse(withoutSpecials);
          }
      }catch(error){
          if(payloadType.text){
              let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
              parsedPayload = withoutSpecials;
          }
      }

      let body : any = {};
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

      } else {
          body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
          if (parsedPayload?.type === 'message') {
              body['cInfo'] = {
                  "body": ''
              };
          } else if (parsedPayload?.text) {
              body['cInfo'] = {
                  "body": parsedPayload.text
              };
          } else {
              body['cInfo'] = {
                  "body": parsedPayload
              };
          }
      }
      return body;
  }
}
