import { Component, OnInit } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-snippet-suggestions',
  templateUrl: './snippet-suggestions.component.html',
  styleUrls: ['./snippet-suggestions.component.scss']
})
export class SnippetSuggestionsComponent implements OnInit{

  subs = new SubSink();
  projConstants: any = ProjConstants;
  searchedSnippetList : any = [];

  constructor(private handleSubjectService : HandleSubjectService,
    private rootService : RootService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.handleSubjectService.searchResponse$.subscribe((searchResponse)=> {
      console.log(searchResponse, 'searchResponse');
      this.searchedSnippetList = [];
      if(searchResponse && searchResponse.snippets){
        this.searchedSnippetList = searchResponse.snippets;
      }
    });
  }

  handleSendCopyButton(actionType, faq_or_article_obj, selectType){
    this.rootService.handleSendCopyButton(actionType, faq_or_article_obj, selectType)
  }

}
