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
    let serviceInfo = Object.assign({},this.serviceList[serviceId] || {});
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
      endpoint: '/agentassist/api/v1/agent-feedback/:conversationId?interaction=:tab',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.mybotFeedback'] = {
      endpoint: '/agentassist/api/v1/agent-feedback/:conversationId?interaction=:tab',
      method: 'get',
      defaultEndPoint : false
    }

    this.serviceList['get.userBotHistory'] = {
      endpoint : '/api/1.1/botmessages/chathistorytoagentassist?botId=:botId&userId=:userId&sessionId=:sessionId&limit=-1&msgDirection=true',
      method : 'get',
      defaultEndPoint : false
    }
    
    this.serviceList['get.transcriptHistory'] = {
      endpoint : '/agentassist/api/v1/agentassistconversations/:convId/conversation?page=1&limit=1000',
      method : 'get',
      defaultEndPoint : false
    }

    this.serviceList['post.autoSearch'] = {
      endpoint : '/agentassist/api/v1/searchaccounts/autosearch?botId=:botId',
      method : 'post',
      defaultEndPoint : false
    }

    this.serviceList['get.settings'] = {
      endpoint : '/agentassist/api/v1/agentassist/:instanceBotId/agentassistsetting',
      method : 'get',
      defaultEndPoint : false
    }
  }

}
