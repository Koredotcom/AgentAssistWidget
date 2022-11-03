import { Component, Input, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-automation-override-report',
  templateUrl: './automation-override-report.component.html',
  styleUrls: ['./automation-override-report.component.scss']
})
export class AutomationOverrideReportComponent implements OnInit {

  @Input() viewType : string;

  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;
  
  constructor(public dashboardService : DashboardService) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy() {
   
  }

}
