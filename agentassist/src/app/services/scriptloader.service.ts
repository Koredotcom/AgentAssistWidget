import { Injectable } from '@angular/core';
import { environment } from '@kore.environment';
import { AuthService } from '@kore.services/auth.service';

declare const $: any;
declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  public WINDOW = window;
  constructor(private authService: AuthService) {
  }

  loadScripts() {
    if (environment.hasOwnProperty('INLINE_MANUAL_SITE_KEY') && environment.INLINE_MANUAL_SITE_KEY) {
      this.loadInlineManualScripts();
    }

  };

  loadScript(scriptUrl, appendTo) {
    let self = this;
    appendTo = appendTo || 'body';
    var el: any = document.createElement('script');
    el.language = 'javascript';
    el.async = 'true';
    el.type = 'text/javascript';
    el.src = scriptUrl;
    $(appendTo).append(el);
  }


  loadMixPanelScripts = function () {
    //let self=this;
    //var _mixPanelScript =   env_conf['assets-url'] + 'scripts/mixpanel.js';
    //loadScript(_mixPanelScript,'head');
  };
  /*          
   * Ref:  
   * https://help.inlinemanual.com/docs/single-page-app-and-people-tracking-angular-react-ember
   *
   */
  loadInlineManualScripts = function () {
    let self = this;

    function inlinemanual_init() {
      window.createInlineManualPlayer(window.inlineManualPlayerData);
      setTimeout(function () {
        if (window.inline_manual_player) {
          //window.inline_manual_player.deactivate();//parent inlinemanual active topics are getting deactivated so commenting till we reach to inlinemanual team
        }
      }, 200);
    }
    function loadInlineManualScripts(PLAYER_ID) {
      let self = this;
      if (self.authService.isAuthenticated()) {
        var koreUID = self.authService.getUserId();
        koreUID = btoa(koreUID.substring(koreUID.indexOf('u-') + 2, koreUID.length));//converting to base64 by removing u-
        window.inlineManualTracking = {
          uid: koreUID
        };
        var scripts = [
          '//inlinemanual.com/embed/player.' + PLAYER_ID + '.bare.js'
        ];
        var script = scripts.shift();
        var el: any = document.createElement('script');
        el.language = 'javascript';
        el.async = 'true';
        el.charset = "UTF-8";
        el.type = 'text/javascript';
        $('body').append(el);
        el.onload = function () {
          inlinemanual_init();
        };
        el.src = script;
      }
    }
    if (environment.hasOwnProperty('INLINE_MANUAL_SITE_KEY') && environment.INLINE_MANUAL_SITE_KEY) {
      loadInlineManualScripts.call(self, environment.INLINE_MANUAL_SITE_KEY);
    }

  };
}
