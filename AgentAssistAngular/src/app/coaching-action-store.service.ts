import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoachingActionStoreService {
  constructor() { }
  nudges = [];
  hint = [];
  getNudgeData(flag){
    let nudgeData : any = [
      {type : 'positive', text : "Great Job"},
      {type : 'neutral', text : "Check customer's account"},
      {type : 'warning', text : "Offer Discounts"},
      {type : 'critical', text : "Transfer to Manager"}
    ]
    return flag ? nudgeData[0] : nudgeData[1];
  }

  getHintData(flag){
    let hintData : any = [
      {type : 'positive', text : "Great Job", desc : "you did a fantastic job providing the customer with the latest discounts", button : "OK, Great", auto_close : true, timer : 5},
      {type : 'neutral', text : "Warm Greeting for Customer", desc : "Great the customer with a warm and thoughtful greeting", button : "Got it", auto_close : false},
      {type : 'warning', text : "Offer Latest Discounts", desc : "Price Objection was detected. Provide the customer with one of the current discount offers", button : "OK, Got it", auto_close : true, timer : 5},
      {type : 'critical', text : "Fowl language Warning", desc : "Please refrain from using words and phrases that are not allowed when conversing with the customer", button : "OK", auto_close : false}
    ]
    return flag ? hintData[0] : hintData[1];
  }
  
  pushToNudge(event){
    
  }
}
