import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable, interval, Subscription, BehaviorSubject } from "rxjs";
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize, startWith } from "rxjs/operators";

import * as _ from 'underscore';
import { NotificationService } from "@kore.services/notification.service";
import { AuthService } from "@kore.services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { AppService } from "@kore.services/app.service";
@Injectable({ providedIn: 'root' })

export class DockStatusService {

    selectedApp: any;
    showStatusDocker: boolean = false;

    isAnyRecordFailed: boolean;
    isAnyRecordCompleted: boolean;
    isAnyRecordInprogress$ = new BehaviorSubject(false);
    statusDockerLoading: boolean;
    dockersList: any[] = [];

    pollingSub: Subscription;
    dockStatusSub: Subscription;

    @Output() change: EventEmitter<any> = new EventEmitter();
    constructor(
        private service: ServiceInvokerService,
        public workflowService: workflowService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private translate: TranslateService,
        private appService: AppService
    ) {
        this.selectedApp = this.workflowService.deflectApps();
    }

    getDockStatus(job: string, id?) {
        let streamId = this.authService.smartAssistBots.map(x=>x._id);
        let params = { streamId: streamId, callflowId: id};
        return Observable.create(observer => {
            const polling = interval(1000).pipe(startWith(0)).subscribe(() => {
                if(params.callflowId){
                    params['userId'] = this.authService.getUserId();
                    this.service.invoke('get.dockstatus.callflow.versions', params)
                    .subscribe(res => {
                        this.commonLogic(polling,observer,job,res);
                    }, err => {
                        observer.error(new Error());
                    })
                }else{
                    this.service.invoke('get.dockstatus', params)
                    .subscribe(res => {
                        this.commonLogic(polling,observer,job,res);
                    }, err => {
                        observer.error(new Error());
                    })
                }

            })
        });
    }

    private commonLogic(polling, observer, job, res){
        let jobObj = _.findWhere(res, { jobType: job });

                        if (jobObj && jobObj.status == 'SUCCESS') {
                            polling.unsubscribe();
                            observer.next(jobObj);
                        } else if (jobObj && jobObj.status == 'FAILURE') {
                            polling.unsubscribe();
                            observer.next(new Error('Failed'));
                        } else if (jobObj) {
                            observer.next(jobObj);
                        } else if (!jobObj) {
                            polling.unsubscribe();
                            observer.error(new Error('No JobType found!'));
                        }


                        // if (jobObj && jobObj.status == 'SUCCESS') {
                        //     polling.unsubscribe();
                        //     observer.next(jobObj);
                        // }
                        // else if (jobObj && jobObj.status == 'FAILURE') {
                        //     polling.unsubscribe();
                        //     observer.next(new Error('Failed'));
                        // }
                        // else if (!jobObj) {
                        //     polling.unsubscribe();
                        //     observer.error(new Error('No JobType found!'));
                        // }
    }

    updateProgress(payload, _id: string, callFlowId?: string) {
        let _params = {
            streamId: this.authService.smartAssistBots.map(x=>x._id),
            dsId: _id,
            callflowId: callFlowId
        };
        return Observable.create(observer => {
            if(_params.callflowId){
                _params['userId'] = this.authService.getUserId();
                this.service.invoke('put.updatedockstatus.callflow.versions', _params, payload).subscribe(res => { observer.next(res) }, err => { observer.error(err); });
            }else{
                this.service.invoke('put.updatedockstatus', _params, payload).subscribe(res => { observer.next(res) }, err => { observer.error(err); });
            }

        })
    }

    downloadDockFile(fileId: string, fileName: string) {
        const params = { fileId: fileId };
        this.service.invoke('get.downloaddockfile', params).subscribe(res => {
            let hrefURL = res.fileUrl + fileName;
            let a = document.createElement('a');
            a['href'] = hrefURL;
            a['download'] = hrefURL.substr(hrefURL.lastIndexOf('/') + 1);
            document.body.appendChild(a);
            a.click();
        }, err => { console.log(err) });
    }

    trigger(data?) {
        this.change.next(data);
    }

    polling() {
        if (this.pollingSub) this.pollingSub.unsubscribe();
        if (this.dockStatusSub) this.dockStatusSub.unsubscribe();

        let streamId = this.authService.smartAssistBots.map(x=>x._id);
        let params = { streamId: streamId };
        this.pollingSub = interval(50000).pipe(startWith(0)).subscribe(() => {
            // this.statusDockerLoading = true;
            this.dockStatusSub = this.service.invoke('get.dockstatus', params)
                .pipe(finalize(() => { this.statusDockerLoading = false; }))
                .subscribe(res => {
                    this.dockersList = (res || []).map(e => e['jobType'] === "PUBLISH_BOT");
                })
        })
    }

    removeRecord(task, index) {
        if (task._id) {
            // this.statusDockerLoading = true;

            let streamId = this.authService.smartAssistBots.map(x=>x._id);
            const queryParms = {
                streamId: streamId,
                dsId: task._id,
            }
            this.service.invoke('delete.dockstatus', queryParms).subscribe(
                res => {
                    this.statusDockerLoading = true;
                    this.dockersList.splice(index, 1);
                    // this.notificationService.notify(res.msg, 'success');
                    this.statusDockerLoading = false;
                },
                errRes => {
                    this.statusDockerLoading = false;
                    this.notificationService.showError(errRes, 'Failed to get Status of Docker.');
                }
            );
        }
        else {
            this.notificationService.notify('Failed to remove this Job.', 'error');
        }
    }

    clearAllRecords() {
        const queryParms = {
            streamId: this.authService.smartAssistBots.map(x=>x._id),
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

    publisAndHold() {
        let payload: any = {
            resources: ['SETTINGS', 'WEBSDK'],
            publishAllComponents: false,
            versionComment: 'Implicit publish'
        };

        const params = {
            appId: this.authService.smartAssistBots.map(x=>x._id),
            'isAgentAssist':true
        };
        return new Promise((resolve, reject) => {
          // publish api is commented out
            // this.service.invoke('post.deploy.publish', params, payload).subscribe(res => {
            //     this.isAnyRecordInprogress$.next(true);
            //     this.getDockStatus('PUBLISH_BOT')
            //         .subscribe(res => {
            //             if (res.status === 'SUCCESS') {
            //                 this.change.emit(res);
            //                 this.isAnyRecordInprogress$.next(false);
            //                 this.notificationService.notify(this.translate.instant("PUBLISHING_COMPLETED"), 'success');
            //                 this.appService.getInstaceApps();
            //                 this.workflowService.updateAvailBal$.next();
            //                 resolve("");
            //             } else if (res instanceof Error) {
            //                 this.notificationService.notify(this.translate.instant("PUBLISHING_FAILED"), 'error');
            //                 this.isAnyRecordInprogress$.next(false);
            //                 reject();
            //             } else {
            //                 // _.extend(res.store, { toastSeen: true });
            //                 // this.updateProgress(_.pick(res, 'store'), res._id).subscribe(res => {
            //                 //     this.change.emit(res);
            //                 // })
            //             }

            //         }, err => {
            //             this.notificationService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_GET_PR"));
            //             reject();
            //         })
            // },
            //     err => {
            //         this.notificationService.showError(err, 'Failed to publish');
            //         reject();
            //     }
            // )
        })
    }

}
