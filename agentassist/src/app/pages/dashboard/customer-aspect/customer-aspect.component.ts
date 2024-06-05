import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { actualvsDisplayTitle, DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { SubSink } from 'subsink';
import { finalize, debounceTime, tap } from 'rxjs/operators';
import { workflowService } from '@kore.services/workflow.service';

@Component({
  selector: 'app-customer-aspect',
  templateUrl: './customer-aspect.component.html',
  styleUrls: ['./customer-aspect.component.scss']
})
export class CustomerAspectComponent implements OnInit {

  @Input() viewType : string;
  @Input() filters : IDashboardFilter;
  @Input() customerDropdownSelection : string;
  @Input() widgetData : any;

  @Output() openSliderChild = new EventEmitter();

  public customerAspectTabvsImage  = actualvsDisplayTitle.CUSTOMER_ASPECT_TYPE_VS_IMAGE;
  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;

  customerAspectTabsList : any = actualvsDisplayTitle.CUSTOMER_ASPECT_TABS_LIST;
  customerAspectOtherNames = actualvsDisplayTitle.CUSTOMER_ASPECT_OTHERS_NAMES;

  customerTabSelection : string = "all";
  customerAspectData : any = [];
  previousTab = 'all'
  customerAspectAcutalData : any;
  onChangeCall: boolean = false;
  botId:any;
  params = {
    streamId: ''
  }
  payload: any = {
    "startDate": "",
    "endDate":"",
    "sessionType" : "all", // agent or customer or all
    "dataType" : "all", // all or faqs or articles or automations
    "experience" : "",  // chat or voice
    "skip":0,  // pages to skip (default 0)
    "limit":3, // number of record to be fetched
    "fetched":0  // count of previously fetched responses (default 0)
  }

  exhaustiveAspectData: any = [];

  isLoading: boolean = false;
  hasMore: boolean = false;
  skip = 0
  limit = 30;
  fetched = 0;
  isUnifiedPlatform =false;
  unifiedPath = '';

  subs = new SubSink();
  typeList : any = ['dialog', 'faq', 'answer'];

  constructor(private dashboardService : DashboardService, 
    private service : ServiceInvokerService, 
    private authService : AuthService,
    private cdRef: ChangeDetectorRef,
    private workflowService : workflowService) { }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService.isUnifiedPlatform();
    if(this.isUnifiedPlatform) {
      this.unifiedPath = window.location.origin + '/koreagentassist-xo-frame';

    }
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    if(this.params.streamId !== '') {
      // this.updateCustomerAspectData();
    }


  }

  ngOnChanges(changes : any){
    if(changes.viewType && changes.viewType.currentValue == this.VIEWTYPELIST.EXHAUSTIVE_VIEW){
      this.customerTabSelection = this.dashboardService.customerAspectTab;
      this.previousTab = this.dashboardService.customerAspectTab;
    }
    if(changes.viewType || changes.filters || changes.customerDropdownSelection || changes.customerTabSelection || !this.onChangeCall) {
      if(this.filters && Object.keys(this.filters).length > 0){
        this.payload = { ... this.filters}
        this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
        this.handleOnChangeCall();
        this.updateCustomerAspectData();
      }
    }
  }

  handleOnChangeCall(){
    this.onChangeCall = true;
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);
  }

  updateCustomerAspectData(empty =false) {
    let streamId = this.dashboardService.getSelectedBotDetails()._id;
    let params = {
      streamId,
    };
    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {
      this.payload.dataType = this.customerTabSelection;
      this.payload.sessionType = this.customerDropdownSelection;
      this.isLoading = true;
      this.cdRef.detectChanges();
      if(this.previousTab !== this.customerTabSelection) {
        this.exhaustiveAspectData = [];
        this.previousTab = this.customerTabSelection;
        this.skip = 0;
        this.fetched = 0;
      }
      let body = {
        skip : this.skip,
        fetched : this.fetched,
        limit : this.limit,
      }
      body = {...this.payload, ...body}
      this.service.invoke('customersLookingfor', params, body).pipe(finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })).subscribe(data => {
        if (data) {
          this.skip = this.skip+1;
          this.hasMore = data.hasMore;
          this.updateViewData(data);
          this.cdRef.detectChanges();
        }
    });
    } else {
        if(this.previousTab !== this.customerTabSelection) {
          this.customerAspectData = [];
          this.previousTab = this.customerTabSelection;
        }
        this.payload.dataType = this.customerTabSelection;
        this.dashboardService.customerAspectTab = this.customerTabSelection;
        this.payload.sessionType = this.customerDropdownSelection;
        let body = {
          skip : 0,
          fetched : 0,
          limit : 5,
        }
        body = {...this.payload, ...body};
        this.service.invoke('customersLookingfor', params, body).subscribe((data : any) => {
          this.updateViewData(data);
        });

    }
  }

  updateViewData(resp){
    this.customerAspectAcutalData = Object.assign({}, resp);
    if(resp && Object.keys(resp).length > 0 && resp[this.customerDropdownSelection]){
      let data = resp[this.customerDropdownSelection];
      if(data && data?.length > 0){
        data.forEach(element => {
          element.title = element.name ? element.name : (element.message ? element.message : '')
        });
      }
      if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
        // this.customerAspectData = data.length <=4 ? data : data.slice(0,4);
        this.customerAspectData = data;
      }else {
        this.exhaustiveAspectData.push(...data);
      }
    }
  }

  changeTabSelection(tabSelection){
    this.customerTabSelection = tabSelection;
    this.updateCustomerAspectData();
  }

  openSlider(componentName){
    this.exhaustiveAspectData = [];
    this.openSliderChild.emit({componentName : componentName, data : this.customerAspectAcutalData});
  }

  onReachEnd(event) {
    if(!this.isLoading && this.hasMore && event.target.scrollTop > 0){
      // this.zone.run(()=>{
        this.updateCustomerAspectData();
      // })
    }
  }


}
