import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UsecasesMainService } from '../../uc-main.service';
import { Category, UsecaseOb, UsecaseParams, UsecaseRespStruct, USECASES_LIMIT } from '../uc-table-main.model';
import { UsecasesTableMainService } from '../uc-table-main.service';
import { workflowService } from '@kore.services/workflow.service';
import { fadeInOutAnimation, fadeInAnimation } from 'src/app/helpers/animations/animations';
import { NotificationService } from '@kore.services/notification.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { debounceTime, delay, finalize } from 'rxjs/operators';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import * as _ from 'underscore';
import { Subscription } from 'rxjs';
import { EXPEIRENCE_MOCKDATA } from 'src/app/data/expeirences.mock';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { AuthService } from '@kore.services/auth.service';

@Component({
  selector: 'app-uc-table-view',
  templateUrl: './uc-table-view.component.html',
  styleUrls: ['./uc-table-view.component.scss'],
  animations: [fadeInOutAnimation, fadeInAnimation]
})
export class UsecasesTableViewComponent implements OnInit, OnDestroy {
  config: any = {
    suppressScrollX: true
  };
  addClass: boolean = false;
  streamId: string;
  ucOffset: number = 0;
  flowOffset: number = 0;
  isLoading: boolean = true;
  moreAvail: boolean = false;
  hasMoreFlows: boolean = false;
  categoriesList: Category [];
  ucListFq: UsecaseOb [] = [];
  ucListDg: UsecaseOb [] = [];
  isCategoriesLoading = true;
  isStateLoading = false;
  subs = new SubSink();
  noResults = false;
  appStatesList = [{
    title: this.translate.instant("USECASES.IN_DEV"),
    id: 'configured',
    imgSrc: "assets/icons/status-clock.svg"
  }, {
    title: this.translate.instant("USECASES.PUB"),
    id: 'published',
    imgSrc: "assets/icons/published.svg"
  }];
  ucDS: Subscription;
  ucASTS: Subscription;
  ucSS: Subscription;
  ucCS: Subscription;
  uUS: Subscription;
  ucCU: Subscription;
  ucU: Subscription;

  currentTabVal;
  callFlows = [];
  callFlowId;
  isCallFlowEditMode = false;
  isCallFlowCreateMode = false;
  showFlowSlider: boolean;
  showFlowEditorSlider: boolean= false;
  flowLimit: number = 10;
  skipFlows: number = 0;
  callFlowSortOrder: 'desc' | 'asc' = 'desc';

  @ViewChild('flowSlider', { static: true }) flowSlider: SliderComponentComponent;
  @ViewChild('flowEditorSlider', { static: true }) flowEditorSlider: SliderComponentComponent;
  @ViewChild('new_faq_tab') fTab: ElementRef;
  @ViewChild('new_conv_tab') cTab: ElementRef;
  @ViewChild('psTableView') psTView: ElementRef;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;


  constructor(public ucTableMainService: UsecasesTableMainService,
              public ucMainService: UsecasesMainService,
              private service:ServiceInvokerService,
              public workflowService: workflowService,
              private notificationService: NotificationService,
              private translate: TranslateService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subs.sink = this.ucMainService.isNewCreateFlowReq$.subscribe(mode => {
      this.isCallFlowCreateMode = mode;
      if(this.isCallFlowCreateMode) {
        this.openFlowSlider('');
      }
    });
    this.subs.sink = this.ucMainService.flowCreateUpdate$.subscribe(val => {
      if(val) {
        this.callFlows = [];
        this.hasMoreFlows = false;
        this.getExpeirences();
      }
    })
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.allSubs();
    if(this.ucMainService.tabActive === 'exp') {
      this.getExpeirences();
      return;
    }
    if(this.ucTableMainService.categories.length > 0) {
      this.categoriesList = this.ucTableMainService.categories;
    } else {
      this.service.invoke('get.categories', {streamId: this.streamId}, { isSmartAssistOnly: true })
      .subscribe(
        res=> {
          // res = _.reject(res, (c: Category) => c.category.toLowerCase() == "no category");
          this.categoriesList = res;
          this.ucTableMainService.categories = res;
        },
        err=> this.showError(err, this.translate.instant("USECASES.FAILED_FETCH_CATEGORIES")));
    }
    
    const params = new UsecaseParams(this.streamId, "", "", "", this.ucMainService.tabActive, this.ucOffset, USECASES_LIMIT, false);
    this.service.invoke('get.usecases', params, {isSmartAssistOnly: true})
      .pipe(
        finalize(()=>{
          this.isLoading = false;
        }))
      .subscribe((res: UsecaseRespStruct)=>{
        this.ucTableMainService.defaultConfigs = res.defaultConfigs;
        this.moreAvail = res.moreAvailable;
        if(this.ucMainService.tabActive == 'faq') this.ucListFq = res.usecases;
        else if(this.ucMainService.tabActive == 'dialog') this.ucListDg = res.usecases;
      }, err => {
        this.moreAvail = false;
        this.showError(err, this.translate.instant("USECASES.FAILED_FETCH_UC"));
      });
  }



