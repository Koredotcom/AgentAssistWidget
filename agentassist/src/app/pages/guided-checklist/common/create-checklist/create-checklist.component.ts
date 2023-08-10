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

  isBasic = true;
  @Input() checkListForm: FormGroup;
  triggerBy: FormGroup;
  assignType = 'all';
  @Input() checkListType = 'primary';
  loading = false;
  selAcc = this.local.getSelectedAccount();
  @Output() closeE = new EventEmitter();
  @Output() saveEvent = new EventEmitter();
  ngOnInit(): void {
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

  saveCheckList(){

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
}
