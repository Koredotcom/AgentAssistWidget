import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-coaching-rule-create',
  templateUrl: './coaching-rule-create.component.html',
  styleUrls: ['./coaching-rule-create.component.scss']
})
export class CoachingRuleCreateComponent implements OnInit {

  constructor() { }

  @Output() onCloseRule = new EventEmitter();

  ngOnInit(): void {
  }

  closeRule(rule?) {
    this.onCloseRule.emit(rule);
  }

}