  allSubs() {
    this.ucU = this.ucTableMainService.ucUpdated$.subscribe(()=>{
      this.isStateLoading = true;
      setTimeout(()=>{
        this.isStateLoading = false;
      }, 50);
    });

    this.ucCU = this.ucTableMainService.ucCategoriesUpdate$.subscribe(res => {
      this.noResults = false;
      this.isCategoriesLoading = true;
      this.service.invoke('get.categories', {streamId: this.streamId}, { isSmartAssistOnly: true })
      .subscribe(
        res=> {
          // res = _.reject(res, (c: Category) => c.category.toLowerCase() == "no category");
          this.categoriesList = res;
          this.ucTableMainService.categories = res;
          if(this.ucMainService.tabActive == 'faq' && !_.reduce(_.pluck(this.categoriesList, 'faqCount'), (a, b) => a+b)) {
            this.noResults = true;
          } else if(this.ucMainService.tabActive == 'dialog' && !_.reduce(_.pluck(this.categoriesList, 'dialogCount'), (a, b) => a+b)) {
            this.noResults = true;
          }
          this.isCategoriesLoading = false;
        },
        err=> {
          this.isCategoriesLoading = false;
          this.showError(err, this.translate.instant("USECASES.FAILED_FETCH_CATEGORIES"))
        });
    });
    this.ucDS = this.ucTableMainService.ucDeleted$.subscribe((res: {uc: UsecaseOb, isDeleted: boolean}) =>{ 
      if(this.ucMainService.tabActive == 'faq') {
        this.ucListFq = _.reject(this.ucListFq, {'taskRefId': res.uc.taskRefId});
      }
      else if(this.ucMainService.tabActive == 'dialog') {
        if(res.isDeleted) {
          this.ucListDg = _.reject(this.ucListDg, {'taskRefId': res.uc.taskRefId});
        } else {
          const index = _.findLastIndex(this.ucListDg, {'taskRefId': res.uc.taskRefId});
          this.ucListDg.splice(index, 1, res.uc);
        }
      }
    });
    this.ucASTS = this.ucMainService.ucAddSwitchTabs$.subscribe((res: string) => {
      if(res == 'faq')  this.fTab.nativeElement.click();
      else if(res == 'dialog')  this.cTab.nativeElement.click();  
    });
    this.ucSS = this.ucTableMainService.ucSearch$.subscribe((res:any)=>{
      // this.moreAvail = res.moreAvailable;
      if(this.ucMainService.tabActive == 'faq'){
        this.moreAvail = res.moreAvailable;
        this.ucListFq = res.usecases;
      } 
      else if(this.ucMainService.tabActive == 'dialog'){
        this.moreAvail = res.moreAvailable;
        this.ucListDg = res.usecases;
      } 
      else if(this.ucMainService.tabActive == 'exp'){
        this.hasMoreFlows = res?.hasMore;
        this.callFlows = res?.results;
        this.skipFlows = 0;
      }
    });
    this.ucCS = this.ucTableMainService.ucCreated$.subscribe((res:UsecaseOb)=>{
      if(this.ucMainService.tabActive == 'faq') this.ucListFq.unshift(res);
      else if(this.ucMainService.tabActive == 'dialog') this.ucListDg.unshift(res);
    });
    this.uUS = this.ucTableMainService.ucUpdated$.subscribe((res:UsecaseOb)=>{
      if(res.usecaseType == 'faq') {
        this.ucListFq.splice(_.findIndex(this.ucListFq, {taskRefId: res.taskRefId}), 1, res);
      } else if(res.usecaseType == 'dialog') {
        this.ucListDg.splice(_.findIndex(this.ucListDg, {taskRefId: res.taskRefId}), 1, res);
      }
    });

  }

