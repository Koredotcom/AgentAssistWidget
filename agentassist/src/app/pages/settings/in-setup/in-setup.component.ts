import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { finalize } from 'rxjs/operators';
import { DEFLECT_CONFIG } from 'src/app/data/configurations.mock';
import { DeflectAppConfig } from 'src/app/data/configurations.model';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { workflowService } from '@kore.services/workflow.service';
import { IncomingSetupModel, IncomingSetupData } from '../settings.model';
import { NotificationService } from '@kore.services/notification.service';
import { SettingsService } from '../setttings.service';
import { fadeInOutAnimation, fadeInAnimation } from 'src/app/helpers/animations/animations';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MixPanelWrapper } from 'src/app/helpers/mixpanel';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
@Component({
  selector: 'app-in-setup',
  templateUrl: './in-setup.component.html',
  styleUrls: ['./in-setup.component.scss'],
  animations: [fadeInOutAnimation, fadeInAnimation]
})
export class InSetupComponent implements OnInit {

  selectedApp: any;
  config: DeflectAppConfig;

  incomingSetup: IncomingSetupModel;

  phoneNumber: any;
  removingPhonenumber: boolean = false;
  isConfigured: boolean = true;
  ivrData: any;
  loading: boolean = true;
  showRPublish: boolean = false;
  showIncomingPhNumberSlider: boolean = false;
  showIncomingIVRSlider: boolean = false;
  showOutgoingAgentSlider: boolean = false;
  @ViewChild('incomingPhNumberSlider', { static: true }) incomingPhNumberSlider: SliderComponentComponent;
  @ViewChild('incomingIVRSlider', { static: true }) incomingIVRSlider: SliderComponentComponent;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private mixPanel: MixPanelWrapper,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.deflectApps();
    // this.getConfigurations();
    this.incomingSetup = $.extend(true, {}, IncomingSetupData);
    this.getIncomingSetupDetails();
  }

  getConfigurations() {
    const _params = {
      'appId': this.workflowService.getCurrentBt()._id
    }
    this.service.invoke('get.configuration', _params)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: DeflectAppConfig) => {
        this.config = $.extend(true, {}, DEFLECT_CONFIG, res);
        this.isConfigured = this.config.deflectConfiguration.type === 'phoneNumber'
        this.phoneNumber = this.config.deflectConfiguration.phoneNumberConfigDetails.phoneNumber;
        this.ivrData = {
          ...this.config.deflectConfiguration.sipDomainConfigDetails,
          voiceChanel: this.config.deflectConfiguration.voiceChannel,
          previewVoiceEnabled: this.config.deflectConfiguration.previewVoiceEnabled,
          asrPreference: this.config.deflectConfiguration.asrPreference,
          ttsPreference: this.config.deflectConfiguration.ttsPreference,
          voicePreference: this.config.deflectConfiguration.voicePreference,
        }
      })
  }


  openPhSlider() {
    this.incomingPhNumberSlider.openSlider("#incomingPhNumber", "width940");
    this.showIncomingPhNumberSlider = true;
  }

  closePhSlider($event) {
    this.showIncomingPhNumberSlider = false;
    this.incomingPhNumberSlider.closeSlider("#incomingPhNumber");

    if ($event) {
      // this.incomingSetup.phoneNumberConfigDetails = $event;
      this.getIncomingSetupDetails();
    }
  }

  openIVRSlider() {
    this.incomingIVRSlider.openSlider("#incomingIVR", "width940");
    this.showIncomingIVRSlider = true;
  }

  closeIVRSlider(refresh?: boolean) {
    this.showIncomingIVRSlider = false;
    this.incomingIVRSlider.closeSlider("#incomingIVR");
    if (refresh) this.getIncomingSetupDetails();
  }


  getIncomingSetupDetails() {
    const _params = { streamId: this.workflowService.getCurrentBt()._id }
    this.loading = true;
    this.service.invoke('get.incoming', _params)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.incomingSetup = $.extend(true, {}, IncomingSetupData, res);
        this.phoneNumber = this.incomingSetup.phoneNumberConfigDetails.phoneNumber;
        this.ivrData = this.incomingSetup.sipDomainConfigDetails;

        this.isConfigured = !!((this.incomingSetup.type === 'phoneNumber' && this.incomingSetup.phoneNumberConfigDetails.phoneNumber) || (this.incomingSetup.type === 'IVR' && this.incomingSetup.sipDomainConfigDetails.didNumber.length > 0))
        this.settingsService.incomingSetupConfigured$.next(this.isConfigured);
        if (this.incomingSetup.voiceChannel === 'audiocodes') {
          this.settingsService.enableVoicePreview$.next(true);
        } else {
          this.settingsService.enableVoicePreview$.next(false);
        }

      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.IN_SETUP_GET_FAILED'))
      })
  }


  removePhoneNumber() {
    if (!this.phoneNumber) return this.openIVRSlider();
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '540px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant('SETTINGS.PH_SWITCH_ALREAT_HEADER'),
        text: this.translate.instant('SETTINGS.PH_SWITCH_ALREAT_DESC'),
        buttons: [{ key: 'yes', label: this.translate.instant('BUTTONS.CONFIRM'), type: 'danger' }, { key: 'no', label: this.translate.instant('BUTTONS.CANCEL') }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const _params = { streamId: this.workflowService.getCurrentBt()._id }
          const _payload = {
            phoneNumber: this.phoneNumber
          }
          // this.removingPhonenumber = true;
          // this.service.invoke('remove.phonenumber', _params, _payload)
          //   .pipe((finalize(() => this.removingPhonenumber = false)))
          //   .subscribe(res => {
          //     this.notificationService.notify('Phone number removed Successfully!', "success");
          //     this.getIncomingSetupDetails();
          //     this.openIVRSlider();
          //     this.mixPanel.removedInSetUp();
          //   }, err => {
          //     this.notificationService.showError(err, 'Failed to remove phone number')

          //   });
          this.openIVRSlider()
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

}
