import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-agent-feedback',
  templateUrl: './agent-feedback.component.html',
  styleUrls: ['./agent-feedback.component.scss']
})
export class AgentFeedbackComponent implements OnInit {

  @Input() viewType : string;
  @Output() openSliderChild = new EventEmitter();
  
  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;
  agentFeedbackData : any = {};
  agentFeedbackTableData : any = [];

  constructor(private dashboardService : DashboardService) { }

  ngOnInit(): void {
   this.updateAgentFeedbackData();
  }

  ngOnDestroy() {
  }

  updateAgentFeedbackData(){
    this.dashboardService.getAgentFeedbackData().subscribe((data : any) => {
      if(data){
        this.agentFeedbackData = Object.assign({}, data);
        if(data.actualData){
          if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
            this.agentFeedbackTableData = data.actualData.length <= 3 ? data.actualData : data.actualData.slice(0,3);
          }else {
            this.agentFeedbackTableData = data.actualData;
          }
        }
      }
    });
  }

  openSlider(componentName){
    this.openSliderChild.emit(componentName);
  }

}
