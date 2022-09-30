import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EVENTS } from 'src/app/events';
import { WebSocketService } from 'src/app/web-socket.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { ImageFileNames, ImageFilePath, ProjConstants } from '../../../common/constants/proj.cnts'

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
    this.emitEvents();
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  emitEvents(){
    this.websocketService.emit(EVENTS.welcome_message_request, {});
    this.websocketService.emit(EVENTS.agent_menu_request,{});
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
      this.showSearchSuggestions = false;
    }
  }

  handleSearchClickEvent(eventObj) {
    if (eventObj.eventFrom == this.projConstants.AGENT_SEARCH) {
      this.showSearchSuggestions = false;
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
    }
  }

}
