import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { NotificationService } from './../../../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Agent } from '../agents.model';
import { AuthService } from '@kore.services/auth.service';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { AgentsService } from '../agents.service';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from '../../agent-settings/user-management/user-management.service';
@Component({
  selector: 'app-new-agent',
  templateUrl: './new-agent.component.html',
  styleUrls: ['./new-agent.component.scss']
})
export class NewAgentComponent implements OnInit {
  agent = new Agent;
  submitted: boolean = false;
  isEditMode: boolean = false;
  selectedGroup: string;
  selectedHoursOperation: string;
  validExtensions: string[] = ['.png'];
  profileImg:any;
  modalTitle: string = this.translate.instant("AGENTS.ADD_NEW_AGENT");
  skillsList: any = [];
  addedSkills: any = [];
  showSkillSearchDropdown: boolean = false;
  selectedSkill: string;
  agentGroups: any = [];
  hoursOperationList: any = [];
  languagesList: any = [];
  voiceLanguagesList: any = [];
  roles: any = [];
  selectedRole: string;
  currentAccUser;

  @Input() selectedAgent: any = {}; 
  @Input() selectedAgentGrp: any = {};
  @Output() closed = new EventEmitter();
  
  @ViewChild('skillSearchTerm') skillSearchTermEle: ElementRef;

  constructor(private service:ServiceInvokerService, private userManagementService: UserManagementService,
    private notificationService: NotificationService, private agentSevice: AgentsService,
    private translate: TranslateService, private authService: AuthService,
    public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentAccUser = this.authService.getAuthInfo()?.currentAccount?.userInfo.emailId;
    if(this.selectedAgent && this.selectedAgent.firstName){
      this.modalTitle = this.translate.instant("AGENTS.EDIT_AGENT");
      this.isEditMode = true;
      this.agent = this.selectedAgent;
      this.agent.oldRoleId = this.selectedAgent.roleId;
      if(!this.agent.maxChatSupport){
        this.agent.maxChatSupport = 5;
      }
      this.addedSkills = this.agent.skills;
    }else{
      this.modalTitle = this.translate.instant("AGENTS.ADD_NEW_AGENT");
      this.isEditMode = false;
      this.agent.profImage = 'no-avatar';
      
      this.selectedGroup = this.selectedAgentGrp.name;
      this.agent.agentGroupId = this.selectedAgentGrp.id;
    }
    this.getGroupAgents();
    this.getSkills();
    this.getHoursofOperations();
    this.getLanguages();
    this.userManagementService.getRoles().subscribe(roles => {
      this.roles = roles;
      if(this.isEditMode){
        let selectedRole = this.roles.filter(role => role.id === this.selectedAgent.roleId);
        if(selectedRole && selectedRole.length){
          this.selectedRole = selectedRole[0].role;
          this.agent.roleId = selectedRole[0].id;
        }
      }
     
    }, error => {
      // this.workflowService.showError(error, 'Failed to fetch roles');
    });
  }

  close(value) {
    this.closed.emit(value);
  }

  onGroupSelect(agentGp){
    this.selectedGroup = agentGp.name;
    this.agent.agentGroupId = agentGp.id;
  }

  onHoursOperationSelect(item){
    this.selectedHoursOperation =  item.name;
    this.agent.hoursOfOperationId = item.id;
  }

  saveNewAgent(isFormInvalid: boolean){
    this.submitted=true; 
    if(!this.validate(isFormInvalid)){
      return;
    }
    if(this.isEditMode){
      this.updateAgent();
    }else{
      this.addAgent();
    }
  }

