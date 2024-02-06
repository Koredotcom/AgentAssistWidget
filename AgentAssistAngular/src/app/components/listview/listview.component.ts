import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListviewComponent implements AfterViewInit{
  projConstants : any = ProjConstants;

  @ViewChild('collapseTabListView', { static: false }) private collapseTab: ElementRef;


  @Input() entityList : any;
  @Output() handlePopupEvent = new EventEmitter();

  inputName : string = ProjConstants.AWAITING;
  automationData : any;

  assistRespType(index, respType) {
    return respType?.data?._id;
  };

  constructor(public rootService : RootService, private websocketService : WebSocketService, private renderer : Renderer2){

  }

  ngOnChanges(changes){
    if(changes?.entityList?.currentValue){
      this.scrollToBottomPadding();
    }
  }

  ngAfterViewInit(){
    this.scrollToBottomPadding();
  }

  scrollToBottomPadding(){    
    if(this.collapseTab?.nativeElement){
      let collapseTabHeight = this.collapseTab?.nativeElement?.offsetHeight;      
      // if(collapseTabHeight){
      //   let pixel = (50 * collapseTabHeight) / 100;
      //   this.renderer.setStyle(this.collapseTab.nativeElement, 'padding-bottom', pixel+"px");
      // }else{
        this.collapseTab.nativeElement.classList.add('pB');
      // }
      setTimeout(() => {
        try {
          this.collapseTab.nativeElement.scrollTop = this.collapseTab.nativeElement.scrollHeight;
          this.collapseTab.nativeElement.classList.remove('pB');
        } catch (err) { }
      }, 0);
    }
  }

  confirmOverride(automation){
    if(!automation.toggleOverride && this.rootService.activeTab != this.projConstants.MYBOT){
      this.inputName = this.projConstants.OVERRIDE;
      automation.toggleOverride = true;
      if(!this.rootService.OverRideMode){
        this.handleOverridBtnClick(automation.connectionDetails, automation.dialogId, automation.toggleOverride);
      }
    }
  }


  cancelOverride(){
    if(this.entityList?.length > 0){
      let automation = this.entityList[this.entityList.length - 1];
      if(this.rootService.activeTab != this.projConstants.MYBOT){
        this.inputName = this.projConstants.AWAITING;
        automation.toggleOverride = false;
        automation.entityValue = '';
        if(this.rootService.OverRideMode && this.rootService.proactiveModeStatus && !this.rootService.manualAssistOverrideMode){
          this.handleOverridBtnClick(automation.connectionDetails, automation.dialogId, automation.toggleOverride);
        }
      }
    }
  }

  handleAgentInput(automation){
    automation.hideOverrideDiv = true;
    automation.userInput = this.projConstants.NO;
    if(this.rootService.activeTab == this.projConstants.ASSIST){
      this.assistInputValue(automation);
    }else if(this.rootService.activeTab == this.projConstants.MYBOT){
       this.mybotInputValue(automation)
    }
  }

  
  closeListView(flag){
    this.cancelOverride();
    this.handlePopupEvent.emit({ status: flag,  type: this.projConstants.LISTVIEW });
  }

  handleOverridBtnClick(connectionDetails, dialogId, toggleOverride) {
    this.websocketService.handleOverrideMode(toggleOverride, dialogId);
  }

  assistInputValue(automation) {
    let connectionDetails = Object.assign({}, this.automationData.connectionDetails);
    connectionDetails.value = automation.entityValue;
    connectionDetails.positionId = automation.dialogId;
    // connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
    connectionDetails.childBotId = automation.data.childBotId;
    connectionDetails.childBotName = automation.data.childBotName;
    let assistRequestParams = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
  }

 mybotInputValue(automation) {
  let connectionDetails: any = Object.assign({}, automation.connectionDetails);
  connectionDetails.value = automation.entityValue;
  connectionDetails.isSearch = false;
  connectionDetails.positionId = automation.dialogId;
  connectionDetails.childBotName = this.rootService?.childBotDetails.childBotName;
  connectionDetails.childBotId = this.rootService?.childBotDetails.childBotId;
  let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
  this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
}

}
