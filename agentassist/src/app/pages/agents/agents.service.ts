import { Injectable } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { Observable, Subject } from 'rxjs';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {
  agentGpsList: any[] = [];
  agentsList: any[] = [];
  agentUpdate$ = new Subject<{data: any, action: 'add' | 'delete' | 'edit'}>();
  allAgentGroups: any[] = [];

  constructor(private service: ServiceInvokerService) { }

  getAgentGps() {
    return this.agentGpsList.slice();
  }

  setAgentGps(gps:any[]) {
      this.agentGpsList = gps;
  }

  updateAgentGps(gp) {
    _.findWhere(this.agentGpsList, {id: gp.id}).name = gp.name;
    _.findWhere(this.agentGpsList, {id: gp.id}).description = gp.description;
    _.findWhere(this.agentGpsList, {id: gp.id}).totalAgents = gp.totalAgents;
    _.findWhere(this.agentGpsList, {id: gp.id}).managers = gp.managers;
    _.findWhere(this.agentGpsList, {id: gp.id}).isAgentsLoading = true;
    _.findWhere(this.agentGpsList, {id: gp.id}).isOpen = false; 
  }

  appendAgentGps(gp: any) {
    gp.totalAgents = gp?.managers?.length || 0;
    gp.isAgentsLoading = true;
    gp.isOpen = false;
    this.agentGpsList.push(gp);
  }

  deleteAgentGps(id: string) {
      this.agentGpsList = this.agentGpsList.filter(val => val.id !== id);
  }

  getAgents(groupId) {
    return this.agentsList.filter(val => val.groupId == groupId);
  }

  setAgent(agents:any[]) {
      this.agentsList = agents;
  }

  updateAgent(group,agent) {
    _.findWhere(this.agentsList, {firstName: agent.firstName}).firstName = agent.firstName;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).lastName = agent.lastName;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).nickName = agent.nickName;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).emailId = agent.emailId;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).phoneNumber = agent.phoneNumber;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).profImage = agent.profImage;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).agentGroupId = agent.agentGroupId;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).hoursOfOperation = agent.hoursOfOperation;

    _.findWhere(this.agentsList, {firstName: agent.firstName}).agentAffinity = agent.agentAffinity;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).canSupportChat = agent.canSupportChat;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).maxChatSupport = agent.maxChatSupport;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).chatLanguageSupport = agent.chatLanguageSupport;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).canSupportVoice = agent.canSupportVoice;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).voiceLanguageSupport = agent.voiceLanguageSupport;
    _.findWhere(this.agentsList, {firstName: agent.firstName}).skills = agent.skills;
  }

  getAllAgentGroups(): Observable<any[]>{
    return new Observable((observer) => {
      if(this.allAgentGroups.length){
        observer.next([...this.allAgentGroups]); 
      }else{
        const params = {
          name: "",
          sortBy: "",
          limit: -1,
          page: 1
        };
        this.service.invoke('get.agentsGp', params).subscribe((res) => { 
          this.allAgentGroups = res.results;
          observer.next([...this.allAgentGroups]); 
        }, err => {
          observer.error(err);
        })
      }
    })
  }

}
