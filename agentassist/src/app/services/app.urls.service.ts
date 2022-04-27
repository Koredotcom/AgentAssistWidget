import { Injectable } from '@angular/core';
import { workflowService } from './workflow.service';
@Injectable({
  providedIn: 'root'
})
export class AppUrlsService {

  public WINDOW=window;
  constructor(private workflowService: workflowService) { 
  }
  appURL(){
    return  this.WINDOW.location.protocol+"//"+this.WINDOW.location.host+this.WINDOW.location.pathname;
  }
  webFormsURL(){
    return  this.WINDOW.location.protocol+"//"+this.WINDOW.location.host+"/forms";
  }
  marketURL(){
    return  this.WINDOW.location.protocol+"//"+this.WINDOW.location.host+"/accounts"
  }
  completeAppPath(){
    return this.WINDOW.location.href;
  }
  public getLoginRedirectURL(redirectToHome?):string{
    var redirectedUrl = "";
    if (redirectToHome) {
      redirectedUrl = this.WINDOW.location.protocol + "//" + this.WINDOW.location.host + "/agentassist";
    } else {
      redirectedUrl = this.completeAppPath();
      // redirectedUrl = this.completeAppPath();
    }
     
    return this.marketURL()+'/?return_to='+redirectedUrl+'&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isDeflectApp' + window.location.search.replace('?', '&');
  }
  public redirectToLogin(redirectToHome?){
    let _redirectUrl=this.getLoginRedirectURL(redirectToHome);
    window.location.href=_redirectUrl
  }

  public redirectToLoginBotStore(redirectToHome?){
    // let _redirectUrl=this.marketURL()+'/?showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true';
    // window.location.href=_redirectUrl;
    this.redirectToLogin(redirectToHome);
  }

}
