import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, debounceTime, tap } from 'rxjs/operators';
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
  ) { }
  @Input() checkListType;
  @Output() update = new EventEmitter();

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
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
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
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let clId = currentCheckList._id;
    let payload : any = {
      "isActive" : currentCheckList.isActive,
      botId
    };
    this.loading = true;
    this.service.invoke('put.acchecklists', {botId, clId}, payload) .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data)=>{
      console.log(data, 'data');
      
    },(err)=> {
      currentCheckList.isActive = false;
      this.notificationService.showError(err, this.translate.instant("COACHING.PUBLISH_FAILURE"));

    });
  }

  updateCl(e){
    this.update.emit(e);
  }

  onReachEnd(event){
    if(!this.loading && this.hasMore && event.target.scrollTop > 0){
      this.zone.run(()=>{
        this.getPrimaryList();
      })
    }
  }

}
