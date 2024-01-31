import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChecklistService } from '../checklist.service';
import { StagesListComponent } from '../common/stages-list/stages-list.component';
import { DynamicChecklistComponent } from '../dynamic-checklist/dynamic-checklist.component';
import { PrimaryChecklistComponent } from '../primary-checklist/primary-checklist.component';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guided-checklist',
  templateUrl: './guided-checklist.component.html',
  styleUrls: ['./guided-checklist.component.scss']
})
export class GuidedChecklistComponent implements OnInit {
  createOrUpdate = 'create';
  modalFlowCreateRef: any;
  checkListType = 'primary';
  currentCheckList = {};
  isStageListOpen = false;
  @ViewChild('checkList1') checkList1: PrimaryChecklistComponent;
  @ViewChild('checkList2') checkList2: DynamicChecklistComponent;
  loading = false;
  subs = new SubSink();
  publishInprogress = false;
  selAcc = this.local.getSelectedAccount();
  isAgentPlayBookEnabled: boolean = true;
  constructor(
    private modalService : NgbModal,
    private auth: AuthService,
    private local: LocalStoreService,
    private service: ServiceInvokerService,
    private workflowService: workflowService,
    private clS: ChecklistService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) { }
  @ViewChild('checklistCreation') checklistCreation: ElementRef;
  ngOnInit(): void {
    // this.getAgentAssistSettings();
    this.getConfigDetails();
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele) => {
      if (ele) {
        this.getConfigDetails();
        if(this.checkListType === 'primary'){
          this.checkList1.getPrimaryList(true);
        }else{
          this.checkList2.getDynamicList(true);
        }
      }
    });
    window.addEventListener("message", (event:any) => {
      if(event.data.action === 'reloadChecklist') {
        this.getConfigDetails();
        if(this.checkListType === 'primary'){
          this.checkList1.getPrimaryList(true);
        }else{
          this.checkList2.getDynamicList(true);
        }
      }
      if(event.data.action === 'destroyedChecklist') {
        this.modalService.dismissAll();
      }
    })
  }

  getAgentAssistSettings() {
    this.loading = true
    let botId = this.workflowService?.getCurrentBtSmt(true)._id
    let params = {
      orgId: this.authService?.getOrgId(),
    };
    let body = {
      botId
    }
    this.service.invoke("get.agentAssistSettings", params, body)
    .pipe(
      finalize(()=>{
        this.loading = false;
      })
    )
    .subscribe(
      (res) => {
        if (res) {
          this.isAgentPlayBookEnabled = res.agentAssistSettings.isAgentPlaybookEnabled;
          if(this.isAgentPlayBookEnabled){
            this.getConfigDetails();
            this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele) => {
              if (ele) {
                this.getConfigDetails();
                if(this.checkListType === 'primary'){
                  this.checkList1.getPrimaryList(true);
                }else{
                  this.checkList2.getDynamicList(true);
                }
              }
            });
          }
        }
      },
      (err) => {
        this.notificationService.showError(
          err,
          this.translate.instant("FALLBACK_ERROR_MSG")
        );
      }
    );
  }

  redirectToAASettings() {
    this.router.navigate(['/config/widget-settings']);
  }

  getConfigDetails() {
    let params: any = {
      userId: this.auth.getUserId(),
      streamId: this.workflowService.getCurrentBtSmt(true)._id
    };
    this.service.invoke('get.AIconfigs', params)
      .subscribe(res => {
        if (res) {
          this.clS.metaForUtternace = (res[0].featureList || [])
            .find(item => item.name === "aa_utterance")
          };
      }, err => {
      });
  }

  createCheckList(checklistCreation){
    this.isStageListOpen = true;
    this.currentCheckList = {};
    this.createOrUpdate = 'create';
    this.modalFlowCreateRef = this.modalService.open(checklistCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
  }


  closeCheckListScreen() {
    if(this.checkListType === 'primary'){
      this.checkList1.getPrimaryList(true);
    }else{
      this.checkList2.getDynamicList(true);
    }
    this.modalFlowCreateRef.close();
    this.isStageListOpen = false;
  }

  updatePrimaryChecklist(event){
    this.getCheckListById(event._id);
  }

  getCheckListById(clId){
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    this.service.invoke('get.checklistbyid', {botId, clId})
    .pipe(finalize(()=>{
      this.checkList1.loading = false;
      this.checkList2.loading = false;
    }))
    .subscribe((data)=>{
      this.checkListType = data[0].type;
      this.isStageListOpen = true;
      this.createOrUpdate = 'update';
      this.modalFlowCreateRef = this.modalService.open(this.checklistCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
      this.currentCheckList = {...data[0]};
    });
  }

  publush(){
    this.publishInprogress = true;
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    this.service.invoke('publish.checklist', {}, {botId})
    .pipe(
      finalize(()=>{
        this.publishInprogress = false;
      })
    )
    .subscribe((data)=>{
      this.notificationService.notify(this.translate.instant('COACHING.PUBLISH_SUCCESS'), 'success');
    },(err)=>{
      this.notificationService.showError(err, this.translate.instant("COACHING.PUBLISH_FAILURE"));
    });
  }

  createFCl(event){
    this.checkListType = event;
    this.createCheckList(this.checklistCreation)
  }

}
