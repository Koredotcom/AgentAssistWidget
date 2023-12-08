import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
  @Output() expandAssist = new EventEmitter();
  @Input() maxButton: boolean;
  @Input() resize;

  projConstants: any = ProjConstants;
  subs = new SubSink();
  checklists: any = [];
  ccVersion: any;
  connectionDetails: any = {};
  selcLinx: number;
  selsTinx: number;
  selsPinx: number;


  shouldShowCL = false;
  triggeredDynCheckLists = [];
  isProceedToClose = false;
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

  showProceedToClose: boolean = false;
  isCloseCompleted = false;
  openAck = false;

  constructor(
    private commonService: CommonService,
    private websocketService: WebSocketService,
    public rootService: RootService,
    private serviceInvoker: ServiceInvokerService
  ) { };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollToStep();
  }

  onResized() {
   this.scrollToStep();
  }

  scrollToStep(){
    let stepId = this.checklists[this.selcLinx]?.stages[this.selsTinx]?.steps[this.selsPinx]?._id;
    if(stepId){
      this.scrollView(stepId);
    }
  }

  ngOnInit() {
    this.subscribeEvents();
  }

  ngOnChanges(){
    this.onResized();
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
          if (inx < 0) {
            if (this.dynClObjs[id]) {
              this.triggeredDynCheckLists.push(JSON.parse(JSON.stringify(this.dynClObjs[id])));
            }
          }
        })
      }
    });
  }

  minimizeToggle() {
    this.maxButtonClick.emit(this.maxButton);
  }

  clickStep(stInx, stepInx) {
    let cl = this.checklists[this.selcLinx];
    if ((this.checklists[this.selcLinx]?.stages)[stInx]?.steps[stepInx]?.complete || (this.checklists[this.selcLinx]?.stages)[stInx]?.steps[stepInx]?.ongoing) {
      return;
    } else if (cl?.order === "random") {
      // let close = this.checkCloseStage(this.selcLinx, stInx);
      // if(close){
        this.checklists[this.selcLinx].stages[this.selsTinx].steps[this.selsPinx].ongoing = false;
        this.selectStepForRandom(stInx, stepInx);
      // }
    } else {
      return;
    }
    if(!(this.checklists[this.selcLinx]?.type == 'primary' && this.checklists[this.selcLinx].stages[this.selsTinx].name == 'Close')){
      this.isProceedToClose = false;
    }
  }


  sendCheckListCompleteEvent(id) {
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_closed', this.checkListData, { "id": id });
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

  // getSelectedCount(stp) {
  //   return (stp.steps || []).filter((s) => {
  //     return s.complete;
  //   })?.length
  // }

  resumeAndUpdateCheckList(i) {
    if(!this.checklists[i].openedChecklist){
      this.getCheckListIndex(this.checklists[i], this.checklists[i]._id)
    }else if(this.checklists[i].name != this.checklists[this.selcLinx].name){
      this.checkListResume(i);
      this.selcLinx = i;
      this.selsTinx = 0;
      this.selectNextStage();
    }
    this.minimizeToggle();
  }

  checkListResume(i) {
    let cl = this.checklists[i];
    this.isProceedToClose = false;
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_resume', this.checkListData, { "id": cl._id });
    this.websocketService.emitEvents(EVENTS.checklist_resume, checklistParams);
  }

  proceedToCloseButtonClick() {
    let obj = {
      stageId: '',
      id: ''
    };
    this.checklists.forEach((item, index) => {
      if (item.type === 'primary') {
        obj['stageId'] = item.stages[1]._id;
        obj['id'] = item._id;
        this.selcLinx = index;
        this.selsTinx = 1;
        this.selectNextStep();
      }
    });
    this.isProceedToClose = true;
    let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_proceed_to_closed', this.checkListData, obj);
    this.websocketService.emitEvents(EVENTS.checklist_proceed_to_closed, checklistParams);
  }

  sendOrCopy(stInx, spInx, type, msg) {
    this.rootService.sendAndCopyForPlaybook(type, this.connectionDetails.conversationId, msg);
    this.stepComplete(this.selcLinx, stInx, spInx);
  }

  // get checklist data and trigger primary checklist if exists

  getCheckListData() {
    let botId = this.connectionDetails.fromSAT ? this.connectionDetails.instanceBotId : this.connectionDetails.botId;
    this.subs.sink = this.serviceInvoker.invoke('get.checklist', { botId: botId }, {}, { checklist: 'true', botId: botId }, this.connectionDetails.agentassisturl).subscribe((data) => {
      if (data.checklists.length > 0) {
        this.checkListData = data;
        this.rootService.primaryChecklist = data.checklists.filter(check => check.type === "primary");
        this.rootService.dynamicChecklist = data.checklists.filter(check => check.type === "dynamic");
        this.checklists = structuredClone(data.checklists);
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
    if (!this.isGuidedChecklistApiSuccess && this.rootService.primaryChecklist.length > 0) {
      let channel = this.connectionDetails.isCallConversation ? 'voice' : 'chat'
      if (this.rootService.primaryChecklist[0]?.channels?.includes(channel)) {
        this.showProceedToClose = true;
        this.shouldShowCL = true;
        this.sendChecklistEvent();
      }
    }else{
      this.expandAssist.emit(this.maxButton);
    }
  }

  sendChecklistEvent() {
    this.isGuidedChecklistApiSuccess = true;
    // this.checklists.push(this.rootService.primaryChecklist[0]);
    this.getCheckListIndex(this.rootService.primaryChecklist[0], this.rootService.primaryChecklist[0]._id);
  }

  getCheckListIndex(clT, id){
    let index = this.checklists.findIndex(obj => obj._id == clT._id);
    if(index >= 0){
      this.updateCheckList(index);
      if(!this.checklists[index].openedChecklist){
        this.checklists[this.selcLinx].openedChecklist = true;
        let checklistParams: any = this.commonService.prepareChecklistPayload(this.connectionDetails, 'checklist_opened', this.checkListData, { "id": id });
        this.websocketService.emitEvents(EVENTS.checklist_opened, checklistParams);
      }
    }
  }

  selectDynCl(clT, i) {
    this.triggeredDynCheckLists.splice(i, 1);
    let index = this.checklists.findIndex(obj => obj._id == clT._id);
    if(this.checklists[index]){
      this.resumeAndUpdateCheckList(index);
    }
  }

  updateCheckList(clInx) {
    this.selcLinx = clInx;
    this.selsTinx = this.checklists[this.selcLinx]?.stages?.length ? 0 : undefined;
    if (this.checklists[this.selcLinx]?.stages[this.selsTinx]?.steps[0]) {
      this.checklists[this.selcLinx].stages[this.selsTinx].steps[0].ongoing = true;
      this.selsPinx = 0;
      let stepId = this.checklists[this.selcLinx].stages[this.selsTinx].steps[0]._id;
      this.scrollView(stepId);
    }
  }

  selectStage(index) {
    if(!this.maxButton){
      this.minimizeToggle();
    }
    this.selsTinx = index;
    this.selectNextStep();
  }

  stepComplete(cLinx, sTinx, sPinx) {
    let close = this.checkCloseStage(cLinx, sTinx);
    if (close) {
      this.selsTinx = sTinx;
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
    }
  };

  checkCloseStage(cLinx, sTinx) {
    let flag = true;
    if (this.checklists[cLinx].stages[sTinx].name == 'Close') {
      for (let i = sTinx - 1; i >= 0; i--) {
        for (let step of this.checklists[this.selcLinx].stages[i]?.steps) {
          if (!step.complete) {
            flag = false;
            return flag;
          }
        }
      }
    }
    return flag;
  }

  selectNextStage() {
    let allStepsCompleteInStage = this.selectNextStep();
    if (allStepsCompleteInStage && this.checklists[this.selcLinx]?.stages[this.selsTinx + 1]) {
      this.selectStage(this.selsTinx + 1);
    }
  }

  selectNextStep() {
    let allStepsComplete = true;
    let index = 0;
    this.closeAllStepsInStage(this.selsTinx);
    for (let step of this.checklists[this.selcLinx]?.stages[this.selsTinx]?.steps) {
      if (!step.complete) {
        step.ongoing = true;
        allStepsComplete = false;
        this.selsPinx = index;
        this.scrollView(step._id);
        break;
      }
      index++;
    }
    this.checklists = structuredClone(this.checklists);
    return allStepsComplete;
  }

  selectStepForRandom(stInx, stepInx) {
    this.selsTinx = stInx;
    this.selsPinx = stepInx;
    this.checklists[this.selcLinx].stages[this.selsTinx].steps[this.selsPinx].ongoing = true;
    let stepId = this.checklists[this.selcLinx].stages[this.selsTinx].steps[this.selsPinx]._id;
    this.scrollView(stepId);
  }

  scrollView(stepId){
    if(document.getElementById(stepId)){
      document.getElementById(stepId).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  closeAllStepsInStage(stInx) {
    this.checklists[this.selcLinx]?.stages.forEach(stage => {
      stage?.steps.forEach(step => {
        step.ongoing = false;
      });
    });
  }

  getNumberstepCompInStage(){
    let stepNum = 0;
    for(let step of this.checklists[this.selcLinx]?.stages[this.selsTinx]?.steps){
      if(step.complete){
        stepNum += 1;
      }
    }
    return stepNum;
  }

  mouseLeaveEvent(event){
    let cl = this.checklists[this.selcLinx];
    if(cl?.order != 'random'){
      this.onResized();
    }
  }

}
