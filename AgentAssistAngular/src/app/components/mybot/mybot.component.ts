import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { forkJoin } from 'rxjs';
import { chatWindow } from '@koredev/kore-web-sdk';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MockDataService } from 'src/app/services/mockData.service';

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent implements AfterViewInit {

  @ViewChild('temp') d1: ElementRef;

  connectionDetails : any = {};
  templateArray: any = [];
  data: SafeHtml;
  

  constructor(
    private rootService : RootService, 
    private serviceInvoker : ServiceInvokerService, 
    private sanitizer: DomSanitizer, 
    private mockDataService : MockDataService){
  }

  ngAfterViewInit(): void {
    // v3 templates
    const chatWindowInstance = new chatWindow();
    chatWindowInstance.on('beforeWSSendMessage', event => {
      console.log('data: ', event);
    })
    chatWindowInstance.setBranding(); 
     this.mockDataService.getTemplateData().subscribe((res : any) => {
      for(let x of res.results) {
        let responseTemplate = this.getResponseUsingTemplate(x);
        const html = chatWindowInstance.generateMessageDOM(responseTemplate);
        this.templateArray.push(html);
        this.d1.nativeElement.appendChild(html)
      }
      
    })
  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getmybotData(this.connectionDetails);
      }
    })
  }

  getmybotData(params) {
    let feedback = this.mybotFeedback(params);
    let history = this.mybotHistory(params);
    forkJoin([feedback, history]).subscribe(res => {
      // console.log(res, "feedback");
    });
  }

  mybotHistory(params) {
    let serviceMethod = params.fromSAT ? 'get.mybotHistorySA' : 'get.mybotHistoryTP';
    let botId = this.rootService.isEmptyStr(params.autoBotId) ? params.autoBotId : params.botId;
    return this.serviceInvoker.invoke(serviceMethod, { botId: botId, convId: params.conversationId }, {}, { historyAPiCall: 'true', botId : botId }, params.agentassisturl)
  }

  mybotFeedback(params) {
    return this.serviceInvoker.invoke('get.mybotFeedback', { tab: 'mybot', botId: params.botId }, {}, {botId : params.botId }, params.agentassisturl);
  }

  getResponseUsingTemplate(res) {
    let _msgsResponse = {
      "type": "bot_response",
      "from": "bot",
      "message": [

      ],
      "messageId": 111 + "-" + (new Date()).getTime(),
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
      _msgsResponse.parsedPayload = parsedPayload;
      console.log(parsedPayload, "parsed payload inside template render");

    });
    if (res.srcChannel && res.srcChannel !== 'msteams') {
      if (res.componentType === 'dialogAct') {
        let actualStringFromBE = '';
        if (res.buttons[0].value.includes('text')) {
          let str = res.buttons[0].value.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          actualStringFromBE = str1.text;
          // arr = str1.text.split('\nYes, No');
        } else {
          actualStringFromBE = res.buttons[0].value;
          // arr = res.buttons[0].value.split('\nYes, No');
        }
        // _msgsResponse = this.formatMsgResponseForConfirmationNode(actualStringFromBE, _msgsResponse);

      } else if (res.entityType === "list_of_values" && !res.buttons[0].value.includes('payload')) {
        let arr = [];
        if (res.buttons[0].value.includes('text')) {
          let str = res.buttons[0].value.replace(/^\s+|\s+$/g, "");
          let str1 = JSON.parse(str);
          arr = str1.text.split('\n');
        } else {
          arr = res.buttons[0].value.split('\n');
        }
        // _msgsResponse = this.formatMsgResponseForEnumeratedList(arr, _msgsResponse);
      }
    }
    return _msgsResponse;
  }
}
