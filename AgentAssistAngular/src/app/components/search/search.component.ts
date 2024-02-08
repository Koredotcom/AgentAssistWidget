import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { ProjConstants } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, AfterContentChecked {

  @Input() maxButton;
  @Output() maxMinButtonClick = new EventEmitter();

  projConstants : any = ProjConstants;

  subs = new SubSink();
  searchText: string = '';

  searchResponse: any = {};
  answerPlaceableIDs: any = [];

  faqViewCount: number;
  articleViewCount: number;
  snippetViewCount: number;
  faqAllView: boolean = false;
  articleAllView: boolean = false;
  snippetAllView: boolean = false;

  searchResultText: string;
  querySuggestions: any = [];
  typeAHeads : any = [];

  searched : boolean = false;
  autocompleteText : string = '';
  showSpinner : boolean = true;
  closeSuggestions : boolean = true;


  constructor(private rootService: RootService, private serviceInvoker: ServiceInvokerService,
    private websocketService: WebSocketService, private handleSubjectService: HandleSubjectService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.updateMenuResponseLoader(false);
    }, 10000);
    this.subscribeEvents();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 }


  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  subscribeEvents() {
    this.subs.sink = this.websocketService.agentAssistAgentResponse$.subscribe((agentResponse: any) => {
      if (agentResponse && (agentResponse.isSearch || this.answerPlaceableIDs.length)) {
        this.rootService.searchedResultData = agentResponse;
        this.handleSearchResponse(agentResponse);
        this.showSpinner = false;
      }
    });
  }

  updateMenuResponseLoader(event){
    this.showSpinner = event;
  }

  typeAHead = this.typeAHeadDeBounce((val, connectionDetails) => this.getAutoSearchApiResult(val, connectionDetails));
  onSearch(event: any) {
    if(this.rootService.settingsData?.searchAssistConfig?.showAutoSuggestions){
      if (this.searchText?.length > 0) {
        this.typeAHead(this.searchText, this.rootService.connectionDetails);
      } else {
        this.clearSearch();
      }
    }
  }

  clearSearch(){
    this.searchText = '';
    this.autocompleteText = '';
    this.searched = false;
    this.searchResponse = {};
    // this.handleSubjectService.setSearchResponse(this.searchResponse);
  }

  typeAHeadDeBounce(func, timeout = 300) {
    let delay;
    return function (...args) {
      clearTimeout(delay);
      delay = setTimeout(() => {
        func.apply(this, args);
      }, timeout)
    }
  }


  getAutoSearchApiResult(value, params) {
    const { botId, conversationId, channel } = this.rootService.getConnectionDetails();
    let payload = {
      "query": value,
      "maxNumOfResults": 3,
      "lang": "en",
      "experience" : channel
    }
    this.serviceInvoker.invoke('post.autoSearch', { botId: botId, convId: conversationId }, payload, { apicall: 'autoSearch', botId: botId }, params.agentassisturl).subscribe((res) => {
      this.querySuggestions = res?.querySuggestions;
      this.typeAHeads = res?.typeAheads;
      if(this.typeAHeads?.length){
        let searchText = this.searchText?.trim()?.split(' ')?.pop();
        let autoText = this.typeAHeads[0];
        this.autocompleteText = autoText ? this.searchText.trim() + autoText.replace(searchText, '') : this.searchText;
      }else{
        this.autocompleteText = '';
      }
    })
  }

  onTabClick(event){
    this.searchText = this.autocompleteText;
  }

  selectSuggestion(suggestion){
    this.searchText = suggestion;
    this.autocompleteText = '';
    this.getSearchResults({target : { value : suggestion}});
  }

  emitSearchRequest(value, isSearch) {
    // this.showSpinner = true;
    let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
    connectionDetails.value = value;
    connectionDetails.isSearch = isSearch;
    // connectionDetails.positionId = searchObj?.positionId;
    if (connectionDetails.interactiveLanguage && typeof connectionDetails.interactiveLanguage == 'string' && connectionDetails.interactiveLanguage != "''") {
      connectionDetails['language'] = connectionDetails.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
  }


  getSearchResults(event) {
    this.showSpinner = true;
    this.setValue(event.target.value, true)
  }

  setValue(value: any, isEntered = false) {
    this.searchText = value;
    // this.isCursorOverFilterSet = false;
    // this.hideList();
    if (isEntered) {
      this.emitSearchRequest(this.searchText, true)
    } else {
      // this.typeahead.emit(this.searchText);
    }

  }

  handleSearchResponse(response) { 
    this.searched = true;   
    if (response && response?.suggestions) {
      if (this.answerPlaceableIDs?.length == 0) {
        this.searchResponse = {};
        // response.suggestions.faqs = [
        //   {question : "How does COVID -19 spread?", answer : ["Covid spreads through tiny virus particles that get inside the body. The most common way for covid to enter the body is by being breathed in from infected air. This can happen when people stand close togethe When a person breaths out, it’s not just air that leaves their nose or mouth. Tiny water droplets are also breathed out, and these can be infected with viruses like colds or covid. These water droplets can be breathed in by other people, or if they land on a surface that someone touches later, that person could catch coronavirus."]},
        //   {question : "Reset Password" , answer : ['to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click off', 'to change password on reset reset to reset password click on reset to reset password click on reset to reset password click on reset to reset password click on reset', 'to reset password click on reset', 'to change password click on reset']},
        //   {question : "Reset Password" , answer : ['to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click off', 'to change password on reset reset to reset password click on reset to reset password click on reset to reset password click on reset to reset password click on reset', 'to reset password click on reset', 'to change password click on reset']},
        //   {question : "Reset Password" , answer : ['to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click off', 'to change password on reset reset to reset password click on reset to reset password click on reset to reset password click on reset to reset password click on reset', 'to reset password click on reset', 'to change password click on reset']}
        // ]
        this.searchResponse = this.rootService.formatSearchResponse(response);
        if(this.searchResponse && Object.keys(this.searchResponse)?.length > 0){
          this.searchResponse.totalSearchResults = (this.searchResponse.dialogs?.length + this.searchResponse.faqs?.length + this.searchResponse?.articles?.length + this.searchResponse?.snippets?.length || 0);
          this.faqViewCount = (this.searchResponse.faqs && this.searchResponse.faqs?.length <= 2) ? this.searchResponse.faqs?.length : 2;
          this.articleViewCount = (this.searchResponse.articles && this.searchResponse.articles?.length <= 2) ? this.searchResponse.articles?.length : 2;
          this.snippetViewCount = (this.searchResponse.snippets && this.searchResponse.snippets?.length <= 2) ? this.searchResponse.snippets?.length : 2;
          this.faqAllView = this.searchResponse.faqs && this.searchResponse.faqs?.length > 2 ? true : false;
          this.articleAllView = this.searchResponse.articles && this.searchResponse.articles?.length > 2 ? true : false;
          this.snippetAllView = this.searchResponse.snippets && this.searchResponse.snippets?.length > 2 ? true : false;
          this.searchResultText = this.searchResponse.totalSearchResults == 1 ? "Search result for" : "Search results for";
          this.checkFaqAnswerNotRenderCountAndRequest()
        }
      } else if (this.answerPlaceableIDs?.length > 0) {        
        response.suggestions.faqs = this.rootService.formatFAQResponse(response.suggestions.faqs);
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
              // this.updateFaqAmbiguity.emit(faq);
            } 
            if(accumulator[faq.question]){
              faq.showSpinner = false;
            }
          });
          let index = this.answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
          this.answerPlaceableIDs.splice(index, 1);
          // setTimeout(() => {
          //   this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
          // }, 1000);
        }
      }
      // this.handleSubjectService.setSearchResponse(this.searchResponse);
    }
  }

  checkFaqAnswerNotRenderCountAndRequest() {
    let answerNotRenderendElements = (this.searchResponse.faqs || []).filter(faq => {
      return !faq.answer;
    });
    
    if (answerNotRenderendElements?.length == 1) {
      this.getFaqAnswerAndtoggle(answerNotRenderendElements[0]);
    }
  }

  getFaqAnswerAndtoggle(faq) {
    faq.toggle = !faq.toggle;
    faq.seeMoreWrapper = false;
    this.checkAnswerAndToggle(faq);
  }

  checkAnswerAndToggle(faq){    
    if (!faq.answer && faq.toggle) {      
      this.answerPlaceableIDs.push({ input: faq.question });
      let searchObj: any = {};
      searchObj.value = faq.displayName;
      searchObj.question = faq.question;
      // searchObj.searchFrom = this.commonService.activeTab;
      this.emitSearchRequest(searchObj.value, false);
    }
  }

  minMaxButtonClick(){
    // this.maxButton = !this.maxButton;
    this.maxMinButtonClick.emit(true);
  }
}
