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
    const finalUrl = "https://uat-agentassist.kore.ai";
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
          "jToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ0NjA1NzAzNzMsImV4cCI6MTY2NDQ2MDU3MTI3MywiYXVkIjoiIiwiaXNzIjoiY3MtYWI4Y2MzNzMtM2E1Yy01YzQ2LWFlZGQtNTBiNTY1ODVlZWRkIiwic3ViIjoiYy1lMTNhYTZjLTEyZDUtNDllNC04YWIwLTdiMTk5ODhiYWE4MyIsImlzQW5vbnltb3VzIjpmYWxzZX0.XpQafNBhQ6WvLpgtfyFGB1VPCyIQSlTFocg69mv-pII"
          // "jToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ0NTQ0Mzk1MjAsImV4cCI6MTY2NDQ1NDQ0MDQyMCwiYXVkIjoiIiwiaXNzIjoiY3MtYWI4Y2MzNzMtM2E1Yy01YzQ2LWFlZGQtNTBiNTY1ODVlZWRkIiwic3ViIjoiYy00YTVkNWI3LTBhYzYtNDAzZC04MGQ5LTA4ZWRjNGM2NzU0YSIsImlzQW5vbnltb3VzIjpmYWxzZX0.pRoQp2d26gOEduMO1DIZJ9W5mGK-OQFmkdHAFSIBfPE"
        }
      }
    };

    return config;
  }
}
