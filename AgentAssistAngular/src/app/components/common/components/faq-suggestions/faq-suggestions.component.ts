import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-faq-suggestions',
  templateUrl: './faq-suggestions.component.html',
  styleUrls: ['./faq-suggestions.component.scss']
})
export class FaqSuggestionsComponent implements OnInit, OnDestroy{

  subs = new SubSink();
  projConstants: any = ProjConstants;
  searchResponse : any = {};
  searchedFAQList : any = [];

  constructor(private handleSubjectService : HandleSubjectService, private rootService : RootService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }
  
  subscribeEvents(){
    this.subs.sink = this.handleSubjectService.searchResponse$.subscribe((searchResponse)=> {
      console.log(searchResponse, 'searchResponse');
      this.searchedFAQList = [];
      if(searchResponse && searchResponse.dialogs){
        this.searchedFAQList = searchResponse.dialogs;
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
