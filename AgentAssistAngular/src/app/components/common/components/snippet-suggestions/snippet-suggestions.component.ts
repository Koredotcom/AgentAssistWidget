import { Component, Input, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
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
  hideCopyButton : boolean = false;
  internalInfo = [];
  moreClickInt = false;
  viewCountInt = 2;
  // sourceInx = null;
  extMore = true;
  intMore = true;
  constructor(private handleSubjectService : HandleSubjectService,
    public rootService : RootService, private commonService : CommonService){

  }

  ngOnInit(){
    
  }

  ngOnChanges(changes : SimpleChange){
    if(changes['searchResponse']?.currentValue){
      this.handleSearchResponse(this.searchResponse);
      this.hideSendAndCopy();
    }
  }


  hideSendAndCopy(){
    // Both send and copy
    this.hideActionButtons = (this.rootService.connectionDetails.isCallConversation) ? true : false;

    //send Button
    if(this.rootService.settingsData?.isAgentResponseEnabled === false){
      this.hideSendButton = true;
    }

    if(this.rootService.settingsData?.isAgentResponseCopyEnabled === false){
      this.hideCopyButton = true;
    }

    if(this.hideSendButton && this.hideCopyButton){
      this.hideActionButtons = true;
    }
  }
  handleSearchResponse(searchResponse){
    this.searchedSnippetList = [];
    if (searchResponse && searchResponse.snippets) {
      this.searchedSnippetList = searchResponse.snippets;
      // this.internalInfo = this.searchedSnippetList.filter(item => item.internalFlag);
      // this.searchedSnippetList = this.searchedSnippetList.filter(item => !item.internalFlag);
      this.viewLessClick();
    }
  }


  handleSendCopyButton(actionType, snippetObj, selectType){
    snippetObj.send = actionType === this.projConstants.SEND ? 'send' : 'copied';
    let snippet = JSON.parse(JSON.stringify(snippetObj));
    snippet.content = snippetObj?.sendCopyText;
    this.commonService.handleSendCopyButton(actionType, snippet, selectType)
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

  viewMoreClickInt(){
    this.moreClickInt = true;
    this.viewCountInt = this.internalInfo?.length;
  }

  viewLessClickInt(){
    this.moreClickInt = false;
    this.viewCountInt = (this.internalInfo && this.internalInfo?.length <= 2) ? this.internalInfo?.length : 2;
  }

  openurlInBrowser(url){
    this.rootService.openurlInBrowser(url);
  }

  prevClass = '';
  hoverOnSource(sourceInx, type, i){
    if(this.prevClass){
      document.querySelectorAll(this.prevClass)?.forEach(el => el?.classList?.remove('selection-on-snippet-color'));
    }
    this.prevClass = '.fragment-ext-' + sourceInx;
    document.querySelectorAll(this.prevClass)?.forEach(el => el?.classList?.add('selection-on-snippet-color'));
  }

  mouseLeave(){
    if(this.prevClass){
      document.querySelectorAll(this.prevClass)?.forEach(el => el?.classList?.remove('selection-on-snippet-color'));
    }
  }
}
