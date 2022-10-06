import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageFilePath, ImageFileNames, ProjConstants, ConnectionDetails, IdReferenceConst } from 'src/common/constants/proj.cnts';
import { EVENTS } from 'src/common/helper/events';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { LibraryService } from 'src/library-tab/services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  @Output() handleSearchClickEvent = new EventEmitter();

  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  projConstants: any = ProjConstants;
  subscriptionsList: Subscription[] = [];


  showSearchSuggestions: boolean = false;
  botDetails: any = {};
  menuResponse: any = {};
  searchText: string = '';
  searchFromAgentSearchBar: boolean = false;

  constructor(public handleSubjectService: HandleSubjectService, public libraryService: LibraryService,
  public websocketService : WebSocketService, public randomUUIDPipe: RandomUUIDPipe,
  public commonService: CommonService) { }

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
      if (searchObj && searchObj.eventFrom == this.projConstants.AGENT_SEARCH) {
        this.searchText = searchObj.searchText;
        this.searchFromAgentSearchBar = true;
        this.getSearchResults(searchObj.eventFrom);
      }
    });
    let subscription2 = this.websocketService.agentMenuResponse$.subscribe((menuResponse : any) =>{
      console.log(menuResponse, "inside library");
      if(menuResponse && menuResponse.usecases){
        this.menuResponse = this.libraryService.formatMenuResponse(menuResponse.usecases); 
      }
    });
   
    this.subscriptionsList.push(subscribtion1);
    this.subscriptionsList.push(subscription2);

  }

  handleRunAgent(dialogueId, event) {
    this.menuResponse[dialogueId].agentRunButton = !this.menuResponse[dialogueId].agentRunButton;
    event.stopPropagation()
  }

  //changing the tab
  dialogueRunClick(dialog,clickType) {
    let runDialogueObject = Object.assign({},dialog);
    runDialogueObject.searchFrom = this.projConstants.LIBRARY;
    runDialogueObject.name = dialog.value.intentName;
    runDialogueObject.agentRunButton = dialog.value.agentRunButton;
    this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
    if (clickType == this.projConstants.ASSIST) {
      this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
      this.AgentAssist_run_click(dialog);
    } else {
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
      this.agent_run_click(dialog,false)
    }
    
  }

  agent_run_click(dialog, isSearchFlag) {
    console.log("inside emit search request", dialog);
    let connectionDetails: any = Object.assign({}, ConnectionDetails);
    connectionDetails.value = dialog.value.intentName;
    connectionDetails.isSearch = isSearchFlag;
    if(!isSearchFlag){
      connectionDetails.intentName = dialog.value.intentName;
    }
    let agent_assist_agent_request_params = this.commonService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
  }

  AgentAssist_run_click(dialog) {
    console.log(dialog, "dialog inside library");
    
    let connectionDetails: any = Object.assign({}, ConnectionDetails);
    connectionDetails.value = dialog.value.intentName;
    connectionDetails.intentName = dialog.value.intentName;
    connectionDetails.positionId = this.randomUUIDPipe.transform(IdReferenceConst.positionId)
    console.log(connectionDetails, "inside agent assist run click");
    
    let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
  }

  getSearchResults(eventFrom?) {
    this.searchFromAgentSearchBar = eventFrom ? true : false;
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.LIBRARY, value: this.searchText });
  }

  emptySearchTextCheck() {
    if (this.searchText == '') {
      this.showSearchSuggestions = false;
      this.searchFromAgentSearchBar = false;
      this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.LIBRARY, value: undefined });
      this.websocketService.agentAssistAgentResponse$.next(null);
    }
  }

  handleBackButtonClick() {
    this.handleSearchClickEvent.emit({ eventFrom: this.projConstants.LIBRARY_SEARCH, searchText: this.searchText });
  }

}
