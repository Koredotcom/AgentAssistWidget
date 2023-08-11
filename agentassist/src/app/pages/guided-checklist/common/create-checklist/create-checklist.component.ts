import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.scss']
})
export class StageCreateComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: ServiceInvokerService,
    private auth: AuthService,
    private local: LocalStoreService,
    private workflowService: workflowService
  ) { };

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl :  FormControl = new FormControl();
  isBasic = true;
  triggerBy: FormGroup;
  assignType = 'all';
  loading = false;
  selAcc = this.local.getSelectedAccount();
  @Input() checkListForm: FormGroup;
  @Input() checkListType = 'primary';
  @Input() createOrUpdate = 'create';
  @Input() currentCheckList:any = {};
  @Output() closeE = new EventEmitter();
  @Output() closeChecklist = new EventEmitter();
  @Output() saveEvent = new EventEmitter();
  ngOnInit(): void {
    if(this.currentCheckList){
      this.currentCheckList.assignedTo
    }
  }

  remove(e) {
    
  }

  selectedOption(a, b) {

  }

  chekProgressionType(pType) {
    (this.checkListForm.controls['order']).patchValue(pType?.toLowerCase());
  }

  channelVoice(checked) {
    if (checked) {
      (this.checkListForm.controls['channels'] as FormArray).push(new FormControl('voice'));
    } else {
      let inx = (this.checkListForm.controls['channels'] as FormArray).value.findIndex((item) => item === 'voice');
      (this.checkListForm.controls['channels'] as FormArray).removeAt(inx);
    }
  }

  channelChat(checked) {
    if (checked) {
      (this.checkListForm.controls['channels'] as FormArray).value.push(new FormControl('chat'));
    } else {
      let inx = (this.checkListForm.controls['channels'] as FormArray).value.findIndex((item) => item === 'chat');
      (this.checkListForm.controls['channels'] as FormArray).removeAt(inx);
    }
  }

  changeAssigne() {
    console.log("this.assignType", this.assignType);
  }

  close(checkListClose?, relaod?, isSaved?) {
    this.closeE.emit({
      checkListClose,
      relaod,
      isSaved
    });
  }

  save() {
    this.loading = true;
    this.service.invoke('post.acchecklists', {}, this.checkListForm.getRawValue())
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((data) => {
        this.saveEvent.emit(data);
      });
  }
  add(e){

  }

  update(){
    this.loading = true;
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let payload = this.checkListForm.getRawValue();
    delete payload.stages;
    this.service.invoke('put.checklist', {botId, clId: this.currentCheckList._id}, payload)
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data) => {
      // this.currentCheckList = data;
      this.closeChecklist.emit(data);
    });
  }
}
