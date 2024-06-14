import { KeyValue } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EVENTS } from 'src/app/helpers/events';
import { FeebackConst, ProjConstants, storageConst } from 'src/app/proj.const';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements AfterViewInit, AfterViewChecked{
  @Input() feedbackData : any = {};
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArray : number;
  @Input() feedbackType : string;
  @Output() updateFeedbackProperties = new EventEmitter();

  feedbackForm : FormGroup;
  feedbackConst : any = FeebackConst;
  feedbackComment : string;
  formTouched : boolean = false;
  dislikeList : any = [];
  showComments : boolean = false;

  constructor(private rootService : RootService,
    private websocketService : WebSocketService,
    private cdRef : ChangeDetectorRef,
    private translate : TranslateService,
    private localStorageService : LocalStorageService){

  }

  ngAfterViewInit(): void {
    this.createForm();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  subscribeValChanges(){
    this.feedbackForm?.valueChanges.subscribe((_change)=>{      
      this.formTouched = true;
    })
  }

  createForm(){ 
    // let appState = this.localStorageService.getLocalStorageState();   
    // let language = appState[this.feedbackData.connectionDetails.conversationId][storageConst.LANGUAGE];    
    let language = this.rootService.connectionDetails?.interactiveLanguage || 'en';
    language = (FeebackConst.DEFAULT_FEEDBACK_LANGUAGE_LIST.indexOf(language.toLowerCase()) != -1) ? language.toLowerCase() : 'en';
    
    let suggestionList = (this.rootService.settingsData?.feedback[this.feedbackType]?.negativeKeyWords[language]) ? 
    this.rootService.settingsData?.feedback[this.feedbackType]?.negativeKeyWords[language] : this.rootService.defaultFeedbackSettings[this.feedbackType]?.negativeKeyWords[language];
    suggestionList?.forEach(element => {
      if(element.isEnabled){
        this.dislikeList.push(element.key);
      }
    });
    this.showComments = this.rootService.settingsData?.feedback[this.feedbackType]?.acceptComment;
    if(this.feedbackData.suggestionType){
      this.feedbackForm = new FormGroup(
        {
          "botId": new FormControl(this.feedbackData.connectionDetails.botId),
          "conversationId" : new FormControl(this.feedbackData.connectionDetails.conversationId),
          "event" : new FormControl(EVENTS.agent_usage_feedback),
          "interactionType": new FormControl(this.feedbackData.interactionType),
          "positionId" : new FormControl(this.feedbackData.positionId),
          "experience" : new FormControl(this.feedbackData.connectionDetails?.channel),
          "sourceMsgId" : new FormControl(this.feedbackData.sourceMsgId),
          "type" : new FormControl(this.feedbackData.suggestionType),
          "comment" : new FormControl(this.feedbackData.comment),
          "feedback" : new FormControl(this.feedbackData.feedback,[Validators.required]),
          "feedbackDetails" : new FormControl(this.feedbackData.feedbackDetails),
          "query" : new FormControl(this.feedbackData.query),
          "subType" : new FormControl(this.feedbackData.subType)
        }
      );

      if (this.feedbackData.suggestionType == 'answer') {
        (this.feedbackForm as FormGroup)?.addControl('title', new FormControl(this.feedbackData.title));
        (this.feedbackForm as FormGroup)?.addControl('answer', new FormControl(this.feedbackData.answer));
        (this.feedbackForm as FormGroup)?.addControl('sources', new FormControl(this.feedbackData.sources));
        (this.feedbackForm as FormGroup)?.addControl('isFromGeneratedSummary', new FormControl(this.feedbackData.isFromGeneratedSummary));
        (this.feedbackForm as FormGroup)?.addControl('answerType', new FormControl(this.feedbackData.answerType));
      }else if(this.feedbackData.suggestionType == 'faqs'){
        (this.feedbackForm as FormGroup)?.addControl('title', new FormControl(this.feedbackData.title));
        (this.feedbackForm as FormGroup)?.addControl('answer', new FormControl(this.feedbackData.answer));
      }else if(this.feedbackData.suggestionType == 'article' || this.feedbackData.suggestionType == 'file'){
        (this.feedbackForm as FormGroup)?.addControl('title', new FormControl(this.feedbackData.title));
        (this.feedbackForm as FormGroup)?.addControl('answer', new FormControl(this.feedbackData.answer));
      }

    } else{
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
          "feedbackDetails" : new FormControl(this.feedbackData.feedbackDetails),
          "type": new FormControl('dialog')
        }
      );
    }  
    
    if(this.rootService.isUpdateFeedBackDetailsFlag && this.feedbackData?.feedbackResponse){
      this.updateFeedbackForm(this.feedbackData);
    }
    if(this.feedbackData?.feedback){
      this.feedbackData.oldFeedback = true;
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
    this.feedbackData.arrowToggle = (feedBackFlag == this.feedbackConst.DISLIKE) ? true : false;
    if(this.feedbackData?.feedback != feedBackFlag){
      this.feedbackData.feedback = feedBackFlag;
      (this.feedbackForm.controls?.['feedback']).setValue(feedBackFlag);
      this.formTouched = false;
      this.callAgentFeedbackUsage(); 
      this.feedbackData.oldFeedback = (feedBackFlag == this.feedbackConst.LIKE) ? true : false;
      if(feedBackFlag == this.feedbackConst.DISLIKE && this.dislikeList.length == 0 && !this.showComments){
        this.rootService.isUpdateFeedBackDetailsFlag = true;
      }else{
        this.rootService.isUpdateFeedBackDetailsFlag = false;
      }
    }  
  }

  dislikeFeedbackArrowToggle(){
    this.feedbackData.arrowToggle = !this.feedbackData.arrowToggle;
  }

  addDislikeSuggestion(suggestion){
    this.formTouched = true;
    let suggestionIndex = this.feedbackData.feedbackDetails.indexOf(suggestion);
    if(suggestionIndex >= 0){
      this.feedbackData.feedbackDetails.splice(suggestionIndex, 1);
    }
    else{
      this.feedbackData.feedbackDetails.push(suggestion);
    }
    this.feedbackData.oldFeedback =  false;
    this.feedbackData.comment = this.feedbackForm.get('comment').value;
    this.updateFeedbackForm(this.feedbackData);
    // this.feedbackData = structuredClone(this.feedbackData);
    // this.submitFeedback();
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
        'experience': this.rootService.connectionDetails?.channel,
        "interactionType": this.rootService.activeTab == ProjConstants.ASSIST ? 'assist' : 'mybot',
        "sourceMsgId" : this.feedbackData.sourceMsgId || ''
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
      this.feedbackData.oldFeedback = true;
    }
  }

  callAgentFeedbackUsage(){
    if(this.feedbackForm.value){
      let feedbackFormObj = JSON.parse(JSON.stringify(this.feedbackForm.value));
      feedbackFormObj.sourceMsgId = this.feedbackData.sourceMsgId || '';
      this.websocketService.emitEvents(EVENTS.agent_usage_feedback, feedbackFormObj);
      this.formTouched = false;
    }
  }

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
}
