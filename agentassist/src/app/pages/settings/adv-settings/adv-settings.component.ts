import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { VoicePreferencesModel } from '../settings.model';
import { SettingsService } from '../setttings.service';
import { combineLatest, concat, of, Subject, Subscription } from 'rxjs';
import { AgentSettingsService } from '../../agent-settings/agent-settings.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';
import { SubSink } from 'subsink';
import { AuthService } from '@kore.services/auth.service';
@Component({
  selector: 'app-adv-settings',
  templateUrl: './adv-settings.component.html',
  styleUrls: ['./adv-settings.component.scss']
})
export class AdvSettingsComponent implements OnInit, OnDestroy {

  streamId: any;
  loading: boolean = false;
  voicePreferences: VoicePreferencesModel;
  showVPSlider: boolean = false;

  incomingSetupConfigured: boolean = true;
  enableVoicePreview: boolean = true;
  destroyed$ = new Subject();

  languages: string = "";
  showLangSlider: boolean = false;

  showPhHoldAudio = false;
  showVoicePreferences:boolean = false;

  subs = new SubSink();
  voiceListSub: Subscription;

  @ViewChild('vpSlider', { static: true }) vpSlider: SliderComponentComponent;
  @ViewChild('langSlider', { static: true }) langSlider: SliderComponentComponent;
  @ViewChild('phHoldAudioSliderSlider', { static: true }) phHoldAudioSliderSlider: SliderComponentComponent;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private settingsService: SettingsService,
    private agentSettingsService: AgentSettingsService,
    private translate: TranslateService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.voicePreferences = {
      "asrPreference": "",
      "ttsPreference": "",
      "voicePreference": ""
    }

    //console.log(this.authService.smartAssistBots.map(x=>x.channels.length),"oiuytrertyuiop");
    // combineLatest([this.settingsService.incomingSetupConfigured$, this.settingsService.enableVoicePreview$,])
    //   .pipe(
    //     takeUntil(this.destroyed$)
    //   )
    //   .subscribe(res => {
    //     this.incomingSetupConfigured = res[0];
    //     this.enableVoicePreview = res[1];
    //     if (res[0] && res[1] && !this.voicePreferences.asrPreference) {
    //       this.getAdvSettings();
    //     }
    //   });
    this.subs.sink = this.settingsService.enableVoicePreview$.subscribe(flag=> this.enableVoicePreview = flag);
    
    const permissions = this.authService.getSelectedAccount()?.permissions;
    const isDeveloper = this.authService.getSelectedAccount()?.isDeveloper;  
    if (permissions.find(f => f === 'admin' || isDeveloper)) {
      this.getAdvSettings();
    }

    this.getLanguages();
  }

  getAdvSettings() {
    const params = {
      // instanceId: this.instanceAppDetails._id,
      instanceId:this.authService.smartAssistBots.map(x=>x._id),
       'isAgentAssist':true
     }
     let channelList;
     if (this.voiceListSub) this.voiceListSub.unsubscribe();
     this.voiceListSub = this.service.invoke('get.voiceList', params, 's').subscribe(voiceList => {
       channelList = voiceList;
       if(channelList.sipTransfers.length > 0){
         this.showVoicePreferences = true;
         const _params = { streamId:this.authService.smartAssistBots.map(x=>x._id),
                         'isAgentAssist':true }
         this.loading = true;
         this.subs.sink = this.service.invoke('get.settings.voicePreferences', _params)
         .pipe(finalize(() => this.loading = false))
         .subscribe(res => {
           this.voicePreferences = res;
         }, err => {
           this.notificationService.showError(err, 'Failed to fetch voice preferences')
         })
       }
       else{
        this.showVoicePreferences = false;
       }
      })
    } 

  getLanguages() {
    const params = {};
    this.subs.sink = this.service.invoke('get.agentLangSettings', params).subscribe(res => {
      if (res && res.length) {
        this.agentSettingsService.setAgentLanguages(res[0].languages);
        this.bindLanguages();
      }
    }, err => {
      this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
    });
  }


  bindLanguages() {
    this.languages = _.map(this.agentSettingsService.getAgentLanguages(), "label").join(", ");
  }

  closeVPSlider($event) {
    this.showVPSlider = false;
    this.vpSlider.closeSlider("#voicePreferenace");

    if ($event) { this.voicePreferences = $event }
  }
  
  openVPSlider() {
    if(this.showVoicePreferences==false){
      this.showVPSlider = false;
    }
    if (this.incomingSetupConfigured) {
      this.vpSlider.openSlider("#voicePreferenace", "width940");
      this.showVPSlider = true;
    }
  }

  openLangSlider() {
    this.showLangSlider = true;
    this.langSlider.openSlider("#langSlider", "width940");
  }

  closeLangSlider() {
    this.langSlider.closeSlider("#langSlider");
    this.showLangSlider = false;
    this.getLanguages();
  }

  openPhHoldAudio() {
    this.phHoldAudioSliderSlider.openSlider("#phHoldAudio", "width940");
    this.showPhHoldAudio = true;
  }

  closePhHoldAudioSlider($event) {
    this.showPhHoldAudio = false;
    this.phHoldAudioSliderSlider.closeSlider("#phHoldAudio");
  }


  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.subs.unsubscribe();
  }
}
