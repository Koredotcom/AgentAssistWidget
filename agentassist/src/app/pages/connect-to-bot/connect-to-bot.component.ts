import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SubSink } from 'subsink';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SDKWidgetModel } from '../settings/settings.model';
import { AppService } from '@kore.services/app.service';

declare const koreBotChat: any;
declare const $: any;
declare const c2c_init: any;
declare const c2c_call: any;
declare const c2c_hangup: any;
declare const guiSendDTMF: any;
@Component({
  selector: 'app-connect-to-bot',
  templateUrl: './connect-to-bot.component.html',
  styleUrls: ['./connect-to-bot.component.scss']
})
export class ConnectToBotComponent implements OnInit {
  activeTabIndex: number = 0;
  displayMode: 'call' | 'chat' | 'home' = 'home';
  subs = new SubSink();
  voiceChannelTypes = { 'audiocodes': 'audiocodes', 'twiliovoice': 'twiliovoice' };
  phoneNumbers: Array<any> = [];
  channels: Array<any> = [];
  selectedPhoneNum: any = {};
  callStatus: string = 'Dialing...';
  audioCodesConfig: any;
  phoneNumber: string = "";
  isMuted: boolean = false;
  callFlows: any = [];
  selectedCallFlow: any = {};
  isCallFlowSelected: boolean = false;
  isFlowStateSelected: boolean = false;
  botOptions: any;
  selectedApp: any;
  koreBot: any;
  theme: any;
  chatConfig: any;
  instanceAppDetails: any;
  isMinimized: boolean = false;
  isCallInitiated: boolean = false;
  isChatInitiated: boolean = false;

  @Input() isBotWindowMinized: boolean;
  @Input() selectedFlow: any;
  @Output() close = new EventEmitter;

  constructor(private translate: TranslateService,
    private service: ServiceInvokerService,
    private appService: AppService,
    private notificationService: NotificationService,
    public workflowService: workflowService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.getCurrentBt(); //this.workflowService.deflectApps().length ? this.workflowService.deflectApps()[0] : this.workflowService.deflectApps();
    this.audioCodesConfig = this.workflowService.seedData()?.smartAssistSeedData?.audioCodesConfig || {}
    this.getWidget();
    if(this.selectedFlow?._id){
      if(this.selectedFlow?.source?.type == 'call'){
        this.activeTabIndex = 1;
        this.onSelectCallFlow(this.selectedFlow);
        this.onSelectFlowVersion('configured');
      }else if(this.selectedFlow?.source?.type == 'chat'){
        this.onSourceSelect('chat');
      }
    }
  }

  ngOnChanges(){
    if(!this.isBotWindowMinized){
      this.isMinimized = false;
    }
  }

  onSelectNumber(phone){
    console.log("number", phone);
    localStorage.setItem("X-PHONE-NUMBER", phone?.phoneNumber);
    localStorage.setItem("X-CALLFLOW-ID", "");
    localStorage.setItem("X-CALLFLOW-STATE", "");
    this.selectedPhoneNum = phone;
    this.initCall();
  }

  onTabChange(index: number){
    this.activeTabIndex = index;
    if(index == 0){
      localStorage.removeItem("X-CALLFLOW-ID");
      localStorage.removeItem("X-CALLFLOW-STATE");
      this.selectedCallFlow = {};
    }
    else if(index == 1){
      localStorage.removeItem("X-PHONE-NUMBER");
      this.isCallFlowSelected = false;
      this.getExpeirences();
      this.selectedPhoneNum = {};
    }
  }

  onSourceSelect(source){
    this.displayMode = source;
    if(source == 'call' && this.phoneNumbers?.length == 0){
      this.subs.sink = this.appService.selectedInstanceApp$.subscribe(data => {
        this.instanceAppDetails = data;
        this.getListOfPhoneNumbers();
      });
    }else if(source == 'chat'){
      setTimeout(() => {
        this.initChat();
        this.removeCommentSection();
      })
    }
  }

  backToMainTabs(){
    this.displayMode = "home";
    this.activeTabIndex = 0;
  }

