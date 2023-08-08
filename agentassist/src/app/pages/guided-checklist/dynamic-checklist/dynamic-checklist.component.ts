import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-checklist',
  templateUrl: './dynamic-checklist.component.html',
  styleUrls: ['./dynamic-checklist.component.scss']
})
export class DynamicChecklistComponent implements OnInit, OnChanges {
  selAcc = this.local.getSelectedAccount();
  loading = false;
  @Input() checkListType;
  constructor(
    private service: ServiceInvokerService,
    private auth: AuthService,
    private local: LocalStoreService,
    private workflowService: workflowService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.checkListType?.currentValue === 'dynamic'){
      this.getDynamicList();
    }
  }

  ngOnInit(): void {

  }



  getDynamicList(){
    this.loading = true;
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let body = {
      botId,
      searchText: '',
      limit: -1,
      sortBy: "asc"
    };
    this.service.invoke('get.acchecklists', {botId}, body)
    .pipe(finalize(() => {
      this.loading = false;
    }))
    .subscribe((data)=>{
      console.log("datadatadata", data);
    })
  }

}
