import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';

@Component({
  selector: 'app-user-bot-history',
  templateUrl: './user-bot-history.component.html',
  styleUrls: ['./user-bot-history.component.scss']
})
export class UserBotHistoryComponent implements OnInit, OnDestroy{

  subscriptionsList: Subscription[] = [];
  historyResponse : any = [];

  constructor(
    private handleSubjectService : HandleSubjectService
    ) { }

  ngOnInit(): void {
    this.subscribeEvents();
    
  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  subscribeEvents(){
    let subscription1 = this.handleSubjectService.userHistoryDataSubject$.subscribe((res : any) => {
      console.log(res, "response inside history");
      if(res && res.chatHistory){
        this.historyResponse = res.chatHistory;
      }
    });
    this.subscriptionsList.push(subscription1)
  }

}
