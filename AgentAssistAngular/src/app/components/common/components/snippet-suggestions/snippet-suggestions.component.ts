import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, SimpleChange, ViewChild } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { FeebackConst, ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-snippet-suggestions',
  templateUrl: './snippet-suggestions.component.html',
  styleUrls: ['./snippet-suggestions.component.scss']
})
export class SnippetSuggestionsComponent implements OnInit, OnDestroy, AfterViewInit{

  @Input() searchResponse : any;
  @ViewChild('snippetContent',{static: false}) private snippetContent : ElementRef;
  @ViewChild('snippetContent1',{static: false}) private snippetContent1 : ElementRef;

  feedbackConst : any = FeebackConst;

  prevClass = '';
  subs = new SubSink();
  projConstants: any = ProjConstants;
  searchedSnippetList : any[] = [];
  viewCount = 2;
  moreClick = false;
  hideActionButtons : boolean = false;
  hideSendButton : boolean = false;
  hideCopyButton : boolean = false;
  internalInfo = [];
  moreClickInt = false;
  viewCountInt = 2;
  // sourceInx = null;
  extMore = true;
  intMore = true;

  constructor(
    private handleSubjectService : HandleSubjectService,
    public rootService : RootService, 
    private commonService : CommonService,
    private websocketService : WebSocketService,
    private renderer: Renderer2
  ){}

  ngAfterViewInit(): void {
    this.addClickListenerToAnchors();
  }

  ngOnInit(){}

  ngOnChanges(changes : SimpleChange){
    if(changes['searchResponse']?.currentValue){
      this.extMore = true;
      this.intMore = true;
      this.handleSearchResponse(this.searchResponse);
      this.hideSendAndCopy();
    }
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
    this.searchedSnippetList = [];
    if (searchResponse && searchResponse.snippets) {
      this.searchedSnippetList = searchResponse.snippets;
      // this.internalInfo = this.searchedSnippetList.filter(item => item.internalFlag);
      // this.searchedSnippetList = this.searchedSnippetList.filter(item => !item.internalFlag);
      this.viewLessClick();
    }
  }


  handleSendCopyButton(actionType, snippetObj, selectType){
    let format = this.rootService?.settingsData?.agentActions?.sharingFormat ? this.rootService?.settingsData?.agentActions?.sharingFormat : 'plainString';
    snippetObj.sendContent = (format == 'plainString') ? this.rootService.extractTextFromElement(this.snippetContent.nativeElement) : (snippetObj.sendCopyText);
    snippetObj.send = actionType === this.projConstants.SEND ? 'send' : 'copied';
    let snippet = JSON.parse(JSON.stringify(snippetObj));
    snippet.content = snippetObj?.sendCopyText;
    this.commonService.handleSendCopyButton(actionType, snippet, selectType)
  }

