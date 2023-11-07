import { Component, Input } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {

  @Input() suggestionResponse: any;
  @Input() agentassistArrayIndex: number;
  @Input() agentassistResponseArrayLength: number;

  connectionDetails: any = {};
  searchResultText: string;

  subs = new SubSink();

  constructor(private rootService: RootService, private websocketService: WebSocketService, private handleSubjectService: HandleSubjectService) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnChanges() {
    if (this.suggestionResponse && this.suggestionResponse.data) {
      this.connectionDetails = this.suggestionResponse.connectionDetails;
      this.updateResponse();
    }
  }

  updateResponse() {
    if (this.suggestionResponse.data) {
      this.handleSearchResponse(this.suggestionResponse.data);
    }
  }


  handleSearchResponse(response) {
    this.checkFaqAnswerNotRenderCountAndRequest()
    this.handleSubjectService.setSearchResponse(this.suggestionResponse.searchResponse);
  }

  checkFaqAnswerNotRenderCountAndRequest() {
    let answerNotRenderendElements = (this.suggestionResponse.searchResponse.faqs || []).filter(faq => {
      return !faq.answer;
    });
    if (answerNotRenderendElements.length == 1 && !this.suggestionResponse.faqArrowClickResponse) {
      this.getFaqAnswerAndtoggle(answerNotRenderendElements[0]);
    }
  }

  getFaqAnswerAndtoggle(faq) {
    faq.toggle = !faq.toggle;
    faq.seeMoreWrapper = false;
    this.checkAnswerAndToggle(faq);
  }

  checkAnswerAndToggle(faq) {
    if (!faq.answer && faq.toggle) {
      this.rootService.suggestionsAnswerPlaceableIDs.push({ input: faq.question, assistSuggestion: this.agentassistArrayIndex });
      let searchObj: any = {};
      searchObj.value = faq.displayName;
      searchObj.question = faq.question;
      // searchObj.searchFrom = this.commonService.activeTab;
      this.emitSearchRequest(searchObj.value, false);
    }
  }

  emitSearchRequest(value, isSearch) {
    let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
    connectionDetails.value = value;
    connectionDetails.isSearch = isSearch;
    // connectionDetails.positionId = searchObj?.positionId;
    if (connectionDetails.interactiveLanguage && typeof connectionDetails.interactiveLanguage == 'string' && connectionDetails.interactiveLanguage != "''") {
      connectionDetails['language'] = connectionDetails.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    let agent_assist_request_params = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, agent_assist_request_params);
  }



}
