import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjConstants } from '../proj.const';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  public userBotConversationDetails : any;

  connectionDetails : any = {};
  assistTabSessionId = '';
  myBotTabSessionId = '';

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

  setUserBotConversationDataDetails(data : any) {
    if (data && data.sessionId) {
      this.userBotConversationDetails = data;
    }
  }

  getUserBotConvosDataDetails() {
    return this.userBotConversationDetails;
  }

  
}
