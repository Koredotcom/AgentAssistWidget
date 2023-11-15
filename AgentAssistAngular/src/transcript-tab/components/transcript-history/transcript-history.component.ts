import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants } from 'src/common/constants/proj.cnts';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { MockDataService } from 'src/common/services/mock-data.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import * as $ from 'jquery';

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
    // this.subscribeEvents();
    this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      console.log(response);
      if(response && response.isCall !== 'false') {
        this.userAgentConversationHistoryAPICall();
      }
    })
  }

  userAgentConversationHistoryAPICall() {
    let connectionDetails;
      let headersVal = {};
      this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
        if (response) {
          connectionDetails = response;
          headersVal = {
            'Authorization': this.commonService.grantResponseObj?.authorization?.token_type + ' ' + this.commonService.grantResponseObj?.authorization?.accessToken,
            'accountId': this.commonService.grantResponseObj?.userInfo?.accountId,
            'iid' : connectionDetails.botId ? connectionDetails.botId : 'st-1c3a28c8-335d-5322-bd21-f5753dc7f1f9'
        }
        $.ajax({
          url: `${connectionDetails.agentassisturl}/agentassist/api/v1/agentassistconversations/${connectionDetails.conversationId}/conversation?page=1&&limit=1000`,
          type: 'get',
          headers: headersVal,
          dataType: 'json',
          success:  (data) => {
            console.log(data);
            if(data && data?.result?.length > 0) {
              this.historyResponse = data.result;
            }
          },
          error: function (err) {
              console.error("Unable to fetch the details with the provided data");
          }
      });
        }
      });


  }

  ngOnDestroy(): void {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  subscribeEvents(){
    let subscription1 = this.mockDataService.getHistoryData().subscribe((res : any) => {
      console.log(res, "response");
      if(res && res.result){
        console.log('testing: ',res, res.result);
        this.handleSubjectService.setUserAgentTranscriptionHistory(res);
        this.historyResponse = res.result;
      }
    });
    this.subscriptionsList.push(subscription1);
  }
}
