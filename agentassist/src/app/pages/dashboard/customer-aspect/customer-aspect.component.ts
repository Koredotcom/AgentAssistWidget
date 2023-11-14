import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { actualvsDisplayTitle, DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { SubSink } from 'subsink';
import { finalize, debounceTime, tap } from 'rxjs/operators';

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
  customerAspectTabsList : any = actualvsDisplayTitle.CUSTOMER_ASPECT_TABS_LIST;
  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;

  customerTabSelection : string = "all";
  customerAspectData : any = [];
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

  isLoading: boolean = false;
  hasMore: boolean = false;
  skip = 0
  limit = 14;
  fetched = 0;

  subs = new SubSink();

  constructor(private dashboardService : DashboardService, 
    private service : ServiceInvokerService, 
    private authService : AuthService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    if(this.params.streamId !== '') {
      this.updateCustomerAspectData();
    }


  }

  ngOnChanges(changes : any){
    if(changes.viewType || changes.filters || changes.customerDropdownSelection || changes.customerTabSelection || !this.onChangeCall) {
      this.payload = { ... this.filters}
      this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
      this.handleOnChangeCall();
      this.updateCustomerAspectData();
    }
    // if(this.viewType && this.filters && Object.keys(this.filters).length > 0 && this.customerDropdownSelection && !this.onChangeCall){
    // }
    // if(changes.customerDropdownSelection) {
    //   this.handleOnChangeCall();
    //   this.updateCustomerAspectData();
    // }

  }

  handleOnChangeCall(){
    this.onChangeCall = true;
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);
  }

  updateCustomerAspectData(empty =false) {
    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {
      this.updateViewData(this.widgetData);
      this.payload.dataType = this.customerTabSelection;
      this.payload.sessionType = this.customerDropdownSelection;
      this.isLoading = true;
      this.cdRef.detectChanges();
      if(empty){
        this.skip = 0;
        this.limit = 14;
        this.fetched = this.fetched;
      }
      let botId = this.dashboardService.getSelectedBotDetails()._id;
      let params: any = {
        botId,
      };
      let body: any = {
        limit: this.limit,
        skip: this.skip,
        fetched: this.fetched
      }
      body = {...body, ... this.payload}
      this.service.invoke('customersLookingfor', this.params, body).pipe(finalize(() => {
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
      // this.dashboardService.getCustomerAspectData(this.customerDropdownSelection, this.customerTabSelection).subscribe(resp => {
      //   if (resp) {
      //     this.updateViewData(resp);
      //   }
      // });
        this.payload.dataType = this.customerTabSelection;
        this.payload.sessionType = this.customerDropdownSelection;
        this.service.invoke('customersLookingfor', this.params, this.payload).subscribe((data : any) => {
          this.updateViewData(data);
        });

    }
  }

  updateViewData(resp){
    this.customerAspectAcutalData = Object.assign({}, resp);
    this.customerAspectData = [];
    if(resp && Object.keys(resp).length > 0 && resp[this.customerDropdownSelection]){
      let data = resp[this.customerDropdownSelection];
      if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
        this.customerAspectData = data.length <=4 ? data : data.slice(0,4);
      }else {
        this.customerAspectData.push(...data);
      }
    }
  }

  changeTabSelection(tabSelection){
    this.customerTabSelection = tabSelection;
    this.updateCustomerAspectData();
  }

  openSlider(componentName){
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