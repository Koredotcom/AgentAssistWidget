import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { EXPEIRENCEFLOW_MOCKDATA, EXPEIRENCE_MOCKDATA, INewExpeirence } from 'src/app/data/expeirences.mock';
import { workflowService } from '@kore.services/workflow.service';
import { AuthService } from '@kore.services/auth.service';
import { SubSink } from 'subsink';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, E, ENTER} from '@angular/cdk/keycodes';
import * as _ from 'underscore';
import { UsecasesMainService } from '../uc-main/uc-main.service';
import { AppService } from '@kore.services/app.service';
import { SettingsService } from '../../settings/setttings.service';
import { VoiceChannelDataSharingService } from '@kore.services/voice-channel-data-sharing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { MixPanelService } from 'src/app/helpers/mixPanel.service';

declare const $: any;
@Component({
  selector: 'app-new-flow-exp',
  templateUrl: './new-flow-exp.component.html',
  styleUrls: ['./new-flow-exp.component.scss']
})
export class NewFlowExpComponent implements OnInit, OnDestroy {
  addOnBlur = true;
  streamId: any;
  isLoading: boolean;
  subs = new SubSink();

  expeirenceFLow: typeof EXPEIRENCEFLOW_MOCKDATA = EXPEIRENCEFLOW_MOCKDATA;
  model: INewExpeirence = {
    "name": '',
    "description": "",
    "source": {
      "type": "call",
      "channels": [],
      "phoneNumbers": [],
      "assignedEmails": []
    },
    "operationHours": []
  };
  // phoneNumbers: Array<any> = [];
  phoneNumbers: Array<any> = []
  channels: Array<any> = [];
  channelsConfiguredToBot = [];

  @Input() flowId: string;
  @Output() closed = new EventEmitter();
  @Output() openFlowEditor = new EventEmitter();
  
