import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { TranslateService } from '@ngx-translate/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AgentsService } from './agents.service';
import { NotificationService } from '@kore.services/notification.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as _ from 'underscore';
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  showSlider1: boolean = false;
  showSlider2: boolean = false;
  agentGps: any[] = [];
  selectedAgentGroup: any = {};
  selectedAgent: any = {};
  statusList: any[] = [];

  selectedGroup = this.translate.instant("USECASES.GROUP_BY");
  selectedFilter = this.translate.instant("USECASES.FILTER_BY");

  @ViewChild('slider1', { static: true }) slider1: SliderComponentComponent;
  @ViewChild('slider2', { static: true }) slider2: SliderComponentComponent;
  @ViewChild('iSearch') iSearch: ElementRef;

  constructor(private translate: TranslateService, 
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private agentsService: AgentsService) { }

  ngOnInit(): void {
    this.getGroupAgents();
    this.getStatuses();

    this.agentsService.agentUpdate$.subscribe(res => {
      if(res.action == 'add') {
        if(this.selectedAgentGroup && this.selectedAgentGroup.agents && this.selectedAgentGroup.agents.length){
          this.selectedAgentGroup.agents.push(res.data);
          this.selectedAgentGroup.totalAgents++;
        }else{
          this.selectedAgentGroup.agents = []
          this.selectedAgentGroup.agents.push(res.data);
          if(this.selectedAgentGroup.totalAgents){
            this.selectedAgentGroup.totalAgents++;
          }else{
            this.selectedAgentGroup.totalAgents = 0;
          }
        }
      } else if (res.action == 'delete') {
        this.selectedAgentGroup.agents =  this.selectedAgentGroup.agents.filter(ele => ele.id !== res.data._id);
      } else if (res.action == 'edit') {
        if(res.data.role == 'agent'){
          _.each(this.agentGps, grp =>{
            let index = _.findIndex(grp?.agents, {id: res.data.id});
            if(index != -1){
              grp?.agents.splice(index, 1);
              grp.totalAgents--;
            }
          })
          let agGrp: any = _.findWhere(this.agentGps, {id: res.data.agentGroupId})
          if(_.findIndex(agGrp.agents, {id: res.data.id}) == -1){
            _.findWhere(this.agentGps, {id: res.data.agentGroupId}).totalAgents++;
            _.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents.push(res.data);
          }
        }
        if(_.findWhere(this.agentGps, {id: res.data.agentGroupId}) && _.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents){
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).firstName = res.data.firstName;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).lastName = res.data.lastName;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).nickName = res.data.nickName;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).emailId = res.data.emailId
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).phoneNumber = res.data.phoneNumber
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).profImage = res.data.profImage;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).agentGroupId = res.data.agentGroupId;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).hoursOfOperation = res.data.hoursOfOperation;
    
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).agentAffinity = res.data.agentAffinity;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).canSupportChat = res.data.canSupportChat;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).maxChatSupport = res.data.maxChatSupport;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).chatLanguageSupport = res.data.chatLanguageSupport;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).canSupportVoice = res.data.canSupportVoice;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).voiceLanguageSupport = res.data.voiceLanguageSupport;
          _.findWhere(_.findWhere(this.agentGps, {id: res.data.agentGroupId}).agents, {id: res.data.id}).skills = res.data.skills;
        }
      }
    })
    this.setupSearch();
  }

  openSlider1(e) {
    e.stopPropagation();
    this.selectedAgent = {};
    this.slider1.openSlider("#slider1", "width940");
    this.showSlider1 = true;
  }

  closeSlider1(event) {
    this.showSlider1 = false;
    this.slider1.closeSlider("#slider1");
    this.agentGps = this.agentsService.getAgentGps();
  }

  openSlider2(e) {
    e.stopPropagation();
    this.selectedAgentGroup = {};
    this.slider2.openSlider("#slider2", "width940");
    this.showSlider2 = true;
  }

  closeSlider2(event) {
    this.showSlider2 = false;
    this.slider2.closeSlider("#slider2");
    this.agentGps = this.agentsService.getAgentGps();
    if(event){
      setTimeout(()=>{
        _.findWhere(this.agentGps, {id: this.selectedAgentGroup.id}).isAgentsLoading = false,
        _.findWhere(this.agentGps, {id: this.selectedAgentGroup.id}).isOpen = true
        },2000);
        this.openAgentGp(this.selectedAgentGroup)
    }
  }

  selectGroup(s) {
    this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + s;
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter == ""? this.translate.instant("USECASES.FILTER_BY"):this.translate.instant("USECASES.FILTER_BY")+ " " + filter;
    
  }

  getGroupAgents(){
    const params = {
      name: "",
      sortBy: "",
      limit: -1,
      page: 1
    };

    this.service.invoke('get.agentsGp', params).subscribe(res => {
        this.agentsService.setAgentGps(res.results);
        this.agentGps = this.agentsService.getAgentGps();
        this.agentGps.map(val => {
          val.agents = [];
          val.isAgentsLoading = true;
          val.isOpen = false;
        });
      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
      }); 
  }

  editAgentGroup(agentGp){
    this.selectedAgentGroup = agentGp;
    this.slider2.openSlider("#slider2", "width940");
    this.showSlider2 = true;
  }

  openAgentGp(agentGp){
    this.selectedAgentGroup = agentGp;

    if(!agentGp.isOpen && agentGp.isAgentsLoading) {
      agentGp.isOpen = true;
    // agentGp["agents"] = this.agentsService.getAgents(agentGp.name);

    const params = {
      groupId: agentGp.id,
      sortBy: '',
      limit: -1,
      page: 1
    }
    this.service.invoke('get.agents.byGroup', params).subscribe(
      res => {
        agentGp.agents = res.results;
        agentGp.isAgentsLoading = false;
      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_FETCH_AGENTS"));
        agentGp.isAgentsLoading = false;
      }
    )
    } else {
      agentGp.isOpen = !agentGp.isOpen;
    }
  }

  openSliderForEdit(agent){
    this.selectedAgent = JSON.parse(JSON.stringify(agent));
    this.slider1.openSlider("#slider1", "width940");
    this.showSlider1 = true;
  }

  setupSearch() {
    setTimeout(() => {
      fromEvent(this.iSearch.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged())
        .subscribe((val)=>{
          const params = {
            name: val,
            sortBy: "",
            limit: -1,
            page: 1
          };

          this.service.invoke('get.agentsGp', params).subscribe(res => {
            this.agentsService.setAgentGps(res.results);
            this.agentGps = this.agentsService.getAgentGps();
            this.agentGps.map(val => {
              val.agents = [];
              val.isAgentsLoading = true;
              val.isOpen = false;
            });
          }, err => {
            this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
          }); 
        });
    }, 100);
  }

  getGroupedSkills(skills){
    let arr: any = [];
    let groupedSkills = _.groupBy(skills, "skillGroupName");
    _.forEach(groupedSkills, function(list, key) {
      let obj: any = {};
      obj["colorCode"] = list[0].skillGroupColor;
      obj["value"] = _.map(list,"name").join(" | ");
      arr.push(obj);
    });
    return arr;
  }

  getEnabledLanguages(voices){
    let activeLanguages = voices.filter(item=>item.isActive);
    return (activeLanguages && activeLanguages.length) ? _.map(activeLanguages,"language").join(",") : "- -";
  }

  getStatuses(){
    const params = {};
    this.service.invoke('get.agentSettings.status', params).subscribe(res => {
     this.statusList = res.statusSettings;
    }, err => {
      this.notificationService.showError(err, this.translate.instant(""));
    });
  }

  getStatusColorCode(onlineStatus){
    if(onlineStatus){
      let status: any = _.find(this.statusList, function (item) {
        return item.label?.toLowerCase() == onlineStatus.toLowerCase();
      })
      return status?.color;
    }else{
      return;
    }
  }

}
