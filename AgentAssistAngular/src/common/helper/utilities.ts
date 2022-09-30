import { Injectable } from "@angular/core";
import { SocketIoConfig } from "ngx-socket-io";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ADUtility {
  private storageType = 'localStorage';
  _consoleLoaded$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  consoleLoaded$: Observable<any[]> = this._consoleLoaded$.asObservable();
  widgetsList$: BehaviorSubject<any[]> = new BehaviorSubject(null);
  allWidgets = [];
  currentGrid = [];
  mainList = []
  externalWidgets = [];
  constructor() {
    this.currentGrid = [
    ];
    this.mainList = []
  }
  getSocketConfig() {
    const url = window.location.href;
    const arr = url.split("/");
    // const finalUrl = arr[0] + '//' + arr[2];
    const finalUrl = "https://uat-smartassist.kore.ai";
    console.log('url arr', finalUrl)
    // const userInfo = this.getUserInfoFromLocalStorage();
    const config: SocketIoConfig = {
      url: finalUrl + '/koreagentassist', options: {
        path: '/agentassist/api/v1/chat',
        autoConnect: false,
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        // 'try multiple transports': false,
        query: {
          "jToken" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ1MzM5MDg0NDIsImV4cCI6MTY2NDUzMzkwOTM0MiwiYXVkIjoiIiwiaXNzIjoiY3MtZTRhMmI0YjYtM2RiZC01NWQwLWIwMjUtNDY2ZTVkMDRjOTgxIiwic3ViIjoiYy1kMTZiNWM2LTg1NTMtNGVlMy1hYjllLWM5Yzk1NzM1ZTg5OCIsImlzQW5vbnltb3VzIjpmYWxzZX0.o6eJZTBI_fV1muPbrTdb1LUAOUA7Am7Luzbd2VRqmkA",
          "EIO":'4',
          "transport" : "websocket"
        }
      }
    };

    return config;
  }
}
