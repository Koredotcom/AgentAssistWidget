import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

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
  @ViewChild('ps') ps: PerfectScrollbarComponent;
  @ViewChild('newCoachingGroup', { static: true }) newCoachingGroup: SliderComponentComponent;

  constructor(private modalService: NgbModal) { }

  respData = {
    hasMore: false,
    results: [{
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      },]
    },{
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      }]
    },
    {
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      }]
    },
    {
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      }]
    },
    {
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      }]
    },
    {
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      }]
    },
    {
      groupName: 'Pricing',
      description: 'Pricing objection',
      ruleCount: 6,
      rules: [{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: true,
      },{
        ruleName: 'Interest Rate',
        description: 'Interest Rate description',
        assignedTo: 'All',
        lastUpdated: '1st Jul, 2023 AT 09:15PM',
        enabled: false,
      }]
    }],
    totalCount: 5,
  }

  ngOnInit(): void {
  }

  // Delete Popup
  openDeleteRule(ruleDelete) {
		this.modalRef = this.modalService.open(ruleDelete, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
	}

  closeDeleteRule(rule?) {
		this.modalRef.close();
	}

  // END

  // Open Flow
    openFLowCreation(flowCreation) {
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }

    closeFLowCreation(rule?) {
      this.modalFlowCreateRef.close();
    }
  // End

  openCoachingGroup(){
    this.newCoachingGroup.openSlider("#newCoachingGroup", "width550");
  }
  closeCoachingGroup(group){
    this.newCoachingGroup.closeSlider("#newCoachingGroup");
  }

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
    }
  }

  bottomMouseOver(){
    if(this.dragStart){
      clearInterval(this.bottomInt);
      this.ps.directiveRef.update();
      this.topInt = setInterval(()=>{
        let scrollTo: any;
        const scrollY = this.ps.directiveRef.ps();
        scrollTo = (scrollY.lastScrollTop as any) + 100;
        this.ps.directiveRef.scrollToTop(scrollTo);
        this.ps.directiveRef.update();
        
      },200);
    }    
  }
 
  topMouseOver(){
    if(this.dragStart){
      this.ps.directiveRef.update();
      clearInterval(this.topInt);
      this.bottomInt = setInterval(()=>{
        let scrollTo: any;
        const scrollY = this.ps.directiveRef.ps();
        scrollTo = (scrollY.lastScrollTop as any) - 100;
        this.ps.directiveRef.scrollToTop(scrollTo);
        this.ps.directiveRef.update();
      },200);
    }
  }

  clearInterVal(){
    clearInterval(this.bottomInt);
    clearInterval(this.topInt)
  }
}
