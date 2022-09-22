import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from './dashboard.cnst';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  @ViewChild('pdfTable') pdfTable!: ElementRef;
  sliderId : string = "dashboardSlider";
  sliderStatus: boolean;
  openComponentId : string;

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;

  constructor(private dashboardService : DashboardService) { }

  ngOnInit(): void {
   
    
  }

  openSlider(id) {
    this.sliderStatus = true;
    this.openComponentId = id;
    this.dashboardService.setExhaustiveRep(true, this.openComponentId);
    this.newConvSlider.openSlider("#" + this.sliderId, "width940");
    console.log(this.dashboardService.getExhaustiveRep())
  }

  closeSlider(value) {
    this.sliderStatus = false;
    this.dashboardService.setExhaustiveRep(false);
    this.newConvSlider.closeSlider('#' + this.sliderId);
  }


  exportPdf(value) {
    let fileName = "AgentAssist Dashboard"
    html2canvas(this.pdfTable.nativeElement).then((canvas) => {

      const FILEURI = canvas.toDataURL('image/png');
      // let PDF = new jsPDF('p', 'mm', 'a4');
      let PDF = new jsPDF({
        orientation: 'landscape'
      })
      // add page top padding 
      let position = 10;
      const imgProps = PDF.getImageProperties(FILEURI);
      const pdfWidth = PDF.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      PDF.addImage(FILEURI, 'PNG', 0, position, pdfWidth, pdfHeight);
      PDF.save(fileName);
      PDF.setProperties({
        title: fileName
      })
      window.open(URL.createObjectURL(PDF.output("blob")))
    })
  }

}
