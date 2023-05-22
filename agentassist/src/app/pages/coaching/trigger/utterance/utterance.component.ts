import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-utterance',
  templateUrl: './utterance.component.html',
  styleUrls: ['./utterance.component.scss']
})
export class UtteranceComponent implements OnInit {

  constructor() { }
  @Input() form:any;
  selectedCond = 'And';
  users = ['Agent', 'Customer'];
  occurances = [1,2,3,4,5];
  selOcc = 1;
  timer = 30;
  selUser: '';
  @ViewChild('adherenceSlider', { static: true }) adherenceSlider: SliderComponentComponent;

  ngOnInit(): void {
    console.log("form", this.form);
    this.form.controls.frequency.controls.every.setValue(this.timer+'s');
  }

  clickOnUser(user){
    this.selUser = user;
    this.form.controls.by.setValue(user);
  }

  clickOcc(occ){
    this.selOcc = occ;
    this.form.controls.frequency.controls.nOccurences.setValue(occ);
  }
  openAdherence(){
    this.adherenceSlider.openSlider("#adherenceSlider", "width900");
  }
  
  closeAdherence(group){
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

}
