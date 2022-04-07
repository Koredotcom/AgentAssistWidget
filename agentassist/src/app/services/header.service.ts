import { Injectable, Output, EventEmitter, Directive } from '@angular/core'


@Directive()
@Injectable()
export class SideBarService {
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() fromCallFlowExpand: EventEmitter<any> = new EventEmitter();
  isOnboardingPage: boolean = false;
  
  toggle(data) {
    this.change.next(data);
  }

  fromDashboard(data){
    this.fromCallFlowExpand.next(data);
  }

}