import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-exhaustive-representation',
  templateUrl: './exhaustive-representation.component.html',
  styleUrls: ['./exhaustive-representation.component.scss']
})
export class ExhaustiveRepresentationComponent implements OnInit {

  subs = new SubSink();

  @Output() onClose = new EventEmitter();
  @Input() componentType: string = '';

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;


  sliderStatus: boolean;

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
    console.log("ngonint inside exhaustive");
    this.subs.sink = this.dashboardService.getExhaustiveRep().subscribe((response: any) => {
      console.log("inside subsribe", response);
      
      if (response && response.status && response.type === DASHBORADCOMPONENTTYPE.AGENT_ASPECT) {
        this.sliderStatus = response.status;
        this.componentType = response.type;
        console.log(this.sliderStatus, "slider status", this.componentType);
      }
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  close() {
    this.onClose.emit('closed');
  }

}
