import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { AgentsService } from '../agents.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-new-agent-group',
  templateUrl: './new-agent-group.component.html',
  styleUrls: ['./new-agent-group.component.scss']
})
export class NewAgentGroupComponent implements OnInit {
  agentGroup: any = {};
  submitted: boolean = false;
  isEditMode: boolean = false;
  modalTitle: string = this.translate.instant("AGENTS.ADD_NEW_AGENT_GROUP");
  managersList: any = [];
  addedMangers: any = [];
  selectedManagerFromDropdown = [];
  showManagersSearchDropdown: boolean = false;
  selectedManager: string;

  @Input() selectedAgentGrp: any = {};
  @Output() closed = new EventEmitter();
  @ViewChild('managerSearchTerm') managerSearchTermEle: ElementRef;

  constructor(private service:ServiceInvokerService, 
    private notificationService: NotificationService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public authService: AuthService,
    private agentService: AgentsService) { }

  ngOnInit(): void {
    if(this.selectedAgentGrp && this.selectedAgentGrp.name){
      this.modalTitle= this.translate.instant("AGENTS.EDIT_AGENT_GROUP");
      this.isEditMode = true;
      this.agentGroup = this.selectedAgentGrp;
    }else{
      this.modalTitle= this.translate.instant("AGENTS.ADD_NEW_AGENT_GROUP");
      this.isEditMode = false;
    }
    this.getManagers();
  }

  close(isUpdated?) {
    if(!this.submitted){
     this.addedMangers.map((val,index)=>{
       this.selectedManagerFromDropdown.forEach((vals)=>{
         if(vals.id === val.id){
           this.addedMangers.splice(index,1);
         }
       })
     })
    }
    this.closed.emit(isUpdated?isUpdated:'');
  }

