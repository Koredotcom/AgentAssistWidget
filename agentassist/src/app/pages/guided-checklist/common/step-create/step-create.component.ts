import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CHECKLISTCNST } from '../../checklist.const';
import { TriggerByComponent } from '../trigger-by/trigger-by.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
import { ChecklistService } from '../../checklist.service';

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
    // 'runDialog' : "Run Dialog"
  };
  selAcc = this.local.getSelectedAccount();
  botId = this.workflowService.getCurrentBtSmt(true)._id

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
    private fb: FormBuilder,
    private clS: ChecklistService
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
    if(this.auth.isLoadingOnSm){
      delete this.stepButtons['runDialog']
    }
    this.getUseCases();
    let formVal = this.stepForm.value;
    if(formVal['confirmButtons']?.length){
      this.showButtons = true;
      if(formVal['confirmButtons']?.length === 1){
        if(formVal['confirmButtons'][0]?.dialogId){
          this.selectedStepButton = 'runDialog';
          this.dialogId = formVal['confirmButtons'][0].dialogId;
        }else{
          this.selectedStepButton = 'confirmation';
        }
      }else if(formVal['confirmButtons']?.length === 2){
        this.selectedStepButton = 'confirmation';
      }
    }
  }

  close(){
    this.closeE.emit(false);
  }

  save(){
    setTimeout(() => {
      this.saveStep.emit(true);
    },);
  }

  update(){
    setTimeout(() => {
      this.updateStep.next(true);
    },);
  }

  changeStepButton(key){
    this.dialogId= '';
    this.selectedStepButton = key;
    (this.stepForm.controls['confirmButtons'] as FormArray).clear();
    if(this.selectedStepButton === 'confirmation'){
      let buttons = this.clS.getConfirmationBtns();
      buttons.forEach((item)=>{
        (this.stepForm.controls['confirmButtons'] as FormArray)
        .push(this.fb.group(
          item
        ))
      })
    }else{
      let button = this.clS.getRunBtn();
      (this.stepForm.controls['confirmButtons'] as FormArray)
        .push(this.fb.group(
          button,
        ))
    }

  }

  colorUpdate(color, index) {
    ((this.stepForm.controls['confirmButtons'] as FormArray)
    .at(index) as FormGroup)
    .controls['color'].patchValue(color.key);
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
    this.dialogId = '';
    this.selectedStepButton = '';
    this.stepForm.removeControl('confirmButtons');
    // if(){
    // };
      this.stepForm.addControl('confirmButtons', this.fb.array([], event.target.checked? [Validators.required]: []));
      setTimeout(() => {
        this.stepForm.updateValueAndValidity();
      },);
  }

  selectedDiaog(item){
    this.selectedRunDialog = item.value;
    this.dialogId= item.key;
    ((this.stepForm.controls['confirmButtons'] as FormArray).at(0) as FormGroup).controls['dialogId'].patchValue(item.key);
  }

  deleteButtons(inx){
    ((this.stepForm.controls['confirmButtons'] as FormArray).removeAt(inx));
  }
}
