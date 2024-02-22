import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
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
  @ViewChild('editableDiv') editableDiv: ElementRef;

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


  constructor(public rootService: RootService, private serviceInvoker: ServiceInvokerService,
    private websocketService: WebSocketService, private handleSubjectService: HandleSubjectService,
    private cdr: ChangeDetectorRef, private renderer: Renderer2) {

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
    const editableDiv = this.editableDiv.nativeElement?.childNodes[0]
    this.searchText = editableDiv?.textContent || ''; 
    if(this.rootService.settingsData?.searchAssistConfig?.showAutoSuggestions){
      if (this.searchText?.length > 0) {
        this.addSpanElement();
        let searchText = this.searchText?.trimStart()?.split(' ')?.pop();
        if(searchText && searchText.charAt(searchText.length - 1) === this.autocompleteText.charAt(0)){
          this.updateAutocompleteText(this.autocompleteText.slice(1));
        }
        this.typeAHead(this.searchText, this.rootService.connectionDetails);
      } else {
        this.clearSearch();
      }
    }
  }

  focusEditableDiv(){
    this.closeSuggestions = false;
  }

  closeSearch(){
    this.updateEditableDiv('');
    this.clearSearch();
  }

  clearSearch() {
    this.searchText = ' ';
    this.searched = false;
    this.searchResponse = {};
    this.updateAutocompleteText('');
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
    this.serviceInvoker.invoke('post.autoSearch', { botId: botId, convId: conversationId }, payload, { botId: botId }, params.agentassisturl).subscribe((res) => {
      this.querySuggestions = res?.querySuggestions;
      this.typeAHeads = res?.typeAheads;
      if(this.typeAHeads?.length && this.searchText?.length){
        let searchText = this.searchText?.trim()?.split(' ')?.pop();
        let autoText = this.typeAHeads[0];  
        this.updateAutocompleteText(autoText ? autoText.replace(searchText, '') : '');
      }else{
        this.updateAutocompleteText('');
      }
      console.log(this.autocompleteText, "auto complete text ");
    })
  }


  selectSuggestion(suggestion){
    this.searchText = suggestion;
    this.updateEditableDiv(suggestion);
    this.updateAutocompleteText('');
    this.getSearchResults(suggestion);
  }

  emitSearchRequest(value, isSearch, faq?) {
    // this.showSpinner = true;
    let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
    connectionDetails.value = value;
    connectionDetails.isSearch = isSearch;
    // connectionDetails.positionId = searchObj?.positionId;
    if (connectionDetails.interactiveLanguage && typeof connectionDetails.interactiveLanguage == 'string' && connectionDetails.interactiveLanguage != "''") {
      connectionDetails['language'] = connectionDetails.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    if(faq && faq.sourceMsgId){
      connectionDetails['sourceMsgId'] = faq.sourceMsgId;
    }
    let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
  }

  keypUpEnterEvent(event){
    event.preventDefault();
    this.getSearchResults(this.searchText);
  }

  getSearchResults(value) {
    if(value.length > 0){
      this.showSpinner = true;
      this.setValue(value, true)
    }
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
      this.emitSearchRequest(searchObj.value, false, faq);
    }
  }

  minMaxButtonClick(){
    // this.maxButton = !this.maxButton;
    this.maxMinButtonClick.emit(true);
  }

  onKeyDown(event: KeyboardEvent) {
    const editableDiv = this.editableDiv.nativeElement;
    
    if (event.key === 'Tab' && editableDiv && editableDiv.contains(document.activeElement)) {
      // Prevent the default tab behavior
      event.preventDefault();
      
      // Insert tab character or desired content
      const tabCharacter = '\t';
      document.execCommand('insertText', false, tabCharacter);

      if(this.editableDiv.nativeElement?.childNodes[0]){
        this.searchText = this.editableDiv.nativeElement.childNodes[0].textContent + this.autocompleteText;
        this.updateEditableDiv(this.searchText);
      }
      this.updateAutocompleteText('');
      this.removeAndAddSpanTag();
      this.onSearch({});
      console.log(this.searchText, "inside tab", this.autocompleteText);
    }else if (event.key === 'Enter'){
      event.preventDefault();
      this.getSearchResults(this.searchText);
    }
  }

  updateAutocompleteText(value) {
    this.autocompleteText = value;
    if(this.autocompleteText.length > 0){
      if (document.getElementById('spanElement1')) {
        document.getElementById('spanElement1').textContent = value;
      }
    }else{
      this.removeSpans();
    }
  }

  removeAndAddSpanTag() {
    this.removeSpans();
    this.addSpanElement();
  }

  removeSpans() {
    const spans = this.editableDiv.nativeElement.querySelectorAll('span');
    spans.forEach(span => {
      this.renderer.removeChild(span.parentNode, span);  // Remove each span from its parent
    });
  }


  addSpanElement() {
    console.log("add span");
    if (!document.getElementById('spanElement1') && this.searchText.length > 1) {
      const spanElement = this.renderer.createElement('span');
      // let span = document.getElementById('spanElement1').cloneNode(true) as HTMLElement;
      spanElement.id = 'spanElement1';
      spanElement.textContent = this.autocompleteText;
      spanElement.contenteditable = false;
      this.renderer.appendChild(this.editableDiv.nativeElement, spanElement);
    }
  }

  updateEditableDiv(value) {
    if (this.editableDiv.nativeElement?.childNodes[0]) {
      this.editableDiv.nativeElement.childNodes[0].textContent = value;
    }
  }


}
