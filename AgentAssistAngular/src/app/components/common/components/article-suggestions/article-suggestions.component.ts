import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RemoveTagFromStringPipe } from 'src/app/pipes/remove-tag-from-string.pipe';
import { ReplaceTextWithTagPipe } from 'src/app/pipes/replace-text-with-tag.pipe';
import { ProjConstants } from 'src/app/proj.const';
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

  constructor(private handleSubjectService : HandleSubjectService,
     private rootService : RootService){

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

  ngOnInit(): void {
   
  }

  handleSearchResponse(searchResponse){
    this.articlesList = [];
    if(searchResponse && searchResponse.articles){
      this.articlesList = searchResponse.articles;
      this.viewLessClick();
    }
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType){
    this.rootService.handleSendCopyButton(actionType, faq_or_article_obj, selectType)
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

}