  isEditMode = false;
  modalTitle;
  flowButton;
  isCallFlowCreateMode;
  hoursOperationList;
  all = {
    name: 'All',
    type: 'All',
    checkAllChannels: false
  }
  modelSourceType = false;
  emailList = <any>[];
  emailArr = <any>[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isValidList = true;
  isCheckBoxChecked = false;
  instanceAppDetails;

  voiceChannelTypes = { 'audiocodes': 'audiocodes', 'twiliovoice': 'twiliovoice' };
  integrationTypes = { 'phoneNumberTransfer': 'phoneNumberTransfer', 'sipDomainTransfer': 'sipDomainTransfer' }

  constructor(
    private service: ServiceInvokerService,
    public ucMainService: UsecasesMainService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private authService: AuthService,
    private appService: AppService,
    public settingsService: SettingsService,
    private voiceService: VoiceChannelDataSharingService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private mixPanel: MixPanelService
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.instanceAppDetails = this.voiceService.instantAppData();
    this.getBotInfo();
    this.subs.sink = this.ucMainService.isNewCreateFlowReq$.subscribe(async mode => {
      await this.getListOfPhoneNumbers().toPromise(); 
      if(mode) {
        this.editModeDisabled();
        this.modalTitle = this.translate.instant("NEW_CALL_FLOW_EXP");
        this.flowButton = this.translate.instant("CREATE_CONTINUE_FLOW_DESIGN")
        this.model = {
          "name": '',
          "description": "",
          "source": {
            "type": "call",
            "channels": [],
            "phoneNumbers": [],
            "assignedEmails": []
          },
          operationHours: []
        };
        this.phoneNumbers.forEach((item)=>item.isChecked = false);
        this.all.checkAllChannels = false;
        this.channels.forEach((item)=> item.isChecked = false);
        this.emailList = [];
      } else {
        if(this.ucMainService.selectedFlowData._id) {
          this.isEditMode = true;
          this.getExpeirenceFlow()
          this.modalTitle = this.translate.instant("EDIT_CALL_FLOW_EXP");
          this.flowButton = this.translate.instant("UPDATE_CONTINUE_FLOW_DESIGN")
        }
      }
    });
    this.getHoursofOperations()
    
  }
  ngOnChanges(){
    if(this.workflowService.isChatsOptionsUpdated){
      this.getListOfPhoneNumbers();
    }
  }

  getHoursofOperations() {
    const params = {"limit" : -1, "page": 1};
    this.service.invoke('get.agentSettings.hoursOperations', params).subscribe(res => {
      this.hoursOperationList = res;
      // console.log(res);
    }, err => {
      // console.log(err);
    });
  }

  getListOfPhoneNumbers() {
    const params = {
      instanceId : this.instanceAppDetails?._id
    }
    return this.service.invoke('get.ExpFlowVoicechannels', params).pipe(tap(data => {
      this.phoneNumbers = [];
      this.channels = [];
      for(let num of data.phoneNumbers) {
        let temp = {};
        temp['phoneNumber'] = num.phoneNumber;
        temp['countryCode'] = num.countryCode;
        let arr = this.phoneNumbers?.filter(ele=>ele.phoneNumber === temp['phoneNumber']);
        arr.length <= 0?this.phoneNumbers.push(temp): '';
      }
      for(let num of data.sipTransfers) {
        let temp = {};
        temp['phoneNumber'] = num;
        let arr = this.phoneNumbers?.filter(ele=>ele.phoneNumber === temp['phoneNumber']);
        arr.length <= 0?this.phoneNumbers.push(temp): '';
      }
      for(let chat of data.chatChannel) {
        let tempChan = { isChecked: false };
        tempChan['type'] = chat.type;
        tempChan['name'] = chat.displayName ? chat.displayName: chat.name;
        let arr = this.channels?.filter(ele=>ele.type === tempChan['type']);
        arr.length <= 0?this.channels.push(tempChan): '';
      }
      let arr = this.filtering(this.phoneNumbers.length>0?this.phoneNumbers:(this.channels.length>0? this.channels: ''));
      if(arr.length>0){
        this.isCheckBoxChecked = true;
      }else{
        this.isCheckBoxChecked = false;
      }
    }));
    // this.service.invoke('get.voiceList', params).subscribe(voiceList => {
    //   for(let num of voiceList.phoneNumbers) {
    //     let temp = {};
    //     temp['phoneNumber'] = num.phoneNumber;
    //     temp['countryCode'] = num.countryCode;
    //     if(this.workflowService.detailsFromVoiceCp?.type === 'phoneNumber'){
    //       if(num.phoneNumber === this.workflowService.detailsFromVoiceCp?.data?.phoneNumber){
    //         temp['isChecked'] = true;
    //       }
    //    }
    //     this.phoneNumbers.push(temp);
    //   }
    //   for(let listofDid of voiceList.sipTransfers) {
    //     for(let numb of listofDid.didNumber ) {
    //       let temp = {};
    //       temp['phoneNumber'] = numb;
    //       if(this.workflowService.detailsFromVoiceCp?.type === 'SIP'){
    //         if(numb === this.workflowService.detailsFromVoiceCp?.data?.selectedDIDNumber){
    //           temp['isChecked'] = true;
    //         }
    //      }
    //       this.phoneNumbers.push(temp);
    //     }
    //   }
    // })
  }

   getBotInfo() {
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamId
    }
     this.service.invoke('get.bt.stream', params).subscribe(res => {
      if (res) {
        if (res?.channels.length > 0) {
          for (let [i, vlist] of res?.channels.entries()) {
            let tempChan = { isChecked: false };
              tempChan['type'] = vlist.type;
              tempChan['name'] = vlist.displayName ? vlist.displayName: vlist.name;
              this.channelsConfiguredToBot.push(tempChan);
          }
        }
      }
    });
  }

  isFlagAvailable(countryCode: string = '') {
    if (!countryCode) return;
    return !!this.settingsService.availableCountryFlags.find(f => f === countryCode.toLocaleLowerCase())
  }

  async editModeDisabled() {
    this.isEditMode = false;
    if(this.workflowService.isChatsOptionsUpdated){
      await this.getListOfPhoneNumbers().toPromise();
    }
  }

  close() {
    this.phoneNumbers.forEach(item => item.isChecked = false);
    this.channels.forEach(item => item.isChecked = false);
    this.all.checkAllChannels = false;
    this.modelSourceType = false;
    this.isCheckBoxChecked = false;
    this.editModeDisabled();
    this.ucMainService.createExpFlowBoolean(false);
    
    this.closed.emit();
  }

