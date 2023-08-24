import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CHECKLISTCNST } from '../../checklist.const';
import { TriggerByComponent } from '../trigger-by/trigger-by.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';

@Component({
  selector: 'app-step-create',
  templateUrl: './step-create.component.html',
  styleUrls: ['./step-create.component.scss']
})
export class StepCreateComponent implements OnInit, OnChanges, AfterViewInit {
  @Output() closeE = new EventEmitter();
  @Output() saveStep = new EventEmitter();
  @Input() stepForm: FormGroup;
  @Input() createOrUpdateStep = 'create';
  @Output() updateStep = new EventEmitter();
  @ViewChild('triggerBy') triggerBy : TriggerByComponent;
  basic = true;
  checklistConst = CHECKLISTCNST.COLORS;
  showButtons = false;
  selectedStepButton : any = '';
  selectedRunDialog : any = '';

  stepButtons : any = {
    'confirmation' : "Confirmation:Yes/No",
    'runDialog' : "Run Dialog"
  };
  selAcc = this.local.getSelectedAccount();
  botId =
  this.auth.isLoadingOnSm && this.selAcc
    ? this.selAcc["instanceBots"][0]?.instanceBotId
    : this.workflowService.getCurrentBt(true)._id;

  selectedRunColorCodeKey : any = '#16B364';
  selectedRunColorCodeValue : any = '#EDFCF2';

  stepConfirmationButtonList : any = [
    {
      name : 'yes',
      color : '#16B364',
      bgcolor : '#EDFCF2'
    },
    {
      name : 'no',
      color : '#F63D68',
      bgcolor : '#FFF1F3'
    }
  ]

 
  // selectedConfirmationColorCode : any = {
  //   'yes' : '#0BA5EC',
  //   'no' : '#0BA5EC'
  // };
  

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
  useCases = {};
  constructor(
    private cdRef : ChangeDetectorRef,
    private service: ServiceInvokerService,
    private auth: AuthService,
    private local: LocalStoreService,
    private workflowService: workflowService,
    private fb: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    if(this.createOrUpdateStep === 'update'){
      setTimeout(() => {
        this.triggerBy.getAddedUtterances();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
  dialogId= ''
  ngOnInit(): void {
    this.getUseCases();
    let formVal = this.stepForm.value;

    if(formVal['confirmButtons']?.length){
      this.showButtons = true;
      if(formVal['confirmButtons']?.length === 1){
        this.selectedStepButton = 'runDialog';
        this.dialogId = formVal['confirmButtons'][0].dialogId;
      }else if(formVal['confirmButtons']?.length === 2){
        this.selectedStepButton = 'confirmation';
      }
    }
  }

  close(){
    this.closeE.emit(false);
  }

  save(){
    // this.triggerBy.upadateAllObjects();
    setTimeout(() => {
      this.saveStep.emit(true);
    },);
  }

  update(){
    // this.triggerBy.upadateAllObjects();
    setTimeout(() => {
      this.updateStep.next(true);
    },);
  }

  changeStepButton(key){
    this.dialogId= '';
    this.selectedStepButton = key;
    (this.stepForm.controls['confirmButtons'] as FormArray).clear();
    if(this.selectedStepButton === 'confirmation'){
      let buttons = [
        {          
          title: ['Yes', [Validators.required]],
          value: ['yun', [Validators.required]],
          color: ['#16B364', [Validators.required]],
          stepStatus: ['in_progress', [Validators.required]],
        },{          
          title: ['No', [Validators.required]],
          value: ['no', [Validators.required]],
          color: ['#F63D68', [Validators.required]],
          stepStatus: ['in_progress', [Validators.required]],
        }
      ];
      buttons.forEach((item)=>{
        (this.stepForm.controls['confirmButtons'] as FormArray)
        .push(this.fb.group(
          item
        ))
      })
    }else{
      let buttons = [{          
        title: ['Run', [Validators.required]],
        value: ['run', [Validators.required]],
        color: ['#16B364', [Validators.required]],
        stepStatus: ['in_progress', [Validators.required]],
        dialogId: ['', [Validators.required]],
      }];
      (this.stepForm.controls['confirmButtons'] as FormArray)
        .push(this.fb.group(
          buttons[0],
        ))
    }
    
  }

  colorUpdate(confirmationNode, color) {
  //  this.selectedConfirmationColorCode[confirmationNode.name] = color;
  //  this.cdRef.detectChanges();
  }

  colorUpdateRun(color){    
    this.selectedRunColorCodeKey = color.key;
    this.selectedRunColorCodeValue = color.value;
    this.cdRef.detectChanges();
    
  }
  getUseCases(){
    // /smartassist/apps/:streamId/usecases?
    // limit=:limit&offset=:offset&search=:search&filterby=:filterby&usecaseType=:usecaseType&status=:status&isAgentAssist=true
    this.service.invoke('get.usecases', {
      streamId: this.botId,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0,
      limit: -1,

    }).subscribe((data) => {
      if (data) {
        this.useCases = (data?.usecases || []).reduce((acc, item)=>{
          acc[item.dialogId] = item.usecaseName;
          return acc;
        }, {});      
      }
    });
  }

  confirmButtons(event){
    this.showButtons = !this.showButtons;
    if(event.target.checked){
      this.stepForm.removeControl('confirmButtons');
      this.stepForm.addControl('confirmButtons', this.fb.array([], [Validators.required]));
      setTimeout(() => {
        this.stepForm.updateValueAndValidity();
      },);
    }else{
      this.stepForm.removeControl('confirmButtons');
    }
  }

  selectedDiaog(item){
    this.selectedRunDialog = item.value;
    this.dialogId= item.key;
    ((this.stepForm.controls['confirmButtons'] as FormArray).at(0) as FormGroup).controls['dialogId'].patchValue(item.key);
  }
}
