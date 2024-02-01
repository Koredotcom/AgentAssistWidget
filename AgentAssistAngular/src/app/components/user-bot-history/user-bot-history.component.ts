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
      }
    });
    this.subs.sink = this.rootService.userBotHistory$.subscribe((data : any) => {
        if(data && data.messages?.length > 0){
          this.historyResponse = data.messages;
          this.formatHistoryResponse();
        }
    })
  }

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
    // if(result.parsedPayload && ((data?.componentType === 'dialogAct' && (data?.srcChannel == 'msteams' || data?.srcChannel == 'rtm')) || (data?.componentType != 'dialogAct'))){
    //   return true;
    // }
    if(result.parsedPayload){
      return true;
    }
    return false;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  minMaxButtonClick(){
    console.log("min max button click");
    this.maxMinButtonClick.emit(true);
  }
}
