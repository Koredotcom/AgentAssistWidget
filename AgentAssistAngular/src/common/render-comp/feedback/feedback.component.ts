import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FeebackConst, ProjConstants } from 'src/common/constants/proj.cnts';
import { EVENTS } from 'src/common/helper/events';
import { CommonService } from 'src/common/services/common.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit{
  @Input() feedbackData : any;
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArrayLength : number;
  @Output() updateFeedbackProperties = new EventEmitter();

  feedbackForm : FormGroup;
  feedbackConst : any = FeebackConst;
  feedbackComment : string;
  formTouched : boolean = false;

  constructor(private commonService : CommonService,
    private websocketService : WebSocketService,
    private cdRef : ChangeDetectorRef){

  }

  ngOnChanges(changes : any){
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
        "interactionType": new FormControl(this.commonService.activeTab == ProjConstants.ASSIST ? 'assist' : 'mybot'),
        "positionId" : new FormControl(this.feedbackData.dialogPositionId),
        "taskId" : new FormControl(this.feedbackData.uuid),
        "taskName" : new FormControl(this.feedbackData.dialogName),
        "comment" : new FormControl(this.feedbackData.comment),
        "feedback" : new FormControl(this.feedbackData.feedback,[Validators.required]),
        "feedbackDetails" : new FormControl(this.feedbackData.feedbackDetails)
      }
    );
    
    if(this.commonService.isUpdateFeedBackDetailsFlag && this.feedbackData?.feedbackResponse){
      this.updateFeedbackForm(this.feedbackData?.feedbackResponse);
    }
    setTimeout(() => {
      this.subscribeValChanges();
    }, 100);
  }

  updateFeedbackForm(feedbackResponse){    
    (this.feedbackForm?.controls?.feedbackDetails).setValue(this.feedbackData.feedbackDetails);
    (this.feedbackForm?.controls?.comment).setValue(feedbackResponse.comment);
    this.cdRef.detectChanges();
  }


  addFeedback(feedBackFlag){
    this.feedbackData.feedback = feedBackFlag;
    this.feedbackData.arrowToggle = (feedBackFlag == this.feedbackConst.DISLIKE) ? true : false;
    (this.feedbackForm.controls.feedback).setValue(feedBackFlag);
    this.formTouched = false;
    this.commonService.isUpdateFeedBackDetailsFlag = false;
    this.callAgentFeedbackUsage(); 
  }

  dislikeFeedbackArrowToggle(){
    this.feedbackData.arrowToggle = !this.feedbackData.arrowToggle;
    if(this.feedbackData.arrowToggle){
      this.AgentAssist_feedBack_Update_Request();
      this.commonService.isUpdateFeedBackDetailsFlag = true;
    }
  }

  addDislikeSuggestion(suggestion){
    let suggestionIndex = this.feedbackData.feedbackDetails.indexOf(suggestion);
    if(suggestionIndex >= 0){
      this.feedbackData.feedbackDetails.splice(suggestionIndex, 1);
    }else{
      this.feedbackData.feedbackDetails.push(suggestion);
    }
    this.feedbackData = structuredClone(this.feedbackData);
    (this.feedbackForm.controls.feedbackDetails).setValue(this.feedbackData.feedbackDetails);
  }

  AgentAssist_feedBack_Update_Request() {
    if(this.commonService.isUpdateFeedBackDetailsFlag){
      let agent_assist_feedback_request = {
        conversationId: this.feedbackData.connectionDetails.conversationId,
        agentId: '',
        botId: this.feedbackData.connectionDetails.botId,
        orgId: '',
        taskId: this.feedbackData.uuid,
        positionId: this.feedbackData.dialogPositionId,
        'experience': (this.commonService.configObj.isCall && this.commonService.configObj.isCall == 'true') ? ProjConstants.VOICE : ProjConstants.CHAT,
        "interactionType": this.commonService.activeTab == ProjConstants.ASSIST ? 'assist' : 'mybot'
      }
      this.websocketService.emitEvents(EVENTS.agent_feedback_request, agent_assist_feedback_request);
    }
  }


  submitFeedback(){
    this.callAgentFeedbackUsage();
    this.feedbackData.arrowToggle = false;
    this.commonService.isUpdateFeedBackDetailsFlag = true;
    this.updateFeedbackProperties.emit(this.feedbackData);
  }

  callAgentFeedbackUsage(){
    this.websocketService.emitEvents(EVENTS.agent_usage_feedback, this.feedbackForm.value);
    this.formTouched = false;
  }

}
