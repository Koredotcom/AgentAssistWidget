import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageFilePath, ImageFileNames, ProjConstants, IdReferenceConst, storageConst } from 'src/common/constants/proj.cnts';
import { EVENTS } from 'src/common/helper/events';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { LocalStorageService } from 'src/common/services/local-storage.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { LibraryService } from 'src/library-tab/services/library.service';
declare const $:any;
@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  @Output() handleSearchClickEvent = new EventEmitter();

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFileNames: any = ImageFileNames;
  imageFilePath: string = ImageFilePath;

  botDetails: any = {};
  menuResponse: any = {};
  searchText: string = '';
  connectionDetails: any = {};
  showSearchSuggestions: boolean = false;
  searchFromAgentSearchBar: boolean = false;

  constructor(public handleSubjectService: HandleSubjectService,
    public libraryService: LibraryService,
    public websocketService: WebSocketService,
    public randomUUIDPipe: RandomUUIDPipe,
    public commonService: CommonService,
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    // hide Run with agent button on clicking outside of document.
    if (Object.keys(this.menuResponse).length > 0) {
      for (let dialogue in this.menuResponse) {
        this.menuResponse[dialogue].agentRunButton = false;
      }
      event.stopPropagation()
    }
  }

  subscribeEvents() {
    let subscribtion1 = this.handleSubjectService.searchTextFromAgentSearch.subscribe((searchObj: any) => {
      this.handleSubjectService.setLoader(true);
      if (searchObj && searchObj.eventFrom == this.projConstants.AGENT_SEARCH) {
        this.searchText = searchObj.searchText;
        this.searchFromAgentSearchBar = true;
        this.getSearchResults(this.searchText,searchObj.eventFrom);
      }
      this.handleSubjectService.setLoader(false);
    });
    let subscription2 = this.websocketService.agentMenuResponse$.subscribe((menuResponse: any) => {
      this.handleSubjectService.setLoader(true);
      if (menuResponse && menuResponse.usecases) {
        this.menuResponse = this.libraryService.formatMenuResponse(menuResponse.usecases);
      }
      this.handleSubjectService.setLoader(false);
    });

    let subscription3 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
      }
    });

    let subscription4 = this.websocketService.socketConnectFlag$.subscribe((response) => {
      if (response) {
        this.updateSearchTextFromStorage();
      }
    });

    this.subscriptionsList.push(subscribtion1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);

  }

  handleRunAgent(dialogueId, event) {
    for(let key in this.menuResponse){
      if(key == dialogueId){
        this.menuResponse[dialogueId].agentRunButton = !this.menuResponse[dialogueId].agentRunButton;
      }else{
        this.menuResponse[key].agentRunButton = false;
      }
    }
    event.stopPropagation()
  }

  //search bar related code
  getSearchResults(value,eventFrom?) {
    this.searchFromAgentSearchBar = eventFrom ? true : false;
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.LIBRARY, value: value });
    this.setSearchTextInLocalStorage(value);
  }

  emptySearchTextCheck(value) {
    if (value == '') {
      this.showSearchSuggestions = false;
      this.searchFromAgentSearchBar = false;
      this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.LIBRARY, value: undefined });
      this.websocketService.agentAssistAgentResponse$.next(null);
      this.setSearchTextInLocalStorage(value);
    }else{
      this.getSearchResults(value);
    }
  }

  librarySearchClose() {
    this.showSearchSuggestions = false;
    this.searchText = '';
    this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.LIBRARY, value: undefined });
    this.setSearchTextInLocalStorage('');
  }

  //local storage set text
  setSearchTextInLocalStorage(value) {
    let storageObject: any = {
      [storageConst.SEARCH_VALUE]: value,
    }
    this.localStorageService.setLocalStorageItem(storageObject, this.projConstants.LIBRARY);
  }

  updateSearchTextFromStorage() {
    let appState = this.localStorageService.getLocalStorageState();
    if (appState && appState[this.connectionDetails.conversationId] && appState[this.connectionDetails.conversationId][this.projConstants.LIBRARY][storageConst.SEARCH_VALUE]) {
      this.searchText = appState[this.connectionDetails.conversationId][this.projConstants.LIBRARY][storageConst.SEARCH_VALUE];
      this.getSearchResults(this.searchText);
    }
  }

  //handling click events
  handleBackButtonClick() {
    this.handleSearchClickEvent.emit({ eventFrom: this.projConstants.LIBRARY_SEARCH, searchText: this.searchText });
  }

  dialogueRunClick(dialog, clickType) {
    dialog.value.positionId = this.randomUUIDPipe.transform(IdReferenceConst.positionId);
    let runDialogueObject = Object.assign({}, dialog.value);
    runDialogueObject.searchFrom = this.projConstants.LIBRARY;
    runDialogueObject.name = dialog.value.intentName;
    runDialogueObject.agentRunButton = dialog.value.agentRunButton;
    if (clickType == this.projConstants.ASSIST) {
      this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
      // this.AgentAssist_run_click(runDialogueObject);
    } else {
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
      this.agent_run_click(runDialogueObject, false)
    }
    this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
  }

  agent_run_click(dialog, isSearchFlag) {
    if (!this.commonService.isMyBotAutomationOnGoing) {
      let connectionDetails: any = Object.assign({}, this.connectionDetails);
      connectionDetails.value = dialog.intentName;
      connectionDetails.isSearch = isSearchFlag;
      if (!isSearchFlag) {
        connectionDetails.intentName = dialog.intentName;
      }
      connectionDetails.positionId = dialog.positionId;
      let agent_assist_agent_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
      this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    }
  }

}
