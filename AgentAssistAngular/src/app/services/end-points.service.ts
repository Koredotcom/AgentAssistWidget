import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndPointsService {

  private serviceList: any = {};

  constructor() {
    this.init();
  }

  public getServiceInfo(serviceId : string, serverUrl : string): any {
    let serviceInfo = this.serviceList[serviceId] || {};;
    if(!serviceInfo.defaultEndPoint){
      serviceInfo.endpoint = serverUrl + serviceInfo.endpoint;
    }
    console.log(serviceInfo, "service info");
    
    return serviceInfo;
  }

  public init() {
    this.serviceList['post.grant'] = {
      endpoint: '/api/1.1/oAuth/token/jwtgrant',
      method: 'post',
      defaultEndPoint : false
    }

    this.serviceList['get.assistHistorySA'] = {
      endpoint: '/agentassist/api/v1/conversations/:convId/aa/messages?botId=:botId&agentHistory=false',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.assistHistoryTP'] = {
      endpoint: '/api/1.1/botmessages/agentassist/:botId/history?convId=:convId&agentHistory=false',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.mybotHistorySA'] = {
      endpoint: '/agentassist/api/v1/conversations/:convId/aa/messages?botId=:botId&agentHistory=true',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.mybotHistoryTP'] = {
      endpoint: '/api/1.1/botmessages/agentassist/:botId/history?convId=:convId&agentHistory=true',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.assistFeedback'] = {
      endpoint: '/agentassist/api/v1/agent-feedback/:botId?interaction=:tab',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.mybotFeedback'] = {
      endpoint: '/agentassist/api/v1/agent-feedback/:botId?interaction=:tab',
      method: 'get',
      defaultEndPoint : false
    }
  }

}
