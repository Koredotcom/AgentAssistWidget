import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { SubSink } from 'subsink';
import { WelcomeEventsService } from '../welcome-events.service';

@Component({
  selector: 'app-greeting-messages',
  templateUrl: './greeting-messages.component.html',
  styleUrls: ['./greeting-messages.component.scss']
})
export class GreetingMessagesComponent implements OnInit {


  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEventSlider: SliderComponentComponent;

  @Output() saveGreetingMessages = new EventEmitter();

  welcomeTaskData: any = {};
  welcomeTaskPreviousData: any = {};

  greetingForm: FormGroup;
  greetingActiveTab: string = 'chat';
  greetingLocaleMap: any = {};
  selectedLocale: any;
  showMsgEnableWarn: boolean = false;
  selectedMsgActionMode: string;
  selectedMsgActionIndex: any;
  selectedMsg: any = { message: '', enabled: false };
  showExceedMsgWarn: boolean = false;
  showProTip: boolean = true;
  copyMessageList: any = [];
  selectedMessageCount: number = 0;
  subs = new SubSink();
  noFormchange : boolean = true;

  greetMsgStr = 'AA_GREETING_MESSAGES';
  newStr = 'New';
  editStr = 'Edit';

  constructor(private modalService: NgbModal, private fb: FormBuilder, private welcomeEventService: WelcomeEventsService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.subs.sink = this.welcomeEventService.welcomeEventData$.subscribe((data) => {
      if (data) {
        this.welcomeTaskData = data;
        this.welcomeTaskPreviousData = JSON.parse(JSON.stringify(this.welcomeEventService.formatWelcomeTaskData(this.welcomeTaskData)));
        this.updateData(this.welcomeTaskData);
        this.initGreetingForm(this.welcomeTaskData);
      }else{
        this.noFormchange = false;
      }
    })
  }

  changeGreetingActiveTab(tab) {
    this.greetingActiveTab = tab;
    this.updateData(this.welcomeTaskPreviousData);
    this.initGreetingForm(this.welcomeTaskPreviousData);
  }

  updateData(welcomeTaskData) {
    if (welcomeTaskData && welcomeTaskData[this.greetMsgStr]?.config && welcomeTaskData[this.greetMsgStr]?.config[this.greetingActiveTab] && welcomeTaskData[this.greetMsgStr]?.config[this.greetingActiveTab].locale) {
      this.greetingLocaleMap = JSON.parse(JSON.stringify(welcomeTaskData[this.greetMsgStr]?.config[this.greetingActiveTab].locale));
      this.selectedLocale = Object.keys(this.greetingLocaleMap)[0];
    }
  }

  initGreetingForm(welcomeTaskData) {
    this.greetingForm = this.fb.group({
      'name': new FormControl(this.greetMsgStr, Validators.required),
      'enabled': new FormControl(welcomeTaskData[this.greetMsgStr]?.enabled || false, Validators.required),
      'config': this.fb.group({
        [this.greetingActiveTab]: this.fb.group(this.getGreetMsgActiveTabFormGroup(welcomeTaskData[this.greetMsgStr]?.config[this.greetingActiveTab]))
      })
    });
    this.greetingForm.valueChanges.subscribe((data)=> {
      this.noFormchange = false;
    }); 
  }

  getGreetMsgActiveTabFormGroup(data) {
    let activeTabGroup: any = {
      "randomMsg": new FormControl(data?.randomMsg || false, Validators.required),
      "locale": this.fb.group(this.greetingLocaleMap)
    };
    return activeTabGroup;
  }


  toggleGreetMsgEvent(event) {
    this.greetingForm.patchValue({ enabled: event.target.checked });
    if(this.welcomeTaskData[this.greetMsgStr]){
      this.welcomeTaskData[this.greetMsgStr].enabled = event.target.checked;
    }
    // this.updateGreetingValidators();
  }

  toggleRandomMsgEvent(event) {
    this.greetingForm.get('config').get(this.greetingActiveTab).patchValue({ randomMsg: event.target.checked });
    this.welcomeTaskData[this.greetMsgStr].config[this.greetingActiveTab].randomMsg = event.target.checked;
    if (!event.target.checked) {
      this.toggleMsgEnabling(false);
    }
  }

  toggleMsgEnabling(flag) {
    this.greetingLocaleMap[this.selectedLocale].forEach((obj: any) => {
      obj.enabled = flag;
    });
  }

  selectedLang(item) {
    this.selectedLocale = item;

  }

