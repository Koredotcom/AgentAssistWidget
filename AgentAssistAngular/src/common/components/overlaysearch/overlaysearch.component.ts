import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageFilePath, ImageFileNames, ProjConstants, IdReferenceConst, classNamesConst } from 'src/common/constants/proj.cnts';
import { EVENTS } from 'src/common/helper/events';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

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
  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  searchResponse: any = {};
  faqViewCount: number;
  articleViewCount: number;
  faqAllView: boolean = false;
  articleAllView: boolean = false;
  searchResultText: string;
  searchConentObject: any;
  showOverLay : boolean = false;
  connectionDetails : any = {};

  constructor(public handleSubjectService: HandleSubjectService, public commonService: CommonService,
    public randomUUIDPipe: RandomUUIDPipe, public websocketService: WebSocketService, public cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.searchTextSubject.subscribe((searchObj : any) => {
      this.showOverLay = false;
      this.searchResponse = {};
      this.handleSubjectService.setLoader(true);
      console.log('inisde overlay component,,,,,,,,,,,,,,,,,,,')
      if (searchObj && searchObj.value) {
        this.searchConentObject = Object.assign({}, searchObj);
        setTimeout(() => {
          this.emitSearchRequest(searchObj, true);
        }, 100);
        console.log(this.showOverLay, "show overlya sub1"); 
      }
      this.handleSubjectService.setLoader(false);
    });
    let subscription2 = this.websocketService.agentAssistAgentResponse$.subscribe((agentResponse: any) => {
      if(agentResponse){
        console.log(agentResponse, "agent Response");
        this.handleSearchResponse(agentResponse);
        this.showOverLay = true;
        console.log(this.showOverLay, "show overlya sub2");

        if(document.getElementById(IdReferenceConst.overLaySuggestions)){
          document.getElementById(IdReferenceConst.overLaySuggestions).classList.add(classNamesConst.DISPLAY_BLOCK)
        }
      }
    });
    let subscription3 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
        console.log("connection details, 'inside assist tab");

      }
    });
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
  }

  emitSearchRequest(searchObj, isSearchFlag) {
    console.log("inside emit overlay request", searchObj, this.connectionDetails);
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = searchObj.value;
    connectionDetails.isSearch = isSearchFlag;
    connectionDetails.positionId = searchObj?.positionId;
    if(!isSearchFlag){
      connectionDetails.intentName = searchObj.value;
    }
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
    console.log(runDialogueObject, "runDialogueObject inside overlaysearch");
    
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
    } else if (clickType == this.projConstants.VIEW_ALL_FAQ) {
      this.faqAllView = false
      this.faqViewCount = this.searchResponse.faqs.length;
    } else if (clickType == this.projConstants.VIEW_FEW_FAQ) {
      this.faqAllView = true;
      this.faqViewCount = 2;
    }
    if(this.searchType = this.projConstants.AGENT_SEARCH){
      this.overlayScrollTop.emit(true);
    }
    setTimeout(() => {
      this.commonService.updateSeeMoreForArticles();
  }, 10);
  }

  handleShowAllClick() {
    this.handleSearchClickEvent.emit({ eventFrom: this.projConstants.AGENT_SEARCH, searchText: this.searchConentObject.value });
  }

  handleSearchResponse(response) {
    this.searchResponse = {};
    if (response && response.suggestions) {
      this.searchResponse = this.commonService.formatSearchResponse(response.suggestions);
      this.searchResponse.totalSearchResults = this.searchResponse.dialogs?.length + this.searchResponse.faqs?.length + this.searchResponse.articles?.length;
      this.faqViewCount = (this.searchResponse.faqs && this.searchResponse.faqs.length <= 2) ? this.searchResponse.faqs.length : 2;
      this.articleViewCount = (this.searchResponse.articles && this.searchResponse.articles.length <= 2) ? this.searchResponse.articles.length : 2;
      this.faqAllView = this.searchResponse.faqs && this.searchResponse.faqs.length > 2 ? true : false;
      this.articleAllView = this.searchResponse.articles && this.searchResponse.articles.length > 2 ? true : false;
      this.searchResultText = this.searchResponse.totalSearchResults == 1 ? "Search result for" : "Search results for";
      console.log(this.searchResponse, "search response");
      
      setTimeout(() => {
        this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
        this.handleSeeMoreButton(this.searchResponse.articles, this.projConstants.ARTICLE);
      }, 10);
    }
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType) {
    let message = {};
    if (actionType == this.projConstants.SEND) {
      message = {
        method: 'send',
        name: "agentAssist.SendMessage",
        // conversationId: _conversationId,
        payload: selectType == this.projConstants.FAQ ? faq_or_article_obj.answer : faq_or_article_obj.content
      };
      window.parent.postMessage(message, '*');
    } else {
      message = {
        method: 'copy',
        name: "agentAssist.CopyMessage",
        // conversationId: _conversationId,
        payload: selectType == this.projConstants.FAQ ? faq_or_article_obj.answer : faq_or_article_obj.content
      };
      parent.postMessage(message, '*');
    }
  }

  handleSeeMoreButton(array, type) {
    let index = 0;
    for (let item of array) {
      this.updateSeeMoreButtonForAgent(index, item, type);
      index++;
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
    faq_or_article_obj.showLessButton = !faq_or_article_obj.showLessButton;
    faq_or_article_obj.showMoreButton = !faq_or_article_obj.showMoreButton;
    if (faq_or_article_obj.showLessButton) {
      titleElement.classList.add('no-text-truncate');
      descElement.classList.add('no-text-truncate');
    } else if (faq_or_article_obj.showMoreButton) {
      titleElement.classList.remove('no-text-truncate');
      descElement.classList.remove('no-text-truncate');
    }
  }


  updateSeeMoreButtonForAgent(id, faq_or_article_obj, type) {
    let faqSourceTypePixel = 5;
    let titleElement = document.getElementById("titleLib-" + id);
    let descElement = document.getElementById("descLib-" + id);
    let divElement = document.getElementById('faqDivLib-' + id);
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let viewLinkElement;
    if (type == this.projConstants.ARTICLE) {
      titleElement = document.getElementById("articletitleLib-" + id);
      descElement = document.getElementById("articledescLib-" + id);
      divElement = document.getElementById('articleDivLib-' + id);
      seeMoreElement = document.getElementById('articleseeMore-' + id);
      viewLinkElement = document.getElementById('articleViewLinkLib-' + id);
    }
    if (titleElement && descElement && divElement) {
      titleElement.classList.add('no-text-truncate');
      descElement.classList.add('no-text-truncate');
      let divSectionHeight = descElement.clientHeight || 0;
      if (divSectionHeight > (24 + faqSourceTypePixel)) {
        faq_or_article_obj.showMoreButton = true;
      } else {
        faq_or_article_obj.showMoreButton = false;
        if (type == this.projConstants.ARTICLE) {
          viewLinkElement.classList.remove('hide');
        }
      }
      titleElement.classList.remove('no-text-truncate');
      descElement.classList.remove('no-text-truncate');
    }
  }


}
