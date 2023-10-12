import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, from, Subject } from 'rxjs';
import { DeflectAppConfig } from '../data/configurations.model';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { environment } from '@kore.environment';
import { AppService } from './app.service';
import { LocalStoreService } from './localstore.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class workflowService {
  mainTab;
  link;
  directFlag = false;
  editInPlatform = false;
  emailBotEIBP: any;
  emailBool = false;
  dialogTaskState: any;
  deflectAppsData: any = [];
  appCreationFlow: boolean = false;
  configurationData: DeflectAppConfig = null;
  completedPercentage: number = 0;
  private currentBtDetails: any;
  currentSelectedBotDetails: any;
  _seedData: any;
  seedData$: BehaviorSubject<any> = new BehaviorSubject(null);
  startNodeDropDownMenu = false;
  isClickedOnIntentBranch = false;
  isClickedOnDropDown = false;
  selectedNodeDetails: any;
  disablePerfectScroll: boolean;
  _planDetails: any;
  private appLevel: 'configured' | 'published' = 'configured';
  private _planType: string = 'None';
  updateAvailBal$ = new Subject();
  createCallflowVersion = new Subject();
  createCallflowVersion$ = this.createCallflowVersion.asObservable();
  headerInitCalls$ = new Subject();
  updateBotDetails$ = new Subject();
  closePublishDialog$ = new Subject();
  switchBt$ = new Subject();
  conversationConfig$ = new Subject();
  detailsFromVoiceCp;
  useCasesDetails;

  loadBotStore$ = new Subject();
  openInstallTemplates$ = new Subject<any>();
  supportedDeflectLangs: string [];
  onPremise: boolean = false;
  doOpenInstallTemps: boolean;
  openBotSelection$ = new Subject();
  processStepApp: any;
  mode:string;

  selectedBotDailogId: any;
  // To check condition type of goto stencil
  gotoStencilConditionSource = new Subject<string>();
  gotoStencilCondition$ = this.gotoStencilConditionSource.asObservable();
  // To access header component event in dashboard component
  setupProcessAppSource = new Subject<string>();
  setupProcessApp$ = this.setupProcessAppSource.asObservable();
  callflow: any;
  callflowStep: any;

  getCurrentSelectedBotId: any;

  btNavigation$: Subject<any> = new Subject<any>();
  private _tokenSource =  new Subject();
  _tokenSource$ = this._tokenSource.asObservable();
  getFlowStatus = new Subject();
  flowPublished = false;

  isChatsOptionsUpdated = false;
  hideTestFlow: boolean;
  UnifiedPlatform = false;

  constructor(
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appService: AppService,
    private local: LocalStoreService,
    private route: ActivatedRoute
  ) {
    this.onPremise = environment.ON_PREMISE;
    this.registerEventsFromParent();
  }

  public get appState() {
    return this.appLevel;
  }

  createflowVersion(data){
    this.createCallflowVersion.next(data);
  }
  public set appState(id: 'configured' | 'published') {
    this.appLevel = id;
  }

  public get planDetails() {
    return this._planDetails;
  }
  public set planDetails(planDetails) {
    if (planDetails.planType !== 'None') {
      planDetails.creditsLeft = planDetails.totalCredits - planDetails.usedCredits;
    }
    this._planDetails = planDetails;
  }


  showAppCreationHeader(value?) {
    if (value === true || value === false) {
      this.appCreationFlow = value;
    }
    return this.appCreationFlow;
  }
  
  FlowStatus(event){
    this.getFlowStatus.next(event);
  }

  showError(err: any, msg: string) {
    try {
      if (err.error.message) {
        this.notificationService.notify(err.error.message, 'error');
      } else if (typeof err.error === 'string') {
        this.notificationService.notify(err.error, 'error');
      } else {
        this.notificationService.notify(err.error.errors[0].msg, 'error');
      }
    } catch (e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  deflectApps(appData?) {
    if (appData) {
      this.deflectAppsData = appData;
    }
    return this.deflectAppsData;
  }

  setCurrentBt(bt: any) {
    console.log(bt);
    this.currentSelectedBotDetails = bt;
    this.currentBtDetails = bt;
  }

  setEditInBotPlatform() {
    this.editInPlatform = true;
  }

  setEmailEIBP() {
    this.emailBool = true;
  }

  setemailDetails() {
    this.emailBool = false;
    this.selectedBotDailogId = '';
    this.dialogTaskState = "";
    this.emailBotEIBP = '';
  }

  // getSelectedSuveyBotForEIBT(bt) {
  //   this.currentSelectedBotDetails = bt;
  // }

  getCurrentBt(automationBot?: boolean) {
    if (automationBot) {
      return { ...this.currentBtDetails };
    } else {
      return { ...this.appService.selectedInstanceApp$.value };
    }
  }

  getCurrentBtSmt(automationBot?: boolean) {
    if (automationBot) {
      if(!window.location.href.includes('smartassist') && !this.UnifiedPlatform) {
        return { ...this.currentBtDetails };
      } else if(this.UnifiedPlatform) {
        let unifiedBot: any;
        let selectedBotObj = this.local.getSelectedBotDetails();
        // console.log("🚀 ~ file: workflow.service.ts:185 ~ workflowService ~ getCurrentBtSmt ~ selectedBotObj:", selectedBotObj)
        // unifiedBot['_id'] = selectedBotObj._id;
        return selectedBotObj;
      } else {
        let selAcc = this.local.getSelectedAccount();
        let smBotObj = selAcc['instanceBots'][0];
        smBotObj._id = smBotObj.instanceBotId;
        return smBotObj;
      }
    }
  }

  selectedCallflowStep(value?) {
    if (value) {
      this.callflowStep = value;
    }
    return this.callflowStep;
  }

  selectedCallflow(value?) {
    if (value) {
      this.callflow = value;
    }
    return this.callflow;
  }

  // To send goToStencil type to subscribe componenent
  sendConditionType(conditionType: string) {
    this.gotoStencilConditionSource.next(conditionType);
  }
  // To send setup status to subscribe componenent
  sendSetupStatus(conditionType: string) {
    this.setupProcessAppSource.next(conditionType);
  }
  
  redirectPlatform(streamId: string, selectedAccount: string, btLanguage: string, ucType: 'dialog' | 'conversation', dgId: string, state: 'indevelopment' | 'published', appLanguage: string) {
    const url = this.resolveHostUrl() + "/botbuilder";
    this.service.invoke('get.token').subscribe(res => {
      if (res.token) {
        const qp = {
          streamId: streamId,
          selectedAccount: selectedAccount,
          selectedBotLanguage: btLanguage,
          usecaseType: ucType,
          dgId: dgId,
          state: state,
          appLanguage: appLanguage
        };
        const encodedQueryParams = btoa(JSON.stringify(qp));
        const finalUrl = `${url}/?&qp=${encodedQueryParams}#id_token=${res.token}`;
        window.open(finalUrl, "_self")
      }
    });
  }

  seedData(_data?) {
    if (_data) {
      this._seedData = _data;
      this.seedData$.next(_data);
      return;
    }
    return this._seedData;
  }
  
  resolveHostUrl(): string {
    const url = window.location.protocol + '//' + window.location.host;
    if (url === 'https://dev-app.smartassist.ai' || url === 'https://dev-smartassist.kore.ai') return 'https://agentassist-dev.kore.ai';
    if (url === 'https://qa-app.smartassist.ai') return 'https://qa-bots.kore.ai';
    if (url === 'https://qa1-app.smartassist.ai' || url === 'https://qa1-smartassist.kore.ai') return 'https://qa1-bots.kore.ai';
    if (url === 'https://uat-app.smartassist.ai' || url === 'https://uat-smartassist.kore.ai') return 'https://uat.kore.ai';
    if (url === 'https://staging-app.deflect.ai' || url === 'https://staging-app.smartassist.ai' || url === 'https://staging-smartassist.kore.ai') return 'https://staging-bots.korebots.com';
    if (url === 'https://pilots-app.deflect.ai' || url === 'https://pilots-app.smartassist.ai') return 'https://pilot-bots.kore.ai';
    if (url === 'https://demo-app.smartassist.ai' || url === 'https://demo-app-smartassist.kore.ai') return 'https://uat-demo.kore.ai';
    if (url === 'https://app.deflect.ai' || url === 'https://app.smartassist.ai' || url === 'https://smartassist.kore.ai') return 'https://bots.kore.ai';
    if (url === 'https://smartassist-jp.kore.ai') return 'https://jp-bots.kore.ai';
    if(url === 'http://localhost:4201') return 'https://dev-agentassist.kore.ai';
    return url;
  }

  // To check templateType 
  toGetJwtToken(event){
    this._tokenSource.next(event);
  }

  registerEventsFromParent() {
    const self = this;
    const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    const eventer = window[eventMethod];
    const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

    // Listen to message from child window
    eventer(messageEvent,  (e) => {
        // console.log('parent received message!:  ', e.data);
        if (e.data && e.data.action) {
            const data = e.data;
            switch (data.action) {
                case 'userTemplates':
                    if (e.data) {
                        this.toGetJwtToken(e.data);
                    }
                break;
                default:
                break;
            }

        }
    }, false);
  }

  isUnifiedPlatform(){
    if(!this.UnifiedPlatform){
    let element = this.route.snapshot.queryParams;
    this.UnifiedPlatform = (element?.isUnifiedPlatform === 'true' || element?.isUnifiedPlatform === true) 
    ? true : false;
      return this.UnifiedPlatform;
    }else{
      return this.UnifiedPlatform;
    }
  }
}
