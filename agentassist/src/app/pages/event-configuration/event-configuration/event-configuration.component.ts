import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NewServiceComponent } from './new-service/new-service.component';

@Component({
  selector: 'app-event-configuration',
  templateUrl: './event-configuration.component.html',
  styleUrls: ['./event-configuration.component.scss']
})
export class EventConfigurationComponent implements OnInit {

  respData : any = {};

  isLoading : boolean = false;

  modalFlowCreateRef: any;
  modalFlowEditRef : any;


  constructor(
    private modalService: NgbModal, private service: ServiceInvokerService,
    private workflowService: workflowService, private cdRef: ChangeDetectorRef,
    private notificationService: NotificationService, private translate: TranslateService,
    private auth: AuthService, private local: LocalStoreService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getServiceLevelData();
  }

  getServiceLevelData(){
    this.respData  = {
      results : [
        {
          name : 'Service Level 1',
          description : 'Demonstrating a courteous and respectful demenor',
          isActive : true
        },
        {
          name : 'Service Level 2',
          description : 'Demonstrating a courteous and respectful demenor',
          isActive : false
        },
        {
          name : 'Service Level 3',
          description : 'Demonstrating a courteous and respectful demenor',
          isActive : true
        },
        {
          name : 'Service Level 4',
          description : 'Demonstrating a courteous and respectful demenor',
          isActive : false
        }
      ]
    }
  }

  openNewService(){
    this.modalFlowCreateRef = this.modalService.open(NewServiceComponent, {
      windowClass: 'modal-ngb-wrapper-window',
      centered: true,
      backdrop: 'static'
    });

    this.modalFlowCreateRef.componentInstance.closeNewService.subscribe(value => {
      if(value){
        this.modalFlowCreateRef.close();
      }
    });
  }

  openFLowCreation(flowCreation) {
    this.modalFlowEditRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
  }

  closeFLowCreation(service?) {
    this.modalFlowEditRef.close();
  }

}
