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
  chatConfig = {
    "chatTitle": "Kore.ai Bot Chat",
    "container": "body",
    botOptions: this.botOptions,
    agentAssistUrl: "https://dev-smartassist.kore.ai",
    urls: ['smartassist.kore.ai', 'smartassist-jp.kore.ai', 'smartassist.korebots.com', 'smartassist-de.kore.ai'],
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
    window['AgentChatInitializes'] = this.AgentChatInitialize;
  }

  getResponseUsingTemplate(res) {
    let _msgsResponse = {
      "type": "bot_response",
      "from": "bot",
      "message": [

      ],
      "messageId": res?.id + "-" + (new Date()).getTime(),
      "botInfo": {
        "chatBot": 'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d',
        "taskBotId": 'st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d'
      },
      "createdOn": "2022-03-21T07:56:18.225Z",
      "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
      "traceId": "873209019a5adc26",
      parsePayLoad: null
    }
    res?.buttons?.forEach((elem) => {
      let parsedPayload;
      if(elem.value){
        elem.value = elem.value.replace(/(^(&quot\;)|(&quot\;)$)/g, '');
      }
      let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");
      console.log(payloadType, "payload type", elem.value);


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
      _msgsResponse.parsePayLoad = parsedPayload;
      console.log(parsedPayload, "parsed payload inside template render");

    });
    if (res.srcChannel === 'msteams') {
      return _msgsResponse;
    } else if (res.srcChannel !== 'msteams' || res.srcChannel === '') {
      if (res.componentType === 'dialogAct') {
        let arr = [];
        if (res.buttons[0].value.includes('text')) {
          let str = res.buttons[0].value.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          arr = str1.text.split('\n');
        } else {
          arr = res.buttons[0].value.split('\n');
        }
        _msgsResponse.message[0] = {
          "type": "text",
          "component": {
            "type": "template",
            "payload": {
              "template_type": "button",
              "text": `${arr[0]}`,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes",
                  "payload": 'Yes'
                },
                {
                  "type": "postback",
                  "title": "No",
                  "payload": "No"
                }
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
                  {
                    "type": "postback",
                    "title": "Yes",
                    "payload": 'Yes'
                  },
                  {
                    "type": "postback",
                    "title": "No",
                    "payload": "No"
                  }
                ]
              }
            }
          }
        }
        _msgsResponse.parsePayLoad = {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": `${arr[0]}`,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes",
                "payload": "Yes"
              },
              {
                "type": "postback",
                "title": "No",
                "payload": "No"
              }
            ]
          }
        }

      } else if (res.entityType === "list_of_values") {
        let arr = [];
        if (res.buttons[0].value.includes('text')) {
          let str = res.buttons[0].value.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          arr = str1.text.split('\n');
        } else {
          arr = res.buttons[0].value.split('\n');
        }

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
        _msgsResponse.parsePayLoad = {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": `${arr[0]}`,
            "buttons": list
          }
        }


      }
      return _msgsResponse;
    }


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
