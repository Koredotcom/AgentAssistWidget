import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-faq-suggestions',
  templateUrl: './faq-suggestions.component.html',
  styleUrls: ['./faq-suggestions.component.scss']
})
export class FaqSuggestionsComponent implements OnInit, OnDestroy{

  @Input() agentassistArrayIndex : number;
  @Output() faqAnswerToggle = new EventEmitter();
  @Input() searchResponse : any;
  @Input() from : string;

  @ViewChild('faqcontent',{static: false}) private faqcontent : ElementRef;

  subs = new SubSink();
  projConstants: any = ProjConstants;
  searchedFAQList : any[] = [];
  viewCount = 2;
  moreClick = false;
  hideActionButtons : boolean = false;
  hideSendButton : boolean = false;
  hideCopyButton : boolean = false;

  constructor(private handleSubjectService : HandleSubjectService, public rootService : RootService,
    private websocketService : WebSocketService, private commonService : CommonService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnChanges(changes: SimpleChange){
    if(changes['searchResponse']?.currentValue){
      this.handleResponse();
    }
  }

  subscribeEvents(){
    this.handleSubjectService.faqsearchResponse$.subscribe((response)=> {
      if(response && Object.keys(response)?.length > 0 && this.from == ProjConstants.ASSIST){
        this.searchResponse = response;
        this.handleResponse();
      }
    })
  }

  handleResponse(){
    this.handleSearchResponse(this.searchResponse);
    this.hideSendAndCopy();
  }

  hideSendAndCopy(){
    // Both send and copy
    this.hideActionButtons = (this.rootService.connectionDetails.isCallConversation) ? true : false;

    //send Button
    if(this.rootService.settingsData?.isAgentResponseEnabled === false){
      this.hideSendButton = true;
    }

    if(this.rootService.settingsData?.isAgentResponseCopyEnabled === false){
      this.hideCopyButton = true;
    }

    if(this.hideSendButton && this.hideCopyButton){
      this.hideActionButtons = true;
    }
  }
  
  handleSearchResponse(searchResponse){
    this.searchedFAQList = [];
    if(searchResponse && searchResponse.faqs){
      this.searchedFAQList = searchResponse.faqs;
      this.viewLessClick();
    }
  }

  handleSendCopyButton(actionType, faq, selectType, sourceMsgId){   
    faq.send = actionType === this.projConstants.SEND ? 'send' : 'copied';
    faq.sourceMsgId = sourceMsgId;
    let format = this.rootService?.settingsData?.agentActions?.sharingFormat ? this.rootService?.settingsData?.agentActions?.sharingFormat : 'plainString';
    faq.sendContent = (format == 'plainString') ? this.rootService.extractTextFromElement(this.faqcontent.nativeElement) : (faq.answer || faq.ans);    
    this.commonService.handleSendCopyButton(actionType, faq, selectType)
  }

  getFaqAnswerAndtoggle(faq){
    faq.toggle = !faq.toggle;
    faq.seeMoreWrapper = false;
    if(!faq.answer){
      faq.showSpinner = true;
      this.faqAnswerToggle.emit(faq);
    }
    // if(!faq.answer && faq.toggle){
    //   this.rootService.suggestionsAnswerPlaceableIDs.push({input : faq.question, assistSuggestion : this.agentassistArrayIndex});
    //   let searchObj : any = {};
    //   searchObj.value = faq.displayName;
    //   searchObj.question = faq.question;
    //   searchObj.searchFrom = this.rootService.activeTab;
    //   this.emitSearchRequest(searchObj, false, true);
    // }
  }

  emitSearchRequest(searchObj, isSearchFlag, faqToggle = false) {
    let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
    connectionDetails.value = searchObj.value;
    connectionDetails.isSearch = isSearchFlag;
    connectionDetails.positionId = searchObj?.positionId;
    if (connectionDetails?.interactiveLanguage && typeof connectionDetails?.interactiveLanguage == 'string' && connectionDetails?.interactiveLanguage != "''") {
      connectionDetails['language'] = connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    if(!isSearchFlag && !faqToggle){
      connectionDetails.intentName = searchObj.value;
    }
    connectionDetails.childBotId = searchObj.childBotId;
    connectionDetails.childBotName = searchObj.childBotName;
    let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
  }

  toggleShowMoreLess(faq){
    faq.showMoreButton = !faq.showMoreButton;
  }

  toggleExpandAndClose(faq){
    if(faq.answer.length > 1){
      faq.seeMoreWrapper = !faq.seeMoreWrapper;
    }
    faq.answerCount = faq.seeMoreWrapper ? faq.answer.length : 1;
  }

  viewMoreClick(){
    this.moreClick = true;
    this.viewCount = this.searchedFAQList?.length;
  }

  viewLessClick(){
    this.moreClick = false;
    this.viewCount = (this.searchedFAQList && this.searchedFAQList?.length <= 2) ? this.searchedFAQList?.length : 2;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
