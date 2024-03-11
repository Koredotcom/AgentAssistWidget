import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-work-notes',
  templateUrl: './work-notes.component.html',
  styleUrls: ['./work-notes.component.scss']
})
export class WorkNotesComponent implements OnInit{

  constructor(
    private http: HttpClient  ,
    private rootService: RootService
  ){}

  ngOnInit(): void {
    try{
      let automation = JSON.parse(this.automation.data.buttons[0].value);
      if(automation?.payload?.template_type === 'worknotesTemplate'){
        this.automation = automation?.payload;
      }
    }catch(e){
      console.error(e);
    }
  }

  @Input() automation: any;
  // @Input() listView : boolean;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;

  workNoteFeedBack(isPosOrNeg, wn){
    this.http.post(this.automation?.feedbackWebhookURL, {
      type: "feedback",
      isExternalWn: true,
      worknotes: [
          {
              worknote_id: wn.worknoteId,
              action: isPosOrNeg ? "like" : "dislike"
          }
        ]
      },{
        headers: {
          accountid: this.rootService.accountId,
          botid: this.rootService.connectionDetails.botId,
          agentid: this.rootService.connectionDetails.conversationId
        }
      } ).subscribe((data)=>{

    });
    
    
    if(true){}
  }

}
