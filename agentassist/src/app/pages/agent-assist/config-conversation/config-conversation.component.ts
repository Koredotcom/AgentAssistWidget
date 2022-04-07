import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { UsecaseOb } from '../../usecases/uc-main/uc-table-main/uc-table-main.model';
@Component({
  selector: 'app-config-conversation',
  templateUrl: './config-conversation.component.html',
  styleUrls: ['./config-conversation.component.scss']
})
export class ConfigConversationComponent implements OnInit {
  isEditable: boolean;
  saveInProgress: boolean = false;
  @Input() inputData: UsecaseOb;
  @ViewChild('confToggle') confToggle: ElementRef;
  @Output() closed = new EventEmitter();
  constructor(
    public workflowService: workflowService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private service: ServiceInvokerService,
    private localStoreService: LocalStoreService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isEditable = this.workflowService.appState === 'configured';

    this.inputData = JSON.parse(JSON.stringify(this.inputData));
    if (this.inputData.isEnabled == undefined) {
      this.inputData.isEnabled = true;
    }
  }

  save() {
    this.inputData.isEnabled = this.confToggle.nativeElement.checked;
    this.onClose(true);
  }

  onClose(saveOnClose?: boolean) {
    if (this.saveInProgress) return;
    this.saveInProgress = true;

    const _obj = {
      data: this.inputData,
      type: 'conversations',
      cb: (flag) => {
        this.saveInProgress = false;
      },
      saveOnClose: saveOnClose
    }
    this.closed.emit(_obj);
  }

  launchPlatform() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: "manage-deflection-exp-popup",
      data: {
        title: this.translate.instant("COMMON.CONFIRMATION"),
        text: this.translate.instant("COMMON.PLATFORM_NAV"),
        text1: this.translate.instant("COMMON.ASSISTANT_PLATFORM"),
        buttons: [{ key: 'yes', label: this.translate.instant("BUTTONS.PROCEED") }, { key: 'no', label: this.translate.instant("BUTTONS.CANCEL") }]
      }
    });

    dialogRef.componentInstance.showLearnMore = true;

    dialogRef.componentInstance.onSelect.subscribe(result => {
      if (result === 'yes') {
        this.workflowService.redirectPlatform(this.workflowService.getCurrentBt()._id, (this.localStoreService.getSelectedAccount() && this.localStoreService.getSelectedAccount().accountId) || (this.authService.getSelectedAccount() && this.authService.getSelectedAccount().accountId), this.workflowService.getCurrentBt().defaultLanguage, 'conversation', this.inputData.dialogId, this.inputData.state == 'configured' ? 'indevelopment' : 'published', this.localStoreService.appLanguage);
      } else if (result === 'learnMore') {
        window.open("https://developer.kore.ai/docs/bots/bot-builder-tool/dialog-task/dialog-tasks/");
        return;
      }

      dialogRef.close();
    });
  }

}
