import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COACHINGCNST } from '../coaching.cnst';

@Component({
  selector: 'app-coaching-group-rule-delete',
  templateUrl: './coaching-group-rule-delete.component.html',
  styleUrls: ['./coaching-group-rule-delete.component.scss']
})
export class CoachingGroupRuleDeleteComponent implements OnInit {

  @Input() data : any;
  @Output() emitDeleteService = new EventEmitter();

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeDeleteRule(){
    this.activeModal.close();
  }

  deletGroupRule(){    
    this.emitDeleteService.next(true);
    this.activeModal.close(this.data.type == COACHINGCNST.GROUP ? this.data.groupId : this.data.ruleId);
  }

}
