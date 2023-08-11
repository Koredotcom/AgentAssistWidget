import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CHECKLISTCNST } from '../checklist.const';

@Component({
  selector: 'app-step-create',
  templateUrl: './step-create.component.html',
  styleUrls: ['./step-create.component.scss']
})
export class StepCreateComponent implements OnInit, OnChanges {
  @Output() closeE = new EventEmitter();
  @Output() saveStep = new EventEmitter();
  @Input() stepForm: FormGroup;
  @Input() createOrUpdateStep = 'create';
  @Output() updateStep = new EventEmitter();

  checklistConst = CHECKLISTCNST.COLORS;

  showButtons = false;
  selectedStepButton : any = '';
  selectedRunDialog : any = '';

  stepButtons : any = {
    'confirmation' : "Confirmation:Yes/No",
    'runDialog' : "Run Dialog"
  }

  selectedRunColorCodeKey : any = '#0BA5EC';
  selectedRunColorCodeValue : any = '#F0F9FF';

  stepConfirmationButtonList : any = [
    {
      name : 'yes',
      color : '#F0F9FF'
    },
    {
      name : 'no',
      color : '#F0F9FF'
    }
  ]

 
  selectedConfirmationColorCode : any = {
    'yes' : '#0BA5EC',
    'no' : '#0BA5EC'
  };
  

  runDialogList : any = [
    {
      name : 'App Solution'
    },
    {
      name : 'Discount'
    },
    {
      name : 'Customer Onboarding'
    },
    {
      name : 'Sales'
    },
    {
      name : 'Laptop Recommendation'
    }
  ]

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("this.stepForm", this.stepForm);
  }

  ngOnInit(): void {

  }

  close(){
    this.closeE.emit(false);
  }

  save(){
    this.saveStep.emit(true);
  }

  update(){
    this.updateStep.next(true);
  }

  changeStepButton(key){
    this.selectedStepButton = key;
  }

  colorUpdate(confirmationNode, color) {
   this.selectedConfirmationColorCode[confirmationNode.name] = color;
   
  }

  colorUpdateRun(color){    
    this.selectedRunColorCodeKey = color.key;
    this.selectedRunColorCodeValue = color.value;
    
  }
}
