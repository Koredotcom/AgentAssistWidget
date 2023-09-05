import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/common/helper/events';
import { CommonService } from 'src/common/services/common.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent implements OnInit, OnDestroy {
  constructor(
    private commonService: CommonService,
    private websocketService: WebSocketService
  ) { };
  subscription1: Subscription;
  subscription2: Subscription;
  @Input() checklists: any;
  @Input() connectionDetails: any;
  @Input() ccVersion: any;
  @Input() dynamicChecklist = [];
  @Input() selectedPlayBook = '';
  @Input() clObjs: any;
  triggeredDynCheckLists = [];
  isProceedToClose = true;
  primaryObj:any = {};
  dynClObjs: any = {};
  showDropDown = false;
  currentCl:any = {};
  clickStep(cl, ac, step, i, si, sti) {
    if ((this.checklists[i]?.stages)[si]?.steps[sti]?.complete) {
      return;
    }
    else if (cl.order === "sequential" && ((this.checklists[i].stages)[si].steps[sti - 1]?.complete || sti === 0)) {
      step.complete = true;
    } else if (cl.order === "random") {
      step.complete = true;
    } else {
      return;
    }
    let checklistParams: any = {
      payload: {
        "event": "checklist_step_closed",
        "conversationId": this.connectionDetails.conversationId,
        "ccVersion": this.ccVersion, //checklist Configuration version
        "accountId": "",
        "botId": (this.commonService.configObj?.fromSAT) ? this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
        "botName": "",
        "agentInfo": {
          "agentId": ""
        },
        "checklistStep": {
          "id": cl._id,
          "stageId": ac._id,
          "stepId": step._id,
          "adheredBy": "manual" // coachingEngine / manual
        },
        "timestamp": 0,
        "context": {}
      }
    }
    this.websocketService.emitEvents(EVENTS.checklist_step_closed, checklistParams);
    this.checkAllStagesCompleted(cl._id);
  }

  sendCheckListCompleteEvent(id){
    let checklistParams: any = {
      "payload": {
          "event": "checklist_closed",
          "conversationId": this.connectionDetails.conversationId,
          "ccVersion": this.ccVersion, // Optional: checklist Configuration version
          "accountId": "",
          "botId": (this.commonService.configObj?.fromSAT) ? this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
          "botName": "",
          "agentInfo": {
              "agentId": "",
              //any other fields
          },
          "checklist": {
              "id": id,
              //any other fields
          },
          "timestamp": 0,
          "context": {}
      }
    };
    this.websocketService.emitEvents(EVENTS.checklist_closed, checklistParams);
  }

  stepComplete(id, stageId, stepId){
    let checklistParams: any = {
      payload: {
        "event": "checklist_step_closed",
        "conversationId": this.connectionDetails.conversationId,
        "ccVersion": this.ccVersion, //checklist Configuration version
        "accountId": "",
        "botId": (this.commonService.configObj?.fromSAT) ? this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
        "botName": "",
        "agentInfo": {
          "agentId": ""
        },
        "checklistStep": {
          id,
          stageId,
          stepId,
          "adheredBy": "manual" // coachingEngine / manual
        },
        "timestamp": 0,
        "context": {}
      }
    }
    this.websocketService.emitEvents(EVENTS.checklist_step_closed, checklistParams);
    this.checkAllStagesCompleted(id);
  };

  checkAllStagesCompleted(id){
    let completed = false;
    let i = (this.checklists || []).findIndex(item => item._id === id);
    if(this.checklists[i]?.type !== 'primary'){
      completed = (this.checklists[i].stages[0]?.steps || [])
      .every(item=> item.complete);
      if(completed){
        this.sendCheckListCompleteEvent(id);
      }
    }else{
      let open = (this.checklists[i].stages[0]?.steps || [])
      .every(item=> item.complete);
      let close = (this.checklists[i].stages[1]?.steps || [])
      .every(item=> item.complete);
      if(open && close){
        completed = true;
      }
      if(completed){
        this.sendCheckListCompleteEvent(id);
      }
    }
  }

  ngOnInit() {
    this.subscription1 = this.websocketService.checkListStepResponse$.subscribe((data) => {
      let clObj = data?.checklistStepsIdentified;
      (clObj || [])
        .forEach((item) => {
          let clInx = this.checklists.findIndex((cl) => cl._id === item.id);
          let sInx = (this.checklists[clInx].stages || []).findIndex((s) => s._id === item.stageId);
          let sTInx = (this.checklists[clInx].stages[sInx].steps || []).findIndex((st) => st._id === item.stepId);
          this.checklists[clInx].stages[sInx].steps[sTInx]['complete'] = true;
          this.stepComplete(item.id, item.stageId, item.stepId);
        })
    });
    this.subscription2 = this.websocketService.checkListResponse$.subscribe((data) => {
      if (data && data.checklistsIdentified) {
        (data.checklistsIdentified || []).forEach((item) => {
          let inx = this.triggeredDynCheckLists.findIndex(cl => cl._id === item.checklistId);
          if (inx < 0) {
            this.triggeredDynCheckLists.push(this.dynClObjs[item.checklistId]);
          }
        })
      }
    });

    this.dynClObjs = (this.dynamicChecklist || [])
      .reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
    }, {});
  }

  getSelectedCount(stp) {
    return (stp.steps || []).filter((s) => {
      return s.complete;
    })?.length
  }

  selectDynCl(clT, i) {
    this.selectedPlayBook = clT?.name;
    this.showDropDown = false;
    this.triggeredDynCheckLists.splice(i, 1);
    this.closeAllCheckLists();
    clT.stages[0].opened = true;
    clT.stages[0].color = this.clObjs[clT.stages[0]._id];
    this.checklists.push(clT);
    let checklistParams: any = {
      "payload": {
        "event": "checklist_opened",
        "conversationId": this.connectionDetails.conversationId,
        "ccVersion": this.ccVersion,
        "accountId": '',
        "botId": (this.commonService.configObj?.fromSAT) ? this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
        "agentInfo": {
          "agentId": "",
        },
        "checklist": {
          "id": clT._id
        },
        "timestamp": 0,
        "context": {}
      }
    }
    this.websocketService.emitEvents(EVENTS.checklist_opened, checklistParams);
  }

  checkListResume(event, cl, i, si) {
    this.selectedPlayBook = cl.name;
    this.isProceedToClose = true;
    event.stopPropagation();
    this.closeAllCheckLists();
    this.checklists[i].stages[si].opened = true;
    let checklistParams: any = {
      "payload": {
        "event": "checklist_resume",
        "conversationId": this.connectionDetails.conversationId,
        "ccVersion": this.ccVersion, // Optional: checklist Configuration version
        "accountId": "",
        "botId": (this.commonService.configObj?.fromSAT) ? this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
        "botName": "",
        "agentInfo": {
          "agentId": "",
        },
        "checklist": {
          "id": cl._id,
        },
        "timestamp": 0,
        "context": {}
      }
    };
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
      if(item.type === 'primary' && isClose){
        item.stages[0].opened = false;
        obj['stageId'] = item.stages[1]._id;
        obj['id'] = item._id;
        item.stages[1].opened = true;
      }
    });
    return obj;
  }

  proceedToClose(){
    this.isProceedToClose = false;
    let obj = this.closeAllCheckLists(true);
    let checklistParams: any = {
      "payload": {
          "event": "checklist_proceed_to_closed",
          "conversationId": this.connectionDetails.conversationId,
          "ccVersion": this.ccVersion,
          "accountId": "",
          "botId": (this.commonService.configObj?.fromSAT) ? this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
          "botName": "",
          "agentInfo": {
              "agentId": "",
              //any other fields
          },
          "checklist": obj,
          "timestamp": 0,
          "context": {}
      }
  }
  ;
    this.websocketService.emitEvents(EVENTS.checklist_proceed_to_closed, checklistParams);
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
