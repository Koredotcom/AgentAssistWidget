import { Injectable } from '@angular/core';
import { environment } from '@kore.environment';
@Injectable({
  providedIn: 'root'
})
export class EndPointsService {

  private API_URL_PREFIX = "/api";
  private API_VERSION_PREFIX = '/1.1';
  private SERVER_URL: String;
  private API_SERVER_URL: String;
  private SUPPORT_API_SERVER_URL: String;

  private serviceList: Object = {};

  constructor() {
    // if (environment.production) {
    //   this.SERVER_URL = window.location.protocol + '//' + window.location.host;
    //   this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    // } 
    
    this.SERVER_URL = environment['API_SERVER_URL'];
    this.API_SERVER_URL = environment['API_SERVER_URL'] + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    this.SUPPORT_API_SERVER_URL = environment['SUPPORT_API_SERVER_URL'] + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    this.init();
  }

  public getServiceInfo(serviceId): any {
    return this.serviceList[serviceId] || {};
  }
  public init() {
    this.serviceList['sales.signout'] = {
      endpoint: this.API_SERVER_URL + '/oAuth/signout',
      method: 'delete'
    };

    this.serviceList['refreshToken'] = {
      endpoint: this.API_SERVER_URL + '/oauth/token',
      method: 'post'
    };

    this.serviceList['app.controls'] = {
      endpoint: this.API_SERVER_URL + '/users/:userId/AppControlList?includeAgentDesktopPermissions=true',
      method: 'get'
    };

    this.serviceList['get.callflow.data'] = {
      endpoint: this.API_SERVER_URL + '/deflectai/apps/:appId/messages',
      method: 'get'
    }

  }
}
