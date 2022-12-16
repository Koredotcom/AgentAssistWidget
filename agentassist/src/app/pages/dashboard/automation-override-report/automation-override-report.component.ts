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
  automationOverrideReportData : any = {};
  automationOverrideTableData : any = [];
  automationIntentNamevsEntityList : any = {};
  
  constructor(public dashboardService : DashboardService) { }

  ngOnInit(): void {
    this.updateAutomationOverrideReport();
  }

  ngOnDestroy() {
   
  }

  updateAutomationOverrideReport(){
    this.dashboardService.getAutomationOverrideReportData().subscribe((data : any) => {
      this.automationOverrideReportData = {};
      this.automationOverrideTableData = [];
      this.automationIntentNamevsEntityList = {};
      if(data && data.actualData){
        for(let automation of data.actualData){
          if(automation.entity_override){
            automation.entityOtherCount = (automation.entity_override.length - 2) > 0 ? automation.entity_override.length - 2 : null;
            this.automationIntentNamevsEntityList[automation.intentName] = automation.entity_override;
          }
        }
        if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
          this.automationOverrideTableData = data.actualData.length <= 5 ? data.actualData : data.actualData.slice(0,5);
        }else {
          this.automationOverrideTableData = data.actualData;
        }
        this.automationOverrideReportData = data;
      }
      console.log(data, 'data inside override data', this.automationIntentNamevsEntityList);
      
    })
  }

}
