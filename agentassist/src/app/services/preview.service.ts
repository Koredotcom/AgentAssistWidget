import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PreviewService {

  userInfo$ = new BehaviorSubject(null);
  constructor(private http: HttpClient) { }

  formatMessages(messages: any[] = []): any[] {
    const formatMessages = [];

    messages.forEach(message => {
      let formattedMsg;
      if (message.type === 'userMsg') {
        formattedMsg = this.getFormattedUserMsg(message);

      } else if (message.type === 'botMsg') {
        formattedMsg = this.getFormattedBotMsg(message);
      } else {
        // ignore anyother notes, except user or bot messages
        return;
      }
      formatMessages.push(formattedMsg);
    });
    return formatMessages;
  }

  getFormattedUserMsg(message) {
    let formattedMsg: any;
    // tslint:disable-next-line: max-line-length
    if ( message.msg.type === 'link' || message.msg.type === 'video' || message.msg.type === 'audio' || message.msg.type === 'image' || message.msg.type === 'attachment') {
       formattedMsg = {
        type: 'currentUser',
        message: [
          {
            type: message.msg.type,
            component: {
              type: message.msg.type,
              payload: message.msg.payload.file.payload
            },
            cInfo: {
              body: message.msg.payload.file.payload
            },
            clientMessageId: message.messageId.replace(/@/g, '_'),
            comments: message.comments && message.comments.length ? message.comments.length : ''
          }
        ],
        messageId: message.messageId.replace(/@:/g, '-')
      };
    } else {
      formattedMsg = {
        type: 'currentUser',
        message: [{
          type: message.msg.type,
          cInfo: { body: message.msg.payload.text },
          clientMessageId: message.messageId.replace(/@/g, '_'),
          comments: message.comments && message.comments.length ? message.comments.length : ''
        }],
      };
    }
    return formattedMsg;
  }

  getFormattedBotMsg(message: any) {
    let formattedMsg;
    // tslint:disable-next-line: max-line-length
    if ( message.msg.type === 'link' || message.msg.type === 'video' || message.msg.type === 'audio' || message.msg.type === 'image' || message.msg.type === 'attachment') {
      formattedMsg = {
        type: 'bot_response',
        from: 'bot',
        message: [
          {
            type: message.msg.type,
            component: {
              type: message.msg.type,
              payload: message.msg.payload.file.payload
            },
            cInfo: {
              body: message.msg.payload.file.payload
            },
            comments: message.comments && message.comments.length ? message.comments.length : ''
          }
        ],
        messageId: message.messageId.replace(/@:/g, '-')
      };
    } else if (message.msg.type === 'template') {
      formattedMsg = {
        type: 'bot_response',
        from: 'bot',
        message: [
          {
            type: message.msg.type,
            component: {
              payload: message.msg.payload.template.payload
            },
            cInfo: {},
            comments: message.comments && message.comments.length ? message.comments.length : ''
          }
        ],
        messageId: message.messageId.replace(/@/g, '_')
      };
    }  else { // Text type message
      formattedMsg = {
        type: 'bot_response',
        from: 'bot',
        message: [
          {
            type: message.msg.type,
            component: {
              type: message.msg.type,
              payload: {
                text: message.msg.payload.text,
              }
            },
            cInfo: {
              body: message.msg.payload.text
            },
            comments: message.comments && message.comments.length ? message.comments.length : ''
          }
        ],
        messageId: message.messageId.replace(/@:/g, '-')
      };
    }

    return formattedMsg;
  }

  convertToArray(obj: any): any[] {
    const messages = [];
    const components = obj.components;
    Object.keys(components).forEach(msgkey => {
      const msg = components[msgkey];
      msg.messageId = msgkey;
      messages.push(msg);
    });
    return messages;
  }

  getPartialFlow(messages = [], messageId: string): any[] {
    const flow = [];
    const msgObj = messages.find(f => f.messageId === messageId);
    flow.push(msgObj);

    if (msgObj.childs && msgObj.childs.length === 1) {
      flow.push(...this.getPartialFlow(messages, msgObj.childs[0]));
    }
    return flow;
  }

  getChildMatch(messages = [], parentId: string, childId: string) {
    const parentMsg = messages.find(f => f.messageId === parentId);
    for (const msgId of parentMsg.childs) {
      const childMsg = messages.find(f => f.messageId === msgId);
      if (childId === childMsg.msg.payload.buttonValue) {
        return childMsg.messageId;
      }
    }
  }

}
