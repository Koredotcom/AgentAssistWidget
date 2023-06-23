import { Component, OnInit, ViewChild } from '@angular/core';
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
  constructor() { }

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
  

}
