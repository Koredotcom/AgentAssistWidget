import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
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

  constructor(private dashboardService : DashboardService,
    private service : ServiceInvokerService) { }

  ngOnInit(): void {
   this.updateAgentFeedbackData();
  }

  ngOnDestroy() {
  }

  updateAgentFeedbackData(){
    this.service.invoke('post.agentfeedback', {}).subscribe((data : any) => {
      if(data){
        this.agentFeedbackData = Object.assign({}, data);
        if(data.usecases){
          if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
            this.agentFeedbackTableData = data.usecases.length <= 3 ? data.usecases : data.usecases.slice(0,3);
          }else {
            this.agentFeedbackTableData = data.usecases;
          }
        }
      }
    });
    // this.dashboardService.getAgentFeedbackData().subscribe((data : any) => {
     
    // });
  }

  openSlider(componentName){
    this.openSliderChild.emit(componentName);
  }

}