  getListOfPhoneNumbers() {
    this.phoneNumbers = [];
    const params = {
      instanceId : this.instanceAppDetails._id
    }
    this.service.invoke('get.voiceList', params).subscribe(voiceList => {
      let didNumbers = []; 
      voiceList?.sipTransfers.forEach(sip => {
        (sip.didNumber || []).forEach(d => {
          if (!didNumbers.includes(d)) {
            didNumbers.push({'phoneNumber': d, 'countryCode': ''});
          }
        })
      });
      this.phoneNumbers = [...voiceList?.phoneNumbers, ...didNumbers];
    })
  }

  closeWindow(){
    this.close.emit();
    if(this.displayMode == 'call' && (this.selectedPhoneNum?.phoneNumber || this.isFlowStateSelected)){
      this.onClickHome(true);
    }
  }

  initCall() {
    this.service.invoke('post.sts').subscribe(data => {

      const _payload = {
        assertion: data.jwt,
        botInfo: {
          chatBot: "Bot",
          taskBotId: this.workflowService.getCurrentBt()._id
        },
        token: {}
      }
      this.service.invoke('post.jwtgrant', {}, _payload).subscribe(res => {

        c2c_call({
          loginStateChanged: (isLogin, cause) => {
            switch (cause) {
              case "connected":
                break;
              case "disconnected":

                break;
              case "login failed":

                break;
              case "login":

                break;
              case "logout":

                break;
            }
            console.log("Testing Component :: ", isLogin, cause);
          },

          outgoingCallProgress: (call, response) => { },

          callTerminated: (call, message, cause, redirectTo) => {
            this.onClickHome();
            if(this.selectedFlow?._id)
              this.minimizeWindow();
          },

          callConfirmed: (call, message, cause) => {
            this.callStatus = "call connected";
          },

          callShowStreams: (call, localStream, remoteStream) => { },

          incomingCall: (call, invite) => { },

          callHoldStateChanged: (call, isHold, isRemote) => { },
          accessToken: res.authorization.accessToken,
          botName: this.workflowService.getCurrentBt()._id,
          serverConfig: this.audioCodesConfig
        });

        this.isCallInitiated = true;

      }, err => {
        this.notificationService.showError(err, this.translate.instant('COMMON.SOMETHING_WENT_WRONG'));
      })
    }, err => {
      this.notificationService.showError(err, this.translate.instant('COMMON.SOMETHING_WENT_WRONG'));
    })
  }

  onClickHome(endCall?: boolean) {
    if(this.selectedFlow?._id){
      this.selectedFlow = {};
      localStorage.removeItem("X-CALLFLOW-ID");
      this.closeChatWindow();
    }
    this.displayMode = 'home';
    this.selectedPhoneNum = {};
    this.isCallInitiated = false;
    this.isChatInitiated = false;
    // this.showMsg = true;
    // this.phoneNumber = "";
    // this.showKeyPad = true;
    this.callStatus = "Dialing...";
    this.phoneNumber = "";
    if (endCall) {
      c2c_hangup();
      localStorage.removeItem("X-PHONE-NUMBER");
    }
    if(this.isFlowStateSelected){
      this.isFlowStateSelected = false;
      localStorage.removeItem("X-CALLFLOW-STATE");
    }

    if (this.koreBot) { this.koreBot.destroy(); }
  }

  minimizeWindow(){
    this.isMinimized = true;
    let currentStatus: any = {};
    currentStatus['isCallInitiated'] = this.isCallInitiated;
    currentStatus['isChatInitiated'] = this.isChatInitiated;
    this.close.emit(currentStatus);
  }

  onClickDigit(digit) {
    this.onInput(digit);
    this.phoneNumber = this.phoneNumber + '' + digit;
    setTimeout(() => $('#dtmfInput').focus());
  }

  onInput($event) {
    const char = typeof $event === 'object' ? $event.data || "" : $event;
    if (!char) return;
    guiSendDTMF(char);
    // clearTimeout(this.timeout);
    // this.dtmfCode = this.dtmfCode + char;

    // this.timeout = setTimeout(() => {
    //   guiSendDTMF(this.dtmfCode);
    //   this.dtmfCode = "";
    // }, 3000);
  }

  toggleVoice() {
    this.isMuted = !this.isMuted;
  }

