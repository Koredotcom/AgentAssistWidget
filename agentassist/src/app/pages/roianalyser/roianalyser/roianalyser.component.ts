import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigureDataComponent } from '../configure-data/configure-data.component';

@Component({
  selector: 'app-roianalyser',
  templateUrl: './roianalyser.component.html',
  styleUrls: ['./roianalyser.component.scss']
})
export class ROIAnalyserComponent implements OnInit {

  modalFlowCreateRef:any;

  constructor(private modalService : NgbModal,) { }

  ngOnInit(): void {
  
  }

  openConfigureDataModal(){
    this.modalFlowCreateRef = this.modalService.open(ConfigureDataComponent, {
      windowClass: 'modal-ngb-wrapper-window',
      centered: true,
      backdrop: 'static'
    });
    this.modalFlowCreateRef.componentInstance.closeConfigureData.subscribe((value : any) => {
      if(value){
        this.modalFlowCreateRef.close();
      }
    });
  }

  toggleCostView(event){
    if(event.target.checked){
      this.openConfigureDataModal();
    }
  }

}
