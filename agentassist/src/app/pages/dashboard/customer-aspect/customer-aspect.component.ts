import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { actualvsDisplayTitle, DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';

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

  customerTabSelection : string = "All";
  customerAspectData : any = [];
  customerAspectAcutalData : any;
  onChangeCall: boolean = false;
  
  
  constructor(private dashboardService : DashboardService) { }

  ngOnInit(): void {
    // this.updateCustomerAspectData();
  }

  ngOnChanges(changes : SimpleChanges){
    if(this.viewType && this.filters && Object.keys(this.filters).length > 0 && this.customerDropdownSelection && !this.onChangeCall){
      this.handleOnChangeCall();
      this.updateCustomerAspectData();
    }
  }

  handleOnChangeCall(){
    this.onChangeCall = true; 
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);   
  }

  updateCustomerAspectData() {
    if (this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData) {      
      this.updateViewData(this.widgetData);
    } else {
      this.dashboardService.getCustomerAspectData(this.customerDropdownSelection, this.customerTabSelection).subscribe(resp => {
        if (resp) {
          this.updateViewData(resp);
        }
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
        this.customerAspectData = data;
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


}
