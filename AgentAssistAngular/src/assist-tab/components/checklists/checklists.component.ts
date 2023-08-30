import { Component, Input } from '@angular/core';
import { EVENTS } from 'src/common/helper/events';
import { CommonService } from 'src/common/services/common.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

@Component({
  selector: 'app-checklists',
  templateUrl: './checklists.component.html',
  styleUrls: ['./checklists.component.scss']
})
export class ChecklistsComponent {
  constructor(
    private commonService: CommonService,
    private websocketService: WebSocketService
  ){

  }
  @Input() checklists: any;
  @Input() connectionDetails: any;
  @Input() ccVersion: any;
  clickStep(cl, ac, step){
    console.log("🚀 ~ file: checklists.component.ts:22 ~ ChecklistsComponent ~ clickStep ~ cl, ac:", cl, ac);
    step.complete = true;
    let checklistParams: any = {
      "payload": /* {
          "event": "checklist_opened",
          "conversationId": this.connectionDetails.conversationId,
          "ccVersion": this.checkListData?.ccVersion,
          "accountId": this.checkListData?.accountId,
          "botId": (this.commonService.configObj?.fromSAT) ?  this.commonService.configObj.instanceBotId : this.commonService.configObj.botid,
          "agentInfo": {
              "agentId": "", // mendatory field
              //any other fields
          },
          "checklist": {
            "_id": this.commonService.primaryChecklist[0]._id,
              //any other fields
          },
          "timestamp": 0,
          "context": {}
      } */
        {
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
}
