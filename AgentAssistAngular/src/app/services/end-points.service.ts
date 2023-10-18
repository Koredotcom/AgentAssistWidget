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

  private serviceList: any = {};

  constructor() {
    if (environment.production) {
      this.SERVER_URL = window.location.protocol + '//' + window.location.host;
      this.API_SERVER_URL = this.SERVER_URL + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    } else {
      this.SERVER_URL = environment['API_SERVER_URL'];
      this.API_SERVER_URL = environment['API_SERVER_URL'] + this.API_URL_PREFIX + this.API_VERSION_PREFIX;
    }
    this.init();
  }

  public getServiceInfo(serviceId : string, serverUrl : string): any {
    let serviceInfo = this.serviceList[serviceId] || {};;
    if(!serviceInfo.defaultEndPoint){
      serviceInfo.endpoint = serverUrl + serviceInfo.endpoint;
    }
    return serviceInfo;
  }

  public init() {
    this.serviceList['post.grant'] = {
      endpoint: '/api/1.1/oAuth/token/jwtgrant',
      method: 'post',
      defaultEndPoint : false
    }
  }

}
