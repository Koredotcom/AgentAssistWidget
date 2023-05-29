import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-utterance',
  templateUrl: './utterance.component.html',
  styleUrls: ['./utterance.component.scss']
})
export class UtteranceComponent implements OnInit {

  constructor(private cdRef : ChangeDetectorRef) { }
  @Input() form:FormGroup;
  @Input() index : number;
  @Input() length : number;
  @Output() deleteTrigger = new EventEmitter();

  users = COACHINGCNST.USER_LIST;
  occurances = COACHINGCNST.OCCURENCES;
  selOcc = COACHINGCNST.SELECTED_OCCURENCE;
  timer = COACHINGCNST.SELECTED_TIMER;
  opList = COACHINGCNST.OPERATOR_LIST;
  selectedOperator : string;
  selUser: '';
  openSetUtterance : boolean = false;

  private adherenceSlider: SliderComponentComponent;

  @ViewChild('adherenceSlider') set content(content: SliderComponentComponent) {
     if(content) { // initially setter gets called with undefined
          this.adherenceSlider = content;
     }
  }

  ngOnInit(): void {
    (this.form.controls.frequency as FormGroup).controls.every.setValue(this.timer+'s');
    this.form?.controls?.operator?.setValue(COACHINGCNST.AND_OPERATOR);
    this.selectedOperator = this.form.controls.operator.value;
  }

  ngOnChanges(changes : SimpleChange){
    if(changes["index"]?.currentValue ==  this.length){
      this.changeOperator(COACHINGCNST.AND_OPERATOR)
    }    
  }

  clickOnUser(user){
    this.selUser = user;
    this.form.controls.by.setValue(user);
  }

  clickOcc(occ){
    this.selOcc = occ;
    (this.form.controls.frequency as FormGroup).controls.nOccurences.setValue(occ);
  }

  changeOperator(op){
    this.selectedOperator = op
    this.form.controls.operator.setValue(op);    
  }

  openAdherence(){
    this.openSetUtterance = true;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.adherenceSlider.openSlider("#adherenceSlider", "width900");
    },);
  }
  
  closeAdherence(group?){
    this.openSetUtterance = false;
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

  deleteTriggerRule(){
    this.deleteTrigger.emit(this.index-1);
  }

}
