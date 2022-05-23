import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { VoiceChannelDataSharingService } from '@kore.services/voice-channel-data-sharing.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { pipe } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IncomingSetupModel } from '../../settings.model';
import { AuthService } from '@kore.services/auth.service';
import { fromEvent, Subscription } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { event } from 'd3';
declare const $: any;
@Component({
  selector: 'app-ivr',
  templateUrl: './ivr.component.html',
  styleUrls: ['./ivr.component.scss']
})
export class IvrComponent implements OnInit {

  selectedApp: any;
  saveInProgress: boolean = false;
  sipMerge: any;
  sipValue: any;
  sipDID: any;
  sipNewURI: any;
  showAudioCodes: boolean = true;
  isDidExist:boolean = false;
  didLengthSet:boolean = false;
  didNumbers: any[] = [];
  sipTransportTypes: any[] = []
  voiceListSub: Subscription;
  asrPreferences: any[] = [];
  ttsPreferences: any[] = [];
  voiceNames: any[] = []
  sipDetailsList: any;
  voiceDataURI: string = "";
  voicePreviewInProgress: boolean = false;
  showMoreDIDNumbers:boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  sipTransferList: any;
  dnsResolveMethods: any[] = [];
  data: any;
  instanceAppDetails;
  updateSipConfig: boolean = false;
  selectedSipInfo;

  @Input() model: {
    sipDomainName: string,
    sipURI: string,
    incomingIpAddresses: string,
    languagePreference: 'en_US',
    didNumber: string[],
    sipTransportType: string,
    sipHost: string, // optional
    sipUserName: string, //optional
    sipPassword: string, //optional
    network: 'listofIp' | 'domainName',
    dnsResolveMethod: string,
    fqdn: string,
    voiceChannel: string,
    previewVoiceEnabled: boolean,
    asrPreference: string,
    ttsPreference: string,
    voicePreference: string,
  }

  @Input() incomingSetup: IncomingSetupModel;
  @Output() closed = new EventEmitter();
  @Output() newSipData = new EventEmitter();
  @ViewChild('audioPlayerRef') audioPlayerRef: ElementRef;
  constructor(
    private voiceService: VoiceChannelDataSharingService,
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dockStatusService: DockStatusService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.instanceAppDetails = this.voiceService.instantAppData();
    this.selectedApp = this.workflowService.deflectApps(); 
    this.workflowService.seedData$.subscribe(res => {
    this.sipDetailsList = this.incomingSetup;
      if (this.model) {
        this.model.sipURI = res.agentAssistSeedData.agentAssistSipURI;
      } 
      else { 
        if(this.sipDetailsList){
          this.sipValue = res.agentAssistSeedData.agentAssistSipURI.split(/[:]/);
          this.sipMerge = this.sipDetailsList.didNumber +'@'+ this.sipValue[1];
          this.sipValue.splice(1,1);
          this.sipValue.splice(1,0,this.sipMerge);
          this.sipNewURI = this.sipValue.join(':');
          this.model = {
          ... this.model,
          'sipURI': this.sipNewURI,
          }
         }
        else {
          const params = {
            instanceId:this.authService.smartAssistBots.map(x=>x._id),
            'isAgentAssist':true
           }
          this.voiceListSub = this.service.invoke('get.voiceList', params).subscribe(voiceList => {
            this.sipTransferList = voiceList;
            this.sipValue = res.agentAssistSeedData.agentAssistSipURI.split(/[:]/);
            if(this.sipTransferList.sipRecId){
            this.sipMerge = this.sipTransferList.sipRecId +'@'+ this.sipValue[1];  
            }
            else{       
            this.sipMerge = this.didNumbers +'@'+ this.sipValue[1];
            }
            this.sipValue.splice(1,1);
            this.sipValue.splice(1,0,this.sipMerge);
            this.sipNewURI = this.sipValue.join(':');
            this.model.didNumber = this.sipTransferList.sipRecId;
            this.model = {
              ... this.model,
              'sipURI': this.sipNewURI,
            }
          })
       }
      }
      if (!res) return;
      this.ttsPreferences = res.deflectSeedData.ttsPreferences;
      this.asrPreferences = res.deflectSeedData.asrPreferences.map(o => { return { name: o } })
      this.sipTransportTypes = res.deflectSeedData.sipTransportTypes;

      this.dnsResolveMethods = res.deflectSeedData.dnsResolveMethods;
    
    })

    if (this.incomingSetup && this.incomingSetup['_id']) {
      this.selectedSipInfo = this.incomingSetup;
      console.log(this.selectedSipInfo);
      this.updateSipConfig = true;
      this.model.sipURI = this.sipNewURI;
      this.model.didNumber = this.selectedSipInfo.didNumber;
      this.model.fqdn = this.selectedSipInfo.fqdn;
      this.model.incomingIpAddresses = this.selectedSipInfo.incomingIpAddresses;
      this.model.network = this.selectedSipInfo.network;
      this.model.sipPassword = this.selectedSipInfo.sipPassword;
      this.model.sipTransportType = this.selectedSipInfo.sipTransportType;
      this.model.sipUserName = this.selectedSipInfo.sipUserName;
    } else {
      this.model = {
        ...{
          sipDomainName: "",
          sipURI: "",
          incomingIpAddresses: [],
          languagePreference: 'en_US',
          didNumber: [],
          sipTransportType: "",
          sipHost: '', // optional
          sipUserName: '', //optional
          sipPassword: '', //optional
          network: 'listofIp',
          dnsResolveMethod: '',
          fqdn: [],

          voiceChannel: '',
          previewVoiceEnabled: true,
          asrPreference: '',
          ttsPreference: '',
          voicePreference: '',
        },
        ...this.model,
      }
    }

    this.model.network = this.model.network || 'listofIp';
    this.model.incomingIpAddresses = (this.model.incomingIpAddresses as any).join(",");
    this.didNumbers = typeof this.model.didNumber === 'object' ? this.model.didNumber : [this.model.didNumber];
    this.model.didNumber = null;
    this.model.fqdn = (this.model.fqdn as any).join(",");
    this.data = $.extend(true, {}, this.model);
  }

