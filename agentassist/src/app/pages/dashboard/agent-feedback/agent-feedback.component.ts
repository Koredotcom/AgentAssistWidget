import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-agent-feedback',
  templateUrl: './agent-feedback.component.html',
  styleUrls: ['./agent-feedback.component.scss']
})
export class AgentFeedbackComponent implements OnInit {

  @Input() viewType: string;
  @Input() filters: IDashboardFilter;
  @Input() widgetData: any;
  @Output() openSliderChild = new EventEmitter();

  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;
  streamId: string;
  agentFeedbackData: any = {};
  agentFeedbackTableData: any = [];
  onChangeCall: boolean = false;

  constructor(private dashboardService: DashboardService,
    private service: ServiceInvokerService,
    private workflowService: workflowService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.viewType && this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall) {
      this.handleOnChangeCall();
      this.updateAgentFeedbackData();
    }
  }

  handleOnChangeCall() {
    this.onChangeCall = true;
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);
  }

  ngOnDestroy() {
  }

  updateAgentFeedbackData() {
    this.streamId = this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id;
    // this.service.invoke('post.agentfeedback', {botId : this.streamId}).subscribe((data : any) => {
    //   if(data){
    //     this.agentFeedbackData = Object.assign({}, data);
    //     if(data.usecases){
    //       if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
    //         this.agentFeedbackTableData = data.usecases.length <= 3 ? data.usecases : data.usecases.slice(0,3);
    //       }else {
    //         this.agentFeedbackTableData = data.usecases;
    //       }
    //     }
    //   }
    // });

    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {      
      this.updateViewData(this.widgetData);
    } else {      
      this.dashboardService.getAgentFeedbackData().subscribe((data: any) => {
        if (data) {
          this.updateViewData(data);
        }
      });
    }
  }

  updateViewData(data) {
    this.agentFeedbackData = Object.assign({}, data);
    if (data.usecases) {
      if (this.viewType == VIEWTYPE.PARTIAL_VIEW) {
        this.agentFeedbackTableData = data.usecases.length <= 3 ? data.usecases : data.usecases.slice(0, 3);
      } else {
        this.agentFeedbackTableData = data.usecases;
      }
    }
  }

  openSlider(componentName) {
    this.openSliderChild.emit({ componentName: componentName, data: this.agentFeedbackData });
  }

}
