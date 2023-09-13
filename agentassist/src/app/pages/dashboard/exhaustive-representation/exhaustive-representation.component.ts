import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
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
  @Input() filters : IDashboardFilter;

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;


  sliderStatus: boolean;
  componentTitle : string;
  componentSubTitle : string;
  compData : any;

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.subs.sink = this.dashboardService.getExhaustiveRep().subscribe((response: any) => {      
      if (response && response.status) {
        this.sliderStatus = response.status;
        this.componentType = response.type;
        this.componentTitle = COMPONENTVSTITLE[response.type];
        this.componentSubTitle = COMPONENTVSSUBTITLE[response.type];
        this.compData = response.data;
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
