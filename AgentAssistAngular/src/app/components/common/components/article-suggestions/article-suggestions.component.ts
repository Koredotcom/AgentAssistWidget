import { Component, Input, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { RemoveTagFromStringPipe } from 'src/app/pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from 'src/app/pipes/replace-text-with-tag.pipe';
import { ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-article-suggestions',
  templateUrl: './article-suggestions.component.html',
  styleUrls: ['./article-suggestions.component.scss']
})
export class ArticleSuggestionsComponent implements OnInit, OnDestroy{

  @Input() searchResponse : any;
  
  subs = new SubSink();
  projConstants: any = ProjConstants;
  articlesList : any[] = [];
  viewCount = 2;
  moreClick = false;
  hideActionButtons : boolean = false;
  hideSendButton : boolean = false;
  hideCopyButton : boolean = false;

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
    this.articlesList = [];
    if(searchResponse && searchResponse.articles){
      this.articlesList = searchResponse.articles;
      this.viewLessClick();
    }
  }

  handleSendCopyButton(actionType, articleObj, selectType){
    articleObj.send = actionType === this.projConstants.SEND ? 'send' : 'copied';
    this.commonService.handleSendCopyButton(actionType, articleObj, selectType)
  }

  toggleShowMoreLess(article){
    article.showMoreButton = !article.showMoreButton;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  viewMoreClick(){
    this.moreClick = true;
    this.viewCount = this.articlesList?.length;
  }

  viewLessClick(){
    this.moreClick = false;
    this.viewCount = (this.articlesList && this.articlesList?.length <= 2) ? this.articlesList?.length : 2;
  }

  openurlInBrowser(url){
    this.rootService.openurlInBrowser(url);
  }
}


