import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';
@Component({
  selector: 'app-hint-agent',
  templateUrl: './hint-agent.component.html',
  styleUrls: ['./hint-agent.component.scss']
})
export class HintAgentComponent implements OnInit {

  @ViewChild('adherenceSlider', { static: true }) adherenceSlider: SliderComponentComponent;
  @Input() form: FormGroup;
  @Input() index : number;
  @Input() length : number;
  @Input() createOrEdit: string = '';
  @Output() deleteAction = new EventEmitter();
  constructor() { }
  selMsgType:string = '';
  msgTypes = COACHINGCNST.TYPE_OF_HINT;
  closeTypes = COACHINGCNST.TYPE_OF_CLOSE;
  title: string = '';
  desc: string = '';
  bodyMsg: string = '';
  variableName: string = '';
  closeType: string = ''
  ngOnInit(): void {
  }

  ngOnChanges(changes : any){
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.form.value;
      this.selMsgType = formVal.expression;
      this.title = formVal.message.title;
      this.bodyMsg = formVal.message.body;
      this.desc = formVal.message.body;
      this.closeType = formVal.message.postAction;
    }
  }


  openAdherence(){
    this.adherenceSlider.openSlider("#adherenceSlider", "width900");
  }
  
  closeAdherence(group){
    this.adherenceSlider.closeSlider("#adherenceSlider");
  }

  selectMsgType(type){
    this.selMsgType = type;
    this.form.controls.expression.setValue(type);
  }

  submitVariable(){
    this.title = this.variableName;
    (this.form.controls.message as FormGroup).controls.title.setValue(this.title);
  }

  submitBody(){
    this.bodyMsg = this.desc;
    (this.form.controls.message as FormGroup).controls.body.setValue(this.bodyMsg);
  }

  clickCloseT(closeT){
    this.closeType = closeT;
    (this.form.controls.message as FormGroup).controls.postAction.setValue(this.closeType);
  }
  
  deleteActionRule(){
    this.deleteAction.emit(this.index-1);
  }
}

