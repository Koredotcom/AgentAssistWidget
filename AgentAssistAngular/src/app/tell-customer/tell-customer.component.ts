import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProjConstants, RenderResponseType } from '../proj.const';
import { CommonService } from '../services/common.service';
import { RootService } from '../services/root.service';

@Component({
  selector: 'app-tell-customer',
  templateUrl: './tell-customer.component.html',
  styleUrls: ['./tell-customer.component.scss']
})
export class TellCustomerComponent {
  @Input() automation : any;
  @Input() isWelcomeMsg;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;

  projConstants : any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  @ViewChild('textRef', { static: false }) private textRef: ElementRef;

  constructor(public rootService : RootService, private commonService : CommonService){
    
  }

  ngOnInit() {
    this.hideSendAndCopy();
  }

  hideSendAndCopy(){
    // Both send and copy
    this.automation.hideActionButtons = ((this.automation?.connectionDetails?.isCallConversation) ||
       (this.automation?.templateRender && this.automation?.template && this.automation.connectionDetails?.source != this.projConstants.SMARTASSIST_SOURCE)) ? true : false;

    // only copy button
    if((this.rootService.settingsData?.isAgentResponseCopyEnabled === false) || (this.automation?.templateRender && this.automation?.template && this.automation?.connectionDetails?.source == this.projConstants.SMARTASSIST_SOURCE)){
      this.automation.hideCopyButton = true; 
    }

    if(this.rootService.settingsData?.isAgentResponseEnabled === false){
      this.automation.hideSendButton = true;
    }

    if(this.automation.hideSendButton && this.automation.hideCopyButton){
      this.automation.hideActionButtons = true;
    }

    if(this.isWelcomeMsg){
      this.automation?.buttons?.forEach(element => {
        element.hideActionButtons = this.automation.hideActionButtons;
        element.hideSendButton = this.automation.hideSendButton;
      });
    }
    
  }

  handleSendCopyButton(method,automation){
    automation.send = true;
    let sendData = this.isWelcomeMsg ? automation.value : automation.sendData;
    if(!automation.templateRender){
      sendData = (method == ProjConstants.COPY) ? this.textRef.nativeElement.innerText : this.rootService.handleEmptyLine(sendData, true);
    }
    this.commonService.handleSendCopyButtonForNodes(method,sendData, this.automation?.dialogId);
    this.responseArray = this.commonService.grayOutPreviousAutomation(this.responseArray, this.automationIndex, this.responseArrayIndex);
    this.responseArray = structuredClone(this.responseArray);
    if(this.isWelcomeMsg){
      this.automation.buttons = this.automation.buttons.filter(element => element.value == automation.value);
      
    }
  }

}
