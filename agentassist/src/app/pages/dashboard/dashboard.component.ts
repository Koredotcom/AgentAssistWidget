import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, SimpleChange, Input } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas, { Options } from 'html2canvas';
import { actualvsDisplayTitle, DASHBORADCOMPONENTTYPE, VIEWTYPE } from './dashboard.cnst';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { DashboardService } from './dashboard.service';
import { SubSink } from 'subsink';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { IDashboardFilter } from './dashboard-filters/dateFilter.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  @Input() filters : IDashboardFilter;
  @Input() viewType : string;
  onChangeCall : boolean = false;

  sliderId : string = "dashboardSlider";
  sliderStatus: boolean;
  openComponentId : string;
  kpiData : any = {};
  customerAspectDropdownList : any = actualvsDisplayTitle.CUSTOMER_ASPECT_DROPDOWN_LIST;
  customerAspectDropdownSelection : string = "agent";
  filterData : any = {};
  params ={
    streamId : ''
  };
  payload: any = {
    "startDate": " ",
    "endDate":" ",
    "experience" : " ",
  }

  subs = new SubSink();

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;

  constructor(public dashboardService : DashboardService, public cdRef : ChangeDetectorRef, private service : ServiceInvokerService, private authService : AuthService) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    this.subscribeEvents();
    this.updateKPIData();
  }

  ngOnChanges(changes : SimpleChange){
    if( this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall ){
      this.params.streamId = this.filters?.botId !== '' ? this.filters.botId : this.params.streamId;
      this.payload = {... this.filters}
      this.updateKPIData();
    }
  }

  updateKPIData(){
      this.service.invoke('sessions', this.params, this.payload).subscribe(
        res => {
          this.kpiData = {};
          if(res && Object.keys(res).length > 0){
            this.kpiData = res;
          }
        });
  }

  subscribeEvents(){
    this.subs.sink = this.dashboardService.getDashboardFilterUpdated().subscribe((filters : any) => {
      // console.log(filters, "filters");
      if(filters && Object.keys(filters).length > 0){
        this.filterData = Object.assign({}, filters);
        this.payload = this.filterData;
        this.params.streamId = this.filters?.botId ? this.filters?.botId : this.dashboardService.getSelectedBotDetails()._id;
        this.updateKPIData();
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  openSlider(event) {
    console.log(event, "event");

    this.sliderStatus = true;
    this.openComponentId = event.componentName;
    this.dashboardService.setExhaustiveRep(true, this.openComponentId, event.data);
    this.newConvSlider.openSlider("#" + this.sliderId, "width940");
  }

  closeSlider(value) {
    this.sliderStatus = false;
    this.dashboardService.setExhaustiveRep(false);
    this.newConvSlider.closeSlider('#' + this.sliderId);
  }


  exportPdf(value) {
    document.getElementById("pdfTable").style.height="auto";
     document.getElementById('scrollContainer').style.height = "auto";
     document.getElementById('innerScroll').style.height = "auto";
     this.cdRef.detectChanges();

    var currentPosition = document.getElementById("pdfTable").scrollTop;
      var w = document.getElementById("pdfTable").offsetWidth;
      var h = document.getElementById("pdfTable").offsetHeight;


     const opts: Partial<Options> = {
      scale: 3, // Adjusts your resolution
    }
      setTimeout(() => {
        html2canvas(document.getElementById("pdfTable"), opts).then((canvas) => {
          var img = canvas.toDataURL("image/jpeg", 1);
          var doc = new jsPDF('l', 'px', [w, h]);
          doc.addImage(img, 'JPEG', 0, 0, w, h);
          // doc.addPage();
          window.open(URL.createObjectURL(doc.output("blob")))
          doc.save('AgentAssist Dashboard.pdf');
          document.getElementById('scrollContainer').style.height = "calc(100vh - 137px)";
          document.getElementById("pdfTable").style.height = "calc(100vh - 59px)";
        });
      }, 100);
  }

  changeAgentAspectView(viewType){
    this.dashboardService.agentAspectView = viewType
  }

  changeCustomerAspectDropdown(selection){
    this.customerAspectDropdownSelection = selection;
  }

}
