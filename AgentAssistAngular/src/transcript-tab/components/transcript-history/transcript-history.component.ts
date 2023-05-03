import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants } from 'src/common/constants/proj.cnts';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { MockDataService } from 'src/common/services/mock-data.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';

@Component({
  selector: 'app-transcript-history',
  templateUrl: './transcript-history.component.html',
  styleUrls: ['./transcript-history.component.scss']
})
export class TranscriptHistoryComponent {
  
  subscriptionsList: Subscription[] = [];
  historyResponse : any = [];
  projconstants : any = ProjConstants;

  constructor(
    private handleSubjectService : HandleSubjectService,
    private templateRenderClassService : TemplateRenderClassService,
    public commonService : CommonService,
    private mockDataService : MockDataService
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
    let subscription1 = this.mockDataService.getHistoryData().subscribe((res : any) => {
      console.log(res, "response");
      if(res && res.chatHistory){
        this.handleSubjectService.setUserHistoryData(res);
        this.historyResponse = res.chatHistory;
      }
    });
    this.subscriptionsList.push(subscription1);
  }
}
