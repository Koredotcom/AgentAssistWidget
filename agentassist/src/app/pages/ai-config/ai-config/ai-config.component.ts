import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-ai-config',
  templateUrl: './ai-config.component.html',
  styleUrls: ['./ai-config.component.scss']
})
export class AiConfigComponent implements OnInit {
  @ViewChild('openAIAndAzureConf', { static: true }) openAIAndAzureConf: SliderComponentComponent;
  azureConfig = false;
  aiConfig = false;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openAzureConf(){
    this.azureConfig = true;
    this.openAIAndAzureConf.openSlider("#openAIAndAzureConf", "width550");
  }

  openOpenAIConf(){
    this.aiConfig = true;
    this.openAIAndAzureConf.openSlider("#openAIAndAzureConf", "width550");
  }  

  closeModal(){
    this.openAIAndAzureConf.closeSlider("#openAIAndAzureConf");
    this.aiConfig = false;
    this.azureConfig = false;
  }
  
  openPolieGuidelines(policiesAndGuideLines) {
    this.modalService.open(policiesAndGuideLines, {backdropClass: 'light-blue-backdrop', windowClass: 'dark-modal', centered: true, backdrop: 'static', keyboard: false});
  }

  closePolieGuidelines() {
    this.modalService.dismissAll();
  }
}
