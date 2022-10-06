import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/common/helper/events';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { classNamesConst, ConnectionDetails, IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants } from '../../../common/constants/proj.cnts'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  projConstants: any = ProjConstants;
  searchText: string = '';
  showSearchSuggestions: boolean = false;
  subscriptionsList: Subscription[] = [];
  searchConentObject: any;
  activeTab: string; // call conversation make transcript as active tab.

  constructor(public handleSubjectService: HandleSubjectService, public websocketService : WebSocketService) { }

  ngOnInit(): void {
    this.subscribeEvents();
    setTimeout(() => {
      this.emitEvents();
    }, 2000);
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  emitEvents(){
    let connectionDetails : any = ConnectionDetails;
    let parsedCustomData : any = {};
    let welcomeMessageParams : any = {
      'waitTime': 2000,
      'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
      'id': ConnectionDetails.conversationId,
      "isSendWelcomeMessage" : true
    }
    this.websocketService.emitEvents(EVENTS.welcome_message_request,welcomeMessageParams);
    this.websocketService.emitEvents(EVENTS.agent_menu_request,connectionDetails);
  }

  subscribeEvents() {
    let subscription1 = this.handleSubjectService.activeTabSubject.subscribe(tab => {
      this.activeTab = tab;
    });
    this.subscriptionsList.push(subscription1);
  }

  isChecked() {

  }

  changeActiveTab(tab) {
    this.handleSubjectService.setActiveTab(tab);
  }

  getSearchResults() {
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.ASSIST, value: this.searchText });
  }

  emptySearchTextCheck() {
    if (this.searchText == '') {
      this.closeSearchSuggestions(true);
    }
  }

  handleSearchClickEvent(eventObj) {
    if (eventObj.eventFrom == this.projConstants.AGENT_SEARCH) {
      this.closeSearchSuggestions(true);
      this.changeActiveTab(this.projConstants.LIBRARY);
      this.handleSubjectService.setLibrarySearchTextFromAgentSearch(eventObj);
    } else if (eventObj.eventFrom == this.projConstants.LIBRARY_SEARCH) {
      this.changeActiveTab(this.projConstants.ASSIST);
      this.searchText = eventObj.searchText;
      this.getSearchResults()
    }
  }

  closeSearchSuggestions(flag){
    if(flag){
      this.showSearchSuggestions = false;
      this.handleSubjectService.setSearchText({ searchFrom: this.projConstants.ASSIST, value: undefined });
      this.websocketService.agentAssistAgentResponse$.next(null);
      if(document.getElementById(IdReferenceConst.overLaySuggestions)){
        document.getElementById(IdReferenceConst.overLaySuggestions).classList.remove(classNamesConst.displayBlock);
      }
    }
  }

  

}