  getExpeirenceFlow() {
    this.isLoading = true;
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamId,
      callflowId: this.ucMainService.selectedFlowData._id
    }
    this.subs.sink = this.service.invoke('get.expeirence-flow', params).subscribe(res => {
      $.extend(true, this.model, res);
      if(res.source.type === 'call') {
        this.phoneNumbers?.forEach((item)=>item.isChecked = false);
        for(let selectedNum of res.source.phoneNumbers) {
          let temp = {};
          selectedNum.isChecked = true;
          temp = selectedNum;

          let arr = this.phoneNumbers?.filter(ele=>ele.phoneNumber === temp['phoneNumber']);
          arr.length <= 0?this.phoneNumbers.push(temp): '';

        }
          let arr = this.filtering(this.phoneNumbers);
          if(arr.length>0){
            this.isCheckBoxChecked = true;
          }else{
            this.isCheckBoxChecked = false;
          }
      }
      if (res.source.type === 'chat') {
        this.channels.forEach((item) => item.isChecked = false);
        for (let selectedchat of res.source.channels) {
          let temp = {};
          temp['isChecked'] = true;
          temp['type'] = selectedchat;
          this.channelsConfiguredToBot.forEach((ele) => {
            if (ele.type === temp['type']) {
              temp['name'] = ele.name;
            }
          });
          let arr = this.channels?.filter(ele => ele.type === temp['type']);
          arr.length <= 0 ? this.channels.push(temp) : '';
          let allChannelSelect = _.every(this.channels, function (item) { return item.isChecked })
          if (allChannelSelect) {
            this.all.checkAllChannels = true;
          }
        }
        let arr = this.filtering(this.channels);
        if (arr.length > 0 || this.all.checkAllChannels) {
          this.isCheckBoxChecked = true;
        } else {
          this.isCheckBoxChecked = false;
        }
      }
      // for(let mailAdd of res?.source?.assignedEmails) {
      //   let temp = {
      //     invalid: false,
      //     email: mailAdd
      //   }
      //   this.emailList.push(temp);
      // }
    }, err => {
      this.notificationService.showError(err);
    })
    this.isLoading = false;
    return EXPEIRENCE_MOCKDATA;
  }

  createExpeirenceFlow(newFlow, gotoFlowEditor?: boolean) {
    this.isLoading = true;
    this.channelType(newFlow);
    delete newFlow.operationHours; // hours of operation key need to be added to the api, this is a temporary fix 
     // Mock data
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamId,
    }
    this.subs.sink = this.service.invoke('post.expeirence-flow', params, newFlow).subscribe(async res => {
      this.mixPanel.postEvent('Experience Flow Created', this.mixPanel.events['Experience Flow Created']);
      this.notificationService.notify('Created Successfully!', 'success');
      this.ucMainService.updateCallFlowTableBoolean(true);
      this.ucMainService.createExpFlowBoolean(false);

      if (gotoFlowEditor) {
        this.workflowService.selectedCallflow(res);
        this.openFlowEditor.emit();
      }
      await this.getListOfPhoneNumbers().toPromise();
      this.closed.emit();
      this.appService.showGuideLink$.next(true);
    }, err => {
      this.notificationService.showError(err);
    })
    this.isLoading = false;
    return EXPEIRENCE_MOCKDATA;
  }

  updateExpeirenceFlow(newFlow, gotoFlowEditor?: boolean) {
    this.isLoading = true;
    this.channelType(newFlow);
    delete newFlow.createdBy;
    delete newFlow.lModBy;
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamId,
      callflowId: this.ucMainService.selectedFlowData._id
    }
    this.subs.sink = this.service.invoke('put.expeirence-flow', params, newFlow).subscribe(async res => {
      this.mixPanel.postEvent('Experience Flow updated', this.mixPanel.events['Experience Flow updated']);
      this.ucMainService.updateCallFlowTableBoolean(true);
      this.ucMainService.createExpFlowBoolean(true);
      this.notificationService.notify('Updated Successfully!', 'success');
      this.editModeDisabled();

      if (gotoFlowEditor) {
        this.workflowService.selectedCallflow(res);
        this.openFlowEditor.emit();
      }
      await this.getListOfPhoneNumbers().toPromise();
      this.closed.emit();
    }, err => {
      this.notificationService.showError(err);
    })
    this.isLoading = false;
    return EXPEIRENCE_MOCKDATA;
  }

  channelType(newFlow) {
    if(newFlow.source.type === 'call') {
      for(let obj of newFlow.source.phoneNumbers) {
        delete obj.isChecked;
      }
      newFlow.source.channels = ['audiocodes'];
      newFlow.source.assignedEmails = [];
    }else if(newFlow.source.type === 'chat') {
      newFlow.source.phoneNumbers = [];
      newFlow.source.assignedEmails = [];
    } else if(newFlow.source.type === 'email') {
      newFlow.source.assignedEmails = this.getAddedMails();
      newFlow.source.channels = [];
      newFlow.source.phoneNumbers = [];
    }
  }

  // PhoneNumber logic Starts
  onChangePhonenumber(phoneNumber) {
    this.model.source.phoneNumbers = [phoneNumber];
  }

  getSelectedPhoneNumbers(selectedNum) {
    let tempArr = this.model.source.phoneNumbers;
    if (selectedNum.isChecked) {
      this.modelSourceType = true;
      if(tempArr.length === 0) {
        this.model.source.phoneNumbers.push(selectedNum);
      } if(tempArr.length > 0) {
        if(!tempArr.includes(selectedNum)) {
          this.model.source.phoneNumbers.push(selectedNum);
        }
      }
    } if(!selectedNum.isChecked) {
      this.modelSourceType = false;
      for(let [ind,num] of tempArr.entries()) {
        if(num.phoneNumber === selectedNum.phoneNumber) {
          this.model.source.phoneNumbers.splice(ind, 1);
        }
      }
    }
    if(this.isEditMode){
     let arr =  this.filtering(this.phoneNumbers);
      if(arr.length > 0){
        this.isCheckBoxChecked = true;
        this.modelSourceType = true;
      }else{
        this.isCheckBoxChecked = false;
        this.modelSourceType = false;
      }  
    }
  }
  filtering(array){
    if (array) {
      return array?.filter((elm) => {
        return elm.isChecked === true;
      })
    } else {
      return '';
    }
  }
  unCheckOthersBasedOnModelType(type){
    this.isCheckBoxChecked = false;
    this.modelSourceType = false;
   if(type === "call"){
     this.channels.forEach(item => item.isChecked = false);
     this.all.checkAllChannels = false;
   }else if(type === "chat"){
     this.phoneNumbers.forEach(item => item.isChecked = false);
   }else{
    this.phoneNumbers.forEach(item => item.isChecked = false);
    this.channels.forEach(item => item.isChecked = false);
    this.all.checkAllChannels = false;
    this.modelSourceType = true;
   }
  }

  navigateToPhonenumberPurchase() {
    this.router.navigate(['config/channels'], { queryParams: { option: 'phone' },skipLocationChange: true},);
  }
  // PhoneNumber logic ends here

  // channels logic starts here
  toggleCheckboxAll(event) {
    if(this.all.checkAllChannels) {
      this.modelSourceType = true;
      this.isCheckBoxChecked = true;
      this.channels.forEach(item => item.isChecked = true);
      for(let select of this.channels) {
        this.model.source.channels.push(select.type);
      }
    } else {
      this.modelSourceType = false;
      this.isCheckBoxChecked = false;
      this.channels.forEach(item => item.isChecked = false);
      this.model.source.channels = [];
    }
  }

  getSelectedChannels(channel) {
    let tempChannels = this.model.source.channels;
    if (channel.isChecked) {
      this.modelSourceType = true
      if(tempChannels.length === 0) {
        this.model.source.channels.push(channel.type);
      } if(tempChannels.length > 0) {
        if(!tempChannels.includes(channel.type)) {
          this.model.source.channels.push(channel.type);
        }
      }
     let allChannelSelect = _.every(this.channels, function(item) {return item.isChecked})
     if(allChannelSelect) {
       this.all.checkAllChannels = true;
     }
    } if(!channel.isChecked) {
      if(this.all.checkAllChannels){
        this.modelSourceType = true;
      };
      this.all.checkAllChannels = false;
      for(let [ind,channelVal] of tempChannels.entries()) {
        if(channelVal === channel.type) {
          this.model.source.channels.splice(ind, 1);
        }
      }
    }
    if(this.isEditMode){
      let arr =  this.filtering(this.channels);
       if(arr.length > 0 || this.all.checkAllChannels){
        this.isCheckBoxChecked = true;
        this.modelSourceType = true;
       }else{
        this.modelSourceType = false;
        this.isCheckBoxChecked = false;
       } 
     }
  }
  // channels logic ends here

  onChangehoursOfOperation(selectedWorkingHours) {
    this.model.operationHours = [selectedWorkingHours];
  }

  getAddedMails() {
    this.emailArr = _.pluck(this.emailList, 'email');
    return this.emailArr;
  }

  // adding multiple emails logic starts here
  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (this.validateEmail(value)) {
        this.emailList.push({email:value, invalid:false});
      } 
      // else{
      //   this.emailList.push({email:value, invalid:true}); 
      // }
    }
    if (input) {
      input.value = '';
    }
    this.checkValidation();
  }
  
  remove(listElement: {email: string, invalid: boolean}) {
    const index = _.findIndex(this.emailList, {email: listElement.email});
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
    this.checkValidation();
  }
  
  checkValidation() {
    this.isValidList = _.where(this.emailList, {invalid: true}).length == 0;
    this.emailList.length === 0 ? this.modelSourceType = false: this.modelSourceType = true;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
  // adding multiple emails ends here


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
