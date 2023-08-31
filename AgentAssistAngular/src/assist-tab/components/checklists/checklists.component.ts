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
  ){};
  subscription1: Subscription;
  subscription2: Subscription;
  @Input() checklists: any;
  @Input() connectionDetails: any;
  @Input() ccVersion: any;
  @Input() dynamicChecklist = [];
  triggeredDynCheckLists = [];
  dynClObjs:any = {};
  showDropDown = false;
  clickStep(cl, ac, step, i, si, sti){
    if((this.checklists[i].stages)[si].steps[sti]?.complete){
      return;
    }
    else if(cl.order === "sequential" && ((this.checklists[i].stages)[si].steps[sti - 1]?.complete || sti === 0)){
      step.complete = true;
    }else if(cl.order === "random"){
      step.complete = true;
    }else{
      return;
    }
    let checklistParams: any = {
      payload: {
            "event": "checklist_step_closed",
            "conversationId": this.connectionDetails.conversationId,
            "ccVersion": this.ccVersion, //checklist Configuration version
            "accountId": "",
            "botId": (this.commonService.configObj?.fromSAT) ?  this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
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
  }

  proceedToClose(){
    //close logic
  }

  ngOnInit(){
    this.subscription1 = this.websocketService.checkListStepResponse$.subscribe((data)=>{
      let clObj = data?.checklistStepsIdentified;
      [
        {
            "id": "acl-a5b97c92-e7b9-5256-98d3-0c545fff6ef3",
            "checklistId": "acl-a5b97c92-e7b9-5256-98d3-0c545fff6ef3",
            "stageId": "acs-fe3b0f54-ab5b-5b5a-899d-ded3280a8a21",
            "stepId": "acst-11b1caad-731c-57ea-8cc7-c465f3773f3a"
        }
      ];
      (clObj || [])
      .forEach((item)=>{
        let clInx = this.checklists.findIndex((cl)=>cl._id === item.checklistId);
        let sInx = (this.checklists[clInx].stages || []).findIndex((s)=>s._id === item.stageId);
        let sTInx = (this.checklists[clInx].stages[sInx].steps || []).findIndex((st)=>st._id === item.stepId);
        this.checklists[clInx].stages[sInx].steps[sTInx]['complete'] = true
      })
    });

    this.subscription2 = this.websocketService.checkListResponse$.subscribe((data)=>{
      if(data && data.checklistsIdentified){
        (data.checklistsIdentified || []).forEach((item)=>{
          let inx = this.triggeredDynCheckLists.findIndex(cl => cl._id === item.checklistId);
          if(inx < 0){
            this.triggeredDynCheckLists.push(this.dynClObjs[item.checklistId]);
          }
        })
      }
    });

    this.dynClObjs = (this.dynamicChecklist || [])
    .reduce((acc, item)=>{
      acc[item._id] = item;
      return acc;
    }, {});

  }

  getSelectedCount(stp){
    return (stp.steps  || []).filter((s)=>{
      return s.complete;
    })?.length
  }

  selectDynCl(clT, i){
    this.showDropDown = false;
    this.triggeredDynCheckLists.splice(i, 1);
    this.checklists.push(clT);
    let checklistParams: any = {
      "payload": {
          "event": "checklist_opened",
          "conversationId": this.connectionDetails.conversationId,
          "ccVersion": this.ccVersion,
          "accountId": '',
          "botId": (this.commonService.configObj?.fromSAT) ?  this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
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

  ngOnDestroy(){
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
