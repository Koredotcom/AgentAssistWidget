import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjConstants } from '../proj.const';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  socketConnection$ : BehaviorSubject<any> = new BehaviorSubject(null);

  public userBotConversationDetails : any;

  connectionDetails : any = {};
  assistTabSessionId = '';
  myBotTabSessionId = '';
  grantResponseObj : any = {};

  constructor() { }

  getConnectionDetails(){
    return this.connectionDetails;
  }

  formatConnectionDetails(obj : any) {
    let parmasObj : any = Object.assign({}, obj);
    for (let key in parmasObj) {
      if (key === "botid") {
        parmasObj[ProjConstants.BOTID] = parmasObj[key];
        delete parmasObj[key];
      } else if (key == 'conversationid') {
        parmasObj[ProjConstants.CONVESATIONID] = parmasObj[key];
        delete parmasObj[key];
      }
      else if(key == "autoBotId"){
        console.log("------- autobotid----xxxxxxxxxxxxxx", key)
        if(parmasObj[key] && (parmasObj[key] !== "undefined" && parmasObj[key] !== null)){
          parmasObj['autoBotId'] = parmasObj[key];
        }else{
          parmasObj['autoBotId'] = '';
        }
      }
    }
    console.log("-----------parmasObj-----------", parmasObj)
    this.connectionDetails = parmasObj;
  }

  isEmptyStr(s) {
    let str = s?.trim();
    str = str?.replaceAll('"', '').replaceAll("'", '');
    if (str && str.length > 1 && str !== "") {
      return true;
    } else {
      return false;
    }
  }


  setUserBotConversationDataDetails(data : any) {
    if (data && data.sessionId) {
      this.userBotConversationDetails = data;
    }
  }

  getUserBotConvosDataDetails() {
    return this.userBotConversationDetails;
  }

  setSocketConnection(data){
    this.socketConnection$.next(data);
  }

  
}
