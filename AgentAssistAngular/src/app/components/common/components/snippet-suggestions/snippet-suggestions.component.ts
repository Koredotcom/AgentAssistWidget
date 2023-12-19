import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class SnippetSuggestionsComponent implements OnInit, OnDestroy, AfterContentChecked{

  @Input() searchResponse : any;
  @ViewChild('ifSnippet', { static: false }) public ifSnippet: ElementRef<HTMLDivElement>
  @ViewChild('snippetContent', { static: false }) public snippetContent: ElementRef<HTMLDivElement>


  subs = new SubSink();
  projConstants: any = ProjConstants;
  searchedSnippetList : any[] = [];
  viewCount = 2;
  moreClick = false;
  hideActionButtons : boolean = false;
  hideSendButton : boolean = false;

  constructor(private handleSubjectService : HandleSubjectService,
    public rootService : RootService, private commonService : CommonService,
    private cdr : ChangeDetectorRef){

  }

  ngOnInit(){
    this.handleSearchResponse(this.searchResponse);
    this.hideSendAndCopy();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
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

  handleSendCopyButton(actionType, snippetObj, selectType){
    snippetObj.send = true;
    let clonedSnippetObj = this.modifySnippetObjForMultiContent(snippetObj);
    this.commonService.handleSendCopyButton(actionType, clonedSnippetObj, selectType)
  }

  modifySnippetObjForMultiContent(snippetObj){
    let clonedSnippetObj = JSON.parse(JSON.stringify(snippetObj));
    if(this.isArray(clonedSnippetObj.content)){
      clonedSnippetObj.content = clonedSnippetObj.content.reduce((acc, obj) => {
        if(obj.answer_fragment){
          acc += obj.answer_fragment;
          return acc;
        }
      }, '')
    }
    return clonedSnippetObj
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

  isArray(content) {
    return Array.isArray(content);
  }

}
