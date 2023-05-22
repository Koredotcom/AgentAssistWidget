import { Component, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-utterance',
  templateUrl: './utterance.component.html',
  styleUrls: ['./utterance.component.scss']
})
export class UtteranceComponent implements OnInit {

  constructor() { }
  @Input() form:any;
  @Input() index : number;
  @Input() length : number;
  
  users = COACHINGCNST.USER_LIST;
  occurances = COACHINGCNST.OCCURENCES;
  selOcc = COACHINGCNST.SELECTED_OCCURENCE;
  timer = COACHINGCNST.SELECTED_TIMER;
  opList = COACHINGCNST.OPERATOR_LIST;
  selectedOperator : string;
  selUser: '';
  @ViewChild('adherenceSlider', { static: true }) adherenceSlider: SliderComponentComponent;

  ngOnInit(): void {
    console.log("form", this.form);
    this.form.controls.frequency.controls.every.setValue(this.timer+'s');
    this.selectedOperator = this.form.controls.operator.value;
  }

  ngOnChanges(changes : SimpleChange){
    console.log(changes, "changes");
    if(changes["index"]?.currentValue ==  length){
      this.form?.controls?.operator?.setValue(COACHINGCNST.AND_OPERATOR);
    }    
  }

  clickOnUser(user){
    this.selUser = user;
    this.form.controls.by.setValue(user);
  }

  clickOcc(occ){
    this.selOcc = occ;
    this.form.controls.frequency.controls.nOccurences.setValue(occ);
  }

  changeOperator(op){
    this.selectedOperator = op
    this.form.controls.operator.setValue(op);
    console.log(this.form, 'from');
    
  }

  openAdherence(){
    this.adherenceSlider.openSlider("#adherenceSlider", "width900");
  }
  
  closeAdherence(group){
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

}
