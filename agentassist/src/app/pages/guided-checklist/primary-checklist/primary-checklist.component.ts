import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, debounceTime, tap } from 'rxjs/operators';
import { CHECKLISTCNST } from '../checklist.const';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../common/delete/delete.component';
@Component({
  selector: 'app-primary-checklist',
  templateUrl: './primary-checklist.component.html',
  styleUrls: ['./primary-checklist.component.scss']
})
export class PrimaryChecklistComponent implements OnInit, OnChanges {

  constructor(
    private auth: AuthService,
    private local: LocalStoreService,
    private workflowService: workflowService,
    private service: ServiceInvokerService,
    private zone : NgZone,
    private cdRef : ChangeDetectorRef,
    private notificationService: NotificationService, private translate: TranslateService,
    private modalService: NgbModal
  ) { }
  @Input() checkListType;
  @Output() update = new EventEmitter();
  @Output() createCl = new EventEmitter();
  modalRef:any;

  searchField = new FormControl();
  loading = false;
  selAcc = this.local.getSelectedAccount();
  primaryCheckList = [];
  searchText = '';
  hasMore : boolean = false;
  limit = 10;
  page = 1;

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.searchField.valueChanges.pipe(debounceTime(300), tap(() => { this.loading = true; }))
      .subscribe(term => {
        term = term.trim()
        if (term.trim()) {
          this.searchText = term;
          this.searchList();
          return;
        } else if (term == '' && this.searchText) {
          this.searchText = term;
          this.searchList();
          return;
        }
        this.loading = false;
      });
  }

  searchList(){
    this.getPrimaryList(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.checkListType?.currentValue === 'primary'){
      this.getPrimaryList(true);
    }
  }

  getPrimaryList(empty = false){
    if(empty){
      this.primaryCheckList = [...[]];
      this.page = 1;
      this.limit = 10;
      this.hasMore = false;
    }
    this.loading = true;
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    let body = {
      botId,
      searchText: '',
      sortBy: "asc",
      type: 'primary',
      limit: this.limit,
      page: this.page,
    };
    if(this.searchText){
      body['searchText'] = this.searchText;
    }
    this.service.invoke('get.acchecklists', {botId}, body)
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data)=>{
      if(empty){
        this.primaryCheckList = [...[]];
        // this.cdRef.detectChanges();
      }
      this.page = this.page+1;
      this.hasMore = data.hasMore;
      this.primaryCheckList.push(...data.results);
      this.cdRef.detectChanges();
    })
  }

  updateStatus(currentCheckList){
    currentCheckList.isActive = !currentCheckList.isActive;
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    let clId = currentCheckList._id;
    let payload : any = {
      "isActive" : currentCheckList.isActive,
      botId,
      type: CHECKLISTCNST.primary,
    };
    this.loading = true;
    this.service.invoke('put.acchecklists', {botId, clId}, payload) .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data)=>{
      console.log(data, 'data');
      this.notificationService.notify(this.translate.instant("CHECKLIST.CLDUPDATE_SUCCESS"), 'success');
    },(err)=> {
      currentCheckList.isActive = false;
      this.notificationService.showError(err, this.translate.instant("COACHING.CLUPDATE_FAILURE"));
    });
  }

  updateCl(e){
    this.loading = true;
    this.update.emit(e);
  }

  onReachEnd(event){
    if(!this.loading && this.hasMore && event.target.scrollTop > 0){
      this.zone.run(()=>{
        this.getPrimaryList();
      })
    }
  }

  openDeleteCl(dyn){
    let botId = this.workflowService.getCurrentBtSmt(true)._id;
    let deleteRule = {
      title: "Delete Playbook",
      desc: "Are you sure, you want to delete playbook '" + dyn.name + "'.",
      type: "rule",
      _id: dyn._id
    }
    this.modalRef = this.modalService.open(DeleteComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
    this.modalRef.componentInstance.data = deleteRule;
    this.modalRef.result.then(emitedValue => {
      if (emitedValue) {
        this.service.invoke('delete.checklist', { clId: dyn._id, botId }).subscribe(_data => {
          this.notificationService.notify(this.translate.instant("CHECKLIST.CLDELETE_SUCCESS"), 'success');
          this.getPrimaryList(true);
          // this.getCoachingPreBuiltRules();
        }, (error) => {
          this.notificationService.showError(error, this.translate.instant("CHECKLIST.FAILED_DELETE"));
        });
      }
    });
  }

  createChecklist(){
    this.createCl.emit('primary');
  }

}
