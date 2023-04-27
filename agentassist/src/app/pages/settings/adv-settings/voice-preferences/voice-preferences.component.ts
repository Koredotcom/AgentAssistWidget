import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VoicePreferencesModel } from '../../settings.model';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { finalize } from 'rxjs/operators';
import { fadeInAnimation, fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
import { AuthService } from '@kore.services/auth.service';

declare const $: any;
@Component({
  selector: 'app-voice-preferences',
  templateUrl: './voice-preferences.component.html',
  styleUrls: ['./voice-preferences.component.scss'],
  animations: [fadeInOutAnimation, fadeInAnimation]
})
export class VoicePreferencesComponent implements OnInit {
  streamId: any;
  saveInProgress: boolean = false;
  showConfirmation: boolean = false;

  ttsPreferences: any[] = [];
  asrPreferences: any[] = [];
  voiceNames: any[] = [];
  ttsLanguages: any[] = [];
  selectedTTSLanguage: any;

  asrLanguages: any[] =[];
  selectedASRLanguage: any;
  dialects: any[] = [];
  selectedDialect: any;

  voiceDataURI: string = "";
  voicePreviewInProgress: boolean = false;

  isPlay: boolean = false;

  loading: boolean = true;
  selectedApp: any;
  voiceWelcomeMessage: string;
  previewText: string = '';

  @Input() voicePreferences: VoicePreferencesModel;
  @Output() closed = new EventEmitter();
  @ViewChild('audioPlayerRef') audioPlayerRef: ElementRef;
  constructor(
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private dockService: DockStatusService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;

    const voicePref = {
      "asrPreference": "",
      "ttsPreference": "",
      "voicePreference": ""
    }
    this.voicePreferences = $.extend(true, {}, voicePref, this.voicePreferences);

    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      this.ttsPreferences = res.deflectSeedData.ttsPreferences;
      this.asrPreferences = res.deflectSeedData.asrPreferences;
      this.ttsLanguages = this.ttsPreferences.find(f => f.ttsProvider === this.voicePreferences.ttsPreference)?.languages || [];
      this.selectedTTSLanguage = this.ttsLanguages.find(f => f.languagePreference === (this.voicePreferences.languagePreference || 'en'));
      this.voiceNames = this.selectedTTSLanguage?.voicePreferences.map(o => { return { name: o } }) || [];

      this.asrLanguages = this.asrPreferences.find(f => f.asrProvider === this.voicePreferences.asrPreference)?.languages || [];
      this.selectedASRLanguage = this.asrLanguages.find(f => f.languagePreference === (this.voicePreferences.languagePreference || 'en'));
      this.dialects = this.selectedASRLanguage?.dialects.map(o => { return { name: o } }) || [];
      this.selectedDialect = this.dialects.find(f => f.name === this.voicePreferences.dialectPreference)?.name;
    })

    this.getDafaultWelcomeMsg();
  }

  getDafaultWelcomeMsg() {
    this.selectedApp = this.workflowService.deflectApps();
    const _params = {
      'appId': this.authService.smartAssistBots.map(x=>x._id),
      'isAgentAssist':true
    }

    const _payload = {
      "experience": "voice",
      "type": "voice_welcome",
      "language": "en",
    }
    this.loading = true;
    this.service.invoke('get.default.messages', _params, _payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.voiceWelcomeMessage = res.voiceWelcomeMessage;
        this.previewText = this.voiceWelcomeMessage;
      }, err => {
        this.notificationService.notify(this.translate.instant('NOTIFY.DEFAULT_MSG_GET_ERROR'), "error");
      });
  }

  selectedSpeechPreferences(preference) {
    this.voicePreferences.asrPreference = preference.asrProvider;
    this.resetDialectPreference();
  }

  resetDialectPreference() {
    this.voicePreferences.dialectPreference = '';
    this.asrLanguages = this.asrPreferences.find(f => f.asrProvider === this.voicePreferences.asrPreference)?.languages || [];
    this.selectedASRLanguage = this.asrLanguages.find(f => f.languagePreference === (this.selectedTTSLanguage?.languagePreference || 'en'));
    this.dialects = this.selectedASRLanguage?.dialects.map(o => { return { name: o } }) || [];
    this.selectedDialect = this.dialects.find(f => f.name === this.voicePreferences.dialectPreference)?.name;
  }

  selectedVoicePreferences(ttsPreference) {
    this.voicePreferences.voicePreference = '';
    this.voicePreferences.ttsPreference = ttsPreference.ttsProvider;

    this.ttsLanguages = ttsPreference.languages || [];
    this.selectedTTSLanguage = this.ttsLanguages.find(f => f.languagePreference === this.selectedTTSLanguage.languagePreference) || this.ttsLanguages.find(f => f.languagePreference === 'en');
    this.voiceNames = this.ttsLanguages.find(f => f.languagePreference === this.selectedTTSLanguage.languagePreference)?.voicePreferences.map(o => { return { name: o } }) || [];
  }

  selectedVoiceLanguage(lang) {
    if (lang.languagePreference === this.selectedTTSLanguage.languagePreference) return;

    // dialog

    if (lang.languagePreference !== this.workflowService.getCurrentBt()?.defaultLanguage) {
      const botLanguage = this.ttsLanguages.find(f => f.languagePreference === this.workflowService.getCurrentBt()?.defaultLanguage)?.displayName || this.workflowService.getCurrentBt()?.defaultLanguage;
      const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
        width: '540px',
        panelClass: "delete-uc",
        data: {
          title: this.translate.instant('VOICE_LANG_WARNING_HEADER'),
          text: this.translate.instant('VOICE_LANG_WARNING_DESC', { currentBotLanguage: botLanguage }),
          buttons: [{ key: 'yes', label: this.translate.instant('SETTINGS.YES') }, { key: 'no', label: this.translate.instant('BUTTONS.NO_IDONT') }]
        }
      });

      dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'yes') {
            dialogRef.close();
            this.changeVoiceLang(lang);
          } else if (result === 'no') {
            dialogRef.close();
          }
        });
    } else {
      this.changeVoiceLang(lang);
    }

  }

  changeVoiceLang(lang) {
    this.voicePreferences.voicePreference = '';
    this.selectedTTSLanguage = lang;
    this.voiceNames = this.selectedTTSLanguage.voicePreferences.map(o => { return { name: o } }) || [];
    this.previewText = this.selectedTTSLanguage.languagePreference === this.voicePreferences.languagePreference ? this.voiceWelcomeMessage : '';

    this.resetDialectPreference();
  }

  selectedVoiceNamePreferences(voicename) {
    this.voicePreferences.voicePreference = voicename.name;
    // this.voiceNames.forEach(v=>{
    //   if(v.name === voicename.name) {
    //     v.isPlaying = true;
    //   }
    // })
    setTimeout(() => {
      const ele = $('#speechSampleInput');
      if (!ele || !ele[0]) return;
      ele[0].focus();
      if (ele[0].value.trim()) {
        voicename.isActive = !voicename.isActive;
        if(voicename.isActive){
          this.isPlay = true;
        }
        else if(!voicename.isActive){
          this.isPlay = false;
        }
        this.onPreviewVoice(ele[0].value)
      }
    });
  }

  onPreviewVoice(previewText: string) {
    let _params: any = { streamId: this.streamId }

    let _payload = {
      "ttsPreference": this.voicePreferences.ttsPreference,
      "previewText": previewText,
      "voicePreference": this.voicePreferences.voicePreference,
      "languagePreference": this.selectedTTSLanguage.languagePreference
    }
    this.voicePreviewInProgress = true;
    this.service.invoke('post.previewVoice', _params, _payload)
      .pipe(finalize(() => this.voicePreviewInProgress = false))
      .subscribe(res => {
        this.voiceDataURI = res.previewVoice;
        setTimeout(() => {
          if(this.isPlay){
            this.audioPlayerRef.nativeElement.play();
          }
          else if(!this.isPlay){
            this.audioPlayerRef.nativeElement.pause();
          }
        })
      }, err => {
        this.notificationService.notify(this.translate.instant('NOTIFY.UNABLE_TO_FETCH_AUDIO'), "error");
      })
  }

  configureVoicePreferenaces() {
    let _params: any = { streamId:this.authService.smartAssistBots.map(x=>x._id),'isAgentAssist':true };
    // if (!this.voicePreferences?.voicePreference) {
    //   this.notificationService.notify(this.translate.instant('SELECT_VOICE_NAME'), 'warning');
    //   return;
    // }
    this.saveInProgress = true;
    this.voicePreferences.languagePreference = this.selectedTTSLanguage.languagePreference;
    this.voicePreferences.dialectPreference = this.selectedDialect;
    this.service.invoke('post.settings.voicePreferences', _params, this.voicePreferences)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.notificationService.notify(this.translate.instant('NOTIFY.CONFIGURED_SUCCESSFULLY'), "success");
        this.close(this.voicePreferences);
        this.dockService.publisAndHold();
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.VOICE_PREFERENACES_CONFIGURE_ERROR'))
      })
  }

  navigateToNuance() {
    window.open('https://www.nuance.com/omni-channel-customer-engagement/voice-and-ivr/text-to-speech.html');
  }

  close(data?: any) {
    this.closed.emit(data);
  }

}
