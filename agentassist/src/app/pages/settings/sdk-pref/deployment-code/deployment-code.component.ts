import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';

declare const $: any;
@Component({
  selector: 'app-deployment-code',
  templateUrl: './deployment-code.component.html',
  styleUrls: ['./deployment-code.component.scss'],
  animations: [fadeInOutAnimation]
})
export class DeploymentCodeComponent implements OnInit {

  loading: boolean = false;
  scriptUrl: string = '';
  scriptTag: string = '';
  linkTag: string = '';
  streamId: string;

  domainForm: FormGroup;
  domains: FormArray;
  saveInProgress: boolean = false;

  @Output() closed = new EventEmitter();
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dockService: DockStatusService
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.domainForm = new FormGroup({ domains: new FormArray([]) });
    this.domains = this.domainForm.get('domains') as FormArray;
    this.fetchDomains();
  }

  fetchDomains() {
    this.loading = true;
    const _qParmas = {
      streamId: this.streamId
    }
    this.service.invoke('get.settings.embedwebsdk', _qParmas)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.linkTag = res.cssTag;
        this.scriptTag = res.scriptTag;
        this.initForm(res.domains);
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_FETCH_DOMAINS_LIST'));
      });
  }

  initForm(domains: string[]) {
    if (domains?.length) {
      domains.forEach((domain, i) => this.domains.insert(i, new FormControl(domain, Validators.required)));
    } else {
      this.domains.insert(0, new FormControl('', Validators.required))
    }
  }

  addNewDomain() {
    if (this.domains.valid) {
      this.domains.insert(0, new FormControl('', Validators.required));
      this.setFoucs();
    };
    this.domains.markAsDirty();
  }

  setFoucs() {
    setTimeout(() => $('.deployment-code-container').find('input:first').focus());
  }

  deleteDomain(index: number) {
    this.domains.removeAt(index);
    this.domains.markAsDirty();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  copyToClipBoard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };


  onCopy() {
    this.copyToClipBoard( this.linkTag + this.scriptTag);
  }

  close(force?: boolean) {
    if (!force && this.domains.dirty) {
      this.showConfirmation();
      return;
    }

    this.closed.emit();
  }


  save() {
    console.log(this.domains.value);
    this.saveInProgress = true;
    const _qParmas = {
      streamId: this.streamId
    }

    const _payload = {
      domains: this.domains.value
    }
    this.service.invoke('post.settings.embedwebsdk', _qParmas, _payload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        this.notificationService.notify(this.translate.instant('NOTIFY.UPDATED_SUCCESSFULLY'), 'success');
        this.close(true);
        this.dockService.publisAndHold();
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_UPDATE_DOMAINS_LIST'));
      })
  }

  showConfirmation() {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '446px',
      height: '210px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant('COMMON.DISCARD_CHANGES'),
        text: this.translate.instant('COMMON.UNSAVED_CHANGES'),
        buttons: [{ key: 'yes', label: this.translate.instant('BUTTONS.DISCARD'), type: 'danger' }, { key: 'no', label: this.translate.instant('BUTTONS.GO_BACK') }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        dialogRef.close();
        if (result === 'yes') {
          this.close(true);
        }
      });
  }


}
