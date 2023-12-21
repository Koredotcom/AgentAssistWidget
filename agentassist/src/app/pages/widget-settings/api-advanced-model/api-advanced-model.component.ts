import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-api-advanced-model',
  templateUrl: './api-advanced-model.component.html',
  styleUrls: ['./api-advanced-model.component.scss']
})
export class ApiAdvancedModelComponent implements OnInit {

  constructor(
    private activeModal : NgbActiveModal
    
  ) { }

  ngOnInit(): void {
  }

  save() {
    this.activeModal.close();
  }

  cancel() {
    this.activeModal.close();
  }

}
