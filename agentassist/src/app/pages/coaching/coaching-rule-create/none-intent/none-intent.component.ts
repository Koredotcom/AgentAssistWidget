import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-none-intent',
  templateUrl: './none-intent.component.html',
  styleUrls: ['./none-intent.component.scss']
})
export class NoneIntentComponent implements OnInit {

  @ViewChild('tagInput', {static : false}) tagInput: ElementRef;
  @ViewChild('trigger', {static : false}) trigger : MatAutocompleteTrigger;

  @Output() closed = new EventEmitter();


  tagControl :  FormControl = new FormControl();

  searchControl :  FormControl = new FormControl();
  searchUtteranceControl : FormControl = new FormControl();

  
  tags:any = [];
  filteredTagsDisplay : any;
  coachingConst : any = COACHINGCNST;
  clickTypes : any = COACHINGCNST.clickType;
  allTagList : any = ['rule3', 'rule4', 'rule5', 'rule6'];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  addedUtterances = [];
  deletedUIds = {};

  selectedUtterancesArray : any = [];
  actualUtterancesArray : any = [];


  constructor() { }

  ngOnInit(): void {
    this.filteredTagsDisplay = this.allTagList.map((item) => {
      return {name : item, checked : false}
    });
    this.getUtteranceData();
    this.subscribeValues();

  }

  subscribeValues(){
    this.tagControl.valueChanges.subscribe((value)=> {
      console.log(value, "value");
      this.searchRules(value);
    });

    this.searchControl.valueChanges.subscribe((value) => {
      console.log(value, "value");
      this.searchRules(value);
    });

    this.searchUtteranceControl.valueChanges.subscribe((value)=> {
      if(value){
        this.assignOriginalUtteranceList();
        this.selectedUtterancesArray = this.selectedUtterancesArray.filter(
          (tag) => (tag.utterance).indexOf(value) !== -1
        );
      }else{
        this.assignOriginalUtteranceList();
      }
    })
  }

  searchRules(value){
    if(value){
      this.assignOriginalToDisplayList();
      this.filteredTagsDisplay = this.filteredTagsDisplay.filter(
        (tag) => (tag.name).indexOf(value) !== -1
      );
    }else{
      this.assignOriginalToDisplayList();
    }
  }

  assignOriginalUtteranceList(){
    this.selectedUtterancesArray = JSON.parse(JSON.stringify(this.actualUtterancesArray));
  }

  getUtteranceData(){
    // get data 
  
    this.actualUtterancesArray = [{"_id":"acu-c995682a-e7cc-5c33-a45b-5463f11a843e","default":false,"state":"configured","utterance":"price is too expensive","language":"english","botId":"st-fff31c68-7818-5062-af32-6bee4d0668e6","accountId":"64c0bf03b3e7d947032368e6","referenceId":"aat-035ee870-65f3-420e-b9be-a4bcec125ed4","type":"utterance","__v":0},
    {"_id":"acu-a79745f0-e648-5c93-961d-a9c1117c11f9","default":false,"state":"configured","utterance":"price is too high","language":"english","botId":"st-fff31c68-7818-5062-af32-6bee4d0668e6","accountId":"64c0bf03b3e7d947032368e6","referenceId":"aat-035ee870-65f3-420e-b9be-a4bcec125ed4","type":"utterance","__v":0},
    {"_id":"acu-12f2eed8-4ca8-53b8-b428-cf1b44f4dd45","default":false,"state":"configured","utterance":"rates are too much","language":"english","botId":"st-fff31c68-7818-5062-af32-6bee4d0668e6","accountId":"64c0bf03b3e7d947032368e6","referenceId":"aat-035ee870-65f3-420e-b9be-a4bcec125ed4","type":"utterance","__v":0}];
    this.selectedUtterancesArray = JSON.parse(JSON.stringify(this.actualUtterancesArray));
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
    console.log(this.tagInput, 'tag input');
    
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

  noneIntentButtonClick(type){
    console.log(type, 'type');
    
    this.clickTypes[type] = true;
    for(let key in this.clickTypes){
      console.log(key, "key");
      
      if(key != type){
        this.clickTypes[key] = false;
      }
    }
    console.log(this.clickTypes, 'clicktypes');
    
  }

  cancel(){
    this.closed.emit(true);
  }

  deleteUtternce(utter, i) {
    if (utter._id) {
      this.deletedUIds[utter._id] = true;
    }
    this.selectedUtterancesArray.splice(i, 1);
  }


}
