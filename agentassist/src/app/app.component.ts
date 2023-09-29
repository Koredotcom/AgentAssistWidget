
import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute, ParamMap } from '@angular/router'
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';


import * as _ from 'underscore';
import { AppService } from '@kore.services/app.service';
import { ScriptLoaderService } from '@kore.services/scriptloader.service';

declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  loading = false
  isFullScreen: boolean = false;
  appsData: any;
  showIframe = false;
  url: string;
  iframeEl: any;
  messageButton: any;
  results: any;
  isBufferIFrame: boolean;
  ldBtStore: Subscription;
  showChatWindow: boolean = false;
  isInCall: boolean = false;
  isInChat: boolean = false;
  isBotWindowMinized: boolean = false;

  iFrameUrl: string;
  dependentsLoaded: any;
  constructor(private router: Router,
    private authService: AuthService,
    public localstore: LocalStoreService,
    public workflowService: workflowService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private service: ServiceInvokerService,
    private appService: AppService,
    public scriptLoader: ScriptLoaderService,
  ) {

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // router.events.subscribe((event: RouterEvent) => {
    //   this.navigationInterceptor(event)
    // });
  }

  ngOnInit() {
    if(window.location.href.includes('smartassist')){
      document.getElementsByTagName('html')[0].classList.add('init-smartassist');
    }
    this.iFrameUrl = `${this.workflowService.resolveHostUrl()}/botstore/store?product=SmartAssist-App#from=SmartAssist`;
    this.ldBtStore = this.workflowService.loadBotStore$.subscribe(
      res => {
        this.showIframe = true;
        this.iframeEl = document.getElementById('botStoreIframe');
        let message: any = {
          action: 'initialCallDetail',
          userId: this.authService.getUserId(),
          loadBot: 'reloadBotstore'
        };
        this.iframeEl.contentWindow.postMessage(message, '*');
        this.service.invoke('get.token').subscribe(
          res => {
            setTimeout(() => {
              this.isBufferIFrame = false;
              this.bindEvent(window, 'message', (e) => {
                if (e.data.loadDg) {
                  this.router.navigate(['/config/usecases']);
                  this.workflowService.doOpenInstallTemps = false;
                  setTimeout(() => {
                    this.showIframe = false;
                    this.workflowService.openInstallTemplates$.next(e.data);
                  });
                } else if (e.data.action == 'closeStore') {
                  if (!this.workflowService.deflectAppsData?.length) {
                    this.workflowService.openBotSelection$.next();
                  }
                  this.showIframe = false;
                }
              });
            }, 2000);
          });
      }
    );

    // To get JWT token
    // const browserLang = this.translate.getBrowserLang();
    // this.localstore.appLanguage = this.localstore.appLanguage || (browserLang.match(/ja/) ? browserLang : 'en');

    this.workflowService._tokenSource$
      .subscribe(data => {
        if (data['action'] === 'userTemplates') {
          let tokenInfo: any = {
            action: 'userTemplates',
            jwtToken: this.authService.getAccessToken()
          }
          this.iframeEl.contentWindow.postMessage(tokenInfo, '*');
        }
    });

    const lang = this.authService.externalQp?.appLanguage || this.localstore.appLanguage;
    if (lang) { this.translate.use(lang); }

    this.route.queryParamMap.subscribe(paramMap => {
      let qParamLang = paramMap.get('lang');

      if (qParamLang) {
        this.localstore.appLanguage = qParamLang;
        this.translate.use(this.localstore.appLanguage);
        var newUrl = this.removeParam("lang", window.location.href);
        window.location.href = newUrl;
      }

      $("body").removeClass((index, className) => {
        return (className.match(/(^|\s)app-lang-\S+/g) || []).join(' ');
      });

      $('body').addClass('app-lang-' + this.localstore.appLanguage);
    });

    // this.appsData = this.workflowService.deflectApps();
    this.onResize();

    this.scriptLoader.loadScripts();
  }

  bindEvent(element, eventName, eventHandler) {
    element.addEventListener(eventName, eventHandler, false);
  }

  // if (_self.appsData.length === 0) {
  //   // if (_self.router.url !== '/onboarding' && _self.router.url !== '/config' && _self.router.url !== '/manage-deflection') {
  //   //   _self.router.navigate(['/apps']);
  //   // }
  //   // if (_self.router.url === '/config' ||  _self.router.url === '/manage-deflection') {
  //   //   return;
  //   // }
  //   _self.router.navigate(['/apps']);
  //   setTimeout(() => {
  //     $(".toShowAppHeader").addClass('d-none');
  //   }, 350);
  // }
  // const route = _self.getAuthorizedRoute(_self.url);
  //  if (_self.appService.instanceApps.length === 0) {
  //   const route = _self.getAuthorizedRoute(_self.url);
  //   _self.router.navigate([(route || 'onboarding')]);
  //   // return _self.router.navigate(['onboarding']);
  // }
  // const route = _self.getAuthorizedRoute(_self.url);
  
  navigationInterceptor(event: RouterEvent): void {
    // const _self = this;
    // this.authService.deflectApps.subscribe(function (res) {
    //   if (res){
    //     _self.appsData = res;
    //     // this.appService.showGuideLink$?.next(false);
    //   };
    // })
    // this.authService.deflectApps.subscribe(function (res) {
    //   if (!res && event['url'] && !event['url']?.includes('/onboarding')){
    //     _self.router.navigate([(_self.url || '/onboarding')]);
    //     _self.isFullScreen = false;
    //     _self.loading = false;
    //   };
    // })
    // const _self = this;
    // if (event instanceof NavigationStart) {
    //   if (event.url.indexOf('/chathistory') == 0) {
    //     _self.isFullScreen = true;
    //     return;
    //   } else {
    //     _self.isFullScreen = false;
    //   }
    //   this.authService.deflectApps.subscribe(function (res) {
    //     if (!res) return;
    //     _self.appsData = res;
    //     _self.loading = true;
    //   })
    // }
    // if (event instanceof NavigationEnd) {
    //   _self.url = event.url;
    //   this.authService.deflectApps.subscribe(function (res) {
    //     if (!res) return;
    //     _self.appsData = res;
    //     _self.loading = false;
    //     if (!_self.authService.smartAssistBots) {
    //       _self.router.navigate([(_self.url || 'onboarding')]);
    //     }

    //     if (_self.workflowService.doOpenInstallTemps || _self.authService.hasToken) {
    //       _self.router.navigate([(_self.url || '/onboarding')]);
    //     }
    //   })

    //   this.appService.showGuideLink$.next(false);
    // }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    // if (event instanceof NavigationCancel) {
    //   this.loading = false
    // }
    // if (event instanceof NavigationError) {
    //   this.loading = false
    // }
  }
  

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.workflowService.disablePerfectScroll = window.innerWidth <= 600;
  }


  ngOnDestroy() {
    this.ldBtStore.unsubscribe();
  }

  removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === key) {
          params_arr.splice(i, 1);
        }
      }
      if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
  }
}


