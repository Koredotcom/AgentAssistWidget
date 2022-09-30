import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageFilePath, ImageFileNames, ProjConstants } from 'src/common/constants/proj.cnts';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
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

  constructor(public handleSubjectService: HandleSubjectService, public libraryService: LibraryService) { }

  ngOnInit(): void {
    this.subscribeEvents();
    this.getMenuResponse();
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
    let subscribtion = this.handleSubjectService.searchTextFromAgentSearch.subscribe((searchObj: any) => {
      if (searchObj && searchObj.eventFrom == this.projConstants.AGENT_SEARCH) {
        this.searchText = searchObj.searchText;
        this.searchFromAgentSearchBar = true;
        this.getSearchResults(searchObj.eventFrom);
      }
    });
    this.subscriptionsList.push(subscribtion);
  }

  handleRunAgent(dialogueId, event) {
    this.menuResponse[dialogueId].agentRunButton = !this.menuResponse[dialogueId].agentRunButton;
    event.stopPropagation()
  }

  //changing the tab
  dialogueRunClick(dialog,clickType) {
    let runDialogueObject = Object.assign({},dialog);
    runDialogueObject.searchFrom = this.projConstants.LIBRARY;
    if (clickType == this.projConstants.ASSIST) {
      this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
    } else {
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
    }
    this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
  }

  getMenuResponse() {
    this.libraryService.getSampleMenuResponse().subscribe((menuResponse: any) => {
      if (menuResponse && menuResponse[1] && menuResponse[1].usecases) {
        this.botDetails = (({ botId, conversationId }) => ({ botId, conversationId }))(menuResponse);
        this.menuResponse = this.libraryService.formatMenuResponse(menuResponse[1].usecases);
      }
    });
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
    }
  }

  handleBackButtonClick() {
    this.handleSearchClickEvent.emit({ eventFrom: this.projConstants.LIBRARY_SEARCH, searchText: this.searchText });
  }

}
