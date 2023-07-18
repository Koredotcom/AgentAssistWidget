import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { COACHINGCNST } from './coaching.cnst';
import { CoachingGroupRuleDeleteComponent } from './coaching-group-rule-delete/coaching-group-rule-delete.component';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize, debounceTime, tap } from 'rxjs/operators';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { CoachingService } from './coaching.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit, OnDestroy {

  modalRef: any;
  modalFlowCreateRef: any;
  bottomInt: any;
  topInt: any;
  dragStart: boolean = false;
  coachingConst: any = COACHINGCNST;
  coachGroupEvent: string;
  coachGroupData: any;
  respData: any = { "results": [] };
  isLoading: boolean = false;
  selectedRuleGroup: any;
  selectedRuleGroupIndex: number;
  selectedRuleIndex: number;
  createOrEdit: string = COACHINGCNST.CREATE;
  currentRule: any;
  searchField = new FormControl();
  searching: boolean = false;
  publishInprogress: boolean = false;
  rulePresent: boolean = false;
  selAcc = this.local.getSelectedAccount();
  subs = new SubSink();
  isCoachingDisable = false;
  limit = 10;
  page = 1;
  hasMore = false;
  searchText = '';

  constructor(
    private modalService: NgbModal, private service: ServiceInvokerService,
    private workflowService: workflowService, private cdRef: ChangeDetectorRef,
    private notificationService: NotificationService, private translate: TranslateService,
    private auth: AuthService, private local: LocalStoreService,
    private authService: AuthService,
    private cs: CoachingService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = this.authService.isAgentCoachongEnable$.subscribe(isEnabled => {
      this.isCoachingDisable = isEnabled;
    });
    if (!this.isCoachingDisable) {
      this.router.navigate(['/config/usecases']);
    } else {
      this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele) => {
        if (ele) {
          this.initApiCalls();
        }
      });
      this.initApiCalls();
    }
  }

  initApiCalls() {
    this.getAgentCoachingRules();
    this.subscribeEvents();
    this.getConfigDetails();
  }

  subscribeEvents() {
    this.searchField.valueChanges.pipe(debounceTime(300), tap(() => { this.isLoading = true; }))
      .subscribe(term => {
        term = term.trim()
        if (term.trim()) {
          this.searchText = term;
          this.serachRules();
          return;
        } else if (term == '' && this.searchText) {
          this.searchText = term;
          this.serachRules();
          return;
        }
        this.isLoading = false;
      });
  }

  serachRules() {
    this.getAgentCoachingRules(true);
  }

  getAgentCoachingRules(empty= false) {
    // let this = this;
    if(empty){
      this.page = 1;
      this.limit = 10;        
    }
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      botId,
    };
    let body = {
      botId,
      limit: this.limit,
      page: this.page,
    }
    if(this.searchText){
      body['searchText'] = this.searchText;
    }
    this.isLoading = true;
    this.cdRef.detectChanges();
    this.service.invoke('get.allagentCoachingRule', params, body).pipe(finalize(() => {
      this.isLoading = false;
      this.cdRef.detectChanges();
    })).subscribe(data => {
      if (data) {
        if(empty){
          this.respData.results = [...[]];
          // this.cdRef.detectChanges();
        }
        this.page = this.page+1;
        this.hasMore = data.hasMore;
        this.respData.results.push(...data.results);
        
        let resultss = JSON.parse(JSON.stringify(data.results));
        resultss.forEach((element, i) => {
          element["default"] = true;
          if(i%2 === 0){
            element["deletable"] = true;
          }else{
            element["deletable"] = false;
          }
        });
        this.respData.preBuilt = resultss;
        this.cdRef.detectChanges();
      }
    });
  }

  // Create or Edit Rule Flow Starts
  openFLowCreation(flowCreation, rule?, type = COACHINGCNST.EDIT) {
    if (type === COACHINGCNST.EDIT) {
      this.isLoading = true;
      this.createOrEdit = COACHINGCNST.EDIT;
      this.service.invoke('get.ruleById', { ruleId: rule._id })
      .pipe(finalize(()=>{
        this.isLoading = false;
      }))  
      .subscribe(data => {
          if (data) {
            this.currentRule = data;
            this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
          }
        }, (error) => {
          this.notificationService.showError(error, this.translate.instant("COACHING.PUBLISH_FAILURE"));
        });

    }
    if (type === COACHINGCNST.CREATE) {
      this.createOrEdit = COACHINGCNST.CREATE;
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }
  }

  closeFLowCreation(rule?) {
    this.modalFlowCreateRef.close();
    if (!rule) {
      return;
    }
    this.getAgentCoachingRules(true);
    this.selectedRuleGroup = null;
    this.selectedRuleGroupIndex = null;
    this.selectedRuleIndex = null;
  }
  // Create or Edit Rule Flow Ends

  //publish coaching

  publishCoaching() {
    this.publishInprogress = true;
    this.service.invoke('post.publishcoaching', {}, { botId: this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id }).pipe(finalize(() => {
      this.publishInprogress = false;
    })).subscribe(data => {
      if (data) {
        this.notificationService.notify(this.translate.instant("COACHING.PUBLISH_SUCCESS"), 'success');
      }
    }, (error) => {
      this.notificationService.showError(error, this.translate.instant("COACHING.PUBLISH_FAILURE"));
    });

  }

  clearInterVal() {
    clearInterval(this.bottomInt);
    clearInterval(this.topInt)
  }

  // rule activities like active or inactive and delete rule starts
  changeRuleStatus(rule) {
    rule.isActive = !rule.isActive;
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      ruleId: rule._id,
    }
    this.service.invoke('put.agentcoachingrule', params, { isActive: rule.isActive, botId }).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(data => {
      if (data) {
        this.notificationService.notify(this.translate.instant("COACHING.GROUPUPDATED_SUCCESS"), 'success');
      }
    }, (error) => {
      this.notificationService.showError(this.translate.instant("COACHING.GROUPUPDATED_FAILURE"));
    });
  }

  openDeleteRule(rule) {
    let deleteRule = {
      title: "Delete Rule",
      desc: "Are you sure, you want to delete rule '" + rule.name + "'.",
      type: "rule",
      _id: rule._id
    }
    this.modalRef = this.modalService.open(CoachingGroupRuleDeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = deleteRule;
    this.modalRef.result.then(emitedValue => {
      if (emitedValue) {
        this.service.invoke('delete.agentCoachingRule', { ruleId: rule._id }).subscribe(_data => {
          this.notificationService.notify(this.translate.instant("COACHING.RULEDELETE_SUCCESS"), 'success');
          this.getAgentCoachingRules(true);
        }, (error) => {
          this.notificationService.showError(this.translate.instant("COACHING.RULEDELETE_FAILURE"));
        });
      }
    });
  }
  // END
  getConfigDetails() {
    let params: any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    this.service.invoke('get.AIconfigs', params)
      .subscribe(res => {
        if (res) {
          this.cs.metaForUtternace = (res[0].featureList || [])
            .find(item => item.name === "aa_utterance")
        };
      }, err => {
      });
  }

  newRule(newRuleModal: any) {
    this.modalService.open(newRuleModal, {
      windowClass: 'modal-ngb-wrapper-window',
      centered: true,
      backdrop: 'static',
    });
  }
  onReachEnd(event){
    console.log("onReachEnd", event);
    if(!this.isLoading && this.hasMore && event.target.clientHeight > 15){
      this.getAgentCoachingRules();
    }
  }
  closeRule() {
    this.modalService.dismissAll();
  }
}
