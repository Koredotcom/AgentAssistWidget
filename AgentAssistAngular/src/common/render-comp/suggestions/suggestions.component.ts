import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { classNamesConst, IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RemoveTagFromStringPipe } from 'src/common/pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from 'src/common/pipes/replace-text-with-tag.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { finalize, takeUntil } from 'rxjs/operators'
import { EVENTS } from 'src/common/helper/events';
import * as $ from 'jquery';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent implements OnInit, OnDestroy{

  @Input() suggestionResponse : any;
  private destroySubject: Subject<boolean> = new Subject();
  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  searchResponse: any = {};
  faqViewCount: number;
  articleViewCount: number;
  snippetViewCount: number;
  faqAllView: boolean = false;
  articleAllView: boolean = false;
  snippetAllView: boolean = false;
  searchResultText: string;
  searchConentObject: any;
  showOverLay : boolean = false;
  connectionDetails : any = {};

  constructor(public handleSubjectService: HandleSubjectService, public commonService: CommonService,
    public randomUUIDPipe: RandomUUIDPipe, public websocketService: WebSocketService, public cdRef : ChangeDetectorRef,
    public removeTagFromString : RemoveTagFromStringPipe, public replaceTextWithTag : ReplaceTextWithTagPipe ) { }

  ngOnInit(): void {
    console.log("inside ng onit suggestions", this.suggestionResponse);
    
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.unsubscribe();
    this.searchResponse = {};   
    // this.websocketService.agentAssistAgentResponse$.next(null); 
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.connectDetailsSubject.pipe(takeUntil(this.destroySubject)).subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
      }
    });

    let subscription2 = this.handleSubjectService.faqAmbiguitySubject$.pipe(takeUntil(this.destroySubject)).subscribe((response : any) => {
      if(response){
        console.log(response, "response");
        
        this.handleSearchResponse(response);
      }
    });
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.updateResponse();
  }

  updateResponse(){
    if(this.suggestionResponse.data){
      this.handleSearchResponse(this.suggestionResponse.data);
    }
  }

  emitSearchRequest(searchObj, assistTab, faqToggle = false) {
    // this.handleSubjectService.setLoader(true);
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = searchObj.value;
    connectionDetails.positionId = searchObj?.positionId;
    if(!faqToggle){
      connectionDetails.intentName = searchObj.value;
      connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
    }
    connectionDetails.childBotId = searchObj.childBotId;
    connectionDetails.childBotName = searchObj.childBotName;
    let requestName : string;
    let agent_assist_request_params : any = {};
    if(assistTab){
      agent_assist_request_params = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
      requestName =  EVENTS.agent_assist_request;
    }else{
      agent_assist_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
      requestName =  EVENTS.agent_assist_agent_request;
    }
    this.websocketService.emitEvents(requestName, agent_assist_request_params);
  }


  AgentAssist_run_click(dialog, dialogPositionId, intent?) {
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = dialog.intentName;
    if (dialog.intentName && intent) {
      connectionDetails.intentName = dialog.intentName;
    }
    connectionDetails.positionId = dialogPositionId;
    connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
    connectionDetails.childBotId = dialog.childBotId;
    connectionDetails.childBotName = dialog.childBotName;
    let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
  }


  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    // hide Run with agent button on clicking outside of document.
    if (this.searchResponse?.dialogs && this.searchResponse?.dialogs.length > 0) {
      // this.searchResponse.dialogs.map(obj => {
      //   obj.agentRunButton = !obj.agentRunButton
      // })
      event.stopPropagation();
    }
  }

  handleRunAgent(dialoguename, event) {
    if (this.searchResponse?.dialogs && this.searchResponse?.dialogs.length > 0) {
      this.searchResponse.dialogs.forEach((obj)=>{
        if (obj.name === dialoguename) {
          obj.agentRunButton = !obj.agentRunButton
          event.stopPropagation()
        }else{
          obj.agentRunButton = false;
        }
      });
      this.searchResponse = {...this.searchResponse}  ;
    }
  }

  dialogueRunClick(dialog, searchType) {
    dialog.positionId = this.randomUUIDPipe.transform(IdReferenceConst.positionId);
    dialog.intentName = dialog.name;
    let runDialogueObject = Object.assign({}, this.searchConentObject);
    Object.assign(runDialogueObject, dialog);    
    if (searchType == this.projConstants.ASSIST) {
      this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
    } else {
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
      this.AgentAssist_agent_run_click(dialog);
    }
    this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
    
  }

  AgentAssist_agent_run_click(dialog){
    dialog.value = dialog.name;
    this.emitSearchRequest(dialog, false);
  }

  handleSearchResponse(response) {
    console.log(response, "response inside handle search response");
    if (response && response.suggestions && this.commonService.suggestionsAnswerPlaceableIDs.length == 0) {
      this.searchResponse = {};
      // response.suggestions.faqs = [
      //   {question : "How does COVID -19 spread?", answer : ["Covid spreads through tiny virus particles that get inside the body. The most common way for covid to enter the body is by being breathed in from infected air. This can happen when people stand close togethe When a person breaths out, it’s not just air that leaves their nose or mouth. Tiny water droplets are also breathed out, and these can be infected with viruses like colds or covid. These water droplets can be breathed in by other people, or if they land on a surface that someone touches later, that person could catch coronavirus."]},
      //   {question : "Reset Password" , answer : ['to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click off', 'to change password on reset reset to reset password click on reset to reset password click on reset to reset password click on reset to reset password click on reset', 'to reset password click on reset', 'to change password click on reset']}
      // ]
      this.searchResponse = this.commonService.formatSearchResponse(response);
      this.searchResponse.totalSearchResults =  (this.searchResponse.dialogs?.length + this.searchResponse.faqs?.length + this.searchResponse?.articles?.length +this.searchResponse?.snippets?.length || 0);
      this.faqViewCount = (this.searchResponse.faqs && this.searchResponse.faqs.length <= 2) ? this.searchResponse.faqs.length : 2;
      this.articleViewCount = (this.searchResponse.articles && this.searchResponse.articles.length <= 2) ? this.searchResponse.articles.length : 2;
      this.snippetViewCount = (this.searchResponse.snippets && this.searchResponse.snippets.length <= 2) ? this.searchResponse.snippets.length : 2;
      this.faqAllView = this.searchResponse.faqs && this.searchResponse.faqs.length > 2 ? true : false;
      this.articleAllView = this.searchResponse.articles && this.searchResponse.articles.length > 2 ? true : false;
      this.snippetAllView = this.searchResponse.snippets && this.searchResponse.snippets.length > 2 ? true : false;
      this.searchResultText = this.searchResponse.totalSearchResults == 1 ? "Search result for" : "Search results for";
      setTimeout(() => {
        this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
        this.handleSeeMoreButton(this.searchResponse.articles, this.projConstants.ARTICLE);
        this.handleSeeMoreButton(this.searchResponse.snippets, this.projConstants.SNIPPET);
      }, 1000);
      this.checkFaqAnswerNotRenderCountAndRequest()
    } else if (response && response.suggestions && this.commonService.suggestionsAnswerPlaceableIDs.length > 0) {
      
      response.suggestions.faqs = this.commonService.formatFAQResponse(response.suggestions.faqs);
      let faqAnswerIdsPlace = this.commonService.suggestionsAnswerPlaceableIDs.find(ele => ele.input == response.suggestions?.faqs[0].question);
      if (faqAnswerIdsPlace) {
        console.log(faqAnswerIdsPlace, "faq answer id place");
        
        let accumulator = response.suggestions.faqs.reduce((acc, faq) => {
          if (faq.question == faqAnswerIdsPlace.input) {
            acc[faq.question] = faq;
            return acc;
          }
        }, {});
        this.searchResponse.faqs.forEach(faq => {
          if (accumulator[faq.question] && accumulator[faq.question].answer) {
            faq.answer = accumulator[faq.question].answer;
          }
        });
        console.log(this.searchResponse, "end of search response");
        let index = this.commonService.suggestionsAnswerPlaceableIDs.indexOf(faqAnswerIdsPlace);
        this.commonService.suggestionsAnswerPlaceableIDs.splice(index, 1);
        setTimeout(() => {
          this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
        }, 1000);
      }
    }
  }

  checkFaqAnswerNotRenderCountAndRequest(){
    let answerNotRenderendElements = (this.searchResponse.faqs || []).filter(faq => {
      return !faq.answer;
    });    
    if(answerNotRenderendElements.length == 1){
      this.getFaqAnswerAndtoggle(answerNotRenderendElements[0]);
    }
  }

  getFaqAnswerAndtoggle(faq){
    faq.toggle = !faq.toggle;
    faq.seeMoreWrapper = false;
    if(!faq.answer && faq.toggle){
      this.commonService.suggestionsAnswerPlaceableIDs.push({input : faq.question});
      let searchObj : any = {};
      searchObj.value = faq.displayName;
      searchObj.question = faq.question;
      searchObj.searchFrom = this.commonService.activeTab;
      this.emitSearchRequest(searchObj, true, true);
    }
    setTimeout(() => {
      this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
    }, 10);
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType) {
    let message = {};
    if (actionType == this.projConstants.SEND) {
      message = {
        method: 'send',
        name: "agentAssist.SendMessage",
        conversationId: this.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: "agentAssist.CopyMessage",
        conversationId: this.connectionDetails.conversationId,
        payload: selectType == this.projConstants.FAQ ? (faq_or_article_obj.answer || faq_or_article_obj.ans) : faq_or_article_obj.content
      };
      parent.postMessage(message, '*');
    }
  }

  handleSeeMoreButton(array, type) {
    if(array && array.length > 0){
      let index = 0;
      for (let item of array) {
        this.commonService.updateSeeMoreButtonForAgent(index, item, type, (type == this.projConstants.FAQ) ? item.answer : []);
        index++;
      }
    }
  }


  toggleShowMoreLessButtons(faq_or_article_obj, index, type) {
    let titleElement = document.getElementById("titleLib-" + index);
    let descElement = document.getElementById("descLib-" + index);

    if (type == this.projConstants.ARTICLE) {
      titleElement = document.getElementById("articletitleLib-" + index);
      descElement = document.getElementById("articledescLib-" + index);
    }
    if (type == this.projConstants.SNIPPET) {
      titleElement = document.getElementById("snippettitleLib-" + index);
      descElement = document.getElementById("snippetdescLib-" + index);
    }
    faq_or_article_obj.showLessButton = !faq_or_article_obj.showLessButton;
    faq_or_article_obj.showMoreButton = !faq_or_article_obj.showMoreButton;
    if (faq_or_article_obj.showLessButton) {
      if(titleElement) titleElement.classList.add('no-text-truncate');
      if(descElement) descElement.classList.add('no-text-truncate');
      if(type == this.projConstants.FAQ && faq_or_article_obj.answer.length > 1){
        faq_or_article_obj.seeMoreWrapper = true;
        setTimeout(() => {
          this.updateSeeMoreButtonForFAQAgent(index.toString(), faq_or_article_obj.answer);
        }, 100);
      }
    }

    if (faq_or_article_obj.showMoreButton) {
      if(titleElement) titleElement.classList.remove('no-text-truncate');
      if(descElement) descElement.classList.remove('no-text-truncate');
      if(type == this.projConstants.FAQ){
        faq_or_article_obj.seeMoreWrapper = false;
      }
    }
  }

  toggleShowMoreLessButtonsForFaq(faq_ans_obj, parentIndex, index){
    parentIndex = parentIndex.toString();
    let titleElement = document.getElementById("titleLib-" + parentIndex);
    let descElement = document.getElementById("desc-faq-lib-" + parentIndex + index);    

    faq_ans_obj.showLessButton = !faq_ans_obj.showLessButton;
    faq_ans_obj.showMoreButton = !faq_ans_obj.showMoreButton;

    if (faq_ans_obj.showLessButton) {
      if(titleElement) titleElement.classList.add('no-text-truncate');
      if(descElement) $(descElement).css({"display" : "block"});
      faq_ans_obj.seeMoreWrapper = true;
    }

    if (faq_ans_obj.showMoreButton) {
      if(titleElement) titleElement.classList.remove('no-text-truncate');
      if(descElement) $(descElement).css({"display" : "-webkit-box"});
      faq_ans_obj.seeMoreWrapper = false;
    }
  }

  updateSeeMoreButtonForFAQAgent(actualId, answerArray){
    let index = 0;
    for(let ans of answerArray){  
        let id = actualId + index;
        let faqSourceTypePixel = 5;
        let descElement =  $("#desc-faq-lib-" + id);
        $(descElement).css({"display" : "block"});
        if(descElement){
            let divSectionHeight = $(descElement).css("height")  || '0px';
            divSectionHeight = parseInt(divSectionHeight?.slice(0,divSectionHeight.length-2));
            if (divSectionHeight > (24 + faqSourceTypePixel)) {
              ans.showLessButton = ans.showLessButton ? ans.showLessButton : false;
              ans.showMoreButton = ans.showLessButton ? false : true;
            } else {
              ans.showLessButton = false;
              ans.showMoreButton = false;
            }
            $(descElement).css({"display" : "-webkit-box"});
        }
        index++;
        let dataObj : any = {
          answer : [ans],
          type : this.projConstants.FAQ
        }
        // this.handleSeeMoreLessClickEventsForFaq(id, dataObj)
    }
  }

}