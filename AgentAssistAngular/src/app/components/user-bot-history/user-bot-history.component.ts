import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { TemplateRenderClassService } from 'src/app/services/template-render-class.service';
import { SubSink } from 'subsink';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-bot-history',
  templateUrl: './user-bot-history.component.html',
  styleUrls: ['./user-bot-history.component.scss']
})
export class UserBotHistoryComponent implements OnInit, OnDestroy{

  @Input() maxButton;
  @Output() maxMinButtonClick = new EventEmitter();

  subs = new SubSink();
  connectionDetails : any;
  historyResponse : any = [];
  projConstants : any = ProjConstants;
  parsedCustomData: any;
  widgetLoader = true;
  userBotHostory = [];
  userAgentHistory = [];
  summary:any = {};


  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private templateRenderClassService : TemplateRenderClassService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getUserBotHistory(this.connectionDetails);
        this.parsedCustomData = Object.assign({},this.connectionDetails.customData);
      }
    });
    // this.subs.sink = this.rootService.userBotHistory$.subscribe((data : any) => {
    //     if(data && data.messages?.length > 0){
    //       this.historyResponse = data.messages;
    //       this.formatHistoryResponse();
    //     }
    // })
  }

  getUserBotHistory(params){
    this.widgetLoader = true;
    this.serviceInvoker.invoke('get.transcriptHistory', { convId: params.conversationId, botId : params.botId, isSummaryRequired: true, sessionId: '6630c0b0f06f208bacd70551' || this.rootService.userBotConversationDetails?.sessionId || '', experience:  this.rootService.connectionDetails?.channel}, {}, { botId : params.botId }, params.agentassisturl)
    .pipe(
      finalize(()=>{
        this.widgetLoader = false;
      })
    )
    .subscribe((data)=> {
      if(data) {
        this.historyResponse = data.result;
        this.userBotHostory = data.userBotMessages?.result /* [] */;
        this.userAgentHistory = data.userAgentMessages?.result /* [] */;
        this.summary = {...data.summary};

        (this.userBotHostory || [])
        .forEach((item)=>{
            if(typeof(item?.components[0]?.data?.text) === 'string'){
                try{
                    let a = JSON.parse(item?.components[0]?.data?.text);
                    if(typeof a === 'object' && a?.payload?.text){
                        item.components[0].data.text = a?.payload?.text;
                    }
                }catch(e){
                    
                }
            }
        });

        (this.userAgentHistory || [])
        .forEach((item)=>{
            if(typeof(item?.components[0]?.data?.text) === 'string'){
                try{
                    let a = JSON.parse(item?.components[0]?.data?.text);
                    if(typeof a === 'object' && a?.payload?.text){
                        item.components[0].data.text = a?.payload?.text;
                    }
                }catch(e){
                }
            }
        });
        
        this.summary.message = this.extractConversationSummary(data.summary.message || '');
        if((this.userBotHostory || [])?.length || (this.userAgentHistory || [])?.length){
            // this.checkOldData.emit(true);
        }
      }
    });
  }

  extractConversationSummary(inputString=''){
    const conversationSummaryRegex = /Conversation Summary: (.+?)(?=\n\n|\n?$)/s;
    const match = inputString.match(conversationSummaryRegex);
    return match ? match[1].trim() : inputString;
  };

  formatHistoryResponse(){
    this.historyResponse.forEach((element, index, theArray) => {
      theArray[index] = this.rootService.formatUserBotHistoryResponse(element);
      let hisRes = theArray[index];
      // hisRes = this.rootService.confirmationNodeRenderForHistoryDataTransform(hisRes);
      let result : any = this.templateRenderClassService.getResponseUsingTemplate(hisRes, true);
      hisRes.isTemplateRender = this.templateRenderCheck(hisRes,result);
      hisRes.template = this.rootService.getTemplateHtml(hisRes.isTemplateRender, result);
    });
  }

  renderHTMLPrompt(value) {
    let temp_hisRes = value
        if(temp_hisRes.includes('<vxml') && temp_hisRes.includes('</vxml>')) {
          return null;
        } else {
          temp_hisRes = this.rootService.handleEmptyLine(temp_hisRes, true);
          return temp_hisRes;
        }

  }

  templateRenderCheck(data,result){
    if(result.parsedPayload){
      return true;
    }
    return false;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  minMaxButtonClick(){
    this.maxMinButtonClick.emit(true);
  }
}