  getExpeirences () {
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt()._id,
      name: ""
    }
    this.subs.sink = this.service.invoke('get.channelsCallflowList', params, {limit: -1}).subscribe(res => {
      this.callFlows = (res.results);
    }, err => {
      this.notificationService.showError(err);
    })
  }

  onSelectCallFlow(callFlow){
    this.isCallFlowSelected = true;
    this.selectedCallFlow = callFlow;
    if(this.selectedCallFlow?.source?.type == "chat"){
      this.onSourceSelect('chat');
    }
  }

  backToCallFlows(){
    this.isCallFlowSelected = false;
    this.selectedCallFlow = {};
    localStorage.removeItem("X-CALLFLOW-STATE");
  }

  onSelectFlowVersion(flowState){
    this.isFlowStateSelected = true;
    if(this.selectedCallFlow?.source?.type == "call"){

      if(flowState == "published"){
        localStorage.setItem("X-CALLFLOW-ID", this.selectedCallFlow?.publishedCfId);
      }else{
        localStorage.setItem("X-CALLFLOW-ID", this.selectedCallFlow?._id);
      }
      localStorage.setItem("X-CALLFLOW-STATE", flowState);
      localStorage.setItem("X-PHONE-NUMBER", "");
      this.displayMode = 'call';
      console.log(this.displayMode == 'call' && ((this.activeTabIndex == 0 && this.selectedPhoneNum?.phoneNumber) || (this.activeTabIndex == 1 && this.isFlowStateSelected)),this.displayMode,"<<<<<< displayMode", this.activeTabIndex, this.selectedCallFlow);

      this.initCall();
      
    }else if(this.selectedCallFlow?.source?.type == "chat"){
      this.onSourceSelect('chat');
    }
  }

  initChat() {
    this.botOptions = {
      logLevel: 'debug',
      koreAPIUrl: this.workflowService.resolveHostUrl() + '/api/',
      koreSpeechAPIUrl: '',
      ttsSocketUrl: '',
      recorderWorkerPath: '../libs/recorderWorker.js',
      koreAnonymousFn: () => { },
      JWTUrl: '',
      userIdentity: '', // Provide users email id here
      botInfo: {
        name: this.selectedApp.name || '',
        icon: this.selectedApp.icon || '',
        _id: this.selectedApp._id,
        customData: [
          {
            callFlowId: this.selectedFlow?._id || '',
            state: this.selectedFlow?.state
          }
        ] 
      },
      clientId: '',
      clientSecret: '',
      assertionFn: (options, callback) => {
        this.service.invoke('post.sts').subscribe(data => {
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
      container: '.live-chat-container-app',
      multiPageApp: {
        enable: false,              //set true for non SPA(Single page applications)
        userIdentityStore: 'localStorage',//'localStorage || sessionStorage'
        chatWindowStateStore: 'localStorage'//'localStorage || sessionStorage'
    }, 
    };

    this.isChatInitiated = true;
    this.chatConfig.chatBridge.beforeRenderMsg = this.beforeRenderMsg.bind(this);
    this.chatConfig.chatBridge.closeChatWindow = this.closeChatWindow.bind(this);
    this.chatConfig.chatBridge.minimizeChatWindow = this.minimizeChatWindow.bind(this);
    
    this.koreBot = koreBotChat();
    this.koreBot.show(this.chatConfig);
    $('.openChatWindow').click(function () {
      this.koreBot.show(this.chatConfig);
    });
  }

  removeCommentSection() {
    $('.kore-chat-window').removeClass('commetSectionDiv');
  }

  beforeRenderMsg() {
    setTimeout(() => {
      this.applyStyles(this.theme);
    });
  }

  applyStyles(widget?: SDKWidgetModel) {
    if (!widget) { return; }
    this.koreBot?.botDetails(widget)
  }

  getWidget() {
    const _params = { 'streamId': this.workflowService.getCurrentBt()._id }
    this.service.invoke('get.settings.widget', _params).subscribe(res => {
      this.theme = res;
    }, err => {
      this.notificationService.showError(err, this.translate.instant('TESTING.GET_THEME_FAILED'));
    })
  }

  closeChatWindow() {
    // this.displayMode = 'home';
    this.isChatInitiated = false;
    this.close.emit();
  }

  minimizeChatWindow(){
    this.isChatInitiated = true;
    this.minimizeWindow();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.koreBot) { this.koreBot.destroy(); }
    localStorage.removeItem("X-CALLFLOW-ID");
    localStorage.removeItem("X-CALLFLOW-STATE");
    localStorage.removeItem("X-PHONE-NUMBER");
  }

}