  getExpeirences () {
    this.isLoading = true;
    if(this.hasMoreFlows){
      this.skipFlows = this.skipFlows + this.flowLimit;
    }
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamId,
      name: ""
    }
    const payload = {
      limit: this.flowLimit,
      skip: this.hasMoreFlows ? this.skipFlows : 0,
      sortBy: "name",
      sortOrder: this.callFlowSortOrder
    }
    this.subs.sink = this.service.invoke('get.expeirence-flows', params, payload).subscribe(res => {
      this.isLoading = false;
      console.log(res);
      this.hasMoreFlows = res?.hasMore;
      this.callFlows = [...this.callFlows, ...(res.results)];
    }, err => {
      this.notificationService.showError(err);
      this.isLoading = false;
    })
    
    // return EXPEIRENCE_MOCKDATA;
    
  }

  deleteExpeirenceFlow(id) {
    this.isLoading = true;
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamId,
      callflowId: id
    }
    this.subs.sink = this.service.invoke('delete.expeirence-flow', params).subscribe(res => {
      this.hasMoreFlows = false;
      this.callFlows = [];
      this.getExpeirences();
    }, err => {
      this.notificationService.showError(err);
    })
    this.isLoading = false;
    return EXPEIRENCE_MOCKDATA;
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }
 
  tabSwitch(activeT: 'faq' | 'dialog' | 'exp') {
    this.ucMainService.updatedTab(activeT);
    this.isLoading = true;
    this.ucOffset = 0;
    this.ucMainService.tabActive = activeT;
    this.ucMainService.isAddUsecase = false;
    this.ucMainService.switchTabs$.next(activeT);
    const params = new UsecaseParams(this.streamId, "", "", "", activeT, this.ucOffset, USECASES_LIMIT, false);
    if((activeT == 'faq' && this.ucListFq.length < 1) || (activeT == 'dialog' && this.ucListDg.length < 1)) {
      this.service.invoke('get.usecases', params, {isSmartAssistOnly: true}).subscribe((res: UsecaseRespStruct)=>{
        this.ucTableMainService.defaultConfigs = res.defaultConfigs;
        this.moreAvail = res.moreAvailable;
        this.isLoading = false;
        if(activeT == 'faq') this.ucListFq = res.usecases;
        else if(activeT == 'dialog') this.ucListDg = res.usecases;
      });
    } else { this.isLoading = false; }
  }

  onReachEnd() {
    if(this.moreAvail) {
      this.ucOffset += USECASES_LIMIT;
      const params = new UsecaseParams(this.streamId, "", "", "", this.ucMainService.tabActive, this.ucOffset, USECASES_LIMIT, false);
      this.service.invoke('get.usecases', params, {isSmartAssistOnly : true}).subscribe((res: UsecaseRespStruct)=>{
        this.moreAvail = res.moreAvailable;
        if(this.ucMainService.tabActive == 'faq') this.ucListFq = this.ucListFq.concat(res.usecases);
        else if(this.ucMainService.tabActive == 'dialog') this.ucListDg = this.ucListDg.concat(res.usecases);
        this.cdr.detectChanges();
      }, err => {
        this.showError(err, this.translate.instant("USECASES.FAILED_LOAD_REST"));
      })
    }
    if(this.hasMoreFlows) {
      this.getExpeirences();
    }
  }

  openFlowSlider(callFlowInfo) {
    this.flowSlider.openSlider("#flowSlider", "width940");
    this.callFlowId = callFlowInfo._id;
    this.showFlowSlider = true;
  }

  openFlowEditorSlider() {
    this.flowEditorSlider.openSlider("#flowEditorSlider", "width100");
    this.showFlowEditorSlider = true;
  }

  closeFlowEditorSlider() {
    this.flowEditorSlider.closeSlider("#flowEditorSlider");
    this.showFlowEditorSlider = false;
  }

  close($event) {
    if(this.isCallFlowCreateMode) {
      this.ucMainService.createExpFlowBoolean(false);
      this.showFlowSlider = false;
      this.flowSlider.closeSlider("#flowSlider");
    } else {
      this.flowSlider.closeSlider("#flowSlider");
    }
  }

  sortOnFlow(){
    if(this.callFlowSortOrder == 'desc')
      this.callFlowSortOrder = 'asc';
    else
      this.callFlowSortOrder = 'desc';
    this.skipFlows = 0;
    this.hasMoreFlows = false;
    this.callFlows = [];
    this.getExpeirences();
  }

  ngOnDestroy() {
    this.ucDS.unsubscribe();
    this.ucASTS.unsubscribe();
    this.ucSS.unsubscribe();
    this.ucCS.unsubscribe();
    this.uUS.unsubscribe();
    this.ucCU.unsubscribe();
    this.ucU.unsubscribe();
    this.subs.unsubscribe();
  }
}
