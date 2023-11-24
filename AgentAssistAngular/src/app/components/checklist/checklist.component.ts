import { Component, EventEmitter, Input, Output } from '@angular/core';
import { number } from 'echarts';
import { EVENTS } from 'src/app/helpers/events';
import { ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent {

  @Output() maxButtonClick = new EventEmitter();
  @Input() maxButton: boolean;

  projConstants : any = ProjConstants;
  subs = new SubSink();
  checklists: any = [];
  ccVersion: any;
  connectionDetails : any = {};
  selcLinx : number;
  selsTinx : number;
  selsPinx = number;
  

  shouldShowCL = false;
  triggeredDynCheckLists = [];
  isProceedToClose = true;
  primaryObj: any = {};
  dynClObjs: any = {};
  currentCl: any = {};
  clObjs: any = {};
  colors = {
    '#0BA5EC': '#F0F9FF',
    '#06AED4': '#ECFDFF',
    '#2E90FA': '#EFF4FF',
    '#6172F3': '#EEF4FF',
    '#6172F3f': '#F5F3FF',
    '#EE46BC': '#FDF4FF',
    '#F63D68': '#FFF1F3',
    '#669F2A': '#F5FBEE',
    '#16B364': '#EDFCF2',
    '#FF4405': '#FFF4ED'
  };
  isGuidedChecklistApiSuccess: boolean = false;
  checkListData: any = {};


  isCloseCompleted = false;
  openAck = false;


  constructor(
    private commonService: CommonService,
    private websocketService: WebSocketService,
    private rootService: RootService,
    private serviceInvoker: ServiceInvokerService
  ) { };


  ngOnInit() {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  subscribeEvents() {

    this.subs.sink = this.websocketService.sendCheckListOpened$.subscribe(res => {
      if (res) {
        this.connectionDetails = this.rootService.getConnectionDetails();
        this.getCheckListData();
      }
    });

    this.subs.sink = this.websocketService.checkListStepResponse$.subscribe((data) => {
      let clObj = data?.checklistStepsIdentified;
      (clObj || [])
        .forEach((item) => {
          let clInx = this.checklists.findIndex((cl) => cl._id === item.id);
          let sInx = (this.checklists[clInx].stages || []).findIndex((s) => s._id === item.stageId);
          let sTInx = (this.checklists[clInx].stages[sInx].steps || []).findIndex((st) => st._id === item.stepId);
          this.stepComplete(clInx, sInx, sTInx);
        })
    });
    this.subs.sink = this.websocketService.checkListResponse$.subscribe((data) => {
      if (data && data.checklistsIdentified) {
        (data.checklistsIdentified || []).forEach((item) => {
          let id = (item.checklistId || item.id || item._id);
          let inx = this.triggeredDynCheckLists.findIndex(cl => cl._id === id);
          console.log(inx, id, "index and id");
          
          if (inx < 0) {
            if (this.dynClObjs[id]) {
              this.triggeredDynCheckLists.push(JSON.parse(JSON.stringify(this.dynClObjs[id])));
            }
          }
        })
      }
      console.log(this.triggeredDynCheckLists, 'triggered dynamic checklist');
      
    });
    console.log(this.dynClObjs, 'dynamic checklist object');
    
  }


  minimizeToggle() {
    this.maxButton = !this.maxButton;
    this.maxButtonClick.emit(this.maxButton);
  }

  clickStep(stepInx) {
    let cl = this.checklists[this.selcLinx];
    if ((this.checklists[this.selcLinx]?.stages)[this.selsTinx]?.steps[stepInx]?.complete) {
      return;
    }
    else if (cl.order === "sequential" && ((this.checklists[this.selcLinx].stages)[this.selsTinx].steps[stepInx - 1]?.complete || stepInx === 0)) {
      // this.stepComplete(this.selcLinx, this.selsTinx, stepInx);
    } else if (cl.order === "random") {
      this.stepComplete(this.selcLinx, this.selsTinx, stepInx);
    } else {
      return;
    }
  }

  terminateChecklist(){
    let selectedCheckList = this.checklists[this.selcLinx];
    this.checklists[this.selcLinx].stages.forEach(stage => {
      stage.steps.forEach(step => {
        step.complete = true;
        step.ongoing = false;
      });
    });
    this.checklists[this.selcLinx].completed = true;
    this.sendCheckListCompleteEvent(selectedCheckList._id);
  }

  sendCheckListCompleteEvent(id) {
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_closed', this.checkListData, {"id": id});
    this.websocketService.emitEvents(EVENTS.checklist_closed, checklistParams);
  }
  
  checkAllStagesCompleted(id) {
    let completed = false;
    let i = (this.checklists || []).findIndex(item => item._id === id);
    if (this.checklists[i]?.type !== 'primary') {
      completed = (this.checklists[i].stages[0]?.steps || [])
        .every(item => item.complete);
      if (completed) {
        // this.checklists[i].stages[0].opened = false;
        this.checklists[i].completed = true;
        this.sendCheckListCompleteEvent(id);
      }
    } else {
      let open = (this.checklists[i].stages[0]?.steps || [])
        .every(item => item.complete);
      if (open) {
        // this.checklists[i].stages[0].opened = false;
      }
      let close = (this.checklists[i].stages[1]?.steps || [])
        .every(item => item.complete);
      if (close) {
        // this.checklists[i].stages[1].opened = false;
        if (!this.openAck) {
          this.isCloseCompleted = true;
          setTimeout(() => {
            this.isCloseCompleted = false;
            this.openAck = true;
          }, 3000);
        }
      }
      if (open && close) {
        this.checklists[i].completed = true;
        completed = true;
      }
      if (completed) {
        this.sendCheckListCompleteEvent(id);
      }
    }
  }

  getSelectedCount(stp) {
    return (stp.steps || []).filter((s) => {
      return s.complete;
    })?.length
  }


  checkListResume(i) {
    let cl = this.checklists[i];
    this.isProceedToClose = true;
    // event.stopPropagation();
    // this.closeAllCheckLists();
    // this.checklists[i].stages[si].opened = true;
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_resume', this.checkListData, {"id": cl._id});
    this.websocketService.emitEvents(EVENTS.checklist_resume, checklistParams);
  }

  closeAllCheckLists(isClose?) {
    let obj = {
      stageId: '',
      id: ''
    };
    this.checklists.forEach((item) => {
      (item.stages || []).forEach((stage) => {
        stage.opened = false;
      })
      if (item.type === 'primary' && isClose) {
        item.stages[0].opened = false;
        obj['stageId'] = item.stages[1]._id;
        obj['id'] = item._id;
        item.stages[1].opened = true;
      }
    });
    return obj;
  }

  proceedToClose() {
    this.isProceedToClose = false;
    let obj = this.closeAllCheckLists(true);
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_proceed_to_closed', this.checkListData, obj);
    this.websocketService.emitEvents(EVENTS.checklist_proceed_to_closed, checklistParams);
  }

  sendOrCopy(type, msg) {
    this.rootService.sendAndCopyForPlaybook(type, this.connectionDetails.conversationId, msg)
  }

  // get checklist data and trigger primary checklist if exists

  getCheckListData() {
    let botId = this.connectionDetails.fromSAT ? this.connectionDetails.instanceBotId : this.connectionDetails.botId;
    this.subs.sink = this.serviceInvoker.invoke('get.checklist', {botId: botId}, {}, {checklist: 'true', botId: botId }, this.connectionDetails.agentassisturl).subscribe((data) => {
      if (data.checklists.length > 0) {
        this.checkListData = data;
        this.rootService.primaryChecklist = data.checklists.filter(check => check.type === "primary");
        this.rootService.dynamicChecklist = data.checklists.filter(check => check.type === "dynamic");
        (data?.checklists || [])
          .forEach((item) => {
            (item.stages || [])
              .forEach((stage) => {
                this.clObjs[stage._id] = stage;
              })
          });
        this.dynClObjs = (this.rootService.dynamicChecklist || [])
          .reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
          }, {});
      };
      this.sendOpenCheckLIstEvent();
    });
  }


  sendOpenCheckLIstEvent() {
    console.log(this.rootService.primaryChecklist, "primary checklist", this.isGuidedChecklistApiSuccess);
    
    if (!this.isGuidedChecklistApiSuccess && this.rootService.primaryChecklist.length > 0) {
      let channel = this.connectionDetails.isCallConversation ? 'voice' : 'chat'
      if (this.rootService.primaryChecklist[0]?.channels?.includes(channel)) {
        this.shouldShowCL = true;
        this.sendChecklistEvent();
      }
    }
  }

  sendChecklistEvent() {
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_opened', this.checkListData,
      {
        "id": this.rootService.primaryChecklist[0]._id,
      }
    );
    this.isGuidedChecklistApiSuccess = true;
    this.websocketService.emitEvents(EVENTS.checklist_opened, checklistParams);
    // if (this.rootService.primaryChecklist[0]?.stages[0]) {
    //   this.rootService.primaryChecklist[0].stages[0].opened = true;
    // };
    // (this.rootService.primaryChecklist[0]?.stages)
    //   .forEach((item) => {
    //     item.color = this.clObjs[item._id]?.color
    //   });
    this.checklists.push(this.rootService.primaryChecklist[0]);
    this.updateCheckList(this.checklists.length - 1);
   
  }
  
  selectDynCl(clT, i) {
    this.triggeredDynCheckLists.splice(i, 1);
    // this.closeAllCheckLists();
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_opened', this.checkListData, {"id": clT._id});
    this.websocketService.emitEvents(EVENTS.checklist_opened, checklistParams);
    this.checklists.push(clT);
    this.updateCheckList(this.checklists.length - 1);
  }

  updateCheckList(clInx){
    this.selcLinx = clInx;
    this.selsTinx = this.checklists[this.selcLinx]?.stages?.length ? 0 : undefined;
    if(this.checklists[this.selcLinx]?.stages[this.selsTinx]?.steps[0]){
      this.checklists[this.selcLinx].stages[this.selsTinx].steps[0].ongoing = true;
    }
  }

  selectStage(index){
    this.selsTinx = index;
    this.selectNextStep();
  }

  stepComplete(cLinx, sTinx, sPinx) {
    let id = this.checklists[cLinx]._id;
    let stageId = this.checklists[cLinx].stages[sTinx]._id;
    let stepId = this.checklists[cLinx].stages[sTinx].steps[sPinx]._id;

    this.checklists[cLinx].stages[sTinx].steps[sPinx].ongoing = false;
    this.checklists[cLinx].stages[sTinx].steps[sPinx].complete = true;
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_step_closed', this.checkListData, 
    {
      id,
      stageId,
      stepId,
      "adheredBy": "manual" // coachingEngine / manual
    }, 
    true);
    this.websocketService.emitEvents(EVENTS.checklist_step_closed, checklistParams);
    this.selectNextStep();
    this.selectNextStage();
    this.checkAllStagesCompleted(id);
  };

  selectNextStage(){
    let allStepsCompleteInStage = this.selectNextStep();
    if(allStepsCompleteInStage && this.checklists[this.selcLinx]?.stages[this.selsTinx + 1]){
      this.selectStage(this.selsTinx + 1);
    }
  }

  selectNextStep(){
    let allStepsComplete = true;
    for(let step of this.checklists[this.selcLinx]?.stages[this.selsTinx]?.steps){
      if(!step.complete){
        step.ongoing = true;
        allStepsComplete = false;
        break;
      }
    }
    return allStepsComplete;
  }

}
