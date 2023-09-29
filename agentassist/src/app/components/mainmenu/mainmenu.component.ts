import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { SideBarService } from '../../services/header.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { workflowService } from '@kore.services/workflow.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BillingPlan } from '../../data/billing.model';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { VoicePreferencesModel } from 'src/app/pages/settings/settings.model';
import * as _ from 'underscore';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { LocalStoreService } from '@kore.services/localstore.service';
import { SubSink } from 'subsink';
import { AppService } from '@kore.services/app.service';
import { InteractiveHelpService } from '@kore.services/interactive-help.service';
import { finalize, take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainmenuComponent implements OnInit, OnDestroy {
  Permissions = Permissions;
  selected: string = "";
  allPlans: BillingPlan[];
  getCurrentPlan: Subscription;
  planDetails: any;
  planLeftPer = 100;
  isPlanLoading = true;
  isPlan = false;
  availBal: Subscription;
  upBtSub: Subscription;
  swtchBot: Subscription;
  smartABots: any[];
  currentBt: any;
  searchBt = "";
  isAgentDesktopEnabled: boolean;
  subs = new SubSink();
  channelList: any;
  loading: boolean = false;
  voicePreferences: VoicePreferencesModel;
  filteredSmartABots : any = {};
  isCoachingDisable = true;
  @ViewChild('wUpdateBot', { static: false }) private wUpdateBot;
  @ViewChild('wSContent', { static: false }) private wSContent;
  @ViewChild(NgbDropdown) private dropdown: NgbDropdown;
  @Input() type = 'config';
  constructor(private headerService: SideBarService,
    public workflowService: workflowService,
    public dialog: MatDialog,
    private service: ServiceInvokerService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private localStoreService: LocalStoreService,
    private appService: AppService,
    private interactiveHelp: InteractiveHelpService
  ) { }

  preview(selection): void {
    this.selected = selection;
    //this.headerService.toggle(this.selected);
  }

  ngOnInit() {
    this.subs.sink = this.authService.isAgentDesktopEnabled$.subscribe(isEnabled => {
      this.isAgentDesktopEnabled = isEnabled;
    });
    this.subs.sink = this.authService.isAgentCoachongEnable$.subscribe(isEnabled => {
      this.isCoachingDisable = isEnabled;
    });

    // this.workflowService.botChange.subscribe((bot : any)=>{
    //   console.log(bot, "inside udpate use case");
    //   if(bot && bot.name){
    //     this.choosedBot = bot.name;
    //   } 
    // });

    // this.getCurrentBotFromAutomationBotList();
    
    this.availBal = this.workflowService.updateAvailBal$.subscribe(
      res => {
        this.getBalance();
      }
    );
    this.upBtSub = this.workflowService.updateBotDetails$.subscribe(
      (res: any) => {
        this.currentBt = res;
        this.workflowService.setCurrentBt(this.currentBt);
      }
    );
    this.swtchBot = this.workflowService.switchBt$.subscribe(
      res => {
        this.authService.getDeflectApps();
        this.switchBots(res);
      }
    );

    this.subs.sink = this.authService.deflectApps.subscribe( (res : any) => {
      if(res){
        console.log("inside subscribe", res);
        
        this.getCurrentBotFromAutomationBotList();
      }
    });
  }

  getCurrentBotFromAutomationBotList(){
    let _id = this.localStoreService.getSelectedAccount()?.accountId || this.authService.getSelectedAccount()?.accountId;
  
    if (this.appService.selectedInstanceApp$.value) {
      this.getBalance();
    }
    if (this.workflowService.deflectAppsData.length || this.workflowService.deflectAppsData._id) {
     
      this.smartABots = this.authService.smartAssistBots || [];
      this.smartABots.forEach((v: any) => {
        v.name = v.name.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
      });
      
      this.currentBt = this.workflowService.getCurrentBt(true) && Object.keys(this.workflowService.getCurrentBt(true)).length > 0 ? this.workflowService.getCurrentBt(true) : _.findWhere(this.authService.smartAssistBots, { _id: this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id });
      this.workflowService.setCurrentBt(this.currentBt);
    }
    this.filterLinkedBotIds();
  }

  filterLinkedBotIds(){
    this.filteredSmartABots = {};
    this.smartABots.forEach((bot) => {
      if(bot._id){
        this.filteredSmartABots[bot._id] = bot;
      }
    });

    
    for(let bot of this.smartABots){
      let filterdBot = this.filteredSmartABots[bot._id];
      if(bot.type == 'universalbot'){

        let linkedBots = [];
        let linkedBotIds = {};

        let config_publish_bot_array = [...bot?.configuredBots, ...bot.publishedBots];

        config_publish_bot_array.forEach((config_publish_bot) => {
          linkedBotIds[config_publish_bot._id] = true;
        });  
   
        linkedBots = this.smartABots.filter(element => linkedBotIds[element._id]); 
        filterdBot.linkedBots = Object.assign([], linkedBots);
        for(let botId in linkedBotIds){
          delete this.filteredSmartABots[botId]
        }        
      }
    }        
  }

  getBalance() {
    this.isPlanLoading = true;
    let params;
    if (this.workflowService.getCurrentBt()._id) {
      params = {
        streamId: this.workflowService.getCurrentBt()._id,
      }
    } else {
      params = {
        streamId: this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id,
      }
    }

   
  }

  getPlans() {
    this.service.invoke("get.plans").subscribe((res: BillingPlan[]) => {
      this.allPlans = res;
    }, err => {

    })
  }

  newBot() {
    this.dropdown.close();
    if (this.workflowService.appState == 'published') {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CANNOT_CREATE"), 'warning');
      return;
    }
    this.modalService.dismissAll();
    this.modalService.open(this.wSContent, { size: 'lg', windowClass: 'welcome-dialog-selection', backdrop: 'static', keyboard: false });
  }

  updateBot() {
    this.dropdown.close();
    if (this.workflowService.appState == 'published') {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CANNOT_UPDATE"), 'warning');
      return;
    }
    this.modalService.dismissAll();
    this.modalService.open(this.wUpdateBot, { size: 'lg', windowClass: 'welcome-dialog-selection', backdrop: 'static', keyboard: false });
  }

  wSHide() {
    this.modalService.dismissAll();
  }

  switchBots(bt) {
    if (this.dropdown) {
      this.dropdown.close();
    }
    this.workflowService.deflectApps(bt);
    if (this.authService.smartAssistBots) {
      this.currentBt = _.findWhere(this.authService.smartAssistBots, { _id: bt._id });
      this.workflowService.setCurrentBt(this.currentBt);
      const self = this;
      if (!this.currentBt) {
        this.currentBt = bt;
        this.workflowService.setCurrentBt(this.currentBt);
        this.smartABots = this.authService.smartAssistBots.concat(bt);
        setTimeout(() => {
          this.searchBt = "d";
          self.cdr.detectChanges();
          this.searchBt = "";
        });
      } else {
        if (_.where(this.authService.smartAssistBots, { _id: this.currentBt._id }).length) {
          this.smartABots = this.authService.smartAssistBots;
        } else {
          this.smartABots = this.authService.smartAssistBots.concat(this.currentBt);
        }
        setTimeout(() => {
          this.searchBt = "d";
          self.cdr.detectChanges();
          this.searchBt = "";
        });
      }
    } else {
      this.currentBt = bt;
      this.workflowService.setCurrentBt(this.currentBt);
      this.smartABots = [bt];
    }
    // if (bt.visibility.namespace == 'private') {
    //   this.navigateToUc();
    // } else {
    //   this.navigateToLiveBoard();
    // }
    // this.navigateToUc();
    this.workflowService.updateAvailBal$.next();
    this.workflowService.headerInitCalls$.next();
    this.changeBot(this.currentBt);
  }


  changeBot(res){
    console.log("----- get use cases----")
    this.workflowService.updateBotDetails$.next(res);
  }

  navigateToUc() {
    // this.router.navigate(['/config/defaults']);
    // setTimeout(() => {
    //   this.router.navigate(['/config//usecases']);
    // });

    this.redirectTo('/config//usecases');

  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  navigateToLiveBoard() {
    this.router.navigate(['/config/defaults']);
    setTimeout(() => {
      this.router.navigate(['/config/liveboard']);
    });
  }

  getAdvSettings() {
    const params = {
      instanceId:this.authService.getAgentAssistStreamId(),
       'isAgentAssist':true
     }
     let channelList;
     this.subs.sink = this.service.invoke('get.voiceList', params, 's').subscribe(voiceList => {
       channelList = voiceList;
       if(channelList.sipTransfers.length > 0){
        const _params = { 
          streamId: this.authService.getAgentAssistStreamId(),
          'isAgentAssist':true 
        }
        this.loading = true;
        this.subs.sink = this.service.invoke('get.settings.voicePreferences', _params)
        .pipe(finalize(() => this.loading = false))
        .subscribe(res => {
          this.voicePreferences = res;
        }, err => {
          this.notificationService.showError(err, 'Failed to fetch voice preferences')
        })
      }
    })
  } 


  config: any = {
    suppressScrollX: true
  };

  ngOnDestroy() {
    if (this.availBal) this.availBal.unsubscribe();
    if (this.upBtSub) this.upBtSub.unsubscribe();
    if (this.swtchBot) this.swtchBot.unsubscribe();
    this.subs.unsubscribe();
  }

  // performBTNavigation(mainTab, link) {
  //   let navData = {
  //     navType: 'direct'
  //   }
  //   this.workflowService.directFlag = true;
  //   this.workflowService.mainTab = mainTab;
  //   this.workflowService.link = link;
  //   this.workflowService.btNavigation$.next(navData);
  // }

}
