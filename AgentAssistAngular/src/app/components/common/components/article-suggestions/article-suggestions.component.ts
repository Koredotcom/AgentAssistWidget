import { Component, OnDestroy, OnInit } from '@angular/core';
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

  subs = new SubSink();
  projConstants: any = ProjConstants;
  articlesList : any = [];

  constructor(private handleSubjectService : HandleSubjectService,
     private rootService : RootService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.handleSubjectService.searchResponse$.subscribe((searchResponse)=> {
      console.log(searchResponse, 'searchResponse');
      this.articlesList = [];
      if(searchResponse && searchResponse.articles){
        this.articlesList = searchResponse.articles;
      }
    });
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType){
    this.rootService.handleSendCopyButton(actionType, faq_or_article_obj, selectType)
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}


