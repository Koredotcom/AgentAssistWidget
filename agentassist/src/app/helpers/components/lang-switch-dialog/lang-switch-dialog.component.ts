import { Component, OnInit } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lang-switch-dialog',
  templateUrl: './lang-switch-dialog.component.html',
  styleUrls: ['./lang-switch-dialog.component.scss']
})
export class LangSwitchDialogComponent implements OnInit {

  selectedLang: any;

  languages: any[] = [];

  saveInProgress: boolean = false;

  isChanged: boolean = false;
  constructor(
    private localStore: LocalStoreService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private service: ServiceInvokerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.languages = [
      {
        code: 'en',
        label: this.translate.instant('COMMON.LANG_EN'),
        icon: 'english.svg'
      },
      {
        code: 'ja',
        label: this.translate.instant('COMMON.LANG_JA'),
        icon: 'japanese.svg'
      },
      {
        code: 'ko',
        label: this.translate.instant('COMMON.LANG_KO'),
        icon: 'korean.svg'
      }
    ];

    // const langCode = this.languages.find(f => f.code.toLocaleLowerCase() === this.localStore.appLanguage?.toLocaleLowerCase());
    this.selectedLang = this.languages.find(f => f.code.toLowerCase() === this.authService.userProfile?.personalInfo?.language?.toLowerCase());
  }

  onChange(lang) {
    this.selectedLang = lang;
    this.isChanged = true;
  }

  close() {

  }

  onSave() {
    // if (!this.isChanged) return;
    this.saveInProgress = true;
    const _params = { "userId": this.authService.getUserId() }
    const _payload = { "personalInfo": { "language": this.selectedLang.code } }
    this.service.invoke('post.profile', _params, _payload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.notificationService.notify(this.translate.instant('NOTIFY.UPDATED_SUCCESSFULLY'), 'success');
        this.localStore.appLanguage = this.selectedLang.code;
        window.location.reload();
      }, err => {
        this.notificationService.showError(err, '');
      })

  }

}