  getLangEnableCount() {
    let count = 0;
    this.greetingLocaleMap[this.selectedLocale].forEach((obj: any) => {
      if (obj.enabled) {
        count++;
      }
    });
    return count;
  }

  toggleMsgEnable(event, index) {
    let langEnableCount = this.getLangEnableCount();
    if (this.welcomeTaskData[this.greetMsgStr].config[this.greetingActiveTab].randomMsg || langEnableCount <= 2) {
      this.greetingLocaleMap[this.selectedLocale][index].enabled = event.target.checked;
      this.updateGreetingFormLocale();
    } else {
      event.target.checked = false;
      this.showMsgEnableWarn = true;
      this.showExceedMsgWarn = false;
    }
  }

  AddOrEditWelcomeMsg() {
    if (this.selectedMsgActionMode == this.newStr) {
      this.greetingLocaleMap[this.selectedLocale].push(this.selectedMsg);
    } else {
      this.greetingLocaleMap[this.selectedLocale][this.selectedMsgActionIndex] = this.selectedMsg;
    }
    this.updateGreetingFormLocale();
    this.closeGreeMessageSlider();
  }

  deleteMsg(item, index) {
    this.greetingLocaleMap[this.selectedLocale].splice(index, 1);
    this.updateGreetingFormLocale();
  }

  updateGreetingFormLocale() {
    this.greetingForm.get('config').get(this.greetingActiveTab).patchValue({ locale: this.greetingLocaleMap });
  }

  // slider events

  deleteWelcomeEvent(contentDeleteWelcomeEvents) {
    this.modalService.open(contentDeleteWelcomeEvents, { centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
  }

  openWelcomeEvent(event, index?) {
    this.selectedMsgActionMode = event;
    this.selectedMsgActionIndex = index;
    if (this.selectedMsgActionMode == this.newStr) {
      this.selectedMsg = { message: '', enabled: false };
    } else if (typeof this.selectedMsgActionIndex == 'number') {
      this.selectedMsg = JSON.parse(JSON.stringify(this.greetingLocaleMap[this.selectedLocale][index]));
    }

    if (this.selectedMsgActionMode == this.editStr || (this.selectedMsgActionMode == this.newStr && this.greetingLocaleMap[this.selectedLocale].length < 10)) {
      this.showProTip = true;
      this.newWelcomeEventSlider.openSlider("#newWelcome", "width550");
    } else {
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

  openModal(contentDeleteWelcomeEvents) {
    let channel = this.greetingActiveTab == 'chat' ? 'voice' : 'chat';
    this.copyMessageList = JSON.parse(JSON.stringify(this.welcomeTaskPreviousData[this.greetMsgStr]?.config[channel]?.locale[this.selectedLocale] || []));
    this.copyMessageList.forEach((obj: any) => {
      obj.selected = false;
    });
    this.selectedMessageCount = 0;
    this.modalService.open(contentDeleteWelcomeEvents, { backdropClass: 'adjust-zindex-above-slider', modalDialogClass: 'confirm-copy', centered: true, backdrop: 'static', keyboard: false });
  }

  closeModal() {
    this.copyMessageList = [];
    this.selectedMessageCount = 0;
    this.modalService.dismissAll();
  }

  copyMessages() {
    this.copyMessageList.forEach((obj: any) => {
      if (obj.selected) {
        this.greetingLocaleMap[this.selectedLocale].push({ message: obj.message, enabled: false });
      }
    });
    this.updateGreetingFormLocale();
    this.closeModal();
  }

  selectedMessage(obj) {
    obj.selected = !obj.selected;
    this.selectedMessageCount = 0;
    this.copyMessageList.forEach((obj) => {
      if (obj.selected) {
        this.selectedMessageCount++;
      }
    });
  }

  toggleMultiSelection(event) {
    this.copyMessageList.forEach((obj) => {
      obj.selected = event.target.checked;
    });
    this.selectedMessageCount = event.target.checked ? this.copyMessageList.length : 0;
  }

  saveGreetMessages() {
    console.log("save greet messages", this.greetingForm.value);
    let payLoad = {
      events: [this.greetingForm.value]
    }
    this.noFormchange = true;
    console.log(payLoad, "payload");
    
    // this.saveGreetingMessages.emit(payLoad);

  }

  cancelGreetMessages() {
    this.updateData(this.welcomeTaskPreviousData);
    this.initGreetingForm(this.welcomeTaskPreviousData);
    this.noFormchange = true;
  }

}
