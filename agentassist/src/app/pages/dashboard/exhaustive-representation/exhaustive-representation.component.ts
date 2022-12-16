import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { COMPONENTVSSUBTITLE, COMPONENTVSTITLE, DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
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
  @Input() customerDropdownSelection : string;

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;


  sliderStatus: boolean;
  componentTitle : string;
  componentSubTitle : string;

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
    console.log("ngonint inside exhaustive", this.customerDropdownSelection);
    this.subs.sink = this.dashboardService.getExhaustiveRep().subscribe((response: any) => {
      console.log("inside subsribe", response);
      
      if (response && response.status) {
        this.sliderStatus = response.status;
        this.componentType = response.type;
        this.componentTitle = COMPONENTVSTITLE[response.type];
        this.componentSubTitle = COMPONENTVSSUBTITLE[response.type];
        console.log(this.sliderStatus, "slider status", this.componentType, this.componentTitle);
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
