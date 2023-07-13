import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators'
import { ImageFilePath, ImageFileNames, ProjConstants, IdReferenceConst, classNamesConst } from 'src/common/constants/proj.cnts';
import { EVENTS } from 'src/common/helper/events';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RemoveTagFromStringPipe } from 'src/common/pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from 'src/common/pipes/replace-text-with-tag.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-overlaysearch',
  templateUrl: './overlaysearch.component.html',
  styleUrls: ['./overlaysearch.component.scss']
})
export class OverlaysearchComponent implements OnInit {
  @Input() searchType: string;
  @Output() handleSearchClickEvent = new EventEmitter();
  @Output() closeSearchSuggestions = new EventEmitter();
  @Output() overlayScrollTop = new EventEmitter();
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
  answerPlaceableIDs : any = [];

  constructor(public handleSubjectService: HandleSubjectService, public commonService: CommonService,
    public randomUUIDPipe: RandomUUIDPipe, public websocketService: WebSocketService, public cdRef : ChangeDetectorRef,
    public removeTagFromString : RemoveTagFromStringPipe, public replaceTextWithTag : ReplaceTextWithTagPipe ) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.unsubscribe();
    this.searchResponse = {};
    this.websocketService.agentAssistAgentResponse$.next(null);
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.searchTextSubject.pipe(takeUntil(this.destroySubject)).subscribe((searchObj : any) => {
      this.showOverLay = false;
      this.searchResponse = {};
      if (searchObj && searchObj.value && searchObj.searchFrom == this.commonService.activeTab) {
        console.log('inisde overlay component,,,,,,,,,,,,,,,,,,,', searchObj)
        this.searchConentObject = Object.assign({}, searchObj);
        setTimeout(() => {
          this.emitSearchRequest(searchObj, true);
        }, 100);
      }
    });
    let subscription2 = this.websocketService.agentAssistAgentResponse$.pipe(
      finalize(()=> {
      }),
      takeUntil(this.destroySubject))
    .subscribe((agentResponse: any) => {
      if(agentResponse){
        this.handleSearchResponse(agentResponse);
        this.showOverLay = true;
        if(document.getElementById(IdReferenceConst.overLaySuggestions)){
          document.getElementById(IdReferenceConst.overLaySuggestions).classList.add(classNamesConst.DISPLAY_BLOCK)
        }
      }
    });
    let subscription3 = this.handleSubjectService.connectDetailsSubject.pipe(takeUntil(this.destroySubject)).subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
      }
    });
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
  }

  emitSearchRequest(searchObj, isSearchFlag, faqToggle = false) {
    this.handleSubjectService.setLoader(true);
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = searchObj.value;
    connectionDetails.isSearch = isSearchFlag;
    connectionDetails.positionId = searchObj?.positionId;
    if (this.connectionDetails?.interactiveLanguage && typeof this.connectionDetails?.interactiveLanguage == 'string' && this.connectionDetails?.interactiveLanguage != "''") {
      connectionDetails['language'] = this.connectionDetails?.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    if(!isSearchFlag && !faqToggle){
      connectionDetails.intentName = searchObj.value;
    }
    connectionDetails.childBotId = searchObj.childBotId;
    connectionDetails.childBotName = searchObj.childBotName;
    let agent_assist_agent_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
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
      this.searchResponse.dialogs.map(obj => {
        if (obj.name === dialoguename) {
          obj.agentRunButton = !obj.agentRunButton
          event.stopPropagation()
        }else{
          obj.agentRunButton = false;
        }
      })
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
    this.closeSearchSuggestions.emit(true);
    this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);

  }

  AgentAssist_agent_run_click(dialog){
    dialog.value = dialog.name;
    this.emitSearchRequest(dialog, false);
  }

  showAllResultsClick(clickType) {
    if (clickType == this.projConstants.VIEW_ALL_ARTICLES) {
      this.articleAllView = false;
      this.articleViewCount = this.searchResponse.articles.length
    } else if (clickType == this.projConstants.VIEW_FEW_ARTICLES) {
      this.articleAllView = true;
      this.articleViewCount = 2;
    }else if (clickType == this.projConstants.VIEW_ALL_SNIPPETS) {
      this.snippetAllView = false;
      this.snippetViewCount = this.searchResponse.snippets.length
    } else if (clickType == this.projConstants.VIEW_FEW_SNIPPETS) {
      this.snippetAllView = true;
      this.snippetViewCount = 2;
    }else if (clickType == this.projConstants.VIEW_ALL_FAQ) {
      this.faqAllView = false
      this.faqViewCount = this.searchResponse.faqs.length;
    } else if (clickType == this.projConstants.VIEW_FEW_FAQ) {
      this.faqAllView = true;
      this.faqViewCount = 2;
    }
    if(this.searchType == this.projConstants.AGENT_SEARCH){
      this.overlayScrollTop.emit(true);
    }
     setTimeout(() => {
        this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
        this.handleSeeMoreButton(this.searchResponse.articles, this.projConstants.ARTICLE);
        this.handleSeeMoreButton(this.searchResponse.snippets, this.projConstants.SNIPPET);
      }, 10);
  }

  handleShowAllClick() {
    this.handleSearchClickEvent.emit({ eventFrom: this.projConstants.AGENT_SEARCH, searchText: this.searchConentObject.value });
  }

  handleSearchResponse(response) {
    if (response && response.suggestions && this.answerPlaceableIDs.length == 0) {
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
    } else if (response && response.suggestions && this.answerPlaceableIDs.length > 0) {

      response.suggestions.faqs = this.commonService.formatFAQResponse(response.suggestions.faqs);
      let faqAnswerIdsPlace = this.answerPlaceableIDs.find(ele => ele.input == response.suggestions?.faqs[0].question);
      if (faqAnswerIdsPlace) {
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
        let index = this.answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
        this.answerPlaceableIDs.splice(index, 1);
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
      this.answerPlaceableIDs.push({input : faq.question});
      let searchObj : any = {};
      searchObj.value = faq.displayName;
      searchObj.question = faq.question;
      searchObj.searchFrom = this.commonService.activeTab;
      this.emitSearchRequest(searchObj, false, true);
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

  toggleViewFullFewButtons(view, type) {
    if (type == this.projConstants.FAQ) {
      this.faqViewCount = (view == this.projConstants.VIEW_ALL_FAQ) ? this.searchResponse.faqs.length : 2;
    } else {
      this.articleViewCount = (view == this.projConstants.VIEW_ALL_ARTICLES) ? this.searchResponse.articles.length : 2;
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

  // handleSeeMoreLessClickEventsForFaq(id, data){

  // }


}

