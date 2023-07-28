import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-none-intent',
  templateUrl: './none-intent.component.html',
  styleUrls: ['./none-intent.component.scss']
})
export class NoneIntentComponent implements OnInit {

  @ViewChild('tagInput', {static : true}) tagInput: ElementRef;
  @ViewChild('trigger', {static : false}) trigger : MatAutocompleteTrigger;

  tagControl :  FormControl = new FormControl();

  
  tags:any = [];
  filteredTagsDisplay : any;
  allTagList : any = ['rule3', 'rule4', 'rule5', 'rule6'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor() { }

  ngOnInit(): void {
    this.filteredTagsDisplay = this.allTagList.map((item) => {
      return {name : item, checked : false}
    });
    this.subscribeValues();
  }

  subscribeValues(){
    this.tagControl.valueChanges.subscribe((value)=> {
      console.log(value, "value");
      
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


}
