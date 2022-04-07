import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { AuthService } from '@kore.services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatHistoryComponent implements OnInit {

  constructor(
    private service: ServiceInvokerService,
    public dialogRef: MatDialogRef<ChatHistoryComponent>, 
    private authService: AuthService,
    public workflowService: workflowService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.isInProgress = true;
    const _params = {
      "msgId": this.data.messageId,
      "streamId": this.workflowService.getCurrentBt()._id
    };
    this.messageId = this.data.messageId;
    const self = this;
    this.service.invoke('get.callflow.chatHistory',_params).subscribe(
      res => {     
        self.isInProgress = false;
        self.chatHistData = res;
        setTimeout(function(){
          if(document.getElementsByClassName('user-message active').length) {
            document.getElementsByClassName('user-message active')[0].scrollIntoView();
          }
          if(document.getElementsByClassName('bot-message active').length) {
            document.getElementsByClassName('bot-message active')[0].scrollIntoView();
          }
        });
      },
      errRes => {
        self.isInProgress = false;
      }
    );
  }

  isInProgress: boolean;
  chatHistData: any;
  messageId: any;
  closeModal() {
    this.dialogRef.close();
  }

}
