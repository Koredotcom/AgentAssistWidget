import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';
import { AuthService } from '@kore.services/auth.service';

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
  params ={
    streamId : ''
  };
  payload: any = {
    "startDate": "",
    "endDate":"",
    "experience" : "",  // chat or voice
    "skip":0,  // pages to skip (default 0)
    "limit":3, // number of record to be fetched
    "fetched":0  // count of previously fetched responses (default 0)
  }

  constructor(private dashboardService: DashboardService,
    private service: ServiceInvokerService,
    private workflowService: workflowService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    if(this.params.streamId !== '') {
      this.updateAgentFeedbackData();
    }

  }

  ngOnChanges(changes : SimpleChanges) {
    if (this.viewType && this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall) {
      console.log("🚀 ~ file: agent-feedback.component.ts:54 ~ AgentFeedbackComponent ~ ngOnChanges ~ this.filters:", this.filters)
      this.params.streamId = this.filters?.botId !== '' ? this.filters.botId : this.dashboardService.getSelectedBotDetails()._id;
      this.payload = {... this.filters}
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
    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {
      this.updateViewData(this.widgetData);
    } else {
      // this.dashboardService.getAgentFeedbackData().subscribe((data: any) => {
      //   if (data) {
      //     this.updateViewData(data);
      //   }
      // });

      this.service.invoke('agentFeedbacks', this.params, this.payload).subscribe((data : any) => {
        this.updateViewData(data);
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
