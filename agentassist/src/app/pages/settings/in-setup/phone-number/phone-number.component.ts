import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { workflowService } from '@kore.services/workflow.service';
import { debounceTime, distinctUntilChanged, finalize, flatMap } from 'rxjs/operators';
import { NotificationService } from '@kore.services/notification.service';
import { SettingsService } from '../../setttings.service';
import { BotAddressModel, ConfiguredAddressModel } from '../../settings.model';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MixPanelWrapper } from 'src/app/helpers/mixpanel';
import { TranslateService } from '@ngx-translate/core';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { Subject } from 'rxjs';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AppService } from '@kore.services/app.service';
import { VoiceChannelDataSharingService } from '@kore.services/voice-channel-data-sharing.service';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  animations: [fadeInOutAnimation]
})
export class PhoneNumberComponent implements OnInit {


  isConfigured: boolean = false;
  showGetNumberSlide: boolean = false;
  showTypes: boolean = true;
  loading: boolean = false;
  selectedApp: any;
  saveInProgress: boolean = false;

  selectedCountry: any;
  countryCodeDetailsFromSeedData: any;
  selectedStateCode: any;
  stateCodes: any[] = [];
  phoneNumberType: 'local' | 'tollFree' = 'local';
  enablingInProgess: boolean = false;
  phoneNumbers: any[] = [];
  phoneNumber: string;
  _id: string = '';

  countriesList: any[] = [];
  botAddress: BotAddressModel;
  selectedCountryAddress: any;

  configuredAddress: ConfiguredAddressModel;

  suggestedAddress: BotAddressModel;
  showAddress: boolean = false;
  isValidating: boolean = false;
  showAddressInfo1: boolean = true;
  showAddressInfo2: boolean = false;
  showAddressError: boolean = false;
  showAddressSuggestion: boolean = false;

  showCountrySearchDropdown: boolean = false;
  showStateSearchDropdown: boolean = false;
  showCountryAddressDropdown: boolean = false;

  planType: string;
  isNoBalanceAvailable: boolean = true;
  areaCode: number;
  areaCodeSearchTerm$ = new Subject();
  pricingData: any;
  authInfo: any;
  customerSupport: boolean = false;
  instanceAppDetails;
  isUpdatePhoneNum: boolean = false;

  streamId: string;

  @Input() selectedPhonenumber; any;
  @Input() phoneNumberConfigDetails: any;
  @Output() closed = new EventEmitter();
  @Output() purchasedNewNum = new EventEmitter();
  @Output() removeNumFromChannel = new EventEmitter();
  showGetPhNumberSlider: boolean = false;
  @ViewChild('getPhNumberSlider', { static: true }) getPhNumberSlider: SliderComponentComponent;
  @ViewChild('countryCodeSearchTerm') countryCodeSearchTermEle: ElementRef;
  @ViewChild('countryName') countryNameEle: ElementRef;
  @ViewChild('stateCodeSearchTerm') stateCodeSearchTermEle: ElementRef;
  constructor(
    public voiceService: VoiceChannelDataSharingService,
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    public settingsService: SettingsService,
    private dialog: MatDialog,
    private eRef: ElementRef,
    private mixPanel: MixPanelWrapper,
    public translate: TranslateService,
    public localStore: LocalStoreService,
    private dockStatusService: DockStatusService
  ) { }

  ngOnInit(): void {
    this.streamId =  this.workflowService.getCurrentBt()._id;;
    this.authInfo = this.localStore.getAuthInfo();
    this.planType = this.workflowService.planDetails?.planType || 'Free';
    this.isNoBalanceAvailable = this.workflowService.planDetails?.creditsLeft <= 0;
    this.resetAddressFields();
    this.instanceAppDetails = this.voiceService.instantAppData();

    this.phoneNumber = this.selectedPhonenumber && this.selectedPhonenumber.phoneNumber;
    if(this.selectedPhonenumber.phoneNumber !== '') {
      this._id = this.selectedPhonenumber._id;
      this.isUpdatePhoneNum = true;
    }
    this.selectedApp = this.workflowService.deflectApps();
    if (!this.settingsService.countriesList$.value.length) {
      this.getCountriesList()
    } else {
      this.countriesList = this.settingsService.countriesList$.value;
      this._setDetails(this.selectedPhonenumber.countryCode || 'US');
    }

    if (this.selectedPhonenumber?.addressSid) {
      this.showAddress = true;
      this.getBotAddress();
    }

    this.areaCodeSearchTerm$.pipe(
      debounceTime(500),
    ).subscribe(() => this.getPhoneNumbers())
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.stateCodeSearchTermEle && this.stateCodeSearchTermEle.nativeElement.contains(event.target)) {
      this.showStateSearchDropdown = true;
    } else {
      this.showStateSearchDropdown = false;
    }

