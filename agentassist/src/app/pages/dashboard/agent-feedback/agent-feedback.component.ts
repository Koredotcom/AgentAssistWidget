import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';
import { AuthService } from '@kore.services/auth.service';
import { finalize, debounceTime, tap } from 'rxjs/operators';

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
  agentFeedbackPartialTableData: any = [];
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

  isLoading: boolean = false;
  hasMore: boolean = false;
  skip = 0
  limit = 30;
  fetched = 0;

  constructor(private dashboardService: DashboardService,
    private service: ServiceInvokerService,
    private workflowService: workflowService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    if(this.params.streamId !== '') {
      // this.updateAgentFeedbackData();
    }

  }

  ngOnChanges(changes : any) {
    if(changes.viewType || changes.filters || !this.onChangeCall) {
      this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
      this.payload = {... this.filters}
      this.handleOnChangeCall();
      this.updateAgentFeedbackData();
    }
    // if (this.viewType && this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall) {
    // }
  }

  handleOnChangeCall() {
    this.onChangeCall = true;
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);
  }

  ngOnDestroy() {
  }

  updateAgentFeedbackData(empty=false) {
    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {
      this.isLoading = true;
      this.cdRef.detectChanges();
      if(empty){
        this.skip = 0;
        this.limit = 14;
        this.fetched = this.fetched;
      }
      let botId = this.dashboardService.getSelectedBotDetails()._id;
      let params: any = {
        streamId: botId,
      };
      let body: any = {
        limit: this.limit,
        skip: this.skip,
        fetched: this.fetched
      }
      body = {...body, ... this.payload}
      this.service.invoke('agentFeedbacks', params, body).pipe(finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })).subscribe(data => {
        if (data) {
          if(empty){
          }
          this.skip = this.skip+1;
          this.hasMore = data.hasMore;
          this.updateViewData(data);
          // this.agentAspectTableData.push(...data.actualData);
          this.cdRef.detectChanges();
        }
      });
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
    // this.agentFeedbackData = Object.assign({}, data);
    if (data.usecases) {
      this.agentFeedbackData = Object.assign({}, data);
      if (this.viewType == VIEWTYPE.PARTIAL_VIEW) {
        this.agentFeedbackPartialTableData = data.usecases.length <= 3 ? data.usecases : data.usecases.slice(0, 3);
      } else {
        this.agentFeedbackTableData.push(...data.usecases);
      }
    }
  }

  openSlider(componentName) {
    this.openSliderChild.emit({ componentName: componentName, data: this.agentFeedbackData });
  }

  onReachEnd(event){
    if(!this.isLoading && this.hasMore && event.target.scrollTop > 0){
      // this.zone.run(()=>{
        this.updateAgentFeedbackData();
      // })
    }
  }

}
