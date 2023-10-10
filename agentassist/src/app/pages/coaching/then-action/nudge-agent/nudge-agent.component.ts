import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';
import { CoachingService } from '../../coaching.service';

@Component({
  selector: 'app-nudge-agent',
  templateUrl: './nudge-agent.component.html',
  styleUrls: ['./nudge-agent.component.scss']
})
export class NudgeAgentComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() index : number;
  @Input() length : number;
  @Input() createOrEdit: string = '';
  @Output() deleteAction = new EventEmitter();
  msgTypes = COACHINGCNST.TYPE_OF_HINT;


  coachingCnst : any = COACHINGCNST;
  closeTypes = COACHINGCNST.TYPE_OF_CLOSE;
  closeType: string = '';
  time : number;
  variableTime : number;


  selMsgType: string = '';
  nudgeMsg: string = '';
  showNudgeMsg: string = '';
  selectedAdherence : string;
  openAdherenceSlider : boolean = false;
  allAdherences = this.coachingService.allactionList[COACHINGCNST.ADHERENCE_DATA];
  adherenceClick : boolean = false;

  private adherenceSlider: SliderComponentComponent;
  @ViewChild('adherenceSlider') set content(content: SliderComponentComponent) {
     if(content) { // initially setter gets called with undefined
          this.adherenceSlider = content;
     }
  }

  constructor(private cdRef : ChangeDetectorRef, private coachingService : CoachingService,
    private fb : FormBuilder) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes : any){
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.form.value;
      this.selMsgType = formVal.expression;
      this.nudgeMsg = formVal.message.title;
      this.showNudgeMsg = formVal.message.title;

      this.closeType = formVal.message.postAction;
      this.time = formVal.message.time ? formVal.message.time : 5;
      this.variableTime = formVal.message.time ? formVal.message.time : 5;

      this.selectedAdherence = formVal.adherence?.adType;
      if(this.selectedAdherence == COACHINGCNST.UTTERANCE && !formVal?.adherence.utteranceCount){
        this.selectedAdherence = null;
      }
    }else if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      const formVal = this.form.value;
      this.time = formVal.message.time;
      this.variableTime = formVal.message.time;
    }
  }

  openAdherence(){
    this.openAdherenceSlider = true;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.adherenceSlider.openSlider("#adherenceSlider", "width900");
    },);
  }
  
  closeAdherence(group){
    this.openAdherenceSlider = false;
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

  selectMsgType(type){
    this.selMsgType = type;
    this.form.controls.expression.setValue(type);
  }

  submitnudgeMsg(){
    this.showNudgeMsg = this.nudgeMsg;
    (this.form.controls.message as FormGroup).controls.title.setValue(this.nudgeMsg);
  }


  clickCloseT(closeT){
    this.closeType = closeT;
    (this.form.controls.message as FormGroup).controls.postAction.setValue(this.closeType);
    if(closeT === 'doesnot_auto_close'){
      (this.form.controls?.message as FormGroup)?.removeControl('time');
    }else{
      (this.form.controls?.message as FormGroup)?.addControl('time', new FormControl(5));
    }
    this.resetValidators();
  }

  deleteActionRule(){
    this.deleteAction.emit(this.index-1);
  }
  
  onEnterTime(e){
    this.time = e ? e : 1;
    (this.form.controls.message as FormGroup).controls?.time.setValue(this.time);
  }


  resetValidators() {
    if (this.closeType == this.coachingCnst.AUTO_CLOSE) {
      this.time = 5;
      (this.form.controls?.message as FormGroup)?.controls?.time?.setValidators(Validators.required);
      (this.form.controls?.message as FormGroup)?.controls?.time?.setValue(this.time);
    } else {
      (this.form.controls?.message as FormGroup)?.controls?.time?.clearValidators();
    }
    (this.form.controls?.message as FormGroup)?.controls?.time?.updateValueAndValidity();
  }

  selectAdherenceClick(type){
    this.selectedAdherence = type;
    this.adherenceClick = true;
    if(!this.form.get('adherence')){
      (<FormGroup> this.form).addControl('adherence',this.fb.group(this.coachingService.getAdherenceForm()));
    }
    this.cdRef.detectChanges();
  }

  deleteAdherenceClick(flag){
    this.selectedAdherence = null;
    this.adherenceClick = true;
    if(!flag){
      (<FormGroup> this.form).removeControl('adherence');    
    }
  }

}