  toggleShowMoreLess(snippet){
    snippet.showMoreButton = !snippet.showMoreButton;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  viewMoreClick(){
    this.moreClick = true;
    this.viewCount = this.searchedSnippetList?.length;
  }

  viewLessClick(){
    this.moreClick = false;
    this.viewCount = (this.searchedSnippetList && this.searchedSnippetList?.length <= 2) ? this.searchedSnippetList?.length : 2;
  }

  viewMoreClickInt(){
    this.moreClickInt = true;
    this.viewCountInt = this.internalInfo?.length;
  }

  viewLessClickInt(){
    this.moreClickInt = false;
    this.viewCountInt = (this.internalInfo && this.internalInfo?.length <= 2) ? this.internalInfo?.length : 2;
  }

  openurlInBrowser(url, snippet){
    this.rootService.openurlInBrowser(url);
    this.handleUrlClickEvent(url, snippet);
  }

  hoverOnSource(sourceInx, type, i){
    if(this.prevClass){
      document.querySelectorAll(this.prevClass)?.forEach(el => el?.classList?.remove('selection-on-snippet-color'));
    }
    this.prevClass = '.fragment-ext-' + sourceInx;
    document.querySelectorAll(this.prevClass)?.forEach(el => el?.classList?.add('selection-on-snippet-color'));
  }

  mouseLeave(){
    if(this.prevClass){
      document.querySelectorAll(this.prevClass)?.forEach(el => el?.classList?.remove('selection-on-snippet-color'));
    }
  }

  snippetFeedback(feedback, snippet){
    snippet.feedback = feedback ? 'like' : 'dislike';
    this.AgentAssist_feedBack_Update_Request(snippet);
  }

  AgentAssist_feedBack_Update_Request(snippet) {
    let agent_assist_feedback_request = {
      feedback : snippet.feedback,
      conversationId: this.rootService.connectionDetails.conversationId,
      agentId: '',
      botId: this.rootService.connectionDetails.botId,
      orgId: '',
      interactionType : snippet.intType,
      positionId: snippet.positionId,
      experience: this.rootService.connectionDetails?.channel,
      sourceMsgId: snippet.sourceMsgId || '',
      type: "answer",
      title: snippet.title,
      answer: snippet.sendCopyText || '',
      sources: snippet.sources,
      isFromGeneratedSummary: snippet.isFromGeneratedSummary, // based on the flag passed from backend
      answerType: snippet.templateType, // citation_snippet or paragraph_snippet etc
      query : snippet.userInput
    }
    if(snippet.internalInfo?.length > 0){
      agent_assist_feedback_request.answer += snippet.internalInfo.join(' ');
    }
    this.rootService.isUpdateFeedBackDetailsFlag = true;
    this.websocketService.emitEvents(EVENTS.agent_usage_feedback, agent_assist_feedback_request);
  }

  handleMoreClickEvent(isInternal,snippet){
    let socketRequestParams : any = this.commonRequestParams(snippet);
    socketRequestParams.eventType= "showmore_clicked";
    socketRequestParams.isInternal = isInternal;
    this.websocketService.emitEvents(EVENTS.agent_activity_request, socketRequestParams);
  }

  handleUrlClickEvent(url, snippet){
    let socketRequestParams : any = this.commonRequestParams(snippet);
    socketRequestParams.eventType= "url_clicked";
    socketRequestParams.url = url;
    this.websocketService.emitEvents(EVENTS.agent_activity_request, socketRequestParams);
  }

  commonRequestParams(snippet){
    const { botId, conversationId, channel } = this.rootService.getConnectionDetails();
    let socketRequestParams = {
      botId: botId,
      conversationId: conversationId,
      event: "clicked",
      sourceMsgId: snippet.sourceMsgId,
      dataSource: "snippet",
      positionId : snippet.positionId,
      participant : this.rootService?.internalTransferData?.participant || {}
    }
    return socketRequestParams;
  }
  
  updateFeedbackProperties(data, snipObje) {
    snipObje.feedbackData = data;
  }

  addClickListenerToAnchors(){
    const anchorElements = this.snippetContent?.nativeElement.getElementsByTagName('a');
    if(anchorElements){
      for (let anchor of anchorElements) {
        this.renderer.listen(anchor, 'click', (event) => {
          event.preventDefault(); 
          this.handleAnchorClick(event);
        });
      };
    }


    const anchorElementsInmternal = this.snippetContent1?.nativeElement.getElementsByTagName('a');
    if(anchorElementsInmternal){
      for (let anchor of anchorElementsInmternal) {
        this.renderer.listen(anchor, 'click', (event) => {
          event.preventDefault(); 
          this.handleAnchorClick(event, true);
        });
      }
    }
  }

  handleAnchorClick(event, isInternal = false){
    let socketRequestParams : any = this.commonRequestParams(this.searchResponse.snippets[0]);
    socketRequestParams.eventType= "url_clicked";
    socketRequestParams.url = event?.srcElement?.href;
    socketRequestParams.isEmbedded = true;
    socketRequestParams.isInternal = isInternal;
    this.websocketService.emitEvents(EVENTS.agent_activity_request, socketRequestParams);
  }

}
