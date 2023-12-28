import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-greeting-messages',
  templateUrl: './greeting-messages.component.html',
  styleUrls: ['./greeting-messages.component.scss']
})
export class GreetingMessagesComponent implements OnInit {


  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEventSlider: SliderComponentComponent;

  @Input() welcomeTaskData : any;
  @Input() welcomeTaskPreviousData : any;

  greetingForm : FormGroup;
  greetingActiveTab : string = 'chat';
  greetingLocaleMap : any = {};
  selectedLocale : any;
  showMsgEnableWarn : boolean = false;
  selectedMsgActionMode : string;
  selectedMsgActionIndex : any;
  selectedMsg : any = { message : '', enabled : false};
  showExceedMsgWarn : boolean = false;
  showProTip : boolean = true;
  copyMessageList : any = [];
  selectedMessageCount : number = 0;

  constructor(private modalService: NgbModal, private fb: FormBuilder) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes : SimpleChanges){
    if(changes?.welcomeTaskData?.currentValue && changes?.welcomeTaskPreviousData?.currentValue){
      this.updateData(this.welcomeTaskData);
      this.initGreetingForm(this.welcomeTaskData);
    }
  }

  changeGreetingActiveTab(tab){
    this.greetingActiveTab = tab;
    this.updateData(this.welcomeTaskPreviousData);
    this.initGreetingForm(this.welcomeTaskPreviousData);
  } 

  updateData(welcomeTaskData){
    if(welcomeTaskData && welcomeTaskData['AA_GREETING_MESSAGES']?.config && welcomeTaskData['AA_GREETING_MESSAGES']?.config[this.greetingActiveTab] && welcomeTaskData['AA_GREETING_MESSAGES']?.config[this.greetingActiveTab].locale){
      this.greetingLocaleMap = JSON.parse(JSON.stringify(welcomeTaskData['AA_GREETING_MESSAGES']?.config[this.greetingActiveTab].locale));
      this.selectedLocale = Object.keys(this.greetingLocaleMap)[0];
    }    
  }

  initGreetingForm(welcomeTaskData){
    this.greetingForm = this.fb.group({
      'name' : new FormControl('AA_GREETING_MESSAGES', Validators.required),
      'enabled' : new FormControl(welcomeTaskData['AA_GREETING_MESSAGES'].enabled || false, Validators.required),
      'config' : this.fb.group({
        [this.greetingActiveTab] : this.fb.group(this.getGreetMsgActiveTabFormGroup(welcomeTaskData['AA_GREETING_MESSAGES']?.config[this.greetingActiveTab]))
      })
    });     
  }
  
  getGreetMsgActiveTabFormGroup(data){        
    let activeTabGroup : any = {
      "randomMsg" : new FormControl(data?.randomMsg || false, Validators.required),
      "locale" : this.fb.group(this.greetingLocaleMap)
    };
    return activeTabGroup;
  }

  // getGreetMsglocaleObjFormGroup(localeData){    
  //   let localeObj : any = {};
  //   if(Object.keys(localeData).length > 0){
  //     for(let key in localeData){
  //       let localeArray = localeData[key];
  //       localeObj[key] = this.fb.array(this.getLocaleArray(localeArray));
  //     }
  //   }    
  //   return localeObj;
  // }

  // getLocaleArray(localeArray){
  //   let formattedLocaleArray : any = [];
  //   localeArray.forEach(obj => { 
  //     formattedLocaleArray.push({
  //       // "message" : new FormControl(obj?.message || '', Validators.required),
  //       // 'enabled' : new FormControl(obj?.enabled || false, Validators.required),
  //       "message" : obj?.message || '',
  //       "enabled" : obj?.enabled || false
  //     });
  //   });
  //   return formattedLocaleArray;
  // }

  // updateGreetingValidators(){
  //   if(this.greetingForm.get('enabled').value){ 

  //     (this.greetingForm.controls['config'] as FormGroup)?.controls[this.greetingActiveTab].clearValidators();
  //   }else{
  //     (this.greetingForm.controls['config'] as FormGroup)?.controls[this.greetingActiveTab].setValidators(Validators.required);
  //   }
  //   (this.greetingForm.controls['config'] as FormGroup)?.updateValueAndValidity();
  // }

  toggleGreetMsgEvent(event){
    this.greetingForm.patchValue({enabled : event.target.checked});
    this.welcomeTaskData['AA_GREETING_MESSAGES'].enabled = event.target.checked;
    // this.updateGreetingValidators();
  }

  toggleRandomMsgEvent(event){
    this.greetingForm.get('config').get(this.greetingActiveTab).patchValue({randomMsg : event.target.checked});
    this.welcomeTaskData['AA_GREETING_MESSAGES'].config[this.greetingActiveTab].randomMsg = event.target.checked;
    if(!event.target.checked){
      this.toggleMsgEnabling(false);
    }
  }

  toggleMsgEnabling(flag){
    this.greetingLocaleMap[this.selectedLocale].forEach((obj : any) => {
      obj.enabled = flag;
    });
  }

  selectedLang(item){
    this.selectedLocale = item;

  }

  getLangEnableCount(){
    let count = 0;
    this.greetingLocaleMap[this.selectedLocale].forEach((obj : any) => {
      if(obj.enabled){
        count++;
      }
    });
    return count;
  }

  toggleMsgEnable(event, index){
    let langEnableCount = this.getLangEnableCount();
    if(this.welcomeTaskData['AA_GREETING_MESSAGES'].config[this.greetingActiveTab].randomMsg || langEnableCount <=2){
      this.greetingLocaleMap[this.selectedLocale][index].enabled = event.target.checked;    
      this.updateGreetingFormLocale();
    }else {
      event.target.checked = false;
      this.showMsgEnableWarn = true;
      this.showExceedMsgWarn = false;
    }   
  }

  AddOrEditWelcomeMsg(){
    if(this.selectedMsgActionMode == 'New'){
      this.greetingLocaleMap[this.selectedLocale].push(this.selectedMsg);
    }else{
      this.greetingLocaleMap[this.selectedLocale][this.selectedMsgActionIndex] = this.selectedMsg;
    }
    this.updateGreetingFormLocale();   
    this.closeGreeMessageSlider();      
  }

  deleteMsg(item, index){
    this.greetingLocaleMap[this.selectedLocale].splice(index, 1);
    this.updateGreetingFormLocale();   
  }

  updateGreetingFormLocale(){
    this.greetingForm.get('config').get(this.greetingActiveTab).patchValue({locale : this.greetingLocaleMap});
  }

  // slider events

  deleteWelcomeEvent(contentDeleteWelcomeEvents) {
    this.modalService.open(contentDeleteWelcomeEvents,{ centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
  }
  
  openWelcomeEvent(event, index?){
    this.selectedMsgActionMode = event;
    this.selectedMsgActionIndex = index;
    if(this.selectedMsgActionMode == 'New'){
      this.selectedMsg = {message : '', enabled : false};
    }else if(typeof this.selectedMsgActionIndex == 'number'){
      this.selectedMsg = JSON.parse(JSON.stringify(this.greetingLocaleMap[this.selectedLocale][index]));
    }

    if(this.selectedMsgActionMode == 'Edit' || (this.selectedMsgActionMode == 'New' && this.greetingLocaleMap[this.selectedLocale].length < 10)){
      this.showProTip = true;
      this.newWelcomeEventSlider.openSlider("#newWelcome", "width550");
    }else{
      this.showExceedMsgWarn = true;
      this.showMsgEnableWarn = false;
    }
  }

  closeGreeMessageSlider() {
    this.selectedMsg = {};
    this.selectedMsgActionIndex = null;
    this.selectedMsgActionMode = null;
    this.newWelcomeEventSlider.closeSlider('#newWelcome');
  }

  openModal(contentDeleteWelcomeEvents){
    let channel = this.greetingActiveTab == 'chat' ? 'voice' : 'chat';
    this.copyMessageList = JSON.parse(JSON.stringify(this.welcomeTaskPreviousData['AA_GREETING_MESSAGES']?.config[channel]?.locale[this.selectedLocale] || []));
    this.copyMessageList.forEach((obj : any) => {
      obj.selected = false;
    });
    this.selectedMessageCount = 0;
    this.modalService.open(contentDeleteWelcomeEvents, {backdropClass: 'adjust-zindex-above-slider', modalDialogClass:'confirm-copy', centered: true, backdrop: 'static', keyboard: false});
  }

  closeModal(){
    this.copyMessageList = [];
    this.selectedMessageCount = 0;
    this.modalService.dismissAll();
  }

  copyMessages(){
    this.copyMessageList.forEach((obj : any) => {
      if(obj.selected){
        this.greetingLocaleMap[this.selectedLocale].push({message : obj.message, enabled : false});
      }
    });
    this.updateGreetingFormLocale();
    this.closeModal();
  }

  selectedMessage(obj){
    obj.selected = !obj.selected;
    this.selectedMessageCount = 0;
    this.copyMessageList.forEach((obj) => {
      if(obj.selected){
        this.selectedMessageCount++;
      }
    });
  }

  toggleMultiSelection(event){
    this.copyMessageList.forEach((obj) => {
      obj.selected = event.target.checked;
    });
    this.selectedMessageCount = event.target.checked ? this.copyMessageList.length : 0;
  }

  saveGreetMessages(){
    console.log("save greet messages", this.greetingForm.value);
    
  }

  cancelGreetMessages(){
    this.updateData(this.welcomeTaskPreviousData);
    this.initGreetingForm(this.welcomeTaskPreviousData);
  }

}
