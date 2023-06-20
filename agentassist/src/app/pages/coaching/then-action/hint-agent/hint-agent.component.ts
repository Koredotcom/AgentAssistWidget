import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';
@Component({
  selector: 'app-hint-agent',
  templateUrl: './hint-agent.component.html',
  styleUrls: ['./hint-agent.component.scss']
})
export class HintAgentComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() index : number;
  @Input() length : number;
  @Input() createOrEdit: string = '';
  @Output() deleteAction = new EventEmitter();

  coachingCnst : any = COACHINGCNST;
  selMsgType:string = '';
  msgTypes = COACHINGCNST.TYPE_OF_HINT;
  closeTypes = COACHINGCNST.TYPE_OF_CLOSE;
  title: string = '';
  desc: string = '';
  bodyMsg: string = '';
  hintTitle: string = '';
  closeType: string = '';
  time : number;
  variableTime : number;
  openAdherenceSlider : boolean = false;
  
  private adherenceSlider: SliderComponentComponent;
  @ViewChild('adherenceSlider') set content(content: SliderComponentComponent) {
    if(content) { // initially setter gets called with undefined
      this.adherenceSlider = content;
    }
  }

  constructor(private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : any){
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.form.value;
      this.selMsgType = formVal.expression;
      this.title = formVal.message.title;
      this.hintTitle = formVal.message.title;
      this.bodyMsg = formVal.message.body;
      this.desc = formVal.message.body;
      this.closeType = formVal.message.postAction;
      this.time = formVal.message.time ? formVal.message.time : 5;
      this.variableTime = formVal.message.time ? formVal.message.time : 5;

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

  submitVariable(){
    this.title = this.hintTitle;
    (this.form.controls.message as FormGroup).controls.title.setValue(this.title);
  }

  submitBody(){
    this.bodyMsg = this.desc;
    (this.form.controls.message as FormGroup).controls.body.setValue(this.bodyMsg);
  }

  clickCloseT(closeT){
    this.closeType = closeT;
    (this.form.controls.message as FormGroup).controls.postAction.setValue(this.closeType);
    this.resetValidators();
  }
  
  deleteActionRule(){
    this.deleteAction.emit(this.index-1);
  }

  onEnterTime(e){
    this.time = e ? e : 1;
    (this.form.controls.message as FormGroup).controls?.time.setValue(this.time);
  }

  resetValidators(){
    if(this.closeType == this.coachingCnst.AUTO_CLOSE){
      (this.form.controls?.message as FormGroup)?.controls?.time.setValidators(Validators.required);
      (this.form.controls?.message as FormGroup)?.controls?.time.setValue(this.time);
    }else{
      (this.form.controls?.message as FormGroup)?.controls?.time.clearValidators();
    }
    (this.form.controls?.message as FormGroup)?.controls?.time.updateValueAndValidity();
  }
}

