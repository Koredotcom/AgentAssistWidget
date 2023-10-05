import {
  Injectable
} from '@angular/core';
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

  constructor() {
    this.registerEventsFromParent();
  }

  registerEventsFromParent() {
    window.addEventListener("message", (e) => {
      if (e.data && e.data.action) {
        var data = e.data;
        switch (data.action) {
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