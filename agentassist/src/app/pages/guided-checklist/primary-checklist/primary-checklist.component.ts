import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize } from 'rxjs/operators';

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
    private service: ServiceInvokerService
  ) { }
  @Input() checkListType;
  @Output() update = new EventEmitter();
  loading = false;
  selAcc = this.local.getSelectedAccount();
  primaryCheckList = []
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.checkListType?.currentValue === 'primary'){
      this.getPrimaryList();
    }
  }

  getPrimaryList(){
    this.loading = true;
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let body = {
      botId,
      searchText: '',
      limit: -1,
      sortBy: "asc",
      type: 'primary'
    };
    this.service.invoke('get.acchecklists', {botId}, body)
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data)=>{
      this.primaryCheckList = data.results;
    })
  }

  updateCl(e){
    this.update.emit(e);
  }

}
