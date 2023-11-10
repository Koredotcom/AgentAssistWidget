import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateRenderClassService {

  constructor() { }

  formatMsgResponseForConfirmationNode(actualStringFromBE, _msgsResponse){

    let lastIndex = actualStringFromBE.lastIndexOf('\n');
    let mainText = actualStringFromBE.substring(0, lastIndex);
    let confirmationString = actualStringFromBE.substring(lastIndex+1);

    _msgsResponse.message[0] = {
      "type": "text",
      "component": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": `${mainText}`,
          "buttons": [

          ]
        }
      },
      "cInfo": {
        "body": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": `${mainText}`,
            "buttons": [

            ]
          }
        }
      }
    }
    _msgsResponse.parsedPayload = {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": `${mainText}`,
        "buttons": [

        ]
      }
    }

    let list = [];
    if(confirmationString){
      let confirmationArray = confirmationString.split(',');
      confirmationArray.forEach((ele, i) => {
        if (ele && i !== confirmationArray.length - 1 && !(/^ *$/.test(ele))) {
          let obj = {
            "type": "postback",
            "title": ele,
            "payload": ele
          }
          list.push(obj)
        }
      })
    }
    _msgsResponse.message[0].component.payload.buttons = list;
    _msgsResponse.message[0].cInfo.body.payload.buttons = list;
    _msgsResponse.parsedPayload.payload.buttons = list;
    return _msgsResponse;
  }

  formatMsgResponseForEnumeratedList(arr, _msgsResponse){
    _msgsResponse.message[0] = {
      "type": "text",
      "component": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": `${arr[0]}`,
          "buttons": [
          ]
        }
      },
      "cInfo": {
        "body": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": `${arr[0]}`,
            "buttons": [

            ]
          }
        }
      }
    }

    let list = [];
    arr.forEach((ele, i) => {
      if (i !== 0 && i !== arr.length - 1 && ele !== '') {
        let data = ele.substring(3, ele.length);
        let obj = {
          "type": "postback",
          "title": data,
          "payload": data
        }
        list.push(obj)
      }

    })
    _msgsResponse.message[0].component.payload.buttons = list;
    _msgsResponse.message[0].cInfo.body.payload.buttons = list;
    _msgsResponse.parsedPayload = {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": `${arr[0]}`,
        "buttons": list
      }
    }
    return _msgsResponse;
  }

  getResponseUsingTemplate(res,configObj) {
    let _msgsResponse = {
      "type": "bot_response",
      "from": "bot",
      "message": [

      ],
      "messageId": res?.uniqueTaskId + "-" + (new Date()).getTime(),
      "botInfo": {
        "chatBot": 'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d',
        "taskBotId": 'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d'
      },
      "createdOn": "2022-03-21T07:56:18.225Z",
      "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
      "traceId": "873209019a5adc26",
      parsedPayload: null
    }
    res?.buttons?.forEach((elem) => {
      let parsedPayload;
      if(elem.value){
        elem.value = elem.value.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
      }
      let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");


      try {
        if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
          let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
          parsedPayload = JSON.parse(withoutSpecials);
        }
      } catch (error) {
        if (payloadType.text) {
          let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
          parsedPayload = withoutSpecials;
        }
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
        body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
        if (parsedPayload?.type === 'message') {
          body['cInfo'] = {
            "body": ''
          };
          elem['copyFlag'] = false;
        } else if (parsedPayload?.text) {
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
      _msgsResponse.parsedPayload = parsedPayload;

    });
    if (res.srcChannel && res.srcChannel !== 'msteams') {
      if (res.componentType === 'dialogAct') {
        let actualStringFromBE = '';
        if (res && res?.buttons && res?.buttons[0]?.value?.includes('text')) {
          let str = res.buttons[0].value.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          actualStringFromBE = str1.text;
          // arr = str1.text.split('\nYes, No');
        } else if(res && res?.buttons && res?.buttons[0]?.value){
          actualStringFromBE = res.buttons[0].value;
          // arr = res.buttons[0].value.split('\nYes, No');
        }
        _msgsResponse = this.formatMsgResponseForConfirmationNode(actualStringFromBE, _msgsResponse);

      } else if (res.entityType === "list_of_values" && !res.buttons[0].value.includes('payload')) {
        let arr = [];
        if (res.buttons[0]?.value?.includes('text')) {
          let str = res.buttons[0].value.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          arr = str1.text.split('\n');
        } else {
          arr = res.buttons[0].value.split('\n');
        }
        _msgsResponse = this.formatMsgResponseForEnumeratedList(arr, _msgsResponse);
      }
    }
    return _msgsResponse;
  }

  getResponseUsingTemplateForHistory(res){
    let _msgsResponse = {
      "type": "bot_response",
      "from": "bot",
      "message": [],
      "messageId": res._id,
      "botInfo": {
        "chatBot": "sample Bot",
        "taskBotId": res.botId
      },
      "createdOn": "2022-03-21T07:56:18.225Z",
      "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
      "traceId": "873209019a5adc26",
      "createdOnTimemillis": res._id,
      parsedPayload: null
    }
    res.components?.forEach((elem) => {
      if(elem.data?.text){
        let parsedPayload;
        if (elem.data?.text) {
          elem.data.text = elem.data?.text.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
        }
        let payloadType = (elem.data?.text)?.replace(/(&quot\;)/g, "\"");
  
        try {
          if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
            let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
            parsedPayload = JSON.parse(withoutSpecials);
          }
        } catch (error) {
          if (payloadType.text) {
            let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
            parsedPayload = withoutSpecials;
          }
        }
  
  
        let body = {};
        body['type'] = elem.cT;
        if (!parsedPayload) {
          body['component'] = {
            "type": elem.cT,
            "payload": {
              "type": elem.cT,
              "text": elem.data.text
            }
          };
          body['cInfo'] = {
            "body": elem.data.text
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
        if(body['cInfo']['body'] != "" && body['cInfo']['body']){
          _msgsResponse.message.push(body);
          _msgsResponse.parsedPayload = parsedPayload;
        }
      }
    });
    
    if(res?.srcChannel && res?.srcChannel !== 'msteams'){
      if (res?.componentType === 'dialogAct') {
        let actualStringFromBE = '';
        if (res.components[0].data.text.includes('text')) {
          let str = res.components[0].data.text.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          actualStringFromBE = str1.text;
        } else {
          actualStringFromBE = res.components[0].data.text;
        }
        _msgsResponse = this.formatMsgResponseForConfirmationNode(actualStringFromBE, _msgsResponse);

      } else if (res?.newEntityType === "list_of_values" && !res.components[0].data.text.includes('payload')) {
        let arr = [];
        if (res.components[0].data.text.includes('text')) {
          let str = res.components[0].data.text.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          arr = str1.text.split('\n');
        } else {
          arr = res.components[0].data.text.split('\n');
        }
        _msgsResponse = this.formatMsgResponseForEnumeratedList(arr, _msgsResponse);
      }
    }
    return _msgsResponse;
  }

  getMessageResponseForUserMessages(data, botId) {
    let _msgsResponse: any = {
      "type": "bot_response",
      "from": "bot",
      "message": [

      ],
      "messageId": data._id,
      "botInfo": {
        "chatBot": "sample Bot",
        "taskBotId": botId
      },
      "createdOn": "2022-03-21T07:56:18.225Z",
      "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
      "traceId": "873209019a5adc26"
    }
    let _id = Math.floor(Math.random() * 100);
    let body = {};
    body['type'] = 'text';
    body['component'] = {
      "type": 'text',
      "payload": {
        "type": 'text',
        "text": data.userInput
      }
    };
    body['cInfo'] = {
      "body": data.userInput
    };
    _msgsResponse.message.push(body);
    return _msgsResponse;

  }

}
