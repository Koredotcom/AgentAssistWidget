import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {

  modalRef:any;
  modalFlowCreateRef:any;
  constructor(private modalService: NgbModal) { }

  @ViewChild('newCoachingGroup', { static: true }) newCoachingGroup: SliderComponentComponent;

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
}
