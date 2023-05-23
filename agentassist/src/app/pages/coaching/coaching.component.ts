import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { COACHINGCNST } from './coaching.cnst';
import { CoachingGroupRuleDeleteComponent } from './coaching-group-rule-delete/coaching-group-rule-delete.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';

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
  respData : any = {};

  @ViewChild('ps') ps: PerfectScrollbarComponent;
  @ViewChild('newCoachingGroup', { static: true }) newCoachingGroup: SliderComponentComponent;

  constructor(private modalService: NgbModal, private service : ServiceInvokerService,
    private workflowService : workflowService) { }

  ngOnInit(): void {
    this.getAgentCoachingGroupData();
  }

  // get or update GroupData Starts
  getAgentCoachingGroupData(){
    let params : any = {
      botId : this.workflowService.getCurrentBt(true)._id,
      isExpand : true
    }
    this.respData = {
      results : []
    };
    this.service.invoke('get.allagentCoachingGroup',params).subscribe(data => {
      if (data) {
        this.respData.results = data;
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

  // Delete Popup
  openDeleteRule() {
		this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = this.coachingConst.DELETE_RULE;
    this.modalRef.componentInstance.emitDeleteService.subscribe((emitedValue) => {
      console.log(emitedValue);
      
    });
	}
  // END


  // Create or Edit Rule Flow Starts
    openFLowCreation(flowCreation) {
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }

    closeFLowCreation(rule?) {
      this.modalFlowCreateRef.close();
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
  
}
