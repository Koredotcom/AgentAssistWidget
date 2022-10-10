import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/common/helper/events';
import { WebSocketService } from 'src/common/services/web-socket.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { classNamesConst, ConnectionDetails, IdReferenceConst, ImageFileNames, ImageFilePath, ProjConstants } from '../../../common/constants/proj.cnts'
import { CommonService } from 'src/common/services/common.service';

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
  showTerminatePopup : boolean = false;
  showInterruptPopup : boolean = false;

  constructor(public handleSubjectService: HandleSubjectService, public websocketService : WebSocketService, private service: CommonService) { }

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
    connectionDetails['conversationId'] = this.service.configObj.conversationid;
    connectionDetails['botId'] = this.service.configObj.botid;
    let parsedCustomData : any = {};
    let welcomeMessageParams : any = {
      'waitTime': 2000,
      'userName': parsedCustomData?.userName || parsedCustomData?.fName + parsedCustomData?.lName || 'user',
      'id': this.service.configObj.conversationid,
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
        document.getElementById(IdReferenceConst.overLaySuggestions).classList.remove(classNamesConst.DISPLAY_BLOCK);
      }
    }
  }

  handleTerminatePopup(popupObject){
    if(popupObject.type == this.projConstants.TERMINATE){
      this.showTerminatePopup = popupObject.status;
      if(popupObject.terminate){
        console.log("terminate inside home component");
        this.handleSubjectService.setTerminateClickEvent({activeTab : this.activeTab})
      }
    }else if(popupObject.type == this.projConstants.INTERRUPT){
      this.showInterruptPopup = popupObject.status;
      if(popupObject.interrupt){
        console.log("interrupt inside home component");
        this.handleSubjectService.setInterruptClickEvent({activeTab : this.activeTab}) 
      }
    }

  }
}
