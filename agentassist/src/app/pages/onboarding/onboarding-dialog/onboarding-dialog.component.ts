import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from '@kore.services/app.service';
import { AuthService } from '@kore.services/auth.service';
import { InteractiveHelpService } from '@kore.services/interactive-help.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { finalize } from 'rxjs/operators';
import { MixPanelService } from 'src/app/helpers/mixPanel.service';
import { SubSink } from 'subsink';
import { InstanceModel } from '../onboarding.model';
import { workflowService } from '@kore.services/workflow.service';
import { WSelDialogComponent } from '../.././w-sel-dialog/w-sel-dialog.component';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';

declare const $: any;
@Component({
  selector: 'app-onboarding-dialog',
  templateUrl: './onboarding-dialog.component.html',
  styleUrls: ['./onboarding-dialog.component.scss']
})
export class OnboardingDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  subs = new SubSink();
  smartABots: string[] = [];
  currentBt: any;
  model: InstanceModel = {
    "name": "",
    "icon": "618b959139d7c0be05beb204",
    "defaultLanguage": "en",
    "isAutomationRequired": true,
    "isAgentDesktopRequired": true
  }

  showSetUpOption: boolean = false;
  saveInProgress: boolean = false;

  @ViewChild(PerfectScrollbarComponent) perfectScroll?: PerfectScrollbarComponent;
  constructor(
    public dialogRef: MatDialogRef<OnboardingDialogComponent>,
    private router: Router,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public appService: AppService,
    private authService: AuthService,
    private translate: TranslateService,
    private interactiveHelp: InteractiveHelpService,
    private mixPanel: MixPanelService,
    public workflowService: workflowService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    //this.initBots();
    this.mixPanel.postEvent('Welcome screen loaded', this.mixPanel.events['Welcome screen loaded']);
  }

  ngAfterViewInit() {
    setTimeout(() => { this.perfectScroll.directiveRef.update() }, 500);
  }

  // initBots() {
  //   this.subs.sink = this.authService.deflectApps.subscribe(res => {
  //     if (!res) return;
  //     if (this.workflowService.deflectAppsData.length || this.workflowService.deflectAppsData._id) {
  //       this.smartABots = this.authService.smartAssistBots;
  //       (this.smartABots || []).forEach((v: any) => {
  //         v.name = v.name.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  //       });
  //       this.currentBt = _.findWhere(this.authService.smartAssistBots, { _id: this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id });
  //       this.workflowService.setCurrentBt(this.currentBt);
  //     }
  //   })
  // }


  // onEnable() {
  //   // if (!this.showSetUpOption) return this.showSetUpOption = true;
  //   this.createInstance(true);
  // }

  // onLater() {
  //   this.createInstance();
  // }

  createInstance(takeTour?) {
    if (!(/^[a-zA-Z0-9][a-zA-Z0-9_<>*. ]+$/.test(this.model.name.trim()))) {
      this.notificationService.notify(this.translate.instant("ONBOARDING_INSTANCE_NAME_ALLOWS"), 'warning');
      return;
    }

    this.saveInProgress = true;
    this.subs.sink = this.service.invoke('post.instances', null, this.model)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {

        this.mixPanel.postEvent('Instance setup complete', this.mixPanel.events['Instance setup complete']);

        this.notificationService.notify("Instance created successfully!", "success");
        this.appService.appendNewInstaceBot(res);
        this.authService.deflectApps.next(null);
        this.closeDialog(takeTour);
        this.router.navigate(['home']);
        // setTimeout(() => { this.router.navigate(['home']) })
      }, err => this.notificationService.showError(err));
  }

  closeDialog(takeTour?, isMigrated?) {
    this.dialogRef.close();

    if (takeTour) {
      this.interactiveHelp.openHelp('INITIAL_PRODUCT_TOUR')
    } else {
      this.mixPanel.postEvent('Welcome screen skipped', this.mixPanel.events['Welcome screen skipped']);
    }

    if (isMigrated) {
      this.appService.isMigrated = false;
      sessionStorage.removeItem('isMigrated');
      this.router.navigate(['home']);
    }
  }

  newBot(type: string) {
    this.dialogRef.close();
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
    else if(type === 'import'){
      modalRef.componentInstance.modSwitch('import');
    }
    this.dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      this.dialogRef.close();
    });
    modalRef.componentInstance.wSel.subscribe(t => {
      this.wSHide();
      
    })
    
  }

  wSHide() {
    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
