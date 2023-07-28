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
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
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
  preBuilt = [];
  sortOrder : 'desc' | 'asc' = 'asc';
  showNoneIntent = false;
  @ViewChild('noneIntent', { static: true }) noneIntent: SliderComponentComponent;
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
    this.getCoachingPreBuiltRules();
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
    this.serachInPreBuilt();
  }

  serachInPreBuilt(){
    if(this.searchText){
      this.respData.preBuilt = this.respData.preBuilt.filter((rule)=>rule.name?.toLowerCase()?.includes(this.searchText?.toLowerCase()))
    }else{
      this.respData.preBuilt = JSON.parse(JSON.stringify(this.preBuilt));
    }
  }

  getCoachingPreBuiltRules(){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      botId,
    };
    this.service.invoke('get.allagentCoachingpreBuiltRules', params)
    .subscribe((data)=>{
      this.respData.preBuilt = data.results;
      this.preBuilt = JSON.parse(JSON.stringify(data.results));
    })
  };


  getAgentCoachingRules(empty= false) {
    // let this = this;
    this.isLoading = true;
    this.cdRef.detectChanges();
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
      sortBy : this.sortOrder
    }
    if(this.searchText){
      body['searchText'] = this.searchText;
    }
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
        this.cdRef.detectChanges();
      }
    });
  }

  // Create or Edit Rule Flow Starts
  openFLowCreation(flowCreation, rule?, type = COACHINGCNST.EDIT) {
    if(rule && !rule.deletable && type == COACHINGCNST.EDIT){
      this.noneIntent.openSlider("#nonIntent", "non-intent-slider");
      this.showNoneIntent = true;
      return;
    }

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
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
              this.cdRef.detectChanges();
            }, 0);
          }
        }, (error) => {
          this.notificationService.showError(error, this.translate.instant("COACHING.PUBLISH_FAILURE"));
        });

    }
    if (type === COACHINGCNST.CREATE) {
      this.currentRule = {...{}};
      this.createOrEdit = COACHINGCNST.CREATE;
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }
  }

  closeFLowCreation(rule?) {
    this.modalFlowCreateRef.close();
    if (!rule) {
      return;
    };
    // this.sortOrder = 'asc'
    this.getAgentCoachingRules(true);
    this.getCoachingPreBuiltRules();
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
          this.getCoachingPreBuiltRules();
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
    if(!this.isLoading && this.hasMore && event.target.scrollTop > 0){
      this.getAgentCoachingRules();
    }
  }
  closeRule() {
    this.modalService.dismissAll();
  }

  sortOnClick(){
    this.sortOrder = this.sortOrder == 'desc' ? 'asc' : 'desc';
    this.getAgentCoachingRules(true);
  }

  closeNoneIntent(e){
    this.noneIntent.closeSlider("#nonIntent");
  }

}