  validate(isFormInvalid): boolean{
    // if(isFormInvalid){
    if(isFormInvalid || !this.agent.agentGroupId || !this.agent.hoursOfOperationId || !this.agent.roleId){
      this.notificationService.showError(undefined, this.translate.instant("AGENTS.FORM_INVALID"));
      return false;
    }
    if((/[`!@#$%^&()+\-=\[\]{};':"\\|,\/?~_<>*.]/.test(this.agent.firstName.trim()))) {
      this.notificationService.notify(this.translate.instant('AGENTS.PLS_ENTER_VALID_FIRSTNAME'), 'error');
      return false;
    }
    if((/[`!@#$%^&()+\-=\[\]{};':"\\|,\/?~_<>*.]/.test(this.agent.lastName.trim()))) {
      this.notificationService.notify(this.translate.instant('AGENTS.PLS_ENTER_VALID_LASTNAME'), 'error');
      return false;
    }
    if(this.agent.nickName && (/[`!@#$%^&()+\-=\[\]{};':"\\|,\/?~_<>*.]/.test(this.agent.nickName.trim()))) {
      this.notificationService.notify(this.translate.instant('AGENTS.PLS_ENTER_VALID_NICKNAME'), 'error');
      return false;
    }
    if(this.agent.maxChatSupport <= 0 || this.agent.maxChatSupport > 100){
      this.notificationService.notify(this.translate.instant('AGENTS.MAX_CHATS_BETWEEN_1_100'), 'error');
      return false;
    }
    if(!_.some(_.pluck(this.languagesList,"isActive"))){
      this.notificationService.notify(this.translate.instant('AGENTS.CHAT_SUPPORT_LANG_VALIDATION'), 'error');
      return false;
    }
    if(!_.some(_.pluck(this.voiceLanguagesList,"isActive"))){
      this.notificationService.notify(this.translate.instant('AGENTS.VOICE_SUPPORT_LANG_VALIDATION'), 'error');
      return false;
    }
    return true;
  }

  addAgent(){
    let params = {};
    let agentPayload: Agent = this.getUPayload();
    this.service.invoke('post.createNewAgent', params, agentPayload).subscribe(res=>{
      this.notificationService.notify(this.translate.instant("AGENTS.NEW_AGENT_CREATED_SUCCESSFULLY"), 'success');
      res['role'] = this.translate.instant("SKILLS.AGENT");
      this.agentSevice.agentUpdate$.next({
        data: res,
        action: 'add'
      });
      this.close(true);
    }, err =>{
      this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_CREATE_AGENT"));
    })
  }

  updateAgent(){
    let params = {"agentId": this.selectedAgent.id, "groupId": this.selectedAgentGrp.id};
    let agentPayload: any =  this.agent;
    agentPayload["nickName"] = this.agent.nickName && this.agent.nickName;
    agentPayload["chatLanguageSupport"] = this.setLanguages(this.languagesList);
    agentPayload["voiceLanguageSupport"] = this.setLanguages(this.voiceLanguagesList);
    if(this.agent.profImage && this.agent.profImage.startsWith("http")){
      delete agentPayload['profImage'];
    }else{
      agentPayload['profImage'] = this.agent.profImage ? this.agent.profImage : "no-avatar";
    }
    agentPayload['skills'] = this.getSelectedSkills();

    this.service.invoke('put.agent', params, agentPayload).subscribe(res=>{
      this.notificationService.notify(this.translate.instant("AGENTS.AGENT_UPDATE_SUCCESSFULLY") + " " + this.agent.firstName + this.agent.lastName + " ", 'success');
      this.agentSevice.agentUpdate$.next({
        data: res,
        action: 'edit'
      });
      this.close(true);
    }, err =>{
      this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_UPDATE_AGENT"));
    })
  }

  getUPayload(): Agent{
    let agentPayload: Agent = {
      firstName: this.agent.firstName,
      lastName: this.agent.lastName,
      nickName: this.agent.nickName && this.agent.nickName,
      phoneNumber: this.agent.phoneNumber,
      emailId: this.agent.emailId,
      profImage: this.agent.profImage ? this.agent.profImage : "no-avatar",
      agentGroupId: this.agent.agentGroupId,
      hoursOfOperationId: this.agent.hoursOfOperationId,
      agentAffinity: this.agent.agentAffinity,
      canSupportChat: this.agent.canSupportChat,
      maxChatSupport: this.agent.maxChatSupport,
      roleId: this.agent.roleId,
      oldRoleId: "",
      // chatLanguageSupport: this.agent.canSupportChat && this.agent.chatLanguageSupport,
      chatLanguageSupport:  this.setLanguages(this.languagesList) || [],
      canSupportVoice: this.agent.canSupportVoice,
      voiceLanguageSupport: this.setLanguages(this.voiceLanguagesList) || [],
      skills:  this.getSelectedSkills()
    }
    return agentPayload;
  }

  setLanguages(languages){
    let arr: any = [];
    arr =  languages.map(lang => {
      return {
        "language": lang.language,
        "proficiency": lang.proficiency,
        "isActive": lang.isActive
      }
    })
    return arr;
  }

  onProfileChange(file){
    if (file) {
      const _ext = file.name.substring(file.name.lastIndexOf('.'));
      
      if (this.validExtensions.indexOf(_ext.toLowerCase()) === -1) {
        this.notificationService.notify(this.translate.instant('NOTIFY.INVALID_EXT', {ext: this.validExtensions.join(', ').toUpperCase()}), "error");
        return;
      }
      const self = this;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        self.profileImg = event.target.result;
        
        let formData = new FormData();
        formData.append('file', file);
        formData.append('fileContext', 'marketplace');
        formData.append('fileExtension', file.name.substring(file.name.lastIndexOf('.') + 1));
        formData.append('Content-Type', file.type);

        const _params = { "userId": this.authService.getUserId() }
        this.service.invoke('post.uploadfaqfile', _params, formData)
          .pipe(finalize(() => { }))
          .subscribe(
            res => {
              this.agent.profImage = res.fileId;
              this.notificationService.notify(this.translate.instant('NOTIFY.FILE_UPLOADED_SUCCESSFULLY'), "success");
            }, err => { 
              this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_UPLOAD_FILE')) 
            });
      };
    }
  }

  deleteImg(){
    this.profileImg = undefined;
    this.agent.profImage = "no-avatar";
  }

  deleteAgent() {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '530px',
      panelClass: "delete-skill",
      data: {
        title: `${this.translate.instant('SKILLS.R_U_SURE')} ${this.selectedAgent.firstName} ${this.selectedAgent.lastName} ?`,
        text: `${this.selectedAgent.firstName} ${this.translate.instant('AGENTS.AGENT_DEL_TEXT')}`,
        buttons: [{ key: 'yes', label: this.translate.instant('SKILLS.DELETE'), type: 'danger' }, { key: 'no', label: this.translate.instant('SKILLS.NO_I_DONT') }]
      }
    });

    
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          const params = {
            agentId: this.selectedAgent.id,
            groupId: this.selectedAgentGrp.id
          }
          this.service.invoke('delete.agent', params).subscribe(
            res => {
              this.notificationService.notify(`${this.selectedAgent.firstName}  ${this.translate.instant('AGENTS.AGENT_DELETE')}`, 'success');
              this.agentSevice.agentUpdate$.next({
                data: res,
                action: 'delete'
              });
              this.close(true);
            }, err => {
              this.notificationService.showError(err, this.translate.instant('AGENTS.FAILED_DELETE_AGENT')) 
            }
          );
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  profiencyLevelChanged(language, type: string){
    language["proficiency"] = type;
    language["profiencyLevel"] = {};
    language["profiencyLevel"][type] =  true;
  }

  skillProfiencyLevelChanged(skill: any,type: string){
    skill["proficiencyLevel"] = type;
  }

  getSkills(){
    const params = {
      orgId: this.authService.getOrgId(),
      limit: -1,
      page: 1
    };
    let _self: any =  this;
    _self.service.invoke('get.agentSkills', params).subscribe(res => {
       if(_self.isEditMode && _self.addedSkills && _self.addedSkills.length){
         _self.skillsList = [];
         let skillIds= _.map(_self.addedSkills, "skillId");
         _self.skillsList = _.filter(res.results, p => _.indexOf(skillIds, p._id) === -1);
       }else{
        _self.skillsList = res.results;
       }
      }, err => {
        _self.notificationService.showError(err, _self.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
      }); 
  }

  onClickSkill(skill){
    this.selectedSkill = skill.name;
    skill["proficiencyLevel"]="expert";
    if(skill._id){
      skill["skillId"]=skill._id;
    }
    this.skillsList = this.skillsList.filter(item => item.skillId !== skill.skillId);
    this.addedSkills.push(skill);
    this.selectedSkill = "";
}

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.skillSearchTermEle && this.skillSearchTermEle.nativeElement.contains(event.target)) {
      this.showSkillSearchDropdown = true;
    } else {
      this.showSkillSearchDropdown = false;
    }
  }

  deleteSkill(skill){
    let arr: any = [];
    arr = JSON.parse(JSON.stringify(this.skillsList));
    this.skillsList = [];
    arr.push(skill); 
    this.addedSkills = this.addedSkills.filter(item => item.skillId !== skill.skillId);
    this.skillsList = [...arr];
  }

  getSelectedSkills(){
    let selectedSkills: any = [];
    this.addedSkills.forEach(element => {
      selectedSkills.push({
        "skillId": element.skillId,
        "proficiencyLevel": element.proficiencyLevel
      })
    });
    
    return selectedSkills;
  }

  isNumber(evt){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if(charCode == 43 || charCode == 32){
        return true;
      }
        return false;
    }
    return true;
  }

  getHoursofOperations() {
    const params = {"limit" : -1, "page": 1};
    this.service.invoke('get.agentSettings.hoursOperations', params).subscribe(res => {
      this.hoursOperationList = res;
      let selectedHoursOperation = this.hoursOperationList.filter(agentGp => agentGp.id === this.selectedAgent.hoursOfOperationId);
      if(selectedHoursOperation && selectedHoursOperation.length){
        this.selectedHoursOperation = selectedHoursOperation[0].name;
        this.agent.hoursOfOperationId = selectedHoursOperation[0].id;
      }
    }, err => {
      this.notificationService.showError(err, this.translate.instant("AGENTSETTINGS.HOURS_OPERATION_LOAD_FAILED"));
    });
  }

  getLanguages(){
    const params = {};
    this.service.invoke('get.agentLangSettings', params).subscribe(res => {
      if(res && res.length){
        if(res[0].languages && res[0].languages.length){
          if(this.isEditMode){
            this.languagesList = _.filter(res[0].languages, item => item.isActive && item.accessLevel.agent);
            this.bindingLanguages(this.languagesList,this.agent.chatLanguageSupport);
            this.voiceLanguagesList =  JSON.parse(JSON.stringify(this.languagesList));
            this.bindingLanguages(this.voiceLanguagesList,this.agent.voiceLanguageSupport);
          }else{
            this.languagesList = _.filter(res[0].languages, item => item.isActive && item.accessLevel.agent);
            _.forEach(this.languagesList,element => {
              element['profiencyLevel'] = {};
              element['profiencyLevel']['expert'] = true;
              element["proficiency"] = 'expert';
              element["isActive"] = false;
            });
            
            this.voiceLanguagesList =  JSON.parse(JSON.stringify(this.languagesList));
          }
        }
      }
     }, err => {
       this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
     }); 
  }

  bindingLanguages(languages, list){
    _.forEach(languages,element => {
      let arr = _.filter(list, element2 => element.language == element2.language)
      if(arr && arr.length){
        element['profiencyLevel'] = {};
        element['profiencyLevel'][arr[0].proficiency] = true;
        element["proficiency"] = arr[0].proficiency;
        element["isActive"] = arr[0].isActive;
      }else{
        element['profiencyLevel'] = {};
        element['profiencyLevel']['expert'] = true;
        element["proficiency"] = 'expert';
        element["isActive"] = false;
      }
    });
  }

  onEnter(event){
    this.showSkillSearchDropdown = false;
    if(event){
      let arr: any = [];
      _.each(this.skillsList, item=>{
        if((item.name.toLowerCase()).includes(event.toLowerCase())){
          arr.push(item);
        }
      })
      if(arr && arr.length == 1){
        this.onClickSkill(arr[0]);
      }
    }
    this.showSkillSearchDropdown = true;
  }

  onChatSupportChange(){
    if(this.agent.canSupportChat && (this.languagesList && this.languagesList.length == 0)){
      this.notificationService.showError(undefined,this.translate.instant("AGENTS.NO_LANGUAGES_AVAILABLE"));
    }
  }

  onVoiceSupportChange(){
    if(this.agent.canSupportVoice && (this.voiceLanguagesList && this.voiceLanguagesList.length == 0)){
      this.notificationService.showError(undefined,this.translate.instant("AGENTS.NO_LANGUAGES_AVAILABLE"));
    }
  }

  getGroupAgents(){
    const params = {
      name: "",
      sortBy: "",
      limit: -1,
      page: 1
    };
    this.service.invoke('get.agentsGp', params).subscribe(res => {
      this.agentGroups = res.results;
      if(this.isEditMode){
        let selectedGroup = this.agentGroups.filter(agentGp => agentGp.id === this.selectedAgent.agentGroupId);
        this.selectedGroup = selectedGroup[0].name;
      }
      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
      }); 
  }

  onRoleSelect(role){
    this.selectedRole = role.role;
    this.agent.roleId = role.id; 
  }

}
