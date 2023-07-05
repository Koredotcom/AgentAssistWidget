import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { COACHINGCNST } from './coaching.cnst';
import { CoachingGroupRuleDeleteComponent } from './coaching-group-rule-delete/coaching-group-rule-delete.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize, debounceTime, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { CoachingService } from './coaching.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {

  modalRef:any;
  modalFlowCreateRef:any;
  bottomInt: any;
  topInt: any;
  dragStart : boolean = false;
  coachingConst : any = COACHINGCNST;
  coachGroupEvent : string;
  coachGroupData : any;
  respData:any = {};
  isLoading : boolean = false;
  selectedRuleGroup : any;
  selectedRuleGroupIndex : number;
  selectedRuleIndex : number;
  createOrEdit: string = COACHINGCNST.CREATE;
  currentRule:any;
  searchField = new FormControl();
  searchedData = {"results":[]};
  searching : boolean = false;
  publishInprogress : boolean = false;
  rulePresent : boolean = false;
  selAcc = this.local.getSelectedAccount();
  subs = new SubSink();
  @ViewChild('ps') ps: PerfectScrollbarComponent;
  @ViewChild('newCoachingGroup', { static: true }) newCoachingGroup: SliderComponentComponent;

  constructor(
    private modalService: NgbModal, private service : ServiceInvokerService,
    private workflowService : workflowService, private cdRef : ChangeDetectorRef,
    private notificationService : NotificationService, private translate: TranslateService,
    private auth: AuthService, private local: LocalStoreService,
    private authService: AuthService,
    private cs: CoachingService
    ) { }

  ngOnInit(): void {
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele)=>{
      if(ele){
        this.initApiCalls();
      } 
    });
    this.initApiCalls();
  }

  initApiCalls(){
    this.getAgentCoachingGroupData();
    this.subscribeEvents();
    this.getConfigDetails();
  }
  
  ngAfterViewInit(){
  }

  subscribeEvents() {
    this.searchField.valueChanges.pipe(tap(() => { this.isLoading = true; }), debounceTime(300))
      .subscribe(term => {
        term = term.trim()
        if (term.trim()) {
          this.serachRules(term);
        }else if(term == ''){
          this.searchedData.results = JSON.parse(JSON.stringify(this.respData.results));
        }
        this.isLoading = false;
      });
  }

  serachRules(term){
    this.searchedData = JSON.parse(JSON.stringify(this.respData));
    let results = this.searchedData["results"];
    for(let i=0; i<results.length; i++){
      let item = results[i];
      item.rules = [...item.rules.filter((iItem) => {
        return iItem.name.toLowerCase().includes(term.toLowerCase());
      })];
      if(item.rules?.length === 0){
        (this.searchedData.results || []).splice(i, 1);
        i = i-1;
      }
    }
  }

  // get or update GroupData Starts
  getAgentCoachingGroupData(){
    let params : any = {
      botId : this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id,
      isExpand : true
    }
    this.isLoading = true;
    this.service.invoke('get.allagentCoachingGroup',params).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(data => {
      if (data) {
        this.respData = Object.assign(data) || {"results":[]};
        this.searchedData.results = JSON.parse(JSON.stringify(data?.results)) || [];
        this.checkRulePresence(this.respData);
        if(this.searchField.value?.trim()){
          this.serachRules(this.searchField.value.trim());
        }
        this.cdRef.detectChanges();
      }
    });
  }

  checkRulePresence(respData){
    this.rulePresent = respData.results.some(group => {
      return (group.rules.length > 0)
    });
  }

  updateGroupData(updateObj){
    this.getAgentCoachingGroupData();
  }
  // get or update GroupData Ends


  // Create or Edit Rule Flow Starts
    openFLowCreation(flowCreation, group,index, rule, type, ruleIndex?) {
      this.selectedRuleGroup = group;
      this.selectedRuleGroupIndex = index;
      this.selectedRuleIndex = ruleIndex;
      if(type === COACHINGCNST.EDIT){
        this.createOrEdit = COACHINGCNST.EDIT;
        this.currentRule = rule;
      }
      if(type === COACHINGCNST.CREATE){
        this.createOrEdit = COACHINGCNST.CREATE;
      }
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }

    closeFLowCreation(rule?) {
      this.modalFlowCreateRef.close();
      // if(rule && (this.createOrEdit == COACHINGCNST.CREATE)){
      //   this.respData?.results[this.selectedRuleGroupIndex]?.rules.push(rule);
      // }else if(rule){
      //   this.respData?.results[this.selectedRuleGroupIndex]?.rules.splice(this.selectedRuleIndex, 1, rule);
      //   this.respData = {...this.respData};
      // }
      if(!rule){
        return;
      }
      this.getAgentCoachingGroupData();
      this.selectedRuleGroup = null;
      this.selectedRuleGroupIndex = null;
      this.selectedRuleIndex = null;
    }
  // Create or Edit Rule Flow Ends

  //publish coaching

  publishCoaching(){
    this.publishInprogress = true;
    this.service.invoke('post.publishcoaching',{}, {botId : this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id}).pipe(finalize(() => {
      this.publishInprogress = false;
    })).subscribe(data => {
      if (data) {
        console.log(data, 'data inside publish');
        this.notificationService.notify(this.translate.instant("COACHING.PUBLISH_SUCCESS"), 'success');
      }
    },(error)=>{
      this.notificationService.showError(error, this.translate.instant("COACHING.PUBLISH_FAILURE"));
    });

  }


  // Create or Edit Group Slider Starts
  openCoachingGroup(type, editData){
    this.coachGroupEvent = type;
    this.coachGroupData  = editData;
    this.newCoachingGroup.openSlider("#newCoachingGroup", "width550");
  }

  closeCoachingGroup(group){
    this.coachGroupData = null;
    this.newCoachingGroup.closeSlider("#newCoachingGroup");
  }
  //Create or Edit Group Slider End


  // drag and drop Starts
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    };
    if(event.container?.id !== event.previousContainer?.id){
      this.updateGroupApis(event);
    }
  }

  updateGroupApis(event){    
    let previousgroupId = event.previousContainer.id;
    let currentgroupId = event.container.id;    

    let currentResGroupPayload = JSON.parse(JSON.stringify(this.respData.results[this.respData.results.findIndex(x => x._id == currentgroupId)]));
    let previousResGroupPayload = JSON.parse(JSON.stringify(this.respData.results[this.respData.results.findIndex(x => x._id == previousgroupId)]));
    
  
    if(this.searchField.value){
      let addRuleId = event.container.data[event.currentIndex].ruleId;
      currentResGroupPayload.rules.splice(event.currentIndex,0,event.container.data[event.currentIndex]);

      const inx = previousResGroupPayload.rules.findIndex(item=>item.ruleId == addRuleId);
      previousResGroupPayload.rules.splice(inx,1);

    }else{
      currentResGroupPayload.rules = event.container.data;
      previousResGroupPayload.rules = event.previousContainer.data;
    }
    
    forkJoin([this.service.invoke('put.agentCoachingGroup', {groupId : currentgroupId}, currentResGroupPayload),
    this.service.invoke('put.agentCoachingGroup', {groupId : previousgroupId}, previousResGroupPayload)]).subscribe((response) => {
      this.getAgentCoachingGroupData();
      this.notificationService.notify(this.translate.instant("COACHING.GROUPUPDATED_SUCCESS"), 'success');
    },(error)=>{
      this.notificationService.showError(this.translate.instant("COACHING.GROUPUPDATED_FAILURE"));
    })
  }

  bottomMouseOver(){
    if(this.dragStart){
      this.clearInterVal();
      this.bottomInt = setInterval(()=>{
        let scrollTo: any;
        const scrollY = this.ps.directiveRef.ps();
        scrollTo = (scrollY.lastScrollTop as any) + 100;
        this.ps.directiveRef.scrollToTop(scrollTo);
      },200);
    }
  }

  topMouseOver(){
    if(this.dragStart){
      this.clearInterVal();
      this.topInt = setInterval(()=>{
        let scrollTo: any;
        const scrollY = this.ps.directiveRef.ps();
        scrollTo = (scrollY.lastScrollTop as any) - 100;
        this.ps.directiveRef.scrollToTop(scrollTo);
      },200);
    }
  }

  clearInterVal(){
    clearInterval(this.bottomInt);
    clearInterval(this.topInt)
  }
  // drag and drop ends

 // rule activities like active or inactive and delete rule starts
  changeRuleStatus(rule, groupId){
    rule.isActive = !rule.isActive;
    // this.isLoading = true;
    let params : any = {
      ruleId : rule.ruleId,
      groupId : groupId
    }
    this.service.invoke('put.agentCoachingRule',params, {active : rule.isActive}).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(data => {
      if (data) {
        this.notificationService.notify(this.translate.instant("COACHING.GROUPUPDATED_SUCCESS"), 'success');
      }
    },(error)=>{
      this.notificationService.showError(this.translate.instant("COACHING.GROUPUPDATED_FAILURE"));
    });
  }

  openDeleteRule(rule, groupId, index) {
    let deleteRule = {
      title : "Delete Rule",
      desc : "Are you sure, you want to delete rule '" +rule.name+"'.",
      type : "rule",
      ruleId : rule.ruleId
    }
    this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = deleteRule;
    this.modalRef.result.then(emitedValue => {
      if(emitedValue){
        this.service.invoke('delete.agentCoachingRule', {groupId : groupId, ruleId: rule.ruleId}).subscribe(_data => {
          // let matchIndex = this.respData?.results[index]?.rules?.findIndex(x => x.ruleId == rule.ruleId);
          // this.respData?.results[index]?.rules.splice(matchIndex, 1);
          // this.checkRulePresence(this.respData);
          // this.cdRef.detectChanges();
          this.notificationService.notify(this.translate.instant("COACHING.RULEDELETE_SUCCESS"), 'success');
          this.getAgentCoachingGroupData();
        },(error)=>{
          this.notificationService.showError(this.translate.instant("COACHING.RULEDELETE_FAILURE"));
        });
      }
    });
  }
  // END
  getConfigDetails(){
    let params: any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    this.service.invoke('get.AIconfigs', params)
      .subscribe(res => {
          if(res){
            this.cs.metaForUtternace = (res[0].featureList || [])
            .find(item=> item.name ==="aa_utterance")
          };
      }, err => {
        // this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
    });
  }
}
