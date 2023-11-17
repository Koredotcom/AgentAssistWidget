import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-snippet-suggestions',
  templateUrl: './snippet-suggestions.component.html',
  styleUrls: ['./snippet-suggestions.component.scss']
})
export class SnippetSuggestionsComponent implements OnInit, OnDestroy{

  @Input() searchResponse : any;

  subs = new SubSink();
  projConstants: any = ProjConstants;
  searchedSnippetList : any[] = [];
  viewCount = 2;
  moreClick = false;
  hideActionButtons : boolean = false;
  hideSendButton : boolean = false;

  constructor(private handleSubjectService : HandleSubjectService,
    private rootService : RootService){

  }

  ngOnInit(): void {
  }

  ngOnChanges(){
    this.handleSearchResponse(this.searchResponse);
    this.hideSendAndCopy();
  }


  hideSendAndCopy(){
    // Both send and copy
    this.hideActionButtons = (this.rootService.connectionDetails.isCallConversation) ? true : false;

    //send Button
    if(!this.rootService.settingsData?.isAgentResponseEnabled){
      this.hideSendButton = true;
    }
  }

  handleSearchResponse(searchResponse){
    this.searchedSnippetList = [];
    if (searchResponse && searchResponse.snippets) {
      this.searchedSnippetList = searchResponse.snippets;
      this.viewLessClick();
    }
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType){
    this.rootService.handleSendCopyButton(actionType, faq_or_article_obj, selectType)
  }

  toggleShowMoreLess(snippet){
    snippet.showMoreButton = !snippet.showMoreButton;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  viewMoreClick(){
    this.moreClick = true;
    this.viewCount = this.searchedSnippetList?.length;
  }

  viewLessClick(){
    this.moreClick = false;
    this.viewCount = (this.searchedSnippetList && this.searchedSnippetList?.length <= 2) ? this.searchedSnippetList?.length : 2;
  }


}
