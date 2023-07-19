import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input() createOrEdit: string = '';
  @Input() isDefault = false;
  @Input() deletable = true;
  @Output() deleteTrigger = new EventEmitter();

  coachingCnst : any = COACHINGCNST
  users = COACHINGCNST.USER_LIST;
  occurances = COACHINGCNST.OCCURENCES;
  selOcc = COACHINGCNST.SELECTED_OCCURENCE;
  timer = COACHINGCNST.SELECTED_TIMER;
  showTimer = COACHINGCNST.SELECTED_TIMER;
  opList = COACHINGCNST.OPERATOR_LIST;
  selectedOperator : string;
  selUser: '';
  openSetUtterance : boolean = false;
  selectedConvType : string;
  selectedList : any = {}
  inconvList : any = {}
  periodList : any = [COACHINGCNST.TRIGGER_FIRST, COACHINGCNST.TRIGGER_WITHIN]

  private adherenceSlider: SliderComponentComponent;
  @ViewChild('adherenceSlider') set content(content: SliderComponentComponent) {
     if(content) { // initially setter gets called with undefined
          this.adherenceSlider = content;
     }
  }
  ngOnInit(): void {
  
  }
  
  ngOnChanges(changes : any){
    if(changes["index"]?.currentValue ==  this.length){
      this.changeOperator(COACHINGCNST.AND_OPERATOR)
    }    
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.form.value;
      this.selectedOperator = formVal.operator;
      this.selUser = formVal.by;
      this.selOcc = formVal.frequency.nOccurrences;
      this.timer = formVal.frequency.every;
      this.showTimer = formVal.frequency.every;
      this.updateInConversationVariables(formVal);
    }
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      this.form?.controls?.operator?.setValue(COACHINGCNST.AND_OPERATOR);
      this.selectedOperator = this.form.controls.operator.value;
      (this.form.controls.frequency as FormGroup).controls?.every.setValue(this.timer);
      this.updateInConversationVariables(this.form.value);
    }
  }

  updateInConversationVariables(formVal){
    this.selectedConvType = formVal.frequency.duration;
    this.selectedList.period = formVal.frequency.period ? formVal.frequency.period : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.period;
    this.selectedList.nSeconds = formVal.frequency.nSeconds ? formVal.frequency.nSeconds : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds;
    this.selectedList.nMessages = formVal.frequency.nMessages ? formVal.frequency.nMessages : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nMessages;
    this.inconvList.period = formVal.frequency.period ? formVal.frequency.period : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.period;
    this.inconvList.nSeconds = formVal.frequency.nSeconds ? formVal.frequency.nSeconds : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds;
    this.inconvList.nMessages = formVal.frequency.nMessages ? formVal.frequency.nMessages : COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION.nMessages;    
  }

  clickOnType(type) {
    if (type && this.selectedConvType != type) {
      this.selectedConvType = type;
      let addConvSelectionList: any = [];
      for (let item in COACHINGCNST.UTTERANCE_CONV_REMOVE_LIST) {
        let utteranceConvSelectionList = COACHINGCNST.UTTERANCE_CONV_REMOVE_LIST[item];
        if (item != type) {
          for (let param of utteranceConvSelectionList) {
            (<FormGroup>this.form.controls.frequency).removeControl(param);
          }
        } else {
          addConvSelectionList = COACHINGCNST.UTTERANCE_CONV_REMOVE_LIST[item];
        }
      }
      for (let param of addConvSelectionList) {
        (<FormGroup>this.form.controls.frequency).addControl(param, new FormControl(COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION[param], [Validators.required]));
        this.selectedList[param] = COACHINGCNST.UTTERANCE_CONV_DEFAULT_SELECTION[param];
      }
      (this.form.controls.frequency as FormGroup).controls?.duration?.setValue(type);
      this.resetFormValuesBasedOnConvSelection(type);
    }
  }

  resetFormValuesBasedOnConvSelection(type){
    if(type){
      this.onEnterPeriod(this.coachingCnst.UTTERANCE_CONV_DEFAULT_SELECTION.period);
      this.onEnterTime(this.coachingCnst.UTTERANCE_CONV_DEFAULT_SELECTION.nSeconds);
      this.onEnterMessages(this.coachingCnst.UTTERANCE_CONV_DEFAULT_SELECTION.nMessages);
    }
  }

  onEnterPeriod(e){
    this.inconvList.period = e;
    this.selectedList.period = e;
    if((this.form.controls.frequency as FormGroup).controls?.period){
      (this.form.controls.frequency as FormGroup).controls?.period.setValue(this.inconvList.period);
    }    
  }


  onEnterTime(e){
    if(!e){
      e = 1;
    }
    this.inconvList.nSeconds = e;
    this.selectedList.nSeconds = e;
    if((this.form.controls.frequency as FormGroup).controls?.nSeconds){
      (this.form.controls.frequency as FormGroup).controls?.nSeconds.setValue(this.inconvList.nSeconds);
    }
  }

  onEnterMessages(e){
    if(!e){
      e = 1;
    }
    this.inconvList.nMessages = e;
    this.selectedList.nMessages = e;
    if((this.form.controls.frequency as FormGroup).controls?.nMessages){
      (this.form.controls.frequency as FormGroup).controls?.nMessages.setValue(this.inconvList.nMessages);
    }
  }

  clickOnUser(user){
    this.selUser = user;
    this.form.controls.by.setValue(user);
  }

  clickOcc(occ){
    this.selOcc = occ;
    (this.form.controls.frequency as FormGroup).controls.nOccurrences.setValue(occ);
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
