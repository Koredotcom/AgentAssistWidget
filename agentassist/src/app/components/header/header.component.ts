import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { SideBarService } from '../../services/header.service';
import { Router } from '@angular/router';
import { workflowService } from '@kore.services/workflow.service';
import { AppUrlsService } from '@kore.services/app.urls.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { kgDataService } from '../../services/componentsServices/kg-data.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { InviteDialogComponent } from '../../helpers/components/invite-dialog/invite-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { HttpHeaders } from '@angular/common';

import * as _ from 'underscore';
import { Subscription } from 'rxjs';
import { LangSwitchDialogComponent } from 'src/app/helpers/components/lang-switch-dialog/lang-switch-dialog.component';
import { environment } from '../../../environments/environment';
import { SDKWidgetModel } from 'src/app/pages/settings/settings.model';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
import { AppService } from '@kore.services/app.service';
import { MixPanelService } from 'src/app/helpers/mixPanel.service';

declare const $: any;
declare const koreBotChat: any;
declare const AgentDesktop: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  toShowAppHeader: boolean;
  pagetitle: any;
  fromCallFlow: string = "";
  showSwichAccountOption: boolean = false;
  isKGTrainingInprogress: boolean = false;
  faqCount: number = 0;
  selectedAppState = this.translate.instant("HEADER.IN_DEV");
  btStream: any;
  emailShare: any;
  botRoles: any;
  sharedToList: any;
  isInvite = true;
  isSharedDeveloper = false;
  appStates: { id: string, label: string }[] = [{
    id: 'configured',
    label: this.translate.instant("HEADER.IN_DEV")
  }, {
    id: 'published',
    label: this.translate.instant("HEADER.PUB")
  }];
  initSub: Subscription;
  isSharedDevError = false;
  isAgentDesktopEnabled: boolean;

  showSupportWindow: boolean = false;
  botOptions: any;
  selectedApp: any;
  koreBot: any;
  chatConfig: any;
  theme: any;

  subs = new SubSink();

  showLaunchConsole: boolean;
  showGuide: boolean = false;

  constructor(
    public authService: AuthService,
    public headerService: SideBarService,
    public workflowService: workflowService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private appUrlsService: AppUrlsService,
    private localStoreService: LocalStoreService,
    private kgService: kgDataService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private service: ServiceInvokerService,
    private mixPanel: MixPanelService,
    private translate: TranslateService,
    public dockService: DockStatusService,
    public appService: AppService
  ) {
    this.iconRegistry.addSvgIcon('profile', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/header/profile.svg'));
    this.iconRegistry.addSvgIcon('invite', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/header/invite.svg'));
    this.iconRegistry.addSvgIcon('documentation', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/header/documentation.svg'));
    this.iconRegistry.addSvgIcon('platform', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/header/platform.svg'));
    this.iconRegistry.addSvgIcon('switchAcc', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/header/switchAcc.svg'));
  }

  logoutClick() {
    this.authService.logout();
    // remove from session storage as well
    sessionStorage.removeItem("selectedAccount");
  }

  ngOnInit() {
    this.selectedApp = this.workflowService.getCurrentBt(true)._id;
    // this.selectedApp = this.authService.smartAssistBots.map(x=>x._id);
    // this.initCalls();
    this.getWidget();
    this.subs.sink = this.authService.isAgentDesktopEnabled$.subscribe(isEnabled => {
      this.isAgentDesktopEnabled = isEnabled;
    });
    this.toShowAppHeader = this.workflowService.showAppCreationHeader();
    this.headerService.change.subscribe(data => {
      this.pagetitle = data.title;
      this.toShowAppHeader = data.toShowWidgetNavigation;
      this.fromCallFlow = "";
      this.ref.detectChanges();
    });
    this.headerService.fromCallFlowExpand.subscribe(data => {
      this.fromCallFlow = data.title;
      this.toShowAppHeader = false;
      this.pagetitle = "";
      this.ref.detectChanges();
    });

    // if (this.authService.smartAssistBots.map(x=>x._id)) {
    //   this.initCalls();
    // }
    if(this.workflowService.getCurrentBt(true) && this.workflowService.getCurrentBt(true)._id){
      this.initCalls();
    }
    this.initSub = this.workflowService.headerInitCalls$.subscribe(() => {
      if(this.workflowService.getCurrentBt(true)._id){
        this.initCalls();
      }
    });
    this.showSwichAccountOption = this.localStoreService.getAssociatedAccounts().length > 1;
    this.kgService.kgTrainingInProgess$.subscribe((res: boolean) => {
      this.isKGTrainingInprogress = res;
    });
    this.kgService.faqsCount$.subscribe((count: number) => this.faqCount = count);

    //initialize mixpanel
    // this.mixPanel.init(this.authService);
    // if (this.workflowService.resolveHostUrl() !== 'https://bots.kore.ai') {
    //   this.mixPanel.optOutTracking();
    // }

    const selectedAccountId = this.localStoreService.getSelectedAccount()?.accountId || this.authService.getSelectedAccount()?.accountId;
    this.showLaunchConsole = selectedAccountId === this.authService.getAuthInfo()?.currentAccount?.accountId;

    this.subs.sink = this.appService.hideHomePage$.subscribe(flag => this.showGuide = flag);
  }

  initCalls() {
    let params;
     params = {
        userId: this.authService.getUserId(),
        streamId: this.authService.getAgentAssistStreamId()
      }

      this.service.invoke('get.shared.developers', params).subscribe(
        res => {
          this.isSharedDeveloper = true;
          this.sharedToList = res;
          this.isSharedDevError = false;
        },
        err => {
          this.isSharedDeveloper = true;
          this.workflowService.showError(err, this.translate.instant("HEADER.FAILED_FETCH"));
          this.isSharedDevError = true;
        }
      )

    try {
      this.isInvite = _.findWhere(this.authService.getApplictionControls().associatedAccounts, { accountId: this.authService.getAuthInfo().currentAccount.accountId }).roles[0] == 'admin';
    } catch (e) {
      this.isInvite = false;
    }

    let paramsEmail;

      paramsEmail = {
        userId: this.authService.getUserId(),
        streamId : this.workflowService.getCurrentBt(true)._id,
        // streamId: this.authService.smartAssistBots.map(x=>x._id),
        orgId: this.authService.getOrgId()
      }


    this.service.invoke('get.share.email', paramsEmail).subscribe(
      res => {
        this.emailShare = res;
      },
      err => {
        this.workflowService.showError(err, this.translate.instant("HEADER.FAILED_SHARED_EMAIL"));
      }
    );
    this.service.invoke('get.bt.roles', paramsEmail).subscribe(
      res => {
        this.botRoles = res;
      },
      err => {
        this.workflowService.showError(err, this.translate.instant("HEADER.FAILED_FETCH_BOT"));
      }
    );

  }

  goToPlatform() {
    const url = this.workflowService.resolveHostUrl() + "/botbuilder";
    this.service.invoke('get.token').subscribe(res => {
      if (res.token) {
        const qp = {
          streamId: this.workflowService.getCurrentBt()._id,
          selectedAccount: (this.localStoreService.getSelectedAccount() && this.localStoreService.getSelectedAccount().accountId) || (this.authService.getSelectedAccount() && this.authService.getSelectedAccount().accountId),
          usecaseType: 'conversation',
          dgId: "",
          state: 'indevelopment',
          appLanguage: this.localStoreService.appLanguage,
          selectedBotLanguage: this.workflowService.getCurrentBt().defaultLanguage
        }
        const encodedQueryParams = btoa(JSON.stringify(qp));
        const finalUrl = `${url}/?qp=${encodedQueryParams}#id_token=${res.token}`;
        window.open(finalUrl, "_self")
      }
    });
  }

  removeCallFlowExpand() {
    let toogleObj = {
      "title": "Dashboard",
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    $(".dashboardContainer").removeClass("callFlowExpand");
    this.pagetitle = toogleObj.title;
    this.toShowAppHeader = toogleObj.toShowWidgetNavigation;
    this.fromCallFlow = "";
    this.ref.detectChanges();
  }


  navigateToCurrent() {
    const path = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([path]);
    });
  }

  stateSelect(state) {
    //enterpriseNpublic or private
    if (state.id == 'published' && ((this.workflowService.deflectApps().visibility && this.workflowService.deflectApps().visibility.namespace == 'private') || (this.workflowService.deflectApps()[0] && this.workflowService.deflectApps()[0].visibility.namespace == 'private'))) {
      this.notificationService.notify(this.translate.instant("HEADER.APP_NOT_PUB"), 'error');
      return;
    }
    this.selectedAppState = state.label;
    this.workflowService.appState = state.id;
    this.navigateToCurrent();
  }

  inviteDialog() {
    this.inviteDevelopers();
    this.workflowService.headerInitCalls$.next();
    const dialogRef = this.dialog.open(InviteDialogComponent);
    const params = {
      userId: this.authService.getUserId(),
      streamId : this.workflowService.getCurrentBt(true)._id,
      // streamId: this.authService.smartAssistBots.map(x=>x._id),
      'isAgentAssistApp':true

    }
    dialogRef.afterClosed().subscribe(res => {
      let usersList = [];
      _.each(this.sharedToList?.users, function (val) {
        usersList.push({
          userId: val._id,
          roleId: val.roleInfo[0]._id
        });
      });
      if (_.isArray(res)) {
        res = res.map(val => {
          return {
            emailId: val.email,
            roleId: _.findWhere(this.botRoles, { role: 'Bot Developer' })._id
          }
        });
        usersList = usersList.concat(res);
        res = _.map(res, function (r) {
          return _.pick(r, 'emailId');
        });
        const payloadEmails = {
          emailIds: res
        };
        const payload = {
          codevelopers: {
            groups: [],
            users: usersList
          }
        };
        const headers = new HttpHeaders().set('agentassist' , 'true').set('x-http-method-override','put');
        this.service.invoke('put.sharebot', params, payload, headers).subscribe(
          res => {
            this.notificationService.notify(this.translate.instant("HEADER.BOT_SHARED_SUCCESSFUL"), 'success');
          }, err => {
            this.workflowService.showError(err, this.translate.instant("HEADER.FAILED_SHARE_BOT"));
          }
        );
        // this.service.invoke('post.invite.user', params, payloadEmails).subscribe(
        //   res => {
        //     this.notificationService.notify('Account has been shared successfully', 'success');

        //   },
        //   err => {
        //     try {
        //       this.notificationService.notify(err.error.message, 'error')
        //     } catch (e) {
        //       this.notificationService.notify('Failed to share the bot', 'error');
        //     }
        //   });
      }
    });
  }

  inviteDevelopers(){
    const params = {
      userId: this.authService.getUserId(),
      streamId : this.workflowService.getCurrentBt(true)._id,
      // streamId: this.authService.smartAssistBots.map(x=>x._id),
      'isAgentAssistApp':true

    }
    this.service.invoke('get.shared.developers', params).subscribe(
      res => {
        this.isSharedDeveloper = true;
        this.sharedToList = res;
        this.isSharedDevError = false;
      },
      err => {
        this.isSharedDeveloper = true;
        this.workflowService.showError(err, this.translate.instant("HEADER.FAILED_FETCH"));
        this.isSharedDevError = true;
      }
    )
  }

  langSwitchDialog() {
    const dialogRef = this.dialog.open(LangSwitchDialogComponent, {
      width: '530px',
      minHeight: '312px',
      panelClass: "app-language-switch-dialog",
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res)
    });
  }

  switchAccount() {
    localStorage.removeItem("selectedAccount");
    localStorage.setItem("queryParams", JSON.stringify({
      'return_to': this.appUrlsService.completeAppPath(),
      'showLogin': 'true',
      'comingFromKey': 'isAgentAssistApp',
      'hideSSOButtons': 'true',
      'hideResourcesPageLink': 'true'
    }))
    window.location.href = this.appUrlsService.marketURL();
  }

  importManageIntents() {
    this.kgService.importFaqs.next();
  }

  trainKG() {
    this.kgService.trainKG$.next();
  }

  navigateToDoc() {
    window.open('https://docs.kore.ai/agentassist/');
    this.mixPanel.postEvent('SG - Help doc viewed', this.mixPanel.events['SG - Help doc viewed']);
  }


  onLauchConsole() {
    const url = window.location.protocol + '//' + window.location.host + "/agentdesktop"
    window.open(url)
  }



  support() {
    this.showSupportWindow = !this.showSupportWindow;
    setTimeout(() => {
      this.initChat();
      this.removeCommentSection();
    })
  }

  initChat() {
    this.botOptions = {
      logLevel: 'debug',
      koreAPIUrl: environment.SUPPORT_API_SERVER_URL + '/api/',
      koreSpeechAPIUrl: '',
      ttsSocketUrl: '',
      recorderWorkerPath: '../libs/recorderWorker.js',
      koreAnonymousFn: () => { },
      JWTUrl: '',
      userIdentity: '', // Provide users email id here
      botInfo: {
        name: environment.BOT_NAME || 'SmartAssist', //this.selectedApp.name || '',
        icon: this.selectedApp.icon || '',
        _id: environment.BOT_ID
      },
      clientId: environment.CLIENT_ID,
      clientSecret: environment.CLIENT_SECRET_ID,
      assertionFn: (options, callback) => {
        this.service.invoke('post.sts.support').subscribe(data => {
          options.assertion = data.jwt;
          options.handleError = this.koreBot.showError;
          options.chatHistory = this.koreBot.chatHistory;
          options.botDetails = this.koreBot.botDetails;
          callback(null, options);
          setTimeout(() => {
            if (this.koreBot && this.koreBot.initToken) {
              this.koreBot.initToken(options);
              this.applyStyles(this.theme)
            }
          }, 2000);

        }, err => {
          this.koreBot.showError(JSON.stringify(err));
        })
      },
    };
    // this.botOptions.koreSocketUrl = () => 'ws://dummy';


    this.chatConfig = {
      botOptions: this.botOptions,
      allowIframe: false,
      isSendButton: false,
      isTTSEnabled: false,
      isSpeechEnabled: false,
      allowGoogleSpeech: false,
      allowLocation: false,
      loadHistory: true,
      messageHistoryLimit: 10,
      autoEnableSpeechAndTTS: false,
      graphLib: 'd3',
      chatBridge: {},
      container: '.chat-container-app',

    };

    this.chatConfig.chatBridge.beforeRenderMsg = this.beforeRenderMsg.bind(this);
    this.chatConfig.chatBridge.closeChatWindow = this.closeChatWindow.bind(this);

    this.koreBot = koreBotChat();
    this.koreBot.show(this.chatConfig);
    var uuId = this.authService.getUserId();
    $('.openChatWindow').click(function () {
      this.koreBot.show(this.chatConfig);
    });
    //AgentDesktop(uuId);
  }

  beforeRenderMsg() {
    setTimeout(() => {
      this.applyStyles(this.theme);
    });
  }

  closeChatWindow() {
    this.showSupportWindow = false;
  }

  applyStyles(widget?: SDKWidgetModel) {

    if (!widget) { return; }
    this.koreBot?.botDetails(widget)
  }

  getWidget() {
    if (!this.authService.isAuthenticated() || !this.workflowService.getCurrentBt()) return;
    const _params = { 'streamId': this.workflowService.getCurrentBt()._id }
    this.subs.sink = this.service.invoke('get.settings.widget', _params).subscribe(res => {
      this.theme = res;
    }, err => {
      this.notificationService.showError(err, this.translate.instant('TESTING.GET_THEME_FAILED'));
    })
  }

  removeCommentSection() {
    $('.kore-chat-window').removeClass('commetSectionDiv');
  }

  navigateToHome() {
    this.appService.hideHomePage$.next(false);
    this.router.navigate(['home']);
  }

  ngOnDestroy() {
    this.initSub.unsubscribe();
    this.subs.unsubscribe();
  }

}
