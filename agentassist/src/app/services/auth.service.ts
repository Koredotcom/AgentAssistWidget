import { Injectable, Injector } from '@angular/core';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service'
import { AppUrlsService } from '@kore.services/app.urls.service'
import { workflowService } from '@kore.services/workflow.service'
import { Observer, from, Subject, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs'
import * as _ from 'underscore';
import { MixPanelWrapper } from '../helpers/mixpanel';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { MixPanelService } from '../helpers/mixPanel.service';

declare const $: any;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private authInfo;
  private appControlList = null;
  private selectedAccount = null;
  public deflectApps = new BehaviorSubject<any>(null);
  public smartAssistBots: any[];
  public universalBot : any = {};
  public hasToken = false;
  public userProfile: any;
  public btStoreQp = null
  public fromToken_tokenId = null;
  public externalQp: any;
  userAccIdDetail: any;

  public isAgentDesktopEnabled$ =  new BehaviorSubject(false);

  constructor(
    private localstore: LocalStoreService,
    private service: ServiceInvokerService,
    private appUrls: AppUrlsService,
    public workflowService: workflowService,
    private translate: TranslateService,
    private injector: Injector,
    private mixPanel: MixPanelService
  ) {
    if (window.location.hash && window.location.hash.indexOf('#id_token') == 0 && window.location.search && window.location.search.indexOf('?qp') == 0) {
      this.hasToken = true;
      this.fromToken_tokenId = window.location.hash.slice(10);
      this.externalQp = JSON.parse(atob(decodeURIComponent(window.location.search.slice(4))));
      $('html, body').addClass('app-' + this.externalQp.appName);
      // this.workflowService.doOpenInstallTemps = this.btStoreQp.hasOwnProperty('openInst');
      this.workflowService.setCurrentBt({ _id: this.externalQp?.streamId, defaultLanguage: this.externalQp?.selectedBotLanguage });
      this.setSelectedAccount({ accountId: this.externalQp?.selectedAccount });
      this.workflowService.appState = this.externalQp?.state;
      localstore.removeAuthInfo();
    } else if (window.location.search && window.location.search.indexOf('?qp') == 0) {
      this.btStoreQp = JSON.parse(atob(window.location.search.slice(4)));
      this.workflowService.doOpenInstallTemps = this.btStoreQp.hasOwnProperty('openInst');
    } else {
      this.authInfo = localstore.getAuthInfo();
    }
   
  }
  public logout() {
    this.service.invoke('sales.signout', {}, {}).subscribe(
      res => {
        // const mixPanel = this.injector.get(MixPanelWrapper);
        // mixPanel.postEvent('Sign Out');
        this.mixPanel.postEvent('Sign Out', {});
        this.authInfo = false;
        this.localstore.removeAuthInfo();
        this.appUrls.redirectToLoginBotStore(true)
      },
      errRes => {
        console.error('Failed in singing out');
      }
    );
  }
  public getAuthInfo() {
    return this.authInfo;
  }
  public isAuthenticated() {
    return this.authInfo ? true : false;
  }
  public getAccessToken() {
    let _accessToken = "";

    if (this.isAuthenticated && !this.hasToken) {
      try { _accessToken = this.localstore.getAuthInfo()?.currentAccount.authorization.accessToken; }
      catch (error) { return false; }
      return _accessToken;
    }

    else if (this.hasToken) { return this.fromToken_tokenId ? this.fromToken_tokenId : window.location.hash.slice(10); }

    else { return false; }
  }
  public getUserId() {
    let _uid = "";
    if (this.isAuthenticated()) {
      try {
        _uid = this.authInfo.currentAccount.userInfo.id;
      } catch (error) {
        return false;
      }
      return _uid;
    } else if(this.externalQp) {
      return this.externalQp.userId
    } else {
      return false;
    }
  }
  public getOrgId() {
    let _uid = "";
    if (this.isAuthenticated) {
      try {
        _uid = this.localstore.getSelectedAccount()?.orgId || this.getSelectedAccount()?.orgId ||this.authInfo.currentAccount.userInfo.orgId || this.authInfo.currentAccount.userInfo.orgID || this.authInfo.currentAccount.orgId;
      } catch (error) {
        return false;
      }
      return _uid;
    } else {
      return false;
    }
  }
  // public getSelectedAccount() {
  //   let _uid = "";
  //   if (this.isAuthenticated) {
  //     try {
  //       let _selectedAccount = this.localstore.getSelectedAccount();
  //       if (_selectedAccount) {
  //         return _selectedAccount
  //       } else {
  //         return false;
  //       }
  //     } catch (error) {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }
  public getApplictionControls() {
    return this.appControlList
  }
  public setSelectedAccount(account) {
    this.selectedAccount = account;
  }
  public getSelectedAccount() {
    return this.selectedAccount;
  }

  public getApplictionControlsFromServer(): ReplaySubject<any> {

    let _observer = this.service.invoke('app.controls', {}, {});
    // _observer.subscribe(res => {
    //   this.appControlList = res;
    // }, errRes => {
    //   this.appControlList = null;
    // });

    const subject = new ReplaySubject(1);
    // subscriber 1
    subject.subscribe((res: any) => {
      
      var _userInfo: any = {};
      _userInfo.appControls = res;
      if (_userInfo.appControls && _userInfo.appControls.associatedAccounts && _userInfo.appControls.associatedAccounts.length) {
        var accounts = _userInfo.appControls.associatedAccounts;
        var defaultAccountId = _userInfo.appControls.defaultAccountId || '';
        var chosenAccountId = _userInfo.appControls.chosenAccountId || '';

        var _selectetedAccount = _userInfo.appControls.associatedAccounts[0];

        var _selfAccount = _.find(_userInfo.appControls.associatedAccounts, function (account) {
          return (account.self);
        });

        if (_selfAccount) {
          _selectetedAccount = _selfAccount;
        }

        var _defaultAccountId = _.find(_userInfo.appControls.associatedAccounts, function (account) {
          return (defaultAccountId === account.accountId);
        });
        if (_defaultAccountId) {
          _selectetedAccount = _defaultAccountId;
        }

        var _chosenAccount = _.find(_userInfo.appControls.associatedAccounts, function (account) {
          return (chosenAccountId === account.accountId);
        });
        if (_chosenAccount) {
          _selectetedAccount = _chosenAccount;
        }

        var _fromSelection = this.getSelectedAccount() || this.localstore.getSelectedAccount();
        if (_fromSelection) {
          _selectetedAccount = _.findWhere(_userInfo.appControls.associatedAccounts, { accountId: _fromSelection.accountId});
        }
        else {
          this.localstore.setSelectedAccount(_selectetedAccount);
        }

        var _fromSSOSelection = localStorage.getItem("selectedSSOAccount");
        if (_fromSSOSelection) {
          _fromSelection = JSON.parse(_fromSSOSelection);
          _selectetedAccount = _.findWhere(_userInfo.appControls.associatedAccounts, { accountId: _fromSelection.accountId});
          this.localstore.setSelectedAccount(_selectetedAccount);
          localStorage.removeItem("selectedSSOAccount");
        }
      }

      this.setSelectedAccount(_selectetedAccount);
      this.appControlList = res;
    }, errRes => {
      this.appControlList = null;
    })
    if (this.hasToken) {
      this.service.invoke('post.tokenDetails', {}, { id_token: window.location.hash.slice(10) })
      .pipe(
        map((res: any) => {
          return {
            currentAccount: {
              authorization: res.authorization,
              userInfo: res.userInfo
            }
          }
        })
      ).subscribe(
        res => {
          this.localstore.setAuthInfo(res);
          this.authInfo = this.localstore.getAuthInfo();
          _observer.subscribe(subject);
        }
      )
    }
    else {
      _observer.subscribe(subject);
    }
    return subject;
  }

  public getAgentDesktopPermissions() {
    let _id = this.localstore.getSelectedAccount()?.accountId || this.getSelectedAccount()?.accountId;
    let param = {'accountId': _id};
    this.service.invoke('get.agentDesktopEnabled.info', param).subscribe(res => {
      this.isAgentDesktopEnabled$.next(res.isAgentDesktopEnabled);
    }
    , error => {
      console.log(error);
      // this.isAgentDesktopEnabled = false;
    });
  }

  public deflectSeedData() {
    this.service.invoke('deflect.seed.data').subscribe(res => {
      this.workflowService.seedData(res);
      this.workflowService.supportedDeflectLangs = res.deflectSeedData.supportedLanguages;
    }, errRes => {
      this.deflectApps.next(errRes);
    })
  }

  public getUniversalBotDetails(res){
    for(let obj of res){
      if(obj.type == 'universalbot'){
        return obj;
        break;
      }
    }
    return {};
  }

  public getAgentAssistStreamId(){
    if(this.universalBot && this.universalBot._id){
      return (this.universalBot._id);
    }else{
      return this.workflowService.getCurrentBt(true)?._id;
      // return this.smartAssistBots.map(x=>x._id);
    }
  }

  public getDeflectApps() {
    this.service.invoke('get.automationbots').subscribe(res => {
      if (res && res.length) {
        this.workflowService.showAppCreationHeader(false);
        this.smartAssistBots = res;
        this.universalBot = this.getUniversalBotDetails(res);
      }
      this.deflectApps.next(res);
      this.workflowService.deflectApps(res);
    }, errRes => {
      this.deflectApps.next(errRes);
    })
  }

  public refreshToken() {
    const OAUTH_DEFAULT_PROPS = {
      client_id: "1",
      client_secret: "1",
      scope: "friends",
      grant_type: "password"
    };

    const currentAccount = this.localstore.getAuthInfo()?.currentAccount; //this.getSelectedAccount();

    if (currentAccount) {
      let params: any = {};
      const auth = currentAccount.authorization;
      if (auth) {
        params = OAUTH_DEFAULT_PROPS;
        params.grant_type = "refresh_token";
        params.refresh_token = auth.refreshToken;
        return this.service.invoke("refreshToken", {}, params);
      } else {
        this.handleInvalidToken();
      }
    } else {
      this.handleInvalidToken();
    }
  }

  updateAuthInfoWithRefreshTokenResponse(tokenRes) {
    _.extend(this.authInfo.currentAccount.authorization, tokenRes.authorization);
    this.localstore.setAuthInfo(this.authInfo);
  }

  handleInvalidToken() {
    this.localstore.removeAuthInfo();
    this.appUrls.redirectToLoginBotStore(true)
  }

  getProfile() {
    this.service.invoke('get.profile').subscribe(res => {
      this.userProfile = res;
      if (!this.localstore.appLanguage) {
        this.localstore.appLanguage = res?.personalInfo?.language;
        this.translate.use(this.localstore.appLanguage);

        $("body").removeClass((index, className) => {
          return (className.match(/(^|\s)app-lang-\S+/g) || []).join(' ');
        });

        $('body').addClass('app-lang-' + this.localstore.appLanguage);
      }

    })
  }
}