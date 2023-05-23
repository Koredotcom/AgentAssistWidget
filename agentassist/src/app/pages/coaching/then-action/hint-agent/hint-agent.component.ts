import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-hint-agent',
  templateUrl: './hint-agent.component.html',
  styleUrls: ['./hint-agent.component.scss']
})
export class HintAgentComponent implements OnInit {

  @ViewChild('adherenceSlider', { static: true }) adherenceSlider: SliderComponentComponent;
  @Input() form: FormGroup
  constructor() { }

  ngOnInit(): void {
  }

  openAdherence(){
    this.adherenceSlider.openSlider("#adherenceSlider", "width900");
  }
  
  closeAdherence(group){
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

}
