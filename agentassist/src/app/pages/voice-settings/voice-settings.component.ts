import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AppService } from '@kore.services/app.service';
import { AuthService } from '@kore.services/auth.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { INewVoicesTransfer, VOICECHANNEL_TRASFER_MOCKDATA } from 'src/app/data/voices.mock';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { SubSink } from 'subsink';
import { SettingsService } from '../settings/setttings.service';
import * as _ from 'underscore';
import { VoiceChannelDataSharingService } from '@kore.services/voice-channel-data-sharing.service';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MixPanelService } from 'src/app/helpers/mixPanel.service';
// import { MIXPANEL_EVENTS } from 'src/app/helpers/mixpanel-events';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
declare const $: any;

@Component({
  selector: 'app-voice-settings',
  templateUrl: './voice-settings.component.html',
  styleUrls: ['./voice-settings.component.scss']
})
export class VoiceSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() deleteSelectedPhoneOrSIP = new EventEmitter;
  showAttacheFlowSlider: boolean = false;
  showIncomingPhNumberSlider: boolean = false;
  showIncomingIVRSlider: boolean = false;
  showFlowSlider: boolean = false;
  updatePhNumberSlider = false;
  updateCallFlowList = false;
  updateIVRSlider = false;
  showNewSIPTransfers: boolean = false;
  @ViewChild('attacheFlowSlider', { static: true }) attacheFlowSlider: SliderComponentComponent;
  @ViewChild('incomingPhNumberSlider', { static: true }) incomingPhNumberSlider: SliderComponentComponent;
  @ViewChild('incomingIVRSlider', { static: true }) incomingIVRSlider: SliderComponentComponent;

  voiceTransferData: typeof VOICECHANNEL_TRASFER_MOCKDATA = VOICECHANNEL_TRASFER_MOCKDATA;
  model: INewVoicesTransfer = {
    "phoneNumbers": [
      {
        "_id": "",
        "phoneNumber": "",
        "countryCode": "",
        "phoneNumberType": "",
        "price": "",
        "inbound_price": "",
        "currencyType": "",
        "callFlowDetails": [
          {
            "_id": "",
            "name": "",
            "state": "",
            "didNumber": ""
          }
        ]

      }
    ],
    "sipTransfers": [
      {
        "_id": "",
        "sipURI": "",
        "network": "",
        "languagePreference": "",
        "didNumber": [],
        "sipTransportType": "",
        "sipUserName": "",
        "sipPassword": "",
        "incomingIpAddresses": [],
        "callFlowDetails": [
          {
            "_id": "",
            "name": "",
            "state": "",
            "didNumber": ""
          }
        ]
      }
    ]
  };
  subs = new SubSink();
  instanceAppDetails;
  phoneNumsDetailsList: any = [];
  phoneNumandSipDetailsList: any;
  sipNumsDetailsList: any = [];
  expFlowList: any;
  streamId;
  emitDetails;
  IncomingPhoneNumber: any = {
    type: "",
    settings: {
      "phoneNumber": "",
      "countryCode": "",
      "phoneNumberType": "",
      "price": "",
      "inbound_price": "",
      "currencyType": ""
    }
  };

  IncomingSIPDetails: any = {
    type: '',
    settings: {
      "sipURI": '',
      "network": '',
      "didNumber": [],
      "sipTransportType": '',
      "sipUserName": '',
      "sipPassword": '',
    }
  }
  incomingSetup;
  ivrData;

  voiceListSub: Subscription;

  @ViewChild('searchEle') searchEle: ElementRef;
  constructor(private service: ServiceInvokerService,
    private voiceService: VoiceChannelDataSharingService,
    private appService: AppService,
    public settingsService: SettingsService,
    private authService: AuthService,
    public workflowService: workflowService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private readonly route: ActivatedRoute,
    private mixPanel: MixPanelService,
    private dockStatusService: DockStatusService
    ) {

  }

  ngOnInit(): void {
    this.updatePhNumberSlider = false;
    this.updateIVRSlider = false;
    this.updateCallFlowList = false;
    this.streamId = this.authService.getAgentAssistStreamId();
    this.instanceAppDetails = this.voiceService.instantAppData();
    this.getFlows();
    this.subscribeEvents();
    this.route.queryParams.subscribe(params => {
      if (params.option) {
        this.openPhSlider()
      }
    });
  }



  subscribeEvents(){
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele)=>{
      if(ele){
        this.streamId = this.authService.getAgentAssistStreamId();
        this.instanceAppDetails = this.voiceService.instantAppData();
        this.getFlows();
      } 
    });
  }

  ngAfterViewInit() {
    this.subs.sink = fromEvent(this.searchEle.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged())
      .subscribe(searchTerm => this.getListOfPhoneNumbers(searchTerm));
  }


  getFlows() {
    const cfParams = {
      userId: this.authService.getUserId(),
      streamId: this.streamId,
      name: "",
    }
    this.subs.sink = this.service.invoke('get.expeirence-flows', cfParams).subscribe(flowList => {
      this.expFlowList = flowList.results;
      this.expFlowList = _.filter(this.expFlowList, function (flow) { return flow.source.type === 'call' })
      this.getListOfPhoneNumbers();
    })
  }

  NewNumberisPurchased(event) {
    this.getListOfPhoneNumbers();
  }

  newSipSetUp(event) {
    this.getListOfPhoneNumbers();
  }

  getListOfPhoneNumbers(searchTerm = '') {
    const params = {
     // instanceId: this.instanceAppDetails._id,
     instanceId:this.authService.getAgentAssistStreamId(),
      'isAgentAssist':true
    }
    
    const qparams = {
      s: searchTerm
    }
    if (this.voiceListSub) this.voiceListSub.unsubscribe();
    this.voiceListSub = this.service.invoke('get.voiceList', params, qparams).subscribe(voiceList => {
      this.phoneNumandSipDetailsList = voiceList;
      if(this.phoneNumandSipDetailsList?.sipTransfers.length == 0){
        this.showNewSIPTransfers = true;
      }
      else{
        this.showNewSIPTransfers = false;
      }
      // for (let numData of this.phoneNumandSipDetailsList.phoneNumbers) {
      //   // for (let flowData of this.expFlowList) {
      //   //   if('cfId' in numData) {
      //   //     if (numData.cfId === flowData._id) {
      //   //       numData.cfName = flowData.name;
      //   //     }
      //   //   } else {
      //   //     numData.cfId = '';
      //   //   }
      //   // }
      // }
      // for (let sipData of this.phoneNumandSipDetailsList.sipTransfers) {
      //   // for (let flowData of this.expFlowList) {
      //   //   if('cfId' in sipData) {
      //   //     if (sipData.cfId === flowData._id) {
      //   //       sipData.cfName = flowData.name;
      //   //     }
      //   //   } else {
      //   //     sipData.cfId = '';
      //   //   }
      //   // }
      // }
    })
  }


  openAFSlider(type, data, selectedFlow?, selectedDIDNumber = '') {
    if(type === 'phoneNumber') {
      if('callFlowDetails' in data && data?.callFlowDetails.length >= 0) {
        this.updateCallFlowList = true;
        this.attachFlow(type,data, selectedFlow);
      } else {
        this.updateCallFlowList = false;
        this.attachFlow(type, data, selectedFlow);
      }
    }
    if (type === 'SIP') {
      if ('callFlowDetails' in data && data?.callFlowDetails.length >= 0) {
        this.updateCallFlowList = true;
        data['selectedDIDNumber'] = selectedDIDNumber;
        this.attachFlow(type,data, selectedFlow);
      } else {
        this.updateCallFlowList = false;
        data['selectedDIDNumber'] = selectedDIDNumber; 
        this.attachFlow(type,data, selectedFlow);
      }
    }

  }

  attachFlow(type, data, selectedFlow) {
    this.emitDetails = { 'type': type, 'data': data, "selectedFlow": selectedFlow};
    this.attacheFlowSlider.openSlider("#attacheFlowSlider", "width500");
    this.showAttacheFlowSlider = true;
    this.workflowService.detailsFromVoiceCp = this.emitDetails;
  }

  flowUpdateBool() {
    this.updateCallFlowList = false;
  }


  closeAFSlider($event) {
    this.showAttacheFlowSlider = false;
    this.attacheFlowSlider.closeSlider("#attacheFlowSlider");
    if ($event) {
      this.getFlows();
    }
  }

  deletePhoneNumberConfig(numDetail) {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '580px',
      panelClass: "delete-phone-sip-config",
      data: {
        title: this.translate.instant('NOTIFY.ARE_YOU_SURE', { phoneNum: numDetail.phoneNumber }),
        text: this.translate.instant("PhoneNum_DELETE_CONFORMATION_NOTE"),
        buttons: [{ key: 'yes', label: this.translate.instant("BUTTONS.DELETE"), type: 'danger' }, { key: 'no', label: this.translate.instant("BUTTONS.CANCEL") }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          //TODO
          console.log(numDetail);
          const params = {
            instanceId: this.authService.getAgentAssistStreamId(),
            'isAgentAssist':true
          }
          const payload = {
            "type": numDetail.sipURI ? "IVR" : "phoneNumber",
            "_id": numDetail._id,
            "callFlowDetails": numDetail.callFlowDetails || []
          }
          this.service.invoke('delete.voiceNum', params, payload).subscribe(res => {
            // this.dockStatusService.publisAndHold();
            console.log(res);
            this.getListOfPhoneNumbers();
          }, err => {
            console.log(err);
          })
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  removePhoneNum(event) {
    this.getListOfPhoneNumbers();
  }
  updatePhoneNumConfig(numDetail) {
    this.phoneNumsDetailsList = numDetail;
    this.incomingPhNumberSlider.openSlider("#incomingPhNumber", "width940");
    this.updatePhNumberSlider = true;
  }

  updateSipConfiguration(sipDetails) {
    console.log(sipDetails);
    this.sipNumsDetailsList = sipDetails;
    this.incomingIVRSlider.openSlider("#incomingIVR", "width940");
    this.updateIVRSlider = true;
  }

  deleteSipConfiguration(sipDetails) {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '580px',
      panelClass: "delete-phone-sip-config",
      data: {
        title: this.translate.instant('NOTIFY.ARE_YOU_SURE', { Sip: sipDetails.sipURI }),
        text: this.translate.instant("SIPURL_DELETE_CONFORMATION_NOTE"),
        buttons: [{ key: 'yes', label: this.translate.instant("BUTTONS.DELETE"), type: 'danger' }, { key: 'no', label: this.translate.instant("BUTTONS.CANCEL") }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          //TODO
          console.log(sipDetails);
          const params = {
            instanceId: this.authService.getAgentAssistStreamId(),
            'isAgentAssist':true
          }
          const payload = {
            "type": "IVR",
            "_id": sipDetails._id,
            "callFlowDetails": []
          }
          this.service.invoke('delete.voiceNum', params, payload).subscribe(res => {
            console.log(res);
            this.getListOfPhoneNumbers();
          }, err => {
            console.log(err);
          })
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
    // 
  }

  deleteSipConfig(sipDetails) {
    this.deleteSipConfiguration(sipDetails)
  }

  openPhSlider() {
    this.phoneNumsDetailsList = this.IncomingPhoneNumber;
    this.incomingPhNumberSlider.openSlider("#incomingPhNumber", "width940");
    this.showIncomingPhNumberSlider = true;
  }

  closePhSlider($event) {
    this.showIncomingPhNumberSlider = false;
    this.updatePhNumberSlider = false;
    this.incomingPhNumberSlider.closeSlider('#incomingPhNumber');
  }

  openIVRSlider() {
    this.sipNumsDetailsList = this.IncomingSIPDetails;
    this.incomingIVRSlider.openSlider("#incomingIVR", "width940");
    this.showIncomingIVRSlider = true;
  }

  closeIVRSlider($event) {
    this.showIncomingIVRSlider = false;
    this.updateIVRSlider = false;
    this.incomingIVRSlider.closeSlider('#incomingIVR');
  }

  isFlagAvailable(countryCode: string = '') {
    if (!countryCode) return;
    return !!this.settingsService.availableCountryFlags.find(f => f === countryCode.toLocaleLowerCase())
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.voiceListSub) this.voiceListSub.unsubscribe();
  }

}
