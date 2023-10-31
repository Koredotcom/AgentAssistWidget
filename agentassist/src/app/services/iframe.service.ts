import {
  Injectable
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject
} from 'rxjs';
declare const window: any;

@Injectable({
  providedIn: "root",
})
export class IframeService {
  dependency: any;
  formAccesscallback: any;
  statusPollInit = null;
  progressInterval = null;
  totalProgress = 0;

  onCloseFormsIframe$ = new Subject();
  openHelpSlider$ = new Subject();
  builderxEvents$ = new BehaviorSubject({});
  navigationItems$ = new BehaviorSubject({});

  constructor(private router: Router) {
    this.registerEventsFromParent();
  }

  expand(selector){
    let message: any = {
        action:'sidenav-toggle',
        selector: selector,
        payload:{isExpand:true},
    };
    window.parent.postMessage(
        message,
        '*');
  }
  collapse(selector){
      let message: any = {
        action:'sidenav-toggle',
        selector: selector,
        payload:{isExpand:false},
      };
      window.parent.postMessage(
          message,
          '*');
  }

  registerEventsFromParent() {
    let self=this;
    window.addEventListener("message", (e) => {
      if (e.data && e.data.action) {
        var data = e.data;
        switch (data.action) {

          case 'routeModule':
            if(e.data.payload){
                let navigationExtra = {
                    skipLocationChange: true
                  };
            
                  self.router.navigateByUrl( '/', navigationExtra).then(() => {
                    let navState:any = {
                    replaceUrl: true
                  };
                
                  self.router.navigateByUrl(`${e.data.payload.module}?tab=${e.data.payload.tab}`, navState);
                  });
                // self.router.navigateByUrl(`${e.data.payload.module}?tab=${e.data.payload.tab}`); 
            }
            break;
            case 'builderxEvent':
                            if (data && data.payload) {
                                self.builderxEvents$.next(data);
                            }
          case "postNavigationItems":
            if (data && data.payload) {
              this.navigationItems$.next(data.payload);
            }
            break;
          default:
            break;
        }
      }
    });
  }

  post(action, payload?, selector?) {
    try {
      let message: any = {
        action: action,
        selector: selector || "#processFlowsFrame",
      };
      if (payload) {
        payload = JSON.parse(JSON.stringify(payload));
        message.payload = payload;
      }
      window.parent.postMessage(message, "*");
    } catch (error) {
      console.log(error);
    }
  }
}