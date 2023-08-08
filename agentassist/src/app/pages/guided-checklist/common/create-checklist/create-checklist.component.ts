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
  ) { }
  isBasic = true;
  checkListForm: FormGroup;
  triggerBy: FormGroup;
  assignType= 'all';
  loading = false;
  selAcc = this.local.getSelectedAccount();
  @Input() checkListType = 'primary';
  @Output() closeE = new EventEmitter();

  ngOnInit(): void {
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    this.checkListForm = this.fb.group({
      'botId': [botId, [Validators.required]],
      'name': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'tags': this.fb.array([]),
      'order': this.fb.array(['sequential'], [Validators.required]),
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
    })
  }
  remove(e){

  }

  selectedOption(a, b){
    
  }

  chekProgressionType(pType){
    (this.checkListForm.controls['order'] as FormArray).value.splice(0, 1, pType?.toLowerCase());
  }

  channelVoice(checked){
    if(checked){
      (this.checkListForm.controls['channels'] as FormArray).push(new FormControl('voice'));
    }else{
      let inx = (this.checkListForm.controls['channels'] as FormArray).value.findIndex((item)=> item === 'voice');
      (this.checkListForm.controls['channels'] as FormArray).removeAt(inx);
    }
  }

  channelChat(checked){
    if(checked){
      (this.checkListForm.controls['channels'] as FormArray).value.push(new FormControl('chat'));
    }else{
      let inx = (this.checkListForm.controls['channels'] as FormArray).value.findIndex((item)=> item === 'chat');
      (this.checkListForm.controls['channels'] as FormArray).removeAt(inx);
    }
  }

  changeAssigne(){
    console.log("this.assignType", this.assignType);
  }

  close(){
   this.closeE.emit(); 
  }

  save(){
    this.loading = true;
    this.service.invoke('post.acchecklists', {}, this.checkListForm.getRawValue())
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data)=>{
      this.close();
    })
  }
}
