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
      "_id":"",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
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
  
}
