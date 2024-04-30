import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { TemplateRenderClassService } from 'src/app/services/template-render-class.service';
import { SubSink } from 'subsink';

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
  summary: any = {};
  parsedCustomData: any;


  constructor(private rootService : RootService, private serviceInvoker : ServiceInvokerService,
    private templateRenderClassService : TemplateRenderClassService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
    this.getUserBotHistoryObj();
  }

  getUserBotHistoryObj() {
    if(this.rootService.userBotHistoryData?.userBotMessages?.result?.length > 0) {
      this.historyResponse = this.rootService.userBotHistoryData?.userBotMessages?.result;
      this.summary = this.rootService?.userBotHistoryData?.summary;
    this.formatHistoryResponse();
    }
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){        
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.parsedCustomData = Object.assign({},this.connectionDetails.customData);
      }
    });
    this.subs.sink = this.rootService.userBotHistory$.subscribe((data : any) => {      
        if(data && data.userBotMessages && data.userBotMessages.result && data.userBotMessages.result.length > 0){
          this.historyResponse = data.userBotMessages.result;
          this.formatHistoryResponse();
        }
    })
  }

  formatHistoryResponse(){

    (this.historyResponse || [])
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
    this.summary.message = this.extractConversationSummary(this.summary.message || '');
  }

  extractConversationSummary(inputString=''){
    const conversationSummaryRegex = /Conversation Summary: (.+?)(?=\n\n|\n?$)/s;
    const match = inputString.match(conversationSummaryRegex);
    return match ? match[1].trim() : inputString;
  };

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
