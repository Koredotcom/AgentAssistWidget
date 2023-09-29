import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ConversationsComponent } from './conversations/conversations.component';
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { WSelDialogComponent } from '../w-sel-dialog/w-sel-dialog.component';
import { AuthService } from '@kore.services/auth.service';
import * as _ from 'underscore';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-agent-usecases',
  templateUrl: './agent-usecases.component.html',
  styleUrls: ['./agent-usecases.component.scss']
})
export class AgentUsecasesComponent implements OnInit, OnDestroy {
  smartABots: string[] = [];
  currentBt: any;
  searchBt = "";

  subs = new SubSink();

  ucType: 'faq' | 'dialog' = 'faq';
  selectedGroup = this.translate.instant("USECASES.GROUP_BY");
  groupBy: string;
  @ViewChild('convComp') convComp: ConversationsComponent;
  @ViewChild('searchTerm') searchTerm: ElementRef<HTMLElement>;
  @ViewChild(NgbDropdown) private dropdown: NgbDropdown;
  constructor(
    private translate: TranslateService,
    public workflowService: workflowService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initBots();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      fromEvent(this.searchTerm?.nativeElement, 'input')
        .pipe(
          map((event: any) => event.target.value),
          debounceTime(500),
          distinctUntilChanged())
        .subscribe((val) => {
          this.convComp?.getUsecases(val);
        });
    }, 100);
    // this.iSearch.nativeElement.focus();
  }

  initBots() {
    this.subs.sink = this.authService.deflectApps.subscribe(res => {
      if (!res) return;
      if (this.workflowService.deflectAppsData.length || this.workflowService.deflectAppsData._id) {
        this.smartABots = this.authService.smartAssistBots;
        (this.smartABots || []).forEach((v: any) => {
          v.name = v.name.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
        });
        this.currentBt = _.findWhere(this.authService.smartAssistBots, { _id: this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id });
        this.workflowService.setCurrentBt(this.currentBt);
      }
    });

    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((bot)=>{
      console.log(bot, "inside udpate use case");
      if(bot){
        this.currentBt = bot;
      }
    });
  }

  openConversation() {
    this.convComp?.openConversation();
  }

  selectGroup(s: string) {
    if (s !== 'state') {
      if (s == 'category') {
        this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + this.translate.instant('USECASES.CATEGORY');
      } else {
        this.selectedGroup = this.translate.instant("USECASES.GROUP_BY");
      }
    } else {
      this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + this.translate.instant("USECASES.STATUS_SMALL");
    }
    this.groupBy = s;
    if (this.convComp) this.convComp.onGroupBy(s);
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

  choosePreBot() {
    this.workflowService.loadBotStore$.next();
  }
  switchBots(bt) {
    this.workflowService.switchBt$.next(bt);
  }

  wSHide() {
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
