import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { UsecasesTableMainService } from '../uc-table-main.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { workflowService } from '@kore.services/workflow.service';
import { Category, GroupBy, UsecaseParams, UsecaseRespStruct, USECASES_LIMIT } from '../uc-table-main.model';
import { UsecasesMainService } from '../../uc-main.service';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@kore.services/auth.service';

@Component({
  selector: 'app-uc-table-view-selection',
  templateUrl: './uc-table-view-selection.component.html',
  styleUrls: ['./uc-table-view-selection.component.scss']
})
export class UsecasesTableViewSelectionComponent implements OnInit, AfterViewInit {

  selectedFilter = this.translate.instant("USECASES.FILTER_BY");
  selectedGroup = this.translate.instant("USECASES.GROUP_BY");
  streamId: string;

  @ViewChild('iSearch') iSearch: ElementRef;

  constructor(public ucTableService: UsecasesTableMainService,
              private service:ServiceInvokerService,
              public ucMainService: UsecasesMainService,
              public workflowService:workflowService,
              private notificationService: NotificationService,
              private translate: TranslateService,
              public ucTableMainService: UsecasesTableMainService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.ucTableService.isGrouped = false;
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      fromEvent(this.iSearch.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged())
        .subscribe((val)=>{
          this.ucTableService.srch = val;
          if(this.ucMainService.tabActive != 'exp'){
            const params = new UsecaseParams(this.streamId, val, "", "", this.ucMainService.tabActive, 0, USECASES_LIMIT, false);
            this.service.invoke('get.usecases', params, {isSmartAssistOnly: true})
            .subscribe((res:UsecaseRespStruct)=>{
              this.ucTableService.ucSearch$.next(res);
            })
          }else if(this.ucMainService.tabActive == 'exp'){
            const params = {
              userId: this.authService.getUserId(),
              streamId: this.streamId,
              name: val
            }
            const payload = {
              limit: 10,
              skip: 0
            }
            this.service.invoke('get.expeirence-flows', params, payload).subscribe(res => {
              this.ucTableService.ucSearch$.next(res);
            }, err => {
              this.notificationService.showError(err);
            })
          }
          
        });
    }, 100);
    // this.iSearch.nativeElement.focus();
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter == ""?this.translate.instant("USECASES.FILTER_BY"):this.translate.instant("USECASES.FILTER_BY")+ " " + filter.toLowerCase();
    this.ucTableService.selStatus = filter == 'in development'?'configured':'published';
    const params = new UsecaseParams(this.streamId, "", "", this.ucTableService.selStatus, this.ucMainService.tabActive, 0, USECASES_LIMIT, false);
  }
  
  toggleGroup() {
    this.ucTableService.isGrouped = !this.ucTableService.isGrouped;
    if(this.ucTableService.isGrouped) { this.selectFilter(""); }
  }

  selectGroup(s: GroupBy) {
    if(s !== 'state') {
      if(s == 'category') {
        this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + this.translate.instant('USECASES.CATEGORY');
      } else {
        this.selectedGroup = this.translate.instant("USECASES.GROUP_BY");
      }
    } else {
      this.selectedGroup = this.translate.instant("USECASES.GROUP_BY") + " " + this.translate.instant("USECASES.STATUS_SMALL");
    }
    this.ucTableService.isGrouped = true;
    this.ucTableService.gpBy = s;
    if(s == "category") {
      this.ucTableMainService.ucCategoriesUpdate$.next();
    }
  }
}
