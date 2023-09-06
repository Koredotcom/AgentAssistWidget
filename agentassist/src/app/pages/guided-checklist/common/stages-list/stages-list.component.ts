import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "@kore.services/auth.service";
import { LocalStoreService } from "@kore.services/localstore.service";
import { workflowService } from "@kore.services/workflow.service";
import { SliderComponentComponent } from "src/app/shared/slider-component/slider-component.component";
import { CHECKLISTCNST } from "../../checklist.const";
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ChecklistService } from "../../checklist.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteComponent } from "../delete/delete.component";
import { NotificationService } from "@kore.services/notification.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-stages-list",
  templateUrl: "./stages-list.component.html",
  styleUrls: ["./stages-list.component.scss"],
})
export class StagesListComponent implements OnInit {
  @Output() closeCheckList = new EventEmitter();
  @ViewChild("checklistCreateSlider", { static: true })
  checklistCreateSlider: SliderComponentComponent;
  @ViewChild("stepCreateSlider", { static: true })
  stepCreateSlider: SliderComponentComponent;
  @Input() checkListType = CHECKLISTCNST.primary;
  @Input() createOrUpdate = "create";
  @Input() currentCheckList: any = {};
  isStepOpen = false;
  isCheckListOpen = false;
  checkListForm: FormGroup;
  stageForm: FormGroup;
  stepForm: FormGroup;
  selAcc = this.local.getSelectedAccount();
  triggerBy: FormGroup;
  // name = new FormControl("");
  stage = {
    name: "",
    runTimeName: "",
    color: "#F0F9FF",
    steps: [],
    edit: false,
    isNew: true,
  };
  createOrUpdateStep = "create";
  stages = [];
  checklistConst = CHECKLISTCNST.COLORS;
  relaod = false;
  currentStage: any = {};
  isCheckListCreateOrUpdate = "create";
  allTagList: any = [];
  stageInx;
  currDragStg;
  currentStep;
  stepIndex;
  botId =
    this.auth.isLoadingOnSm && this.selAcc
      ? this.selAcc["instanceBots"][0]?.instanceBotId
      : this.workflowService.getCurrentBt(true)._id;
  modalRef:any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private local: LocalStoreService,
    private workflowService: workflowService,
    private service: ServiceInvokerService,
    private clS: ChecklistService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private notificationService: NotificationService,
     private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.checkListForm = this.fb.group(
      this.clS.getCheckListForm(this.botId, this.checkListType)
    );
    // this.triggerBy = this.fb.group(this.clS.getTriggerBy());
    // this.name.valueChanges.subscribe((val) => {
    //   this.checkListForm.controls["name"].patchValue(val);
    // });
    if (this.createOrUpdate === "create") {
      this.openCheckList();
      this.stages.push(JSON.parse(JSON.stringify(this.stage)));
    } else {
      // this.name.patchValue(this.currentCheckList.name);
      this.stages = this.currentCheckList?.stages || [];
    }
  }

  createStepForm() {
    this.stepForm = this.fb.group(this.clS.getStepForm(this.botId));
  }

  closeCheckListScreen() {
    this.closeCheckList.emit();
  }

  openSettings() {
    this.getCheckListById();
  }

  updateAndGetTags(){
    this.isCheckListCreateOrUpdate = "update";
    if (this.currentCheckList) {
      this.patchSettings(this.currentCheckList);
    }
    this.getRuleTags();
  }

  getCheckListById(){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    this.service.invoke('get.checklistbyid', {botId, clId: this.currentCheckList._id})
    .subscribe((data)=>{
      this.currentCheckList = {...data[0]};
      this.updateAndGetTags();
    })
  }

  patchSettings(obj) {
    this.checkListForm = this.fb.group(this.clS.setCheckListForm(obj));
  }

  openCheckList() {
    this.isCheckListCreateOrUpdate = "create";
    this.getRuleTags();
  }

  getRuleTags() {
    let params: any = {
      botId: this.botId,
    };
    this.service
      .invoke("get.agentchecklisttags", params, {
        botId: this.botId,
      })
      .subscribe((data) => {
        if (data && data.tags?.length > 0) {
          this.allTagList = data.tags;
        }
        this.isCheckListOpen = true;
        this.checklistCreateSlider.openSlider("#checklistCreate", "");
      });
  }

  close() {
    // if (e.checkListClose) {
    //   
    // }
    // this.name.patchValue(this.checkListForm.value.name);
    this.dismisCheckList();
    if(this.createOrUpdate !== 'update'){
      this.closeCheckListScreen();
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

  saveStageApi(stage, isStageUpdate = true, step = false) {
    let params = {};
    let method = "post.stage";
    if (!stage.isNew) {
      method = "put.stage";
      params = {
        botId: this.botId,
        clsId: stage._id,
        clId: this.currentCheckList._id,
      };
    } else {
      params = {
        clId: this.currentCheckList._id,
      };
    }
    let obj = {
      botId: this.botId,
      steps: stage.steps.map((step) => step._id),
    };
    // if (stage.isNew) {
      obj["color"] = stage.color;
      obj["name"] = stage.name;
    // }
    this.service.invoke(method, params, obj).subscribe((data) => {
      if (data) {
        stage.edit = false;
        stage._id = data._id;
        if (isStageUpdate) {
          this.updateStagesOrder();
        }
        let notificationMsg = '';
        if(step){
          notificationMsg = (this.createOrUpdateStep == 'create') ? 'CHECKLIST.STEPCREATE_SUCCESS' : 'CHECKLIST.STEPUPDATE_SUCCESS';
        }else{
          notificationMsg = stage.isNew ? 'CHECKLIST.STAGECREATE_SUCCESS' : 'CHECKLIST.STAGEUPDATE_SUCCESS';
        }
        stage.isNew = false;
        this.notificationService.notify(this.translate.instant(notificationMsg), 'success');
      }
    },(error) => {
      let notificationMsg = '';
      if(step){
        notificationMsg = (this.createOrUpdateStep == 'create') ? 'CHECKLIST.STEPCREATE_FAILURE' : 'CHECKLIST.STEPUPDATE_FAILURE';
      }else{
        notificationMsg = stage.isNew ? 'CHECKLIST.STAGECREATE_FAILURE' : 'CHECKLIST.STAGEUPDATE_FAILURE'
      }
      this.notificationService.showError(error, this.translate.instant(notificationMsg));
    });
  }

  updateStagesOrder() {
    this.currentCheckList.stages = this.stages.map((item) => {
      if (item._id) {
        return item._id;
      }
    });
    const payload = {
      botId: this.botId,
      stages: [...this.currentCheckList.stages],
    };
    this.service
      .invoke(
        "put.checklist.order",
        { botId: this.botId, clId: this.currentCheckList._id },
        payload
      )
      .subscribe((data) => {});
  }

  colorUpdate(stage) {
    this.saveStageApi(stage, false);
  }

  addStages(i) {
    this.stages.splice(i + 1, 0, JSON.parse(JSON.stringify(this.stage)));
  }

  stepCreate(item, i) {
    this.createOrUpdateStep = "create";
    this.isStepOpen = true;
    this.stageInx = i;
    this.currentStage = item;
    this.createStepForm();
    setTimeout(() => {
      this.stepForm.controls["clsId"].patchValue(item._id);
      this.stepCreateSlider.openSlider("#stepCreate", "");
    });
  }

  closeStepModal() {
    this.stepCreateSlider.closeSlider("#stepCreate");
    this.isStepOpen = false;
  }

  closeStep(e) {
    this.closeStepModal();
    if (!e) {
      this.stages[this.stageInx].newStep = false;
    }
  }

  saveStep(event = false) {
    if (this.stepForm.valid) {
      let val = this.stepForm.value;
      if(!val.isAdherenceActive){
        val['adherence'] = {};
      }
      this.service
        .invoke("post.step", {}, val)
        .subscribe((data) => {
          this.stages[this.stageInx].steps.push(data);
          this.stages[this.stageInx].newStep = false;
          this.saveStageApi(this.stages[this.stageInx], false, true);
          this.closeStepModal();
        }, 
        (err)=>{
          this.notificationService.showError(err, this.translate.instant('CHECKLIST.STEPCREATEFAILURE'));
        });
    }
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(
  //     this.stages[this.currDragStg].steps,
  //     event.previousIndex,
  //     event.currentIndex
  //   );
  // }

  saveCheckList(event) {
    this.createOrUpdate = 'update';
    this.service
      .invoke("get.checklistbyid", { botId: this.botId, clId: event._id })
      .subscribe((data) => {
        this.currentCheckList = { ...data[0] };
        // if (event.type === "primary") {
        // }
        this.stages = data[0]?.stages;
        this.isCheckListOpen = false;
        this.checklistCreateSlider.closeSlider("#checklistCreate");
        let notificationMsg = '';
        notificationMsg = (this.isCheckListCreateOrUpdate == 'create') ? "CHECKLIST.CLCREATE_SUCCESS" : "CHECKLIST.CLUPDATE_SUCCESS";
        this.notificationService.notify(this.translate.instant(notificationMsg), 'success');

      },(error)=> {
        let notificationMsg = '';
        notificationMsg = (this.isCheckListCreateOrUpdate == 'create') ? "CHECKLIST.CLCREATE_FAILURE" : "CHECKLIST.CLUPDATE_FAILURE";
        this.notificationService.showError(error, this.translate.instant('CHECKLIST.STEPUPDATE_FAILURE'));

      });
  }

  updateForm(step){
    this.stepForm = this.fb.group(this.clS.setStepForm(step, this.botId));
  }

  openEditStep(item, step, i, si) {
    this.createOrUpdateStep = "update";
    this.stageInx = i;
    this.currentStage = item;
    this.currentStep = step;
    this.stepIndex = si;
    this.updateForm(step);
    this.stepForm.patchValue(step);
    this.isStepOpen = true;
    setTimeout(() => {
      this.stepForm.controls["clsId"].patchValue(item._id);
      this.stepCreateSlider.openSlider("#stepCreate", "");
    });
  }

  updateStep(event) {
    if (this.stepForm.valid && event) {
      let payload = this.stepForm.value;
      if(!payload.isAdherenceActive && payload.adherence.type === ''){
        payload['adherence'] = {};
      }

      this.service
        .invoke(
          "put.step",
          {
            clstId: this.currentStep._id,
            botId: this.botId,
            clsId: this.currentStage._id,
          },
          payload
        )
        .subscribe((data) => {
          this.stages[this.stageInx].steps.splice(this.stepIndex, 1, data);
          this.closeStepModal();
          this.notificationService.notify(this.translate.instant('CHECKLIST.STEPUPDATE_SUCCESS'), 'success');

        },(error) => {
          this.notificationService.showError(error, this.translate.instant('CHECKLIST.STEPUPDATE_FAILURE'));
        });
    }
  }

  dismisCheckList(data?) {
    if (data) {
      this.currentCheckList = data;
    }
    this.isCheckListOpen = false;
    this.checklistCreateSlider.closeSlider("#checklistCreate");
  }


  deleteStep(i, si, step, stage){

    let deleteStep = {
      title: "Delete Step",
      desc: "Are you sure, you want to delete Step '" + step.name + "'.",
      type: "step",
      _id : step.name
    }

    this.modalRef = this.modalService.open(DeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = deleteStep;

    this.modalRef.result.then(emitedValue => {
      if (emitedValue) {
        this.service
        .invoke(
          "delete.step",
          {
            clstId: step._id,
            botId: this.botId,
            clsId: stage._id
          }
        )
        .subscribe((data) => {
          (this.stages[i]?.steps || []).splice(si, 1);
          this.notificationService.notify(this.translate.instant("CHECKLIST.STEPDELETE_SUCCESS"), 'success');
        },(error)=> {
          this.notificationService.showError(error, this.translate.instant("CHECKLIST.STEPDELETE_FAILURE"));

        });
      }
    });
  
  }

  deleteStage(i){

    let deleteStage = {
      title: "Delete Stage",
      desc: "Are you sure, you want to delete Stage '" + this.stages[i].name + "'.",
      type: "stage",
      _id : this.stages[i].name
    }

    this.modalRef = this.modalService.open(DeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = deleteStage;
    this.modalRef.result.then(emitedValue => {
      if (emitedValue) {
        this.service
        .invoke(
          "delete.stage",
          {
            clId: this.currentCheckList._id,
            botId: this.botId,
            clsId: this.stages[i]?._id,
          }
        )
        .subscribe((data) => {
          (this.stages || []).splice(i, 1);
          this.notificationService.notify(this.translate.instant("CHECKLIST.STAGEDELETE_SUCCESS"), 'success');
        },(error)=> {
          this.notificationService.showError(error, this.translate.instant("CHECKLIST.STAGEDELETE_FAILURE"));

        });
      }
    });    
  }

  drop(event: CdkDragDrop<string[]>, i) {
    moveItemInArray(this.stages[i].steps, event.previousIndex, event.currentIndex);
  }
}
