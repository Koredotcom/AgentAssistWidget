import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas, { Options } from 'html2canvas';
import { actualvsDisplayTitle, DASHBORADCOMPONENTTYPE, VIEWTYPE } from './dashboard.cnst';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { DashboardService } from './dashboard.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  sliderId : string = "dashboardSlider";
  sliderStatus: boolean;
  openComponentId : string;
  kpiData : any = {};
  customerAspectDropdownList : any = actualvsDisplayTitle.CUSTOMER_ASPECT_DROPDOWN_LIST;
  customerAspectDropdownSelection : string = "Agent_Initiated";

  subs = new SubSink();

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;

  constructor(public dashboardService : DashboardService, public cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeEvents();
   this.updateKPIData();
  }

  updateKPIData(){
    this.dashboardService.getKPIData().subscribe(data => {
      this.kpiData = {};
      if(data && data.dashboardkpi){
        this.kpiData = data.dashboardkpi;
      }
    });
  }

  subscribeEvents(){
    this.subs.sink = this.dashboardService.getDashboardFilterUpdated().subscribe((filters : any) => {
      console.log(filters, "filters");
      
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  openSlider(id) {
    this.sliderStatus = true;
    this.openComponentId = id;
    this.dashboardService.setExhaustiveRep(true, this.openComponentId);
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
