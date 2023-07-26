import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChecklistService } from '../checklist.service';

@Component({
  selector: 'app-guided-checklist',
  templateUrl: './guided-checklist.component.html',
  styleUrls: ['./guided-checklist.component.scss']
})
export class GuidedChecklistComponent implements OnInit {

  modalFlowCreateRef: any;

  constructor(private modalService : NgbModal) { }

  ngOnInit(): void {
  }

  createCheckList(checklistCreation){
    this.modalFlowCreateRef = this.modalService.open(checklistCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
  }


  closeCheckListScreen(event) {
    this.modalFlowCreateRef.close();
  }
}
