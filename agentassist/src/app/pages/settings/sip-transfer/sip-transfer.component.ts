import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ASSETS } from '../../channels/channels.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { workflowService } from '@kore.services/workflow.service';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { NotificationService } from '@kore.services/notification.service';

import * as _ from 'underscore';
import { SIPConfig, SIPPayload } from '../settings.model';
import { TranslateService } from '@ngx-translate/core';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-sip-transfer',
  templateUrl: './sip-transfer.component.html',
  styleUrls: ['./sip-transfer.component.scss']
})
export class SipTransferComponent implements OnInit, OnChanges {

  assets = ASSETS;
  sipForm: FormGroup;
  streamId: string;
  deflectSeedData: any;
  sipData: SIPConfig;

  @Output() close = new EventEmitter();
  @Output() updateSIP = new EventEmitter<SIPPayload>();
  @Input() configDetails: any;
  @Input() isEmitOnly: boolean;

  @ViewChild('sipSlider') sipSlider: SliderComponentComponent;
  constructor(public workflowService:workflowService,
            private service:ServiceInvokerService,
            private notificationService: NotificationService,
            private translate: TranslateService,
            private dockService: DockStatusService
            ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.sipForm = new FormGroup({
      "sipTransferId": new FormControl(null, Validators.required),
      "additionalContext": new FormArray([]),
      "userToUser": new FormGroup({
        "enabled": new FormControl(false),
        "payload": new FormControl(null)
      })
    });
    this.workflowService.seedData$.subscribe(res =>{
      if(res) {
        // res.deflectSeedData.supportedLiveAgents.voiceAgents.push({
        //   "key": "sipTransfer",
        //   "iconPath": "/agents/custom.svg",
        //   "defaultData": {
        //     "additionalContext": [
        //       {
        //         "enabled": true,
        //         "name": "Intent",
        //         "value": "Context.IntentName"
        //       },
        //       {
        //         "enabled": true,
        //         "name": "Chat URL",
        //         "value": "www.abc.com"
        //       }
        //     ],
        //     "userToUser": {
        //       "enabled": false,
        //       "payload": "%7B%0A%20%20%22Intent%22%3A%20context.IntentName%2C%0A%20%20%22Chat%20URL%22%3A%20%22www.abc.com%22%0A%7D"
        //     }
        //   }
        // });
        const self = this;
        if(_.isEmpty(this.sipData)) {
          const sipSeed: SIPConfig = _.findWhere(res.deflectSeedData.supportedLiveAgents.voiceAgents, {key: 'sipTransfer'}).defaultData;
          sipSeed.additionalContext.forEach(val => {
            const add = new FormGroup({
              "name": new FormControl(val.name),
              "value": new FormControl(val.value),
              "enabled": new FormControl(val.enabled)
            });
            (<FormArray>self.sipForm.get('additionalContext')).push(add);
          });
          self.sipForm.get('userToUser').patchValue({
            enabled: sipSeed.userToUser.enabled,
            payload: decodeURIComponent(sipSeed.userToUser.payload)
          });
        } else {
          this.sipData.additionalContext.forEach(val => {
            const add = new FormGroup({
              "name": new FormControl(val.name),
              "value": new FormControl(val.value),
              "enabled": new FormControl(val.enabled)
            });
            (<FormArray>self.sipForm.get('additionalContext')).push(add);
          });
          self.sipForm.get('userToUser').patchValue({
            enabled: this.sipData.userToUser.enabled,
            payload: decodeURIComponent(this.sipData.userToUser.payload)
          });
          self.sipForm.get('sipTransferId').patchValue(self.sipData.sipTransferId);
        }
      } 
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.sipData = changes.configDetails.currentValue.config;
    } catch (e) {
      console.log(e);
    }
  }


  onChangeInterface() {

  }

  deleteContext(index: number) {
    (<FormArray>this.sipForm.controls.additionalContext).removeAt(index);
  }

  onAddHeader() {
    const h = new FormGroup({
      "name": new FormControl(null),
      "value": new FormControl(null),
      "enabled": new FormControl(false)
    });
    (<FormArray>this.sipForm.get('additionalContext')).push(h);
  }

  closeSlider() {
    this.close.emit();
  }
  
  onSave() {
    this.sipForm.get('userToUser').patchValue(encodeURIComponent(this.sipForm.get('userToUser').value.payload));
    const payload: SIPPayload = {
      type: 'voice',
      name: 'sipTransfer',
      config: this.sipForm.value
    };

    if (this.isEmitOnly) {
      this.updateSIP.emit(payload);
      this.closeSlider();
      return;
    }

    this.service.invoke('post.settings.outgoing', {streamId: this.streamId}, payload).subscribe(res => {
      this.notificationService.notify(this.translate.instant("NAV.CONVERSATIONAL_LOGS"), 'success');
      this.updateSIP.emit(payload);
      setTimeout(() => {
        this.closeSlider();
      }, 100);
      this.dockService.publisAndHold();
    }, err => {
      this.workflowService.showError(err, this.translate.instant("NAV.CONVERSATIONAL_LOGS"));
    });
  }

  closeSIPSlider() {
    this.sipSlider.closeSlider('#sipSlider');
  }

  openSIPSlider() {
    this.sipSlider.openSlider('#sipSlider', 'width940')
  }

}
