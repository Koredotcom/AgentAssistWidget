import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { actualvsDisplayTitle, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-customer-aspect',
  templateUrl: './customer-aspect.component.html',
  styleUrls: ['./customer-aspect.component.scss']
})
export class CustomerAspectComponent implements OnInit {

  @Input() viewType : string;
  @Input() customerDropdownSelection : string;
  customerAspectTabsList : any = actualvsDisplayTitle.CUSTOMER_ASPECT_TABS_LIST;
  customerTabSelection : string = "All";
  public customerAspectTabvsImage  = actualvsDisplayTitle.CUSTOMER_ASPECT_TYPE_VS_IMAGE;
  customerAspectData : any = [];
  
  
  constructor(private dashboardService : DashboardService) { }

  ngOnInit(): void {
    this.updateCustomerAspectData();
  }

  updateCustomerAspectData(){    
    this.dashboardService.getCustomerAspectData(this.customerDropdownSelection,this.customerTabSelection).subscribe(data => {
      this.customerAspectData = [];
      if(data && data.length > 0){
        if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
          this.customerAspectData = data.length <=4 ? data : data.slice(0,4);
        }else {
          this.customerAspectData = data;
        }
      }      
    });
  }

  ngOnChanges(changes : SimpleChanges){
    if(changes && changes.customerDropdownSelection && changes.customerDropdownSelection.currentValue != changes.customerDropdownSelection.previousValue){
      this.updateCustomerAspectData();
    }
    
  }

  changeTabSelection(tabSelection){
    this.customerTabSelection = tabSelection;
    this.updateCustomerAspectData();
  }

}
