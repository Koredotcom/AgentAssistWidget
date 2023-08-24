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
  selAcc = this.local.getSelectedAccount();
  constructor(
    private modalService : NgbModal,
    private auth: AuthService,
    private local: LocalStoreService,
    private service: ServiceInvokerService,
    private workflowService: workflowService,
    private clS: ChecklistService
  ) { }
  @ViewChild('checklistCreation') checklistCreation: ElementRef;
  ngOnInit(): void {
    this.getConfigDetails();
  }

  getConfigDetails() {
    let params: any = {
      userId: this.auth.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
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
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    this.service.invoke('get.checklistbyid', {botId, clId})
    .subscribe((data)=>{
      this.isStageListOpen = true;
      this.createOrUpdate = 'update';
      this.modalFlowCreateRef = this.modalService.open(this.checklistCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
      this.currentCheckList = {...data[0]};
    })
  }
  
}
