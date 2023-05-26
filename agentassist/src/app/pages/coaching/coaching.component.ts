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
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';

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

  @ViewChild('ps') ps: PerfectScrollbarComponent;
  @ViewChild('newCoachingGroup', { static: true }) newCoachingGroup: SliderComponentComponent;

  constructor(private modalService: NgbModal, private service : ServiceInvokerService,
    private workflowService : workflowService, private cdRef : ChangeDetectorRef,
    private notificationService : NotificationService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getAgentCoachingGroupData();
  }

  // get or update GroupData Starts
  getAgentCoachingGroupData(){
    let params : any = {
      botId : this.workflowService.getCurrentBt(true)._id,
      isExpand : true
    }
    this.isLoading = true;
    this.service.invoke('get.allagentCoachingGroup',params).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(data => {
      if (data) {
        this.respData = data || {"results":[]};
      }
    });
  }

  updateGroupData(updateObj){    
    if(updateObj.data && updateObj.data.id){
      if(updateObj.type == COACHINGCNST.CREATE){
        this.respData.results.push(updateObj.data);
      }else if(updateObj.type == COACHINGCNST.EDIT){
        let groupId = updateObj.data.id;
        let matchIndex = this.respData.results.findIndex(x => x._id == groupId);
        this.respData.results.splice(matchIndex, 1,updateObj.data);
      }else if(updateObj.type == COACHINGCNST.DELETE){
        let groupId = updateObj.data.id;
        let matchIndex = this.respData.results.findIndex(x => x._id == groupId);
        this.respData.results.splice(matchIndex, 1);
      }      
    }
  }
  // get or update GroupData Ends


  // Create or Edit Rule Flow Starts
    openFLowCreation(flowCreation, group,index) {
      this.selectedRuleGroup = group;
      this.selectedRuleGroupIndex = index;
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }

    closeFLowCreation(rule?) {
      this.modalFlowCreateRef.close();
      if(rule){
        rule["ruleId"] = rule.id;
        this.respData?.results[this.selectedRuleGroupIndex]?.rules.push(rule);
      }
      this.selectedRuleGroup = null;
      this.selectedRuleGroupIndex = null;
    }
  // Create or Edit Rule Flow Ends


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
    this.updateGroupApis(event);
  }

  updateGroupApis(event){
    let previousgroupId = event.previousContainer.id;
    let currentgroupId = event.container.id;
    let currentGroupPayload = this.respData.results[this.respData.results.findIndex(x => x._id == currentgroupId)];
    let previousGroupPayload = this.respData.results[this.respData.results.findIndex(x => x._id == previousgroupId)];

    forkJoin([this.service.invoke('put.agentCoachingGroup', {groupId : currentgroupId}, currentGroupPayload),
    this.service.invoke('put.agentCoachingGroup', {groupId : previousgroupId}, previousGroupPayload)]).subscribe((response) => {
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
    this.isLoading = true;
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
    this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = {...COACHINGCNST.DELETE_RULE, ruleId : rule.ruleId};
    this.modalRef.result.then(emitedValue => {
      if(emitedValue){
        this.service.invoke('delete.agentCoachingRule', {groupId : groupId, ruleId: rule.ruleId}).subscribe(_data => {
          
          let matchIndex = this.respData?.results[index]?.rules?.findIndex(x => x.ruleId == rule.ruleId);
          this.respData?.results[index]?.rules.splice(matchIndex, 1);

          this.cdRef.detectChanges();
          this.notificationService.notify(this.translate.instant("COACHING.RULEDELETE_SUCCESS"), 'success');
        },(error)=>{
          this.notificationService.showError(this.translate.instant("COACHING.RULEDELETE_FAILURE"));
        });
      }
    });
  }
  // END
  
}