  saveAgentGroup(isFormInvalid){
    this.submitted = true;
     if(isFormInvalid){
      this.notificationService.showError(undefined, this.translate.instant("AGENTS.FORM_INVALID"));
      return;
    }
    if((/[`!@#$%^&()+\-=\[\]{};':"\\|,\/?~_<>*.]/.test(this.agentGroup.name.trim())) ) {
      this.notificationService.notify(this.translate.instant('AGENTS.PLS_ENTER_VALID_AGENTGP_NAME'), 'error');
      return;
    }
    if(this.isEditMode){
     this.updateAgentGroup(); 
    }else{
      this.addAgentGroup();
    }
  }

  addAgentGroup(){
    let payload: any = this.getAgentGpPayload();
    let params = {};
    this.service.invoke('post.createNewAgentGroup', params, payload).subscribe(res=>{
      this.notificationService.notify(this.translate.instant("AGENTS.NEW_AGENT_GROUP_CREATED_SUCCESSFULLY") + " ", 'success');
      this.agentService.appendAgentGps(res);
      this.close();
    }, err =>{
      this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_CREATE_AGENT_GROUP"));
    })
  }

  updateAgentGroup(){
    let payload: any = this.getAgentGpPayload();
    let params = {"id": this.selectedAgentGrp.id};
    this.service.invoke('put.agentsGp.update', params, payload).subscribe(res=>{
      this.notificationService.notify(this.translate.instant("AGENTS.UPDATE_AGENT_GROUP_CREATED_SUCCESSFULLY") + " ", 'success');
      this.agentService.updateAgentGps(res);
      this.close(true);
    }, err =>{
      this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_UPDATE_AGENT_GROUP"));
    })
  }

  getAgentGpPayload(){
    let authInfo: any  = this.authService.getAuthInfo();
    let managers = [];
    this.addedMangers.forEach(element => {
      managers.push({"userId":element.userId, "accessLevel": element.accessLevel, "accountId": element.accountId})
    });
    let agentGpPayload: any = {
      name: this.agentGroup.name,
      description: this.agentGroup.description,
      managers: managers
    }
    return agentGpPayload;
  }

  deleteAgentGroup(){
    if(this.agentGroup.totalAgents){
      const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
        width: '530px',
        panelClass: "delete-skill",
        data: {
          title: `${this.translate.instant("AGENTS.HAS_AGENTS_TITLE")}`,
          text: `${this.translate.instant("AGENTS.HAS_AGENTS_TEXT")}`,
          buttons: [{ key: 'no', label: "Go Back" }]
        }
      });
  
      dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'no') {
            dialogRef.close();
          }
        });
    }else{
      const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
        width: '530px',
        panelClass: "delete-skill",
        data: {
          title: `${this.translate.instant('AGENTS.DELETE_AGENTGP_TITLE')}`,
          text: `${this.translate.instant('AGENTS.DELETE_AGENTGP_TEXT')}`,
          buttons: [{ key: 'yes', label: this.translate.instant('SKILLS.DELETE'), type: 'danger' }, { key: 'no', label: this.translate.instant('SKILLS.NO_I_DONT') }]
        }
      });
  
      dialogRef.componentInstance.onSelect
        .subscribe(result => {
          if (result === 'yes') {
            dialogRef.close();
            const params = {
              id: this.agentGroup.id
            }
            this.service.invoke('delete.agentsGp', params).subscribe(
              res => {
                this.notificationService.notify(`${this.agentGroup.name}  ${this.translate.instant('AGENTS.AGENT_GP_DELETE')}`, 'success');
                this.agentService.deleteAgentGps(res.id);
                this.close();
              }, err => {
                  this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_DELETE_AGENT_GP"));
              }
            );
          } else if (result === 'no') {
            dialogRef.close();
          }
        });
    }
    
    
  }

  getManagers(){
    let authInfo: any  = this.authService.getAuthInfo();
    const params = {
      sortBy: "",
      role: "",
      limit: 10,
      page: 1,
      orgId: this.authService.getOrgId()
    };

    this.service.invoke('get.agentGpManagers', params).subscribe(res => {
      if(this.isEditMode){
        this.addedMangers = this.agentGroup.managers;
        let userIds= _.map(this.addedMangers, "userId");
        this.managersList = _.filter(res.results, mnger => _.indexOf(userIds, mnger.userId) === -1);
      }else{
        let currentUser = res.results.filter(manager => manager.userId === authInfo.currentAccount.userInfo.id);
        this.managersList = res.results.filter(manager => manager.userId !== authInfo.currentAccount.userInfo.id);
        if(currentUser && currentUser.length){
         currentUser[0]["accessLevel"] = "full";
          this.addedMangers.push(currentUser[0]);
        }else{
          let defaultManager: any = {};
          defaultManager["firstName"] = authInfo.currentAccount.userInfo.fName;
          defaultManager["lastName"] = authInfo.currentAccount.userInfo.lName;
          defaultManager["emailId"] = authInfo.currentAccount.userInfo.emailId;
          defaultManager["userId"] = authInfo.currentAccount.userInfo.id;
          defaultManager["accountId"] = authInfo.currentAccount.authorization.accountId;
          defaultManager["accessLevel"] = "full";
          this.addedMangers.push(defaultManager)
        }
      }
      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
      }); 
  }

  onClickManager(manager){
    this.selectedManager =  manager.firstName+ " "+ manager.lastName;
    manager["accessLevel"] = "full";
    this.selectedManagerFromDropdown.push(manager);
    this.addedMangers.push(manager);
    this.managersList = this.managersList.filter(mnger => mnger.id !== manager.id);
    this.selectedManager = "";
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.managerSearchTermEle && this.managerSearchTermEle.nativeElement.contains(event.target)) {
      this.showManagersSearchDropdown = true;
    } else {
      this.showManagersSearchDropdown = false;
    }
  }

  managerAccessLevelChanged(manager, type: string){
    manager['accessLevel'] = type;
  }

  deleteManager(manager){
    let arr: any = [];
    arr = JSON.parse(JSON.stringify(this.managersList));
    this.managersList = [];
    arr.push(manager);
    this.addedMangers = this.addedMangers.filter(mnger => mnger.id !== manager.id);
    this.managersList = [...arr];
  }

}
