import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  @Input() ruleForm: FormGroup;
  @Input() allTagList : string[];
  @Input() filteredTagsOriginal;
  
  @Output() submitRuleForm = new EventEmitter();
  @Output() closeBasicRule = new EventEmitter();

  coachingCnst : any = COACHINGCNST
  tags:any = [];
  filteredTagsDisplay : any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagControl :  FormControl = new FormControl();
  ruleName : string;
  ruleDesc : string;
  
  constructor(private cdRef : ChangeDetectorRef,
    private fb: FormBuilder, 
    private activeModal : NgbActiveModal 
    ) { }

  ngOnInit(): void {
    this.filteredTagsDisplay = JSON.parse(JSON.stringify(this.allTagList));
    this.subscribeValues();
    this.updateVariables();
  }

  subscribeValues(){
    this.tagControl.valueChanges.subscribe((value)=> {
      if(value){
        this.assignOriginalToDisplayList();
        this.filteredTagsDisplay = this.filteredTagsDisplay.filter(
          (fruit) => fruit.indexOf(value) !== -1
        );
      }
    });
    this.ruleForm.valueChanges.subscribe(val =>{
      this.ruleForm.patchValue(val,{emitEvent:false})
    })
  }

  updateVariables(){
    this.ruleName = this.ruleForm.value.name;
    this.ruleDesc = this.ruleForm.value.description;
    this.tags = this.filteredTagsOriginal.map((str, index) => ({ name: str}));    
  }

  selectedOption(item){
    let checked = this.ruleForm.controls?.tags.value.indexOf(item) >=0 ? false : true
      
    let tags = this.ruleForm.value.tags;    
    if(checked && tags.indexOf(item) == -1){
      this.AddOrSelectTagNames(item);
    }else if(!checked){
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
      // this.filteredTagsOriginal = this.filteredTagsOriginal.filter(item => item !== value);
    }
    
    this.ruleForm.setControl('tags', this.fb.array(this.tags.map(a => a.name) || []));  
    this.trigger.openPanel();  
    this.assignOriginalToDisplayList();
    this.tagInput.nativeElement.value = '';
    setTimeout(() => {
      this.tagControl.setValue('');
    }, 0);
  }

  remove(fruit): void {
    const index = this.tags.findIndex(item =>{
      return item.name == fruit;
    });
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.assignOriginalToDisplayList();
    this.ruleForm.setControl('tags', this.fb.array(this.tags.map(a => a.name) || []));
    this.trigger.openPanel();  
  }

  assignOriginalToDisplayList(){
    this.filteredTagsDisplay = JSON.parse(JSON.stringify(this.allTagList));
  }

  channelSelection(event, item){
    let channelList = this.ruleForm.value.channels;
    if(event.target.checked && channelList.indexOf(item) == -1){
      channelList.push(item);
    }else if(!event.target.checked){
      channelList = channelList.filter(channel => channel != item);
    }
    this.ruleForm.setControl('channels', this.fb.array(channelList));
  }

  closeRule(){
    this.closeBasicRule.emit(true);
  }

  submitForm(){
    this.ruleForm.controls['name'].patchValue(this.ruleName);
    this.ruleForm.controls['description'].patchValue(this.ruleDesc);    
    // this.activeModal.close(true);
    this.submitRuleForm.emit(true);
  }

}
