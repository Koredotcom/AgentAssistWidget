import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coaching-confirmation',
  templateUrl: './coaching-confirmation.component.html',
  styleUrls: ['./coaching-confirmation.component.scss']
})
export class CoachingConfirmationComponent implements OnInit {

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
  }

  discardChanges(flag){
    this.activeModal.close(flag);
  }

}
