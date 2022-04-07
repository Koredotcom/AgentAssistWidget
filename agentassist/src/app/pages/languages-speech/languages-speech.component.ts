import { Component, OnInit } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { AgentSettingsService } from '../agent-settings/agent-settings.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-languages-speech',
  templateUrl: './languages-speech.component.html',
  styleUrls: ['./languages-speech.component.scss']
})
export class LanguagesSpeechComponent implements OnInit {
  languages: string = "";
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private agentSettingsService: AgentSettingsService
  ) { }

  ngOnInit(): void {
  }

  getLanguages() {
    const params = {};
    this.service.invoke('get.agentLangSettings', params).subscribe(res => {
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
}
