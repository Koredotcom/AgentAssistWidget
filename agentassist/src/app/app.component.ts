
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
  loading = true
  isFullScreen: boolean = false;
  // appsData: any;
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
    translate.setDefaultLang('en');
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event)
    })
  }

  ngOnInit() {
    if(window.location.href.includes('smartassist')){
      document.getElementsByTagName('html')[0].classList.add('init-smartassist');
    }
    const self = this;
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
    this.onResize();
    this.scriptLoader.loadScripts();
  }

  bindEvent(element, eventName, eventHandler) {
    element.addEventListener(eventName, eventHandler, false);
  }

  navigationInterceptor(event: RouterEvent): void {
    const _self = this;
    if (event instanceof NavigationStart) {
      this.authService.deflectApps.subscribe(function (res) {
        if (!res?.length) return;
        _self.loading = true;
      })
    }
    if (event instanceof NavigationEnd) {
      _self.url = event.url;
      this.authService.deflectApps.subscribe(function (res) {
        if (!res?.length) return;
        _self.loading = false;
        if (!_self.authService.smartAssistBots) {
          _self.router.navigate([('/onboarding')]);
        }
      })
    }
    if (event instanceof NavigationCancel) {
      this.loading = false
    }
    if (event instanceof NavigationError) {
      this.loading = false
    }
  }

  // getAuthorizedRoute(url: string): string{
  //   return '/onboarding';
  // }

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

  onBotClick() {
    if (this.isBotWindowMinized) {
      this.isBotWindowMinized = false;
      $('.kore-chat-window').removeClass('minimize')
    }
    this.showChatWindow = true;
  }

  closeBotWindow(event) {
    if (event?.isCallInitiated || event?.isChatInitiated) {
      this.isBotWindowMinized = true;
      if (event?.isCallInitiated) {
        this.isInCall = true;
      } else {
        this.isInChat = true;
      }
      return;
    }
    this.isInCall = false;
    this.isInChat = false;
    this.showChatWindow = false;
  }

  loadscripts(){
    const path = window.location.href
    if(path && (path.includes('/conversation') || path.includes('/storypreview'))){
      this.loadDependentLibs('assets/web-kore-sdk-storyboard/libs/anonymousassertion.js','script');
      this.loadDependentLibs('assets/web-kore-sdk-storyboard/kore-bot-sdk-client.js','script');
      this.loadDependentLibs('assets/web-kore-sdk-storyboard/UI/chatWindow.js','script');
      this.loadDependentLibs('assets/web-kore-sdk-storyboard/UI/chatWindow.css','style');
    } else { // for process
      this.loadDependentLibs('assets/web-kore-sdk/libs/anonymousassertion.js','script');
      this.loadDependentLibs('assets/web-kore-sdk/kore-bot-sdk-client.js','script');
      this.loadDependentLibs('assets/web-kore-sdk/UI/chatWindow.js','script');
      this.loadDependentLibs('assets/web-kore-sdk/UI/chatWindow.css','style');
    }
     setTimeout(()=>{
     this.dependentsLoaded = true;
     })
  }
  loadDependentLibs(url: string,type) {
    const head = <HTMLDivElement> document.head;
    if(type === 'script'){
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = url;
      script.async = false;
      script.defer = true;
      head.appendChild(script);
    } else if(type === 'style'){
      const style = document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = url
      head.appendChild(style);
    }
  }
}