    if (this.countryCodeSearchTermEle && this.countryCodeSearchTermEle.nativeElement.contains(event.target)) {
      this.showCountrySearchDropdown = true;
    } else {
      this.showCountrySearchDropdown = false;
    }

    if (this.countryNameEle && this.countryNameEle.nativeElement.contains(event.target)) {
      this.showCountryAddressDropdown = true;
    } else {
      this.showCountryAddressDropdown = false;
    }
  }

  close(data?: any) {
    this.closed.emit(data);
  }

  openGetPhNumberSlider() {
    this.showGetNumberSlide = true;
    this.showGetPhNumberSlider = true;
  }

  closeGetPhNumberSlider() {
    this.showGetPhNumberSlider = false;
  }

  onClickCountryCode(item) {
    this.showTypes = item.types.length > 1;
    this.selectedCountry = item;
    this._setDetails(this.selectedCountry.countryCode)
  }

  onClickStateCode(state) {
    this.selectedStateCode = state;
    this.getPhoneNumbers()
  }

  onClickGetNumber(data: any) {
    if (this.customerSupport) {
      this.onContactSupport(data);
      return;
    }
    if (this.selectedPhonenumber && this.selectedPhonenumber.phoneNumber === data.phoneNumber) {
      this.showGetNumberSlide = false;
    } else {
      this.selectedPhonenumber = data;
      this.showGetNumberSlide = false;
      this.resetAddressFields();

      // Pre-fill country name
      this.selectedCountryAddress = this.countriesList.find(f => f.countryCode === data.isoCountry);
      this.botAddress.country = this.selectedCountryAddress.country;
    }
  }

  onClickCancel() {
    this.phoneNumbers.map(e => {
      e.showConfirmation = false;
      return e;
    })
  }

  enableIntegration(data?: any) {
    this.enablingInProgess = true;
    const _params = {
      'appId': this.streamId
    }
    const _payload = {
      "integrationType": "phoneNumberTransfer",
      "countryCode": this.selectedCountry['countryCode'],
      "phoneNumber": data?.number,
      "stateCode": data?.stateCode
    }
    this.service.invoke('enable.ivr.configuration', _params, _payload)
      .pipe(finalize(() => this.enablingInProgess = false))
      .subscribe(
        res => {
          // this.closed.emit({ phoneNumber: data.number })
          res.channels.forEach(value => {
            if (value.type === "audiocodes") {
              this.selectedPhonenumber = value.phoneNumberConfigDetails.phoneNumber;
            }
          });
        },
        errRes => {
          this.notificationService.notify(this.translate.instant('NOTIFY.ENABLE_PHONE_NUMBER_FAILED'), 'error');
        }
      );
  }

  changePhoneNumber() {
    this.showGetNumberSlide = true;
  }

  removePhoneNumber() {
    if (!this.phoneNumber) return this.selectedPhonenumber = null;
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '446px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant('NOTIFY.ARE_YOU_SURE'),
        text: this.translate.instant('SETTINGS.PH_SWITCH_ALREAT_HEADER'),
        buttons: [{ key: 'yes', label: this.translate.instant('BUTTONS.CONFIRM'), type: 'danger' }, { key: 'no', label: this.translate.instant('BUTTONS.CANCEL') }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          // const _params = { streamId: this.streamId }x`
          // const _payload = {
          //   phoneNumber: this.phoneNumber || this.selectedPhonenumber.phoneNumber
          // }

          const params = {
            instanceId: this.instanceAppDetails._id
          }

          const payload = {
            "type": "phoneNumber",
            "_id": this.selectedPhonenumber._id,
            "callFlowDetails": this.selectedPhonenumber.callFlowDetails
          }

          this.service.invoke('delete.voiceNum', params, payload)
            .subscribe(res => {
              this.dockStatusService.publisAndHold();
              this.notificationService.notify(this.translate.instant('NOTIFY.PH_REMOVED_SUCCESS'), "success");
              this.selectedPhonenumber = null;
              this.removeNumFromChannel.emit(true);
              this.close(true);
              this.mixPanel.removedInSetUp();

            }, err => {
              this.notificationService.showError(err, this.translate.instant('NOTIFY.PH_REMOVE_ERROR'))

            });
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  getCountriesList() {
    const _params = { streamId: this.streamId }
    this.service.invoke('get.phonenumber.countries', _params).subscribe(res => {
      this.settingsService.countriesList$.next(res);
      this.countriesList = res;
      this._setDetails('US');
    }, err => {
      this.notificationService.showError(err, this.translate.instant('NOTIFY.COUNTRIES_GET_FAILED'))
    })
  }

  getPhoneNumbers() {
    if (this.loading) return;
    const _params = { streamId: this.streamId }
    const _payload = {
      countryCode: this.selectedCountry.countryCode,
      type: this.phoneNumberType,
      stateCode: this.selectedStateCode?.stateCode || ''
    }

    if (this.selectedCountry.countryCode === 'US') {
      _payload['areaCode'] = this.areaCode || '';
    }
    this.loading = true;
    this.pricingData = null;

    this.service.invoke('get.country.phonenumbers', _params, _payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.phoneNumbers = res.numbers || res; // fallback  
        this.pricingData = res.pricingData;
        this.customerSupport = res.customerSupport;
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.PH_GET_ERROR'))
      })
  }


  _setDetails(countryCode) {
    this.selectedCountry = this.countriesList.find(f => f.countryCode === countryCode);
    this.stateCodes = [];
    this.phoneNumberType = this.selectedCountry?.types.find(f => f === 'local') || this.selectedCountry?.types[0];
    const stateCodesObj = this.selectedCountry.states;
    if (stateCodesObj) {
      Object.keys(stateCodesObj).forEach(k => {
        this.stateCodes.push({
          stateCode: k,
          stateName: stateCodesObj[k]
        })
      })
    }
    this.selectedStateCode = this.stateCodes[0];
    this.getPhoneNumbers();
  }

  getBotAddress() {
    const _params = { streamId: this.streamId }
    const _payload = { phoneNumber: this.selectedPhonenumber.phoneNumber }
    this.service.invoke('get.bot.address', _params, _payload).subscribe(res => {
      this.botAddress = res;
    }, err => {
      this.notificationService.showError(err, this.translate.instant('NOTIFY.BOT_ADDRESS_GET_ERROR'))

    })
  }

  isAddressFilled() {
    return this.botAddress?.customerName && this.botAddress?.street && this.botAddress?.region && this.botAddress?.postalCode && this.botAddress?.city && this.botAddress?.country;
  }

  validateAddress() {
    const country = this.countriesList.find(f => f.country === this.botAddress.country);
    const _payload = {
      ...this.botAddress,
      isoCountry: country && country.countryCode
    }

    this.isValidating = true;
    this.service.invoke('post.configure.address', {}, _payload)
      .pipe(finalize(() => this.isValidating = false))
      .subscribe(res => {
        this.botAddress['sid'] = res.address.sid;
        this.showAddressError = false;
        this.showAddressSuggestion = false;
        this.showAddress = true;
      }, err => {
        try {
          if (err.error.errors[0].code === 628) {
            this.showAddressError = true;
          } else if (err.error.errors[0].code === 629) {
            let address = {};
            err.error.errors[0].msg.split('|')[1].split(',').forEach(e => address = { ...address, [e.split(':')[0].trim()]: e.split(':')[1].trim() });
            this.suggestedAddress = {
              "customerName": address['CustomerName'],
              "street": address['Street'],
              "city": address['Locality'],
              "region": address['Region'],
              "country": _payload.country,
              "postalCode": address['PostalCode'],
              "isoCountry": address['isoCountry']
            }

            this.showAddressSuggestion = true;
          } else {
            this.notificationService.showError(err, this.translate.instant('NOTIFY.BOT_ADDRESS_CONFGURE_ERR'));
          }

        } catch (e) {
          this.notificationService.showError(err, this.translate.instant('NOTIFY.BOT_ADDRESS_CONFGURE_ERR'));
        }
      })
  }

  onClickAddressInfo(infoNumber) {
    if (infoNumber === 1) {
      this.showAddressInfo1 = false;
      this.showAddressInfo2 = true;
    } else {
      this.showAddressInfo2 = false;
    }
  }

  onSelecteSuggestAddress() {
    this.botAddress = this.suggestedAddress;
    // this.showAddress = true;
    this.showAddressSuggestion = false;
  }


  resetAddressFields() {
    this.botAddress = {
      "customerName": "",
      "street": "",
      "city": "",
      "region": "",
      "country": "",
      "postalCode": ""
    };

    this.configuredAddress = {
      validated: false,
      verified: false,
      sid: "",
      city: "",
      customerName: "",
      dateCreated: "",
      isoCountry: "",
      postalCode: "",
      region: ""
    };
    this.suggestedAddress = null;
    this.showAddress = false;
    this.isValidating = false;
    this.showAddressInfo1 = true;
    this.showAddressInfo2 = false;
    this.showAddressError = false;
    this.showAddressSuggestion = false;
  }

  configureIncomingSetup() {
    const _params = { streamId: this.streamId }
    const _payload = {
      "type": "phoneNumber",
      "phoneNumberConfigDetails": {
        "phoneNumber": this.selectedPhonenumber.phoneNumber,
        "countryCode": this.selectedCountry.countryCode,
        "phoneNumberType": this.phoneNumberType,
        "price": this.pricingData?.monthly_charges?.current_price,
        "inbound_price": this.pricingData?.operational_charges?.current_price,
        "currencyType": this.pricingData?.monthly_charges?.priceUnit,
        "addressSid": this.botAddress['sid']
      },
      "languagePreference": "en_US",
      "isSetUpCompleted": true
    }

    this.saveInProgress = true;

    this.service.invoke('post.incoming', _params, _payload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.showGetNumberSlide = false;
        this.settingsService.incomingSetupConfigured$.next(true);
        this.notificationService.notify(this.translate.instant('NOTIFY.CONFIGURED_SUCCESSFULLY'), "success");
        this.close(this.selectedPhonenumber);
        this.mixPanel.configuredInSetup();
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.BOT_ADDRESS_CONFGURE_ERR'))

      })
  }

  setupIncomingConfiguration() {
    const params = {
      instanceId : this.instanceAppDetails._id
    }
    this.saveInProgress = true;
    if(!this.isUpdatePhoneNum) {
      const payload = {
        "type": "phoneNumber",
        "settings": {
          "phoneNumber": this.selectedPhonenumber.phoneNumber,
          "countryCode": this.selectedCountry.countryCode,
          "phoneNumberType": this.phoneNumberType,
          "price": this.pricingData?.monthly_charges?.current_price,
          "inbound_price": this.pricingData?.operational_charges?.current_price,
          "currencyType": this.pricingData?.monthly_charges?.priceUnit,
        }
      }
      this.service.invoke('post.voiceType', params,  payload)
      .subscribe(res => {
        this.dockStatusService.publisAndHold();
        this.saveInProgress = false;
        this.showGetNumberSlide = false;
        this.purchasedNewNum.emit(true);
        this.notificationService.notify(this.translate.instant('NOTIFY.CONFIGURED_SUCCESSFULLY'), "success");
        this.close(this.selectedPhonenumber);
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.BOT_ADDRESS_CONFGURE_ERR'))
      });
    } else {
      const payload = {
        "type": "phoneNumber",
        "settings": {
          "_id": this._id,
          "trunkName": '',
          "phoneNumber": this.selectedPhonenumber.phoneNumber,
          "countryCode": this.selectedCountry.countryCode,
          "phoneNumberType": this.phoneNumberType,
          "price": this.pricingData?.monthly_charges?.current_price,
          "inbound_price": this.pricingData?.operational_charges?.current_price,
          "currencyType": this.pricingData?.monthly_charges?.priceUnit,
          "callFlowDetails": this.selectedPhonenumber.callFlowDetails
        }
      }
      this.service.invoke('post.voiceType', params,  payload)
      .subscribe(res => {
        this.dockStatusService.publisAndHold();
        this.saveInProgress = false;
        this.showGetNumberSlide = false;
        this.isUpdatePhoneNum = false;
        this.purchasedNewNum.emit(true);
        this.notificationService.notify(this.translate.instant('NOTIFY.CONFIGURED_SUCCESSFULLY'), "success");
        this.close(this.selectedPhonenumber);
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.BOT_ADDRESS_CONFGURE_ERR'))
      });
    }
  }


  isFlagAvailable(countryCode: string = '') {
    if (!countryCode) return;
    return !!this.settingsService.availableCountryFlags.find(f => f === countryCode.toLocaleLowerCase())
  }

  onContactSupport(selectedPhonenumber) {
    const emailTo = 'Support@kore.com';
    const emailSub = "Request raise for buying phone number " + selectedPhonenumber.phoneNumber;
    const emailBody = `Hello Support team kore.ai,

      I would like to buy the below number for mentioned country.
      Phone Number :  ${selectedPhonenumber.phoneNumber}
      Phone Number type : ${this.phoneNumberType}
      Country : ${this.selectedCountry?.country}

      Regards,
      ${this.authInfo.currentAccount.userInfo.fName}
    `;
    window.open("mailto:" + emailTo + '?subject=' + encodeURIComponent(emailSub) + '&body=' + encodeURIComponent(emailBody), "_self");
  }

}
