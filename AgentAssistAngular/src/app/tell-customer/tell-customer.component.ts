import { Component, ElementRef, Input, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ProjConstants, RenderResponseType } from '../proj.const';
import { CommonService } from '../services/common.service';
import { RootService } from '../services/root.service';
import { chatWindow } from '@koredev/kore-web-sdk';
import $ from "jquery";

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
    this.chatWindowInstance.on('beforeRenderMessage', event => {
      console.log('data: ', event);
    });
    this.chatWindowInstance.setBranding();   
  }

  ngOnChanges() {
    this.hideSendAndCopy();
    this.checkTemplateOrNot();
  }

  checkTemplateOrNot() {
    if(this.automation?.templateRender && this.automation?.template) {
      
    let template = (this.chatWindowInstance.generateMessageDOM(this.automation?.result));
    if(this.automation?.result?.message[0].cInfo?.body?.payload?.cards) {
        let cardsArr = this.automation?.result?.message[0].cInfo?.body?.payload?.cards;
        template.querySelectorAll('.btn-action-card').forEach((ele, i) => {
          cardsArr[i].id = i;
          ele.setAttribute("id", `clickable-${cardsArr[i].id}`);
        })
        this.v_Template = template.innerHTML;
        return this.v_Template;
      }
      if(this.automation?.result.message[0].cInfo.body.payload.buttons) {
        template.querySelectorAll('.kr-btn').forEach((element, i) => {
          console.log("🚀 ~ file: tell-customer.component.ts:50 ~ TellCustomerComponent ~ template.querySelectorAll ~ element:", element, i)
          let click_Id = i;
          element.setAttribute("id", `clickable-${click_Id}`);
          element.setAttribute("payload", ``)
          // element.setAttribute("data", `${}`)
        });
      }
    this.v_Template = template.innerHTML;
    }
  }

  @HostListener('click', ['$event'])
  onClick(evt) {
    console.log("🚀 ~ file: tell-customer.component.ts:49 ~ TellCustomerComponent ~ checkTemplateOrNot ~ this.automation?.result:",evt)
    console.log(evt.target)
    $('')
    if(evt.target) {
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
