import { Component, Input, OnInit } from '@angular/core';
import { UsecasesMainService } from '../../../uc-main.service';
import { Category, UsecaseOb, UsecaseParams } from '../../uc-table-main.model';
import { workflowService } from '@kore.services/workflow.service';
import { UsecasesTableMainService } from '../../uc-table-main.service';
import {ServiceInvokerService} from "@kore.services/service-invoker.service";
import { NotificationService } from '@kore.services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-uc-groupby',
  templateUrl: './uc-groupby.component.html',
  styleUrls: ['./uc-groupby.component.scss']
})
export class UcGroupbyComponent implements OnInit {

  streamId: string;
  ucListFq: UsecaseOb[] = [];
  ucListDg: UsecaseOb[] = [];
  isLoading = true;

  @Input() category: Category;
  @Input() isCategory: boolean;

  constructor(public ucMainServ: UsecasesMainService,
              private ucTServ: UsecasesTableMainService,
              private service:ServiceInvokerService,
              private workflowService:workflowService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
  }

  expandCat() {
    const params = new UsecaseParams(this.streamId, "", this.category.category, "", this.ucMainServ.tabActive, 0, 500, false);
    this.service.invoke('get.usecases', params, {isSmartAssistOnly: true})
    .pipe(finalize(()=>{
      this.isLoading = false;
    }))
    .subscribe(res=>{
      if(this.ucMainServ.tabActive == 'faq') this.ucListFq = res.usecases;
      else if(this.ucMainServ.tabActive == 'dialog') this.ucListDg = res.usecases;
    }, err=>{
      this.showError(err, "Failed to fetch usecases")
    });
  }

  expandState(c) {
    const params = new UsecaseParams(this.streamId, "", "", c.id, this.ucMainServ.tabActive, 0, 500, false);
    this.service.invoke('get.usecases', params, {isSmartAssistOnly: true})
    .pipe(finalize(()=>{
      this.isLoading = false;
    }))
    .subscribe(res=>{
      if(this.ucMainServ.tabActive == 'faq') this.ucListFq = res.usecases;
      else if(this.ucMainServ.tabActive == 'dialog') this.ucListDg = res.usecases;
    }, err=>{
      this.showError(err, "Failed to fetch usecases")
    });
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  closeCat() { this.isLoading = true; }

}
