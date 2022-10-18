import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { ServiceInvokerService } from '../../services/service-invoker.service';
import { from, interval, Subject, Subscription } from 'rxjs';
import { startWith, elementAt, filter } from 'rxjs/operators';
import { workflowService } from '@kore.services/workflow.service';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';
import { SubSink } from 'subsink';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dock-status',
  templateUrl: './dock-status.component.html',
  styleUrls: ['./dock-status.component.scss']
})
export class DockStatusComponent implements OnInit {
  fileId;
  streamId;
  @Input('statusDockerLoading') statusDockerLoading: boolean = true;

  public dockersList: Array<any> = [];
  public pollingSubscriber: any;
  public dockServiceSubscriber: any;

  subs = new SubSink();

  constructor(private service: ServiceInvokerService,
    private workflowService: workflowService,
    private notify: NotificationService,
    private dockStatusService: DockStatusService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    //this.streamId = this.workflowService.getCurrentBt()._id;
    this.streamId = this.authService.smartAssistBots.map(x=>x._id);
    this.dockServiceSubscriber = this.dockStatusService.change.subscribe(data => {
      // this.polling();
      const index = this.dockersList.findIndex(f => f._id === data._id);
      if (index >= 0) {
        data.createdOn = moment(data.createdOn).format("Do MMM YYYY | h:mm A");
        this.dockersList.splice(index, 1, data);
      }
    })

    this.polling();
  }

  ngOnChanges(changes) {
    if (changes.statusDockerLoading.currentValue) {
      this.statusDockerLoading = changes.statusDockerLoading.currentValue;
      this.polling();
    }
  }
  initDockStatus() {
    this.polling();
  }
  polling() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    const queryParms = {
      streamId: this.streamId
    }
    this.pollingSubscriber = interval(1000).pipe(startWith(0)).subscribe(() => {
      this.subs.sink = this.service.invoke('get.dockstatus', queryParms).subscribe(res => {
        this.statusDockerLoading = false;
        this.dockersList = (res || []).filter(e => e.jobType === "PUBLISH_BOT" || e.action === 'EXPORT');
        // this.dockersList = JSON.parse(JSON.stringify([res]));
        this.dockersList.forEach((record: any) => {
          record.createdOn = moment(record.createdOn).format("Do MMM YYYY | h:mm A");
          if (record.status === 'SUCCESS' && record.fileId && !record.store.toastSeen) {
            if (record.action === 'EXPORT') {
              this.downloadDockFile(record.fileId, record.store.urlParams, record.streamId, record._id);
            }
          }
        })
        const queuedJobs = _.filter(this.dockersList, (source) => {
          return ((source.status === 'IN_PROGRESS') || (source.status === 'QUEUED') || (source.status === 'validation'));
        });

        if (queuedJobs && queuedJobs.length) {
          this.dockStatusService.isAnyRecordInprogress$.next(true);
        } else {
          this.pollingSubscriber.unsubscribe();
          this.dockStatusService.isAnyRecordInprogress$.next(false);
        }
      }, errRes => {
        this.pollingSubscriber.unsubscribe();
        if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
          this.notify.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notify.notify('Failed to get Status of Docker.', 'error');
        }
      });
    }
    )
  }

  getStatusText(status, type?) {
    if (type === 'PUBLISH_BOT') {
      if (status === 'IN_PROGRESS') {
        return this.translate.instant('PUBLISHING_IN_PROGRESS');
      } else if (status === 'SUCCESS') {
        return this.translate.instant('PUBLISHING_COMPLETED');
      } else if (status === 'FAILURE') {
        return this.translate.instant('PUBLISHING_FAILED');
      }
    }

    if (status === 'HALTED') {
      return 'Stopped';
    }
    else if (status === 'QUEUED') {
      return 'In-queue';
    }
    else if (status === 'IN_PROGRESS' || status === 'validation') {
      return 'In-progress';
    } else {
      return status;
    }
  }

  navigateTo(task) {
    if (task.jobType === 'faq') {
      this.router.navigate(['/faqs'], { skipLocationChange: true })
    } else {
      this.router.navigate(['/content'], { skipLocationChange: true });
    }
  }

  removeRecord(task, index) {
    if (task._id) {
      // this.statusDockerLoading = true;
      let streamId = this.workflowService.getCurrentBt()._id
      const queryParms = {
        streamId: streamId,
        dsId: task._id,
      }
      this.service.invoke('delete.dockstatus', queryParms).subscribe(
        res => {
          this.statusDockerLoading = true;
          this.dockersList.splice(index, 1);
          // this.notify.notify(res.msg, 'success');
          this.statusDockerLoading = false;
        },
        errRes => {
          this.statusDockerLoading = false;
          this.errorToaster(errRes, 'Failed to get Status of Docker.');
        }
      );
    }
    else {
      this.notify.notify('Failed to remove this Job.', 'error');
    }
  }

  clearAllRecords() {
    const queryParms = {
      streamId: this.workflowService.getCurrentBt()._id,
    }
    this.service.invoke('deleteAll.dockstatus', queryParms).subscribe(
      res => {
        this.statusDockerLoading = true;
        this.polling();
      },
      errRes => {
        this.statusDockerLoading = false;
        this.notificationService.showError(errRes, 'Failed to get Status of Docker.');
      }
    );
  }

  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notify.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notify.notify(message, 'error');
    } else {
      this.notify.notify('Somthing went worng', 'error');
    }
  }


  downloadDockFile(fileId, fileName, streamId, dockId) {
    const params = {
      fileId,
      streamId: streamId,
      dockId: dockId
    }
    let payload = {
      "store": {
        "toastSeen": true,
        "urlParams": fileName,
      }
    }
    this.service.invoke('attachment.file', params).subscribe(res => {
      let hrefURL = res.fileUrl + fileName;
      window.open(hrefURL, '_self');
      this.service.invoke('put.dockStatus', params, payload).subscribe(res => {
      }
      )
    }, err => { console.log(err) });
  }

  retryPublish() {
    this.dockStatusService.publisAndHold();
  }

  ngOnDestroy() {
    if (this.pollingSubscriber) {
      this.pollingSubscriber.unsubscribe();
    }
    if (this.dockServiceSubscriber) {
      this.dockServiceSubscriber.unsubscribe();
    }

    this.subs.unsubscribe();
  }
}