/*  getAuthorizedRoute(url: string): string {
     const roles = this.authService.getSelectedAccount()?.roles;
    const isDeveloper = this.authService.getSelectedAccount()?.isDeveloper;
    let route: string;

    if (isDeveloper) return '/onboarding';

    for (let role of roles) {
      if (role === 'admin') {
        return '/onboarding';
      } else if (role === 'SmartAssist Agent Admin') {
        return '/config/agents';
      } else {
        const permissions = this.authService.getSelectedAccount()?.permissions;

        switch (url) {
          case '/config/agents':
            if (permissions.find(f => f === 'AGENT_VIEW' || f === 'AGENT_GROUP_VIEW')) return url;
          case '/config/agent-assist':
            if (permissions.find(f => f === 'STANDARD_RESPONSE_VIEW')) return url;
          case '/config/wait-experiences':
            if (permissions.find(f => f === 'WAITING_EXPERIENCE_VIEW')) return url;
          case '/config/skills':
            if (permissions.find(f => (f === 'SKIL_VIEW' || f === 'SKILL_GROUP_VIEW'))) return url;
          case '/config/queue-settings':
            if (permissions.find(f => (f === 'QUEUE_SETTINGS_VIEW'))) return url;
          case '/config/operationalHours':
            if (permissions.find(f => (f === 'HOURS_OF_OPERATION_VIEW'))) return url;
          case '/config/roleManagement':
            if (permissions.find(f => (f === 'ROLE_MANAGEMENT_VIEW'))) return url;
          case '/config/agentStatus':
            if (permissions.find(f => (f === 'AGENT_STATUS_SETTINGS_VIEW'))) return url;
          case '/config/languages':
            if (permissions.find(f => (f === 'LANGUAGE_SETTINGS_VIEW' || f === 'WAITING_EXPERIENCE_FULL'))) return url;
          case '/config/widgets':
            if (permissions.find(f => (f === 'AGENT_WIDGET_MANAGEMENT_VIEW'))) return url;
          case ('/config/agent-settings'):
            if (permissions.find(f => (f === 'LANGUAGE_SETTINGS_VIEW' || f === 'AGENT_STATUS_SETTINGS_VIEW' || f === 'HOURS_OF_OPERATION_VIEW' || f === 'QUEUE_SETTINGS_VIEW' || f === 'ROLE_MANAGEMENT_VIEW'))) return url;
        }

        for (let p of permissions) {
          switch (p) {
            case 'AGENT_VIEW':
            case 'AGENT_GROUP_VIEW':
              return '/config/agents';
            case 'STANDARD_RESPONSE_VIEW':
              return '/config/agent-assist';
            case 'WAITING_EXPERIENCE_VIEW':
              return '/config/wait-experiences';
            case 'SKILL_VIEW':
            case 'SKILL_GROUP_VIEW':
              return '/config/skills';
            case 'LANGUAGE_SETTINGS_VIEW':
              return '/config/languages';
            case 'AGENT_WIDGET_MANAGEMENT_VIEW':
              return '/config/widgets';
            case 'AGENT_STATUS_SETTINGS_VIEW':
            case 'HOURS_OF_OPERATION_VIEW':
            case 'QUEUE_SETTINGS_VIEW':
            case 'ROLE_MANAGEMENT_VIEW':
              return '/config/agent-settings';
          }
        }

        if (permissions.find(f => f === 'AGENT_DESKTOP_CONSOLE_VIEW')) {
          const url = window.location.protocol + '//' + window.location.host + "/agentdesktop";
          window.open(url, '_self');
        }
      }
    }
    return route; 
    return url; */

  // onBotClick() {
  //   if (this.isBotWindowMinized) {
  //     this.isBotWindowMinized = false;
  //     $('.kore-chat-window').removeClass('minimize')
  //   }
  //   this.showChatWindow = true;
  // }

  // closeBotWindow(event) {
  //   if (event?.isCallInitiated || event?.isChatInitiated) {
  //     this.isBotWindowMinized = true;
  //     if (event?.isCallInitiated) {
  //       this.isInCall = true;
  //     } else {
  //       this.isInChat = true;
  //     }
  //     return;
  //   }
  //   this.isInCall = false;
  //   this.isInChat = false;
  //   this.showChatWindow = false;
  // }


  // loadscripts(){
  //   const path = window.location.href
  //   if(path && (path.includes('/conversation') || path.includes('/storypreview'))){
  //     this.loadDependentLibs('assets/web-kore-sdk-storyboard/libs/anonymousassertion.js','script');
  //     this.loadDependentLibs('assets/web-kore-sdk-storyboard/kore-bot-sdk-client.js','script');
  //     this.loadDependentLibs('assets/web-kore-sdk-storyboard/UI/chatWindow.js','script');
  //     this.loadDependentLibs('assets/web-kore-sdk-storyboard/UI/chatWindow.css','style');
  //   } else { // for process
  //     this.loadDependentLibs('assets/web-kore-sdk/libs/anonymousassertion.js','script');
  //     this.loadDependentLibs('assets/web-kore-sdk/kore-bot-sdk-client.js','script');
  //     this.loadDependentLibs('assets/web-kore-sdk/UI/chatWindow.js','script');
  //     this.loadDependentLibs('assets/web-kore-sdk/UI/chatWindow.css','style');
  //   }
  //    setTimeout(()=>{
  //    this.dependentsLoaded = true;
  //    })
  // }

  // loadDependentLibs(url: string,type) {
  //   const head = <HTMLDivElement> document.head;
  //   if(type === 'script'){
  //     const script = document.createElement('script');
  //     script.innerHTML = '';
  //     script.src = url;
  //     script.async = false;
  //     script.defer = true;
  //     head.appendChild(script);
  //   } else if(type === 'style'){
  //     const style = document.createElement('link');
  //     style.id = 'client-theme';
  //     style.rel = 'stylesheet';
  //     style.href = url
  //     head.appendChild(style);
  //   }
  // }


