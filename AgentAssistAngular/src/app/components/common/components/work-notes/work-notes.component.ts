import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-work-notes',
  templateUrl: './work-notes.component.html',
  styleUrls: ['./work-notes.component.scss']
})
export class WorkNotesComponent implements OnInit{

  constructor(
    private http: HttpClient  ,
    private rootService: RootService,
    private websocketService: WebSocketService
  ){}

  ngOnInit(): void {
    try{
      let automation
      if(this.automation.data.buttons[0].value){
        automation = JSON.parse(this.automation.data.buttons[0].value);
      }else if(this.automation.data){
        automation = JSON.parse(this.automation.data.buttons[0].value);
      }
      if(automation?.payload?.template_type === 'worknotesTemplate'){
        this.automationObj = {...automation?.payload};
      }
    }catch(e){
      console.error(e);
    }
  }

  @Input() automation: any;
  // @Input() listView : boolean;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;
  automationObj: any = {};

  workNoteFeedBack(isPosOrNeg, wn){
    this.http.post(this.automationObj?.feedbackWebhookURL, {
      type: "feedback",
      isExternalWn: true,
      worknotes: [
          {
              worknote_id: wn.worknoteId,
              action: isPosOrNeg ? "like" : "dislike"
          }
        ]
      },{
        headers: {
          accountid: this.rootService.accountId,
          botid: this.rootService.connectionDetails.botId,
          agentid: this.rootService.connectionDetails.conversationId
        }
      } ).subscribe((data)=>{
    });
    this.postTheFeedback(isPosOrNeg, wn)
  }

  postTheFeedback(isPosOrNeg, wn){
    let feedBack =       {
      "botId": this.rootService.connectionDetails.botId,
      "conversationId" : this.rootService.connectionDetails.conversationId,
      "event" : EVENTS.agent_usage_feedback,
      "interactionType": this.rootService.activeTab == ProjConstants.ASSIST ? 'assist' : 'mybot',
      "positionId" : this.automation?.data?.positionId,
      "taskId" : /* workNoteId */ wn.worknoteId,
      "taskName" : /* workNoteName */ wn.categoryTitle,
      "comment" : /* workNoteDescription */ wn.description,
      "feedback" : isPosOrNeg ? "like" : "dislike",
      "feedbackDetails" : []
    };
    this.websocketService.emitEvents(EVENTS.agent_usage_feedback, feedBack);
  }
}