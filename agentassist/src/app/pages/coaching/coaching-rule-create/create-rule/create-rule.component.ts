import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { COACHINGCNST } from '../../coaching.cnst';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.scss']
})
export class CreateRuleComponent implements OnInit {

  @ViewChild('tagInput', {static : true}) tagInput: ElementRef;
  @ViewChild('trigger', {static : false}) trigger : MatAutocompleteTrigger;

  @Input() ruleForm: UntypedFormGroup;
  @Input() allTagList : string[];
  @Input() filteredTagsOriginal;
  @Input() createOrEdit : string;
  @Input() disableApplyButton : boolean;
  
  @Input() default = false;
  @Output() submitRuleForm = new EventEmitter();
  @Output() closeBasicRule = new EventEmitter();

  coachingCnst : any = COACHINGCNST
  tags:any = [];
  filteredTagsDisplay : any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl :  UntypedFormControl = new UntypedFormControl();
  ruleName : string;
  ruleDesc : string;
  channelList : any[] = [];
  
  constructor(private cdRef : ChangeDetectorRef,
    private fb: UntypedFormBuilder, 
    private activeModal : NgbActiveModal 
    ) { }

  ngOnInit(): void {
    this.filteredTagsDisplay = this.allTagList.map((item) => {
      return {name : item, checked : this.ruleForm?.value?.tags.indexOf(item) >= 0 ? true : false}
    });
    this.subscribeValues();
    this.updateVariables();
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

  updateVariables(){    
    this.ruleName = this.ruleForm.value.name;
    this.ruleDesc = this.ruleForm.value.description;
    this.tags = this.filteredTagsOriginal.map((str, index) => ({ name: str}));   
    this.channelList = (this.ruleForm?.controls['channels'] as UntypedFormArray).getRawValue(); 
  }

  selectedOption(item, index){
    let checked = this.filteredTagsDisplay[index].checked;
    if(!checked){
      this.AddOrSelectTagNames(item);
    }else{
      this.remove(item)
    }
  }
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value?.trim();
    this.AddOrSelectTagNames(value);
    
  }

  AddOrSelectTagNames(value) {
    // Add our fruit
    if ((value || '')) {
      let filterIndex = this.tags.findIndex((item) => {
        return item.name == value;
      });
      if (filterIndex == -1) {
        this.tags.push({ name: value });
      }
      
      if(this.allTagList.indexOf(value) == -1){
        this.allTagList.push(value);
      }
    }
  
    this.trigger.openPanel();  
    this.assignOriginalToDisplayList();
    this.tagInput.nativeElement.value = '';
    setTimeout(() => {
      this.tagControl.setValue('');
    }, 0);
  }

  remove(tag): void {    
    const index = this.tags.findIndex(item =>{
      return item.name == tag;
    });    
    if (index >= 0) {
      this.tags.splice(index, 1);
    }    
    this.assignOriginalToDisplayList();
    this.trigger.openPanel();  
  }

  assignOriginalToDisplayList(){    
    this.filteredTagsDisplay = this.allTagList.map((item) => {      
      return {name : item, checked : (this.tags.findIndex((tag) => {return tag.name == item})) >= 0 ? true : false}
    });    
  } 

  channelSelection(event, item){
    let index = this.channelList.indexOf(item);
    if(event.target.checked && index == -1){
      this.channelList.push(item);
    }else if(!event.target.checked && index >= 0){
      this.channelList.splice(index, 1);
    }
  }

  closeRule(){
    this.closeBasicRule.emit(true);
  }

  submitForm(){
    this.disableApplyButton = true;
    this.ruleForm.controls['name'].patchValue(this.ruleName.trim());
    this.ruleForm.controls['description'].patchValue(this.ruleDesc.trim()); 
    this.ruleForm.setControl('channels', this.fb.array([...this.channelList]));   
    this.ruleForm.setControl('tags', this.fb.array(this.tags.map(a => a.name) || []));  
    this.submitRuleForm.emit(true);
  }

}
