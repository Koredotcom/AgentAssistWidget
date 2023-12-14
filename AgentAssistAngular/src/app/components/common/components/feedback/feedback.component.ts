import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EVENTS } from 'src/app/helpers/events';
import { FeebackConst, ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  @Input() feedbackData : any;
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArray : number;
  @Output() updateFeedbackProperties = new EventEmitter();

  feedbackForm : FormGroup;
  feedbackConst : any = FeebackConst;
  feedbackComment : string;
  formTouched : boolean = false;
  dislikeList : any = [
    this.translate.instant("WRONG_SUGGESTION"),
    this.translate.instant("INCORRECT_INTENT"),
    this.translate.instant("ACCIDENTAL_CLICK"),
    this.translate.instant("TIME_TAKING"),
    this.translate.instant("OTHER"),
  ]

  constructor(private rootService : RootService,
    private websocketService : WebSocketService,
    private cdRef : ChangeDetectorRef,
    private translate : TranslateService){

  }

  ngOnInit(): void {
    this.createForm();
  }

  subscribeValChanges(){
    this.feedbackForm?.valueChanges.subscribe((_change)=>{      
      this.formTouched = true;
    })
  }

  createForm(){    
    this.feedbackForm = new FormGroup(
      {
        "botId": new FormControl(this.feedbackData.connectionDetails.botId),
        "conversationId" : new FormControl(this.feedbackData.connectionDetails.conversationId),
        "event" : new FormControl(EVENTS.agent_usage_feedback),
        "interactionType": new FormControl(this.rootService.activeTab == ProjConstants.ASSIST ? 'assist' : 'mybot'),
        "positionId" : new FormControl(this.feedbackData.dialogPositionId),
        "taskId" : new FormControl(this.feedbackData.uuid),
        "taskName" : new FormControl(this.feedbackData.dialogName),
        "comment" : new FormControl(this.feedbackData.comment),
        "feedback" : new FormControl(this.feedbackData.feedback,[Validators.required]),
        "feedbackDetails" : new FormControl(this.feedbackData.feedbackDetails)
      }
    );
    
    if(this.rootService.isUpdateFeedBackDetailsFlag && this.feedbackData?.feedbackResponse){
      this.updateFeedbackForm(this.feedbackData);
    }
    setTimeout(() => {
      this.subscribeValChanges();
    }, 100);
  }

  updateFeedbackForm(feedbackResponse){        
    (this.feedbackForm?.controls?.['feedbackDetails']).setValue(feedbackResponse.feedbackDetails);
    (this.feedbackForm?.controls?.['comment']).setValue(feedbackResponse.comment);
    this.cdRef.detectChanges();
  }


  addFeedback(feedBackFlag){
    this.feedbackData.feedback = feedBackFlag;
    this.feedbackData.arrowToggle = (feedBackFlag == this.feedbackConst.DISLIKE) ? true : false;
    (this.feedbackForm.controls?.['feedback']).setValue(feedBackFlag);
    this.formTouched = false;
    this.rootService.isUpdateFeedBackDetailsFlag = false;
    this.callAgentFeedbackUsage(); 
  }

  dislikeFeedbackArrowToggle(){
    this.feedbackData.arrowToggle = !this.feedbackData.arrowToggle;
    if(this.feedbackData.arrowToggle){
      this.AgentAssist_feedBack_Update_Request();
      this.rootService.isUpdateFeedBackDetailsFlag = true;
    }
  }

  addDislikeSuggestion(suggestion){
    let suggestionIndex = this.feedbackData.feedbackDetails.indexOf(suggestion);
    if(suggestionIndex >= 0){
      this.feedbackData.feedbackDetails.splice(suggestionIndex, 1);
    }else{
      this.feedbackData.feedbackDetails.push(suggestion);
    }
    this.feedbackData.comment = this.feedbackForm.get('comment').value;
    this.feedbackData = structuredClone(this.feedbackData);
    this.submitFeedback();
  }

  AgentAssist_feedBack_Update_Request() {
    if(this.rootService.isUpdateFeedBackDetailsFlag){
      let agent_assist_feedback_request = {
        conversationId: this.feedbackData.connectionDetails.conversationId,
        agentId: '',
        botId: this.feedbackData.connectionDetails.botId,
        orgId: '',
        taskId: this.feedbackData.uuid,
        positionId: this.feedbackData.dialogPositionId,
        'experience': (this.rootService.connectionDetails.isCall && this.rootService.connectionDetails.isCall == 'true') ? ProjConstants.VOICE : ProjConstants.CHAT,
        "interactionType": this.rootService.activeTab == ProjConstants.ASSIST ? 'assist' : 'mybot'
      }
      this.websocketService.emitEvents(EVENTS.agent_feedback_request, agent_assist_feedback_request);
    }
  }


  submitFeedback(flag?){
    this.callAgentFeedbackUsage();
    this.rootService.isUpdateFeedBackDetailsFlag = true;
    this.updateFeedbackProperties.emit(this.feedbackData);
    if(flag){
      this.feedbackData.arrowToggle = false;
    }
  }

  callAgentFeedbackUsage(){
    this.websocketService.emitEvents(EVENTS.agent_usage_feedback, this.feedbackForm.value);
    this.formTouched = false;
  }

}
