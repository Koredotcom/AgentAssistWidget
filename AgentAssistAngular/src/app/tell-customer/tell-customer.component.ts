import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ProjConstants, RenderResponseType } from '../proj.const';
import { CommonService } from '../services/common.service';
import { RootService } from '../services/root.service';
import { chatWindow } from '@koredev/kore-web-sdk';

@Component({
  selector: 'app-tell-customer',
  templateUrl: './tell-customer.component.html',
  styleUrls: ['./tell-customer.component.scss']
})
export class TellCustomerComponent implements AfterViewInit {
  @Input() automation : any;
  @Input() isWelcomeMsg;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;

  projConstants : any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  chatWindowInstance = new chatWindow();
  v_Template: any;

  constructor(public rootService : RootService, private commonService : CommonService){ 
  }

  ngOninit() {
  }

  ngAfterViewInit(): void {
    // v3 templates
    this.chatWindowInstance.on('beforeWSSendMessage', event => {
      console.log('data: ', event);
    })
    this.chatWindowInstance.setBranding();   
  }

  ngOnChanges() {
    this.hideSendAndCopy();
    this.checkTemplateOrNot();
  }

  checkTemplateOrNot() {
    if(this.automation?.templateRender && this.automation?.template) {
    let template = (this.chatWindowInstance.generateMessageDOM(this.automation?.result));
    this.v_Template = template.innerHTML;
    }
  }

  hideSendAndCopy(){
    // Both send and copy
    this.automation.hideActionButtons = ((this.automation?.connectionDetails?.isCallConversation) ||
       (this.automation?.templateRender && this.automation?.template && this.automation.connectionDetails?.source != this.projConstants.SMARTASSIST_SOURCE)) ? true : false;

    // only copy button
    if(this.automation?.templateRender && this.automation?.template && this.automation?.connectionDetails?.source == this.projConstants.SMARTASSIST_SOURCE){
      this.automation.hideCopyButton = true;  
    }

    if(!this.rootService.settingsData?.isAgentResponseEnabled){
      this.automation.hideSendButton = true;
    }

    if(this.automation.hideSendButton && this.automation.hideCopyButton){
      this.automation.hideActionButtons = true;
    }

    if(this.isWelcomeMsg){
      this.automation.buttons.forEach(element => {
        element.hideActionButtons = this.automation.hideActionButtons;
        element.hideSendButton = this.automation.hideSendButton;
      });
    }
    
  }

  handleSendCopyButton(method,automation){
    automation.send = true;
    let sendData = this.isWelcomeMsg ? automation.value : automation.sendData;
    this.rootService.handleSendCopyButtonForNodes(method,sendData);
    this.responseArray = this.commonService.grayOutPreviousAutomation(this.responseArray, this.automationIndex, this.responseArrayIndex);
    this.responseArray = structuredClone(this.responseArray);
  }

}
