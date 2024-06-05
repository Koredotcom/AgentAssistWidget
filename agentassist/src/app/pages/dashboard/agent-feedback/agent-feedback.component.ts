import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { actualvsDisplayTitle, DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';
import { AuthService } from '@kore.services/auth.service';
import { finalize, debounceTime, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { FormControl } from '@angular/forms';

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
  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;

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
    "experience" : ""  // chat or voice
  }

  isLoading: boolean = false;
  hasMore: boolean = false;
  skip = 0
  limit = 30;
  fetched = 0;
  subs = new SubSink();
  
  negativeFeedbackColMap : any = Object.entries(actualvsDisplayTitle.NEGATIVE_FEEDBACK_MAP);
  feedbackTabsList : any = Object.entries(actualvsDisplayTitle.FEEDBACK_TABS_LIST);
  feedbackTabvsImage : any = actualvsDisplayTitle.FEEBDACK_TYPES_VS_IMAGE;
  feedbackTabColMap : any = actualvsDisplayTitle.FEEDBACK_TABLE_COLNAME;
  feedbackTabSelection : string = 'usecases';
  showConversationLogsSlider : boolean = false;
  showResponseTable : boolean = false;
  showCommentTable : boolean = false;
  feedbackisLoading: boolean = false;
  negFbisLoading : boolean = false;
  feedbackhasMore: boolean = false;
  negativeFeedbackTableData : any = {};
  conversationTableData : any = [];
  searchField = new FormControl();
  conversationId : string = '';  
  selectedTaskObj : any = {};
  negFeedback : any = {};
  feedbackSkip = 0;
  feedbackLimit = 15;

  constructor(private dashboardService: DashboardService,
    private service: ServiceInvokerService,
    private workflowService: workflowService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
    this.subscribeEvents();
  }

  ngOnChanges(changes : any) {
    if(changes.viewType || changes.filters || !this.onChangeCall) {
      if(this.filters && Object.keys(this.filters).length > 0){
        this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
        this.payload = {... this.filters}
        this.handleOnChangeCall();
        this.feedbackTabSelection = this.widgetData?.tabSelection ? this.widgetData.tabSelection : 'usecases';
        this.updateAgentFeedbackData(this.feedbackTabSelection);
      }
    }
  }

  subscribeEvents(){
    this.subs.sink = this.dashboardService.getFeedbackIntentPageSelection().subscribe((data : any) => {
      if(data){
        this.selectedTaskObj = data;
        this.showResponseTable = false;
        this.showCommentTable = false;
      }
    });

    this.searchField.valueChanges.pipe(debounceTime(300), tap(() => { }))
      .subscribe(term => {
        if(term == ''){
          this.getFeedbackTable(true);
        }
      });
  }

  handleOnChangeCall() {
    this.onChangeCall = true;
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  updateAgentFeedbackData(tab, empty=false) {    
    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {      
      this.isLoading = true;
      this.cdRef.detectChanges();
      if(empty){
        this.skip = 0;
        this.fetched = 0;
      }
      let botId = this.dashboardService.getSelectedBotDetails()._id;
      let params: any = {
        streamId: botId,
      };
      let body: any = {
        limit: this.limit,
        skip: this.skip,
        fetched: this.fetched,
        type : this.feedbackTabSelection
      }
      body = {...body, ... this.payload}
      this.service.invoke('agentFeedbacks', params, body).pipe(finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })).subscribe(data => {
        if (data) {
          this.skip = this.skip+1;
          this.hasMore = data.hasMore;
          this.updateViewData(data);
          // this.agentAspectTableData.push(...data.actualData);
          this.cdRef.detectChanges();
        }
      });
    } else {
      let body: any = {
        limit: 10,
        skip: 0,
        fetched: 0,
        type : this.feedbackTabSelection
      }
      body = {...body, ... this.payload}
      this.service.invoke('agentFeedbacks', this.params, body).subscribe((data : any) => {
        this.updateViewData(data);
      });
    }
  }

  updateViewData(data) {
    // this.agentFeedbackData = Object.assign({}, data);
    let viewData = data[this.feedbackTabSelection];
    if (viewData) {
      this.agentFeedbackData = Object.assign({}, data);
      if (this.viewType == VIEWTYPE.PARTIAL_VIEW) {
        this.agentFeedbackPartialTableData = viewData.length <= 3 ? viewData : viewData.slice(0, 3);
      } else {
        this.agentFeedbackTableData.push(...viewData);
      }      
    }else{
      this.agentFeedbackData = {};
      this.agentFeedbackTableData = [];
      this.agentFeedbackPartialTableData = [];
    }
  }

  openSlider(componentName) {
    let feedbackData = JSON.parse(JSON.stringify(this.agentFeedbackData));
    feedbackData.tabSelection = this.feedbackTabSelection;
    this.openSliderChild.emit({ componentName: componentName, data: this.agentFeedbackData });
  }

  onReachEnd(event){
    if(!this.isLoading && this.hasMore && event.target.scrollTop > 0){
      // this.zone.run(()=>{
        this.updateAgentFeedbackData(this.feedbackTabSelection);
      // })
    }
  }

  onReachEndNegFeedback(event){
    if(!this.feedbackisLoading && this.feedbackhasMore && event.target.scrollTop > 0){
      this.getFeedbackTable();
    }
  }

  changeTabSelection(tab){
    this.feedbackTabSelection = tab;
    this.skip = 0
    this.limit = 30;
    this.fetched = 0;
    this.updateAgentFeedbackData(tab);    
  }

  selectTask(taskObj){
    let body: any = {
      limit: -1,
      skip: 0,
      fetched: 0,
      type : this.feedbackTabSelection,
      taskName : taskObj.intentName
    }
    body = {...body, ... this.payload};
    this.dashboardService.setFeedbackIntentPageSelection(taskObj);
    this.negativeFeedbackTableData = {};
    this.negFbisLoading = true;
    this.service.invoke('agentFeedbacks', this.params, body).pipe(finalize(()=> {this.negFbisLoading = false})).subscribe((response : any) => {
      if(response?.data && Object.keys(response?.data)?.length > 0){
        this.negativeFeedbackTableData = response;        
      }
    });
    
  }

  getFeedbackTable(empty = false, convId = null) {

    if (empty) {
      this.feedbackLimit = 15;
      this.feedbackSkip = 0;
      this.conversationTableData = [];
    }

    let body: any = {
      limit: this.feedbackLimit,
      skip: this.feedbackSkip,
      type: this.feedbackTabSelection,
      taskName: this.selectedTaskObj.intentName,
      feedbackName: this.negFeedback.key,
      additionalComments: this.showCommentTable
    }

    if(convId){
      body.searchId = convId;
    }

    body = { ...body, ... this.payload };

    this.feedbackisLoading = true;

    this.service.invoke('agentFeedbacks', this.params, body).pipe(finalize(() => {
      this.feedbackisLoading = false;
      this.cdRef.detectChanges();
    })).subscribe((response: any) => {    
      if (response && response?.result?.length > 0) {
        this.feedbackSkip = this.feedbackSkip + 1;
        this.feedbackhasMore = response.hasMore;
        response.result?.forEach(element => {
          try {
            element.agentDetails = element.agentDetails ? JSON.parse(element.agentDetails) : {}
          }catch{
            element.agentDetails = {};
          }
        });
        this.conversationTableData.push(...response.result);        
        this.cdRef.detectChanges();
      }
    });
  }

  negFeedbackTableClick(negFb, type){
    this.negFeedback = negFb;
    this.showResponseTable = (type == 'count') ? true : false;
    this.showCommentTable = (type == 'comment') ? true : false;
    this.searchField.setValue(null);
    this.getFeedbackTable(true);
  }

  showConversationLogs(id){
    this.showConversationLogsSlider = true;
    this.openConvSlider(id);
  }

  closeConvsHistorySlider(data){
    this.showConversationLogsSlider = false;
    this.conversationId = '';
    this.newConvSlider.closeSlider('#convsLogSilder');
  }

  openConvSlider(id) {
    this.showConversationLogsSlider = true;
    this.newConvSlider.openSlider("#convsLogSilder", "width500");
    this.conversationId = id;
  }

  getConversationSearch(){
    console.log(this.searchField, "conv search");
    this.feedbackLimit = -1;
    this.feedbackSkip = 0;
    this.conversationTableData = [];
    this.getFeedbackTable(false, this.searchField.value.trim());
  }

}
