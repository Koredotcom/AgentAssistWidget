import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';

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
  selMsgType: string = '';
  nudgeMsg: string = '';
  showNudgeMsg: string = '';
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
      this.nudgeMsg = formVal.message.title;
      this.showNudgeMsg = formVal.message.title;
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

  deleteActionRule(){
    this.deleteAction.emit(this.index-1);
  }
}
