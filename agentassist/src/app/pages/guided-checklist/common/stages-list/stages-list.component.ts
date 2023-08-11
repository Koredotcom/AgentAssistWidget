import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { CHECKLISTCNST } from '../checklist.const';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-stages-list',
  templateUrl: './stages-list.component.html',
  styleUrls: ['./stages-list.component.scss']
})
export class StagesListComponent implements OnInit {

  @Output() closeCheckList = new EventEmitter();
  @ViewChild('checklistCreateSlider', { static: true }) checklistCreateSlider: SliderComponentComponent;
  @ViewChild('stepCreateSlider', { static: true }) stepCreateSlider: SliderComponentComponent;
  @Input() checkListType = 'primary';
  @Input() createOrUpdate = 'create';
  @Input() currentCheckList: any = {};
  isStepOpen = false;
  isCheckListOpen = false;
  checkListForm: FormGroup;
  stageForm: FormGroup;
  stepForm: FormGroup;
  selAcc = this.local.getSelectedAccount();
  triggerBy: FormGroup;
  name = new FormControl('');
  stage = {
    name: '',
    runTimeName: '',
    color: '#F0F9FF',
    steps: [],
    edit: false,
    isNew: true,
  };
  createOrUpdateStep = 'create';
  stages = [];
  checklistConst = CHECKLISTCNST.COLORS;
  relaod = false;
  currentStage:any = {};
  isCheckListCreateOrUpdate = 'create';
  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private local: LocalStoreService,
    private workflowService: workflowService,
    private service: ServiceInvokerService,
  ) { }

  ngOnInit(): void {
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    this.checkListForm = this.fb.group({
      'botId': [botId, [Validators.required]],
      'name': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'tags': this.fb.array([]),
      'order': ['', [Validators.required]],
      'channels': this.fb.array([], [Validators.required]),
      'type': [this.checkListType, [Validators.required]],
      'assignedTo': this.fb.group({
        'isAllInteractions': [true],
        'assignees': this.fb.group({
          'groups': this.fb.array([]),
          'agents': this.fb.array([]),
        }),
        'queues': this.fb.array([]),
        'skills': this.fb.array([]),
      }),
      'stages': this.fb.array([]),
      'isActive': [true, [Validators.required]],
    });
    this.triggerBy = this.fb.group({
      'type': ['', [Validators.required]],
      'botId': ['', [Validators.required]],
      'taskId': ['', [Validators.required]],
      'when': ['', [Validators.required]],
      'addUtterances': this.fb.array([]),
    });
    this.name.valueChanges.subscribe((val) => {
      this.checkListForm.controls['name'].patchValue(val);
    });
    if(this.createOrUpdate === 'create'){
      this.openCheckList();
      this.stages.push({...this.stage});
    }else{
      console.log("this.currentCheckList?.stages", this.currentCheckList?.stages);
      this.stages = this.currentCheckList?.stages || [];
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes?.createOrUpdate?.currentValue === 'create') {
  //     this.openCheckList();
  //     this.stages.push({...this.stage});
  //   } else {
  //     this.stages = this.currentCheckList?.stages || [];
  //   }
  // }

  createStepForm(){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    this.stepForm = new FormGroup({
      "botId": new FormControl(botId, [Validators.required]),
      "name": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "confirmButtons": this.fb.array([]),
      "Adherence": new FormGroup({}),
      "clsId": new FormControl(''),
    })
  }


  closeCheckListScreen(e?) {
    this.closeCheckList.emit(this.relaod ? this.relaod : e);
  }

  openSettings() {
    this.isCheckListOpen = true;
    this.isCheckListCreateOrUpdate = 'update';
    if(this.currentCheckList){
      this.checkListForm?.patchValue(this.currentCheckList);
    }
    this.checklistCreateSlider.openSlider("#checklistCreate", "");
  }

  openCheckList(){
    this.isCheckListOpen = true;
    this.isCheckListCreateOrUpdate = 'create';
    this.checklistCreateSlider.openSlider("#checklistCreate", "");
  }

  close(e) {
    if (e.checkListClose) {
      this.dismisCheckList();
    } if (e.relaod && e.isSaved) {
      this.relaod = e.relaod;
      this.name.patchValue(this.checkListForm.value.name);
      this.checkListForm.updateValueAndValidity();
    } if (!e.isSaved && this.createOrUpdate !== 'update') {
      this.closeCheckListScreen(!e.isSaved);
    }
  }

  editStage(stage) {
    stage.edit = true;
    stage.runTimeName = stage.name;
  }

  saveStage(stage) {
    stage.name = stage.runTimeName;
    this.saveStageApi(stage);
  }

  saveStageApi(stage, isStageUpdate = true) {
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    stage.botId = botId;
    let params = {}
    let method = 'post.stage';
    if (!stage.isNew) {
      method = 'put.stage';
      params = {
        botId,
        clsId: stage._id,
        clId: this.currentCheckList._id
      }
    } else {
      params = {
        clId: this.currentCheckList._id
      };
    }
    let obj = {
      botId,
      name: stage.name,
      color: stage.color,
      steps: stage.steps.map((step)=>step._id)
    }
    this.service.invoke(method, params, obj)
      .subscribe((data) => {
        if (data) {
          stage.edit = false;
          stage.isNew = false;
          stage._id = data._id;
          if (isStageUpdate) {
            this.updateStagesOrder();
          }
        }
      });
  }

  // updateStages() {
  //   let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
  //   this.currentCheckList.stages = this.stages.map((item) => {
  //     if (item._id) {
  //       return item._id;
  //     }
  //   });
  //   this.service.invoke('put.checklist', { botId, clId: this.currentCheckList._id }, this.currentCheckList)
  //     .subscribe((data) => {
  //   });
  // }

  updateStagesOrder(){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    this.currentCheckList.stages = this.stages.map((item) => {
      if (item._id) {
        return item._id;
      }
    });
    const payload = {
      botId,
      stages: [...this.currentCheckList.stages]
    }
    this.service.invoke('put.checklist.order', { botId, clId: this.currentCheckList._id }, payload)
      .subscribe((data) => {
    });
  }

  colorUpdate(stage) {
    this.saveStageApi(stage, false);
  }

  addStages(i) {
    this.stages.splice(i + 1, 0, { ...this.stage });
  }
  currentInx;
  stepCreate(item, i){
    this.createOrUpdateStep = 'create';
    this.isStepOpen = true;
    this.currentInx = i;
    this.currentStage = item;
    this.createStepForm();
    setTimeout(() => {
      this.stepForm.controls['clsId'].patchValue(item._id)
      this.stepCreateSlider.openSlider("#stepCreate", "");
    },);
  }

  closeStepModal(){
    this.stepCreateSlider.closeSlider('#stepCreate');
    this.isStepOpen = false;
  }

  closeStep(e){
    this.closeStepModal();
    if(!e){
      this.stages[this.currentInx].newStep = false;
    }
  }

  saveStep(event){
    if(this.stepForm.valid){
      this.service.invoke('post.step', {}, this.stepForm.value)
      .subscribe((data) => {
        this.stages[this.currentInx].steps.push(data)
        this.stages[this.currentInx].newStep = false;
        this.saveStageApi(this.stages[this.currentInx], false);
        this.closeStepModal();
      });
    }
  }
  currDragStg;
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.stages[this.currDragStg].steps, event.previousIndex, event.currentIndex);
  }

  saveCheckList(event){
    // if(event.type === 'primary'){
      let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
      this.service.invoke('get.checklistbyid', {botId, clId: event._id})
      .subscribe((data)=>{
        this.currentCheckList = {...data[0]};
        if(event.type === 'primary'){
          this.stages = data[0]?.stages;
        }
        this.checklistCreateSlider.closeSlider('#checklistCreate');
      });
    // }else if(event.type === 'dynamic'){
    //   this.checklistCreateSlider.closeSlider('#checklistCreate');
    // }
  }
  currentStep;
  stepIndex;
  openEditStep(item, step, i, si){
    this.isStepOpen = true;
    this.createOrUpdateStep = 'update';
    this.currentInx = i;
    this.currentStage = item;
    this.currentStep = step;
    this.stepIndex = si;
    this.createStepForm();
    this.stepForm.patchValue(step);
    setTimeout(() => {
      this.stepForm.controls['clsId'].patchValue(item._id)
      this.stepCreateSlider.openSlider("#stepCreate", "");
    },);
  }

  updateStep(event){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    if(this.stepForm.valid && event){
      this.service.invoke('put.step', {clstId: this.currentStep._id, botId, clsId: this.currentStage._id}, this.stepForm.value)
      .subscribe((data) => {
        this.stages[this.currentInx].steps.splice(this.stepIndex, 1, data);
        this.saveStageApi(this.stages[this.currentInx], false);
        this.closeStepModal();
      });
    }
  }

  dismisCheckList(data?){
    if(data){
      this.currentCheckList = data;
    }
    this.isCheckListOpen = false;
    this.checklistCreateSlider.closeSlider('#checklistCreate');
  }
  
}
