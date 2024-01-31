import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WSelDialogComponent } from '../w-sel-dialog/w-sel-dialog.component';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.scss']
})
export class AutomationComponent implements OnInit, OnDestroy {
  bots: any[] = [];
  isHideBotsList: boolean = false;
  searchTerm: string = "";
  sortByOptions = [
    {
      key: 'name',
      label: 'Bot Name'
    },
    {
      key: 'taskCount',
      label: 'Task Count'
    },
    {
      key: 'isPublished',
      label: 'Status'
    }
  ];
  sortBy = {
    key: 'name',
    label: 'Bot Name'
  };

  sortByOrder: 'asc' | 'desc' = 'asc';

  subs = new SubSink();

  @ViewChild(NgbDropdown) private dropdown: NgbDropdown;
  constructor(
    private authService: AuthService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.isHideBotsList = false;
    this.getBots();
    this.authService.getDeflectApps();
    if(this.workflowService.emailBool) {
      this.navigatetoBotBuilder(this.workflowService.emailBotEIBP)
    }
    if(this.workflowService.editInPlatform) {
      // console.log(this.workflowService.getCurrentBt(true));
      // this.navigatetoBotBuilder(this.workflowService.getCurrentBt(true));
      if(this.workflowService.currentSelectedBotDetails?.streamId) {
        this.workflowService.currentSelectedBotDetails['_id'] = this.workflowService.currentSelectedBotDetails.streamId;
        this.navigatetoBotBuilder(this.workflowService.currentSelectedBotDetails);
      }
       else {
        this.navigatetoBotBuilder(this.workflowService.currentSelectedBotDetails);
       }
    }
  }

  getBots() {
    this.subs.sink = this.authService.deflectApps.subscribe(res => {
      if (!res) return;
      this.bots = res.map(bot => {
        bot['taskCount'] = this.getTasksCount(bot);
        bot['isPublished'] = bot.visibility.namespace != 'private';
        return bot;
      })
    })
  }

  getTasksCount(bot) {
    const faqCount = bot?.taskCounts?.faqCount || 0;
    if (!bot?.taskCounts?.dialogs) return faqCount;

    let countsMap: any = bot?.taskCounts?.dialogs.map(e => e.count);
    if (countsMap?.length) {
      return countsMap.reduce((a, b) => a + b, 0) + faqCount;
    } else {
      return faqCount;
    }
  }

  newBot(type: string) {
    this.dropdown.close();
    if (this.workflowService.appState == 'published') {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CANNOT_CREATE"), 'warning');
      return;
    }
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(WSelDialogComponent, { size: 'lg', windowClass: 'welcome-dialog-selection', backdrop: 'static', keyboard: true });
    modalRef.componentInstance.activeMod[type] = true;
    if (type === 'createNew') {
      modalRef.componentInstance.modSwitch('createNew');
    }
    modalRef.componentInstance.wSel.subscribe(t => {
      this.wSHide();
    })
  }

  wSHide() {
    this.modalService.dismissAll();
  }

  choosePreBot() {
    this.workflowService.loadBotStore$.next();
  }

  navigatetoBotBuilder(bot) {
    console.log(bot);
    this.workflowService.getCurrentSelectedBotId = JSON.parse(JSON.stringify(bot));
    this.isHideBotsList = true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
