import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
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
  triggerBy: FormGroup;
  assignType = 'all';
  loading = false;
  tags:any = [];
  filteredTagsDisplay : any = [];
  selAcc = this.local.getSelectedAccount();
  selectedchannelList : any = [];
  tab = 'basic';
  channelList : any = ['voice', 'chat'];
  @Input() checkListForm: FormGroup;
  @Input() checkListType = 'primary';
  @Input() createOrUpdate = 'create';
  @Input() currentCheckList:any = {};
  @Input() allTagList : string[];
  @Output() closeE = new EventEmitter();
  @Output() closeChecklist = new EventEmitter();
  @Output() saveEvent = new EventEmitter();

  @ViewChild('tagInput', {static : true}) tagInput: ElementRef;
  @ViewChild('trigger', {static : false}) trigger : MatAutocompleteTrigger;
  
  ngOnInit(): void {
    if(this.currentCheckList){
      this.currentCheckList.assignedTo
    }
  
    this.subscribeValues();
    this.assignOriginalToDisplayList();
    this.selectedchannelList = (this.checkListForm?.controls['channels'] as FormArray).getRawValue(); 
    
  }

  subscribeValues(){
    this.tagControl.valueChanges.subscribe((value)=> {
     
      if(value){
        this.assignOriginalToDisplayList();
        this.filteredTagsDisplay = this.filteredTagsDisplay.filter(
          (tag) => (tag.name).indexOf(value) !== -1
        );
      }else{
        this.assignOriginalToDisplayList();
      }
    });
  }

  chekProgressionType(pType) {
    (this.checkListForm.controls['order']).patchValue(pType?.toLowerCase());
  }

  // channelVoice(checked) {
  //   if (checked) {
  //     (this.checkListForm.controls['channels'] as FormArray).push(new FormControl('voice'));
  //   } else {
  //     let inx = (this.checkListForm.controls['channels'] as FormArray).value.findIndex((item) => item === 'voice');
  //     (this.checkListForm.controls['channels'] as FormArray).removeAt(inx);
  //   }
  // }

  channelSelection(event, item){
    let index = this.selectedchannelList.indexOf(item);
    if(event.target.checked && index == -1){
      this.selectedchannelList.push(item);
    }else if(!event.target.checked && index >= 0){
      this.selectedchannelList.splice(index, 1);
    }
    this.checkListForm.setControl('channels', this.fb.array([...this.selectedchannelList]));   
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


  // tag related changes

  selectedOption(item, index){
    let checked = this.filteredTagsDisplay[index].checked;
    if(!checked){
      this.AddOrSelectTagNames(item);
    }else{
      this.remove(item)
    }
  }
  
  add(event: MatChipInputEvent): void {
    console.log(this.checkListForm, "check list form");
    
    const input = event.input;
    const value = event.value?.trim();
    this.AddOrSelectTagNames(value);
    
  }

  AddOrSelectTagNames(value) {
    // Add our fruit
    if ((value || '')) {
      let filterIndex = this.checkListForm.value?.tags?.findIndex((item) => {
        return item.name == value;
      });
      if (filterIndex == -1) {

        (<FormArray>this.checkListForm?.controls["tags"]).push(this.fb.group({ name: value }))
        // this.tags.push({ name: value });
      }
     
      if(this.allTagList.indexOf(value) == -1){
        this.allTagList.push(value);
      }
    }
  
    this.trigger?.openPanel();  
    this.assignOriginalToDisplayList();
    this.tagInput.nativeElement.value = '';
    setTimeout(() => {
      this.tagControl.setValue('');
    }, 0);
  }

  remove(tag): void {    
    const index = this.checkListForm?.value?.tags.findIndex(item =>{
      return item.name == tag;
    });    
    if (index >= 0) {
      (<FormArray>this.checkListForm.controls["tags"]).removeAt(index);
      // this.tags.splice(index, 1);
    }    
    this.assignOriginalToDisplayList();
    this.trigger.openPanel();  
  }

  assignOriginalToDisplayList(){  
    console.log(this.allTagList, 'all tag list');
      
    this.filteredTagsDisplay = this.allTagList.map((item) => {      
      return {name : item, checked : (this.checkListForm.value?.tags?.findIndex((tag) => {return tag.name == item})) >= 0 ? true : false}
    });    
    console.log(this.filteredTagsDisplay, 'filtered tags display');
    
  } 
}
