import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SliderComponentComponent } from '../../../shared/slider-component/slider-component.component';
import { SettingsService } from '../setttings.service';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { ASSETS } from '../../channels/channels.model';

import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit, OnDestroy {
  streamId: string;
  openSubs: Subscription;
  closeSubs: Subscription;
  isCallNumber = false;
  liveAgents: any;
  selectedApp: any;
  instructions: any[] = [];
  selectedAgent: any;
  agentForm: FormGroup;
  sdkApps: any[] = [];
  selectedSdkApp: any;
  assets = ASSETS;
  hostUrl: string;
  isView = false;

  @Input() agentDetails: any;
  @Input() agentType: 'chat' | 'voice';
  @Output() close = new EventEmitter();
  @ViewChild('slider', { static: true }) slider: SliderComponentComponent;

  constructor(private serviceSettings: SettingsService,
              private service:ServiceInvokerService,
              public workflowService:workflowService,
              private notificationService: NotificationService,
              private translate: TranslateService,
              public fb: FormBuilder,
              private authService: AuthService,
              private dockService: DockStatusService
          ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.openSubs = this.serviceSettings.openChannel$
      // .pipe(
      //   tap(response => {
      //     if(response.flagName == 'isCallNumber') {
      //       this.isCallNumber = true;
      //       this.isAnotherView = true;
      //     } else {
      //       this.isCallNumber = false;
      //       this.isAnotherView = false;
      //     }
      //   })
      // )  
      .subscribe(res =>{
        this.slider.openSlider('#channel-slider', 'width940');
      });
    this.closeSubs = this.serviceSettings.closeChannel$.subscribe(res =>{
      this.slider.closeSlider('#channel-slider');
      this.close.emit();
    });
    this.hostUrl = this.workflowService.resolveHostUrl();
    this.selectedApp = this.workflowService.deflectApps();
    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      this.liveAgents = JSON.parse(JSON.stringify(res.deflectSeedData.supportedLiveAgents));
      // const allAgents = this.liveAgents.voiceAgents.concat(this.liveAgents.chatAgents);
      const allAgents = this.liveAgents.chatAgents;
      this.liveAgents = JSON.parse(JSON.stringify(allAgents));
      this.liveAgents.forEach(agent => {
        agent.iconPath = this.workflowService.resolveHostUrl() + agent.iconPath;
        agent.fields = agent.fields.map(field => ({
          name: field.key,
          displayName: field.label,
          helpText: field.helpText,
          fieldType: field.fieldType, //staticlist //radio //textbox
          dataType: field.type,
          placeholder: field.placeholder || '',
          isOptional: field.isOptional,
          isMultiSelect: false,
          minLength: field.minLength,
          maxLength: field.maxLength,
          showCopy: field.copyIcon,
          isNew: true,
          listofvalues: field.listOfValues || [],
          defaultValue: field.defaultValue,
          isEditable: field.isEditable
        }));
      })
    });

    // agentName changed to key
    if (this.agentDetails && this.agentDetails.key) {
      this.getInstructions(this.agentDetails.key);
      this.selectedAgent = this.liveAgents.find(f => f.key === this.agentDetails.key);
      if (this.agentDetails.key === 'custom') {
        this.getSDKApps();
      }
      this.generateForm(true);
      if(_.where(this.agentDetails.fields, {key: 'webhookURL'}).length > 0) {
        const params = {
          streamId: this.streamId,
          agentName: this.agentDetails.key
        };
        this.service.invoke('get.settings.webhook', params).subscribe(
          res => {
            this.agentForm.get('webhookURL').setValue(res.postUrl);
          }, err => {
            this.agentForm.get('webhookURL').setValue('');
            this.workflowService.showError(err, this.translate.instant("SETTINGS.FAILED_FETCH_WBHOOK"));
          }
        )
      }
    }
  }


  closeS() {
    this.slider.closeSlider('#channel-slider');
    this.close.emit();
  }

  updateCheckedStatus(controlName: string, value: string) {
    return this.agentForm.get(controlName).value === value;
  }

  getSDKApps() {
    const _params = {
      'userId': this.authService.getUserId(),
      'appId': this.workflowService.getCurrentBt()._id,
    }
    this.service.invoke('get.sdk.apps', _params).subscribe(res => {
      this.sdkApps = res.apps;
      this.onSdkAppChange('sdkClientId');
    });
  }

  onSdkAppChange(fieldName){
    setTimeout(()=>{
      const id = this.agentForm.get(fieldName).value;
      this.selectedSdkApp = this.sdkApps.find(f=>f.clientId === id);
    })
  }

  getInstructions(selectedAgent) {
    const _params = {
      'agentKey': selectedAgent
    }
    this.service.invoke('get.agent.instructions', _params).subscribe(res => {
      if(res[1].instruction.indexOf('[here]') > -1) {
        res[1].instruction = res[1].instruction.replace('[',  '<a href="'+ res[1].instruction.slice(res[1].instruction.indexOf('(') + 1, res[1].instruction.indexOf(')')) + '" target="_blank">');
        res[1].instruction = res[1].instruction.replace(']',  '</a> ');
      }
      this.instructions = res;
    });
  }

  generateForm(bindValues?: boolean) {
    const formFields = {};
    this.selectedAgent.fields.forEach(e => {
      const validators = [];
      if (!e.isOptional) { validators.push(Validators.required) }
      if (e.minLength) { validators.push(Validators.minLength(e.minLength)) }
      if (e.maxLength) { validators.push(Validators.maxLength(e.maxLength)) }
      if (e.dataType === 'email') { validators.push(Validators.email) }
      if (e.dataType === 'url') { validators.push(Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')) }

      if (this.selectedAgent.key === 'servicenow' && e.name === 'webhookURL') {
        const hostUrl = this.workflowService.resolveHostUrl();
        e.defaultValue = hostUrl + "/agentSdk/stream/" + (this.workflowService.getCurrentBt()._id) + "/sendToUser";
      }
      // formFields[e.name] = new FormControl('', validators);
      formFields[e.name] = new FormControl((bindValues && this.agentDetails && this.agentDetails[e.name]) || e.defaultValue || '', validators);
    });
    this.agentForm = this.fb.group(formFields, { updateOn: "change" });
    // this.agentForm.valueChanges.subscribe(value => {
    //   this.onUpdate.emit({ agentName: this.selectedAgent.key, ...value });
    // });
  }

  save() {
    let payload = { name: this.selectedAgent.key, type: this.agentType, config: { ...this.agentForm.value }};
    this.service.invoke('post.settings.outgoing', {streamId: this.streamId}, payload).subscribe(res=>{
      this.notificationService.notify(this.translate.instant("NOTIFY.SAVED"), 'success');
      if(this.agentType == 'chat') {
        this.serviceSettings.outgoingAgents.chatAgent = res.liveAgent.chatAgent;
        this.serviceSettings.updateOutGo$.next({type: 'chat', data: res.liveAgent.chatAgent});
      } else if(this.agentType == 'voice') {
        this.serviceSettings.outgoingAgents.voiceAgent = res.liveAgent.voiceAgent;
        this.serviceSettings.updateOutGo$.next({type: 'voice', data: res.liveAgent.voiceAgent});
      }
      this.service.invoke('get.deploy.status', {streamId: this.streamId})
        .subscribe(
          res=>{
            this.serviceSettings.outgoingSetupConfigured$.next(res.setup?.outgoing);
          }, 
          err => {
            this.serviceSettings.showError(err, this.translate.instant("SETTINGS.FAILED_FETCH_DP_STATUS"));
          }
        );

      this.closeS();
      this.dockService.publisAndHold();
    }, err => this.serviceSettings.showError(err, this.translate.instant("SETTINGS.FAILED_FETCH_SV_CHANNEL")));
  }

  ngOnDestroy() {
    this.openSubs.unsubscribe();
    this.closeSubs.unsubscribe();
  }

}