  onDIDNumberRemove(tag): void {
    this.isDidExist = true;
    this.sipValue = this.sipNewURI.split(/[@:]/);
    if(this.didNumbers.length == 1){
    this.sipValue.splice(1,1);
    }
    this.sipNewURI = this.sipValue.join(':');
    const index = this.didNumbers.indexOf(tag);
    if (index >= 0) {
      this.didNumbers.splice(index, 1);
    }
  }


  onDidNumberFocus(event) {
    this.OnDidNumberUpdated(event);
  }

  OnDidNumberUpdated(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
     
      this.didLengthSet = true;
      if (this.didNumbers.length >= 1) {
        
        this.notificationService.notify("SIP doesn't support more than 1 number", 'warning');
        return;
      }

      if (this.didNumbers.indexOf(value.trim()) > -1) {
        return;
      }
      this.isDidExist = true;
      if(this.sipNewURI){
      this.sipValue = this.sipNewURI.split(/[@:]/);
      }
      else{
        this.sipValue = this.model.sipURI.split(/[@:]/);
      }
      if(this.sipValue[1] == this.model.didNumber){
      this.sipValue.splice(1,1);
      this.sipMerge = value +'@'+ this.sipValue[1];
      this.sipValue.splice(1,1);
      }
      else if(this.sipValue[1] != this.model.didNumber){
      this.sipMerge = value +'@'+ this.sipValue[1];
      this.sipValue.splice(1,1);
      }
      this.sipValue.splice(1,0,this.sipMerge);
      this.sipNewURI = this.sipValue.join(':');
      this.didNumbers.push(value.trim());
     
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  selectedVoicePreferences(ttsPreference) {
    this.model.voicePreference = '';
    this.model.ttsPreference = ttsPreference.ttsProvider;
    this.voiceNames = ttsPreference.English.voicePreferences.map(o => { return { name: o } })
  }

  selectedVoiceNamePreferences(voicename) {
    this.model.voicePreference = voicename.name;
    setTimeout(() => $('#speechSampleInput').focus());
  }

  selectedSpeechPreferences(preference) {
    this.model.asrPreference = preference.name;
  }

  onChangeSIPTransportType(transport) {
    this.model.sipTransportType = transport;
    if (transport === 'TLS') {
      this.model.sipURI = this.model.sipURI.replace(/.$/, "1");
    }
  }

  onPreviewVoice(previewText: string) {
    let _params: any = {
      streamId: this.workflowService.getCurrentBt()._id,
    }

    let _payload = {
      "ttsPreference": this.model.ttsPreference,
      "previewText": previewText,
      "voicePreference": this.model.voicePreference
    }
    this.voicePreviewInProgress = true;
    this.service.invoke('post.previewVoice', _params, _payload)
      .pipe(finalize(() => this.voicePreviewInProgress = false))
      .subscribe(res => {
        this.voiceDataURI = res.previewVoice;
        setTimeout(() => {
          this.audioPlayerRef.nativeElement.play();
        })

      }, err => {
        this.notificationService.notify(this.translate.instant('NOTIFY.UNABLE_TO_FETCH_AUDIO'), "error");
      })
  }
  onSave() {
    this.saveInProgress = true;
    const _params = { streamId: this.authService.smartAssistBots.map(x=>x._id),
      'isAgentAssist':true }
      this.sipValue = this.model.sipURI.split(/[:]/);
      this.sipMerge = this.didNumbers[0] +'@';
      //this.sipValue.splice(1,1);
      this.sipValue.splice(1,0,this.sipMerge);
      this.sipNewURI = this.sipValue.join(':');
      
    const _payload = {
      "type": "IVR",
      "sipDomainConfigDetails": {
        "sipURI": this.sipNewURI,
        "network": this.model.network,
        "languagePreference": "en_US",
        "didNumber": this.didNumbers,
        "sipTransportType": this.model.sipTransportType,
        "sipUserName": this.model.sipUserName, //optional
        "sipPassword": this.model.sipPassword, //optional
      },
      "languagePreference": "en_US",
      "isSetUpCompleted": true

    }
    if (this.model.network === 'listofIp') {
      _payload["sipDomainConfigDetails"]["incomingIpAddresses"] = this.model.incomingIpAddresses.split(",");
    } else {
      _payload["sipDomainConfigDetails"]["fqdn"] = this.model.fqdn.split(",");
      _payload["sipDomainConfigDetails"]["dnsResolveMethod"] = this.model.dnsResolveMethod
    }
    this.service.invoke('post.incoming', _params, _payload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.notificationService.notify(this.translate.instant("NOTIFY.UPDATED_SUCCESSFULLY"), "success")
        this.close(true);
      }, err => {
        this.notificationService.showError(err, this.translate.instant("NOTIFY.FAILED_TO_CONFIGURE_IVR"));
      })
  }
  

  SipTransferConfig() {
   
    this.saveInProgress = true;
    const params = {
      instanceId: this.authService.smartAssistBots.map(x=>x._id),
      'isAgentAssist':true
    }
    
    this.sipValue = this.model.sipURI.split(/[@:]/);
    this.sipValue.splice(1,1);
    this.sipMerge = this.model.didNumber +'@'+ this.sipValue[1];   
    this.sipValue.splice(1,1);
    this.sipValue.splice(1,0,this.sipMerge);
    this.sipNewURI = this.sipValue.join(':');
    if (!this.updateSipConfig) {
      const payload = {
        "type": "IVR",
        "settings": {
          "sipURI": this.sipNewURI,
          "network": this.model.network,
          "didNumber": this.didNumbers,
          "sipTransportType": this.model.sipTransportType,
          "sipUserName": this.model.sipUserName,
          "sipPassword": this.model.sipPassword,
        }
        
      }
          
      if (this.model.network === 'listofIp') {
        payload["settings"]["incomingIpAddresses"] = this.model.incomingIpAddresses.split(",");
      } else {
        payload["settings"]["fqdn"] = this.model.fqdn.split(",");
        payload["settings"]["dnsResolveMethod"] = this.model.dnsResolveMethod
      }
      this.service.invoke('post.voiceType', params, payload).subscribe(res => {
        this.dockStatusService.publisAndHold();
        this.saveInProgress = false
        this.newSipData.emit(true);
        this.notificationService.notify(this.translate.instant("NOTIFY.CONFIGURED_SUCCESSFULLY"), "success")
        this.close(true);
        this.authService.getDeflectApps();
      }, err => {
        this.notificationService.showError(err, this.translate.instant("NOTIFY.FAILED_TO_CONFIGURE_IVR"));
      })
    } else {
      let payload = {'type': "IVR"}     
      this.sipValue = this.model.sipURI.split(/[@:]/);
      this.sipMerge = this.didNumbers +'@'+ this.sipValue[2];
      this.sipValue.splice(1,1);
      this.sipValue.splice(1,1,this.sipMerge);
      this.sipNewURI = this.sipValue.join(':');
      let config = {
        "_id": this.selectedSipInfo._id,
        "sipURI": this.sipNewURI,
        "network": this.model.network,
        "didNumber": this.didNumbers,
        "sipTransportType": this.model.sipTransportType,
        "sipUserName": this.model.sipUserName,
        "sipPassword": this.model.sipPassword,
        "callFlowDetails": this.selectedSipInfo.callFlowDetails
      }
      if (this.model.network === 'listofIp') {
        config["incomingIpAddresses"] = this.model.incomingIpAddresses.split(",");
      } else {
        config["fqdn"] = this.model.fqdn.split(",");
        config["dnsResolveMethod"] = this.model.dnsResolveMethod
      }
      payload['settings'] = $.extend(this.incomingSetup, config);
      // const payload = {
      //   "type": "IVR",
      //   "settings": {
      //     "_id": this.selectedSipInfo._id,
      //     "sipURI": this.model.sipURI,
      //     "network": this.model.network,
      //     "didNumber": this.didNumbers,
      //     "sipTransportType": this.model.sipTransportType,
      //     "sipUserName": this.model.sipUserName,
      //     "sipPassword": this.model.sipPassword,
      //     "callFlowDetails": this.selectedSipInfo.callFlowDetails
      //   }
      // }
      // if (this.model.network === 'listofIp') {
      //   payload["settings"]["incomingIpAddresses"] = this.model.incomingIpAddresses.split(",");
      // } else {
      //   payload["settings"]["fqdn"] = this.model.fqdn.split(",");
      //   payload["settings"]["dnsResolveMethod"] = this.model.dnsResolveMethod
      // }
      this.service.invoke('post.voiceType', params, payload).subscribe(res => {
        this.dockStatusService.publisAndHold();
        this.saveInProgress = false;
        this.updateSipConfig = false;
        this.newSipData.emit(true);
        this.notificationService.notify(this.translate.instant("NOTIFY.UPDATED_SUCCESSFULLY"), "success")
        this.close(true);
      }, err => {
        this.notificationService.showError(err, this.translate.instant("NOTIFY.FAILED_TO_CONFIGURE_IVR"));
      })
    }

  }

  close(success?: boolean) {
    this.closed.emit(success);
  }

  onCancel() {
    this.model = $.extend(true, {}, this.data);
  }

}
