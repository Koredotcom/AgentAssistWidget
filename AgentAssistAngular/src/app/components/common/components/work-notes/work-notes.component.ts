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


  // @Input() listView : boolean;
  @Input() automation: any;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;
  @Input() feedBackForWn;
  feedback:any = {};
  
  automationObj: any = {};

  ngOnInit(): void {
    console.log("feedBackForWn", this.feedBackForWn);
    this.feedback = (this.feedBackForWn || []).reduce((acc, item)=>{
      if(item.type === 'worknote'){
        acc[item.positionId] = item.feedback;
      }
      return acc ;
    }, {});
    
    console.log("🚀 ~ WorkNotesComponent ~ this.feedback= ~ this.feedback:", this.feedback)


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

  workNoteFeedBack(isPosOrNeg, wn){
    this.feedback[wn.worknoteId] = null;
    wn.feedback = isPosOrNeg ? "like" : "dislike"
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
      "positionId" : wn.worknoteId,
      "taskId" : /* workNoteId */ wn.worknoteId,
      "taskName" : /* workNoteName */ wn.categoryTitle,
      "comment" : /* workNoteDescription */ wn.description,
      "feedback" : isPosOrNeg ? "like" : "dislike",
      "feedbackDetails" : [],
      "type": 'worknote' 
    };
    this.websocketService.emitEvents(EVENTS.agent_usage_feedback, feedBack);
  }
}