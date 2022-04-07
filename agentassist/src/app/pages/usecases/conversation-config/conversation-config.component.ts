import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { workflowService } from '@kore.services/workflow.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { UsecaseOb } from '../uc-main/uc-table-main/uc-table-main.model';
import { UsecasesTableMainService } from '../uc-main/uc-table-main/uc-table-main.service';
import { SkillsDdComponent } from '../skills-dd/skills-dd.component';
import { NgModel } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { Skill, SkillGp, SkillGpRsp, SkillRsp, SkillsLite } from '../../../data/skills.model';
declare const $: any;
@Component({
  selector: 'app-conversation-config',
  templateUrl: './conversation-config.component.html',
  styleUrls: ['./conversation-config.component.scss']
})
export class ConversationConfigComponent implements OnInit {

  callExp: {
    type: 'automatedDialog' | 'agentTransfer' | 'deflection',
    preTransferMsgType: 'default' | 'custom',
    preTransferMsgs: string[];
    offerDeflection: boolean,
    chatTransferType: "" | "deflection" | "agentTransfer";
    chatPreTransferMsgType: 'default' | 'custom',
    chatPreTransferMsgs: string[],
    preTransferMsgViewType: 'preview' | 'edit',
    chatPreTransferMsgViewType: 'preview' | 'edit',
    isConfigured: boolean,
    skills: string []
  }

  chatExp: {
    type: 'automatedDialog' | 'agentTransfer',
    preTransferMsgType: 'default' | 'custom',
    preTransferMsgs: string[],
    preTransferMsgViewType: 'preview' | 'edit',
    isConfigured: boolean,
    skills: string []
  }
  

  saveInProgress: boolean = false;

  defaultMessages: {
    callPreTransferMsg: string;
    chatPreTransferMsg: string;
    chatAgentOptMsg: string;
    chatAutomationOptMsg: string;
  }
  allSkillData: SkillsLite[];

  isEditable: boolean = true;

  skillsLoaded = false;
  hideInfo = false;

  viewType: 'preview' | 'edit' = 'preview';
  defaultMessage: string = "Our company believes in supporting our local farmers, economy and community by sourcing as many of our ingredients as possible from Pennsylvania. The bounty of local produce inspires our weekly market pizza specials, helpin, Our company believes in supporting our local farmers, economy and community by sourcing as many of our ingredients as possible from Pennsylvania. The bounty of local produce inspires our weekly market pizza specials, helpin...";
  

  @ViewChild('confToggle') confToggle: ElementRef;
  @ViewChild('callSkills') callSkills: SkillsDdComponent;
  @ViewChild('chatSkills') chatSkills: SkillsDdComponent;



  @Input() inputData: UsecaseOb;
  @Input() tabActive: string;
  @Input() hideToogleSlider: boolean = false;
  @Output() closed = new EventEmitter();
  constructor(
    public workflowService: workflowService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private service: ServiceInvokerService,
    private localStoreService: LocalStoreService,
    public authService: AuthService,
    private usecaseTableSerice: UsecasesTableMainService
  ) { }

  ngOnInit(): void {
    this.workflowService.conversationConfig$.subscribe(data =>{
      if(data){
        this.launchPlatform();
      }
    })

    this.inputData = JSON.parse(JSON.stringify(this.inputData));
    if(this.inputData.isEnabled == undefined){
      this.inputData.isEnabled = true;
    }

    this.callExp = {
      type: this.inputData.callExperience.type || 'automatedDialog',
      preTransferMsgType: this.inputData.callExperience.preTransferMsgType || 'default',
      preTransferMsgs: this.inputData.callExperience.preTransferMsgs || [],
      offerDeflection: !!this.inputData.callExperience.settings.chat,
      chatTransferType: this.inputData.callExperience.settings.chat,
      chatPreTransferMsgType: this.inputData.callExperience.settings.chatPreTransferMsgType || 'default',
      chatPreTransferMsgs: this.inputData.callExperience.settings.chatPreTransferMsgs || [],
      preTransferMsgViewType: 'preview',
      chatPreTransferMsgViewType: 'preview',
      isConfigured: this.inputData.callExperience.isConfigured,
      skills: this.inputData.callExperience.skills || []
    };

    this.chatExp = {
      type: this.inputData.chatExperience.type || 'automatedDialog',
      preTransferMsgType: this.inputData.chatExperience.preTransferMsgType || 'default',
      preTransferMsgs: this.inputData.chatExperience.preTransferMsgs || [],
      preTransferMsgViewType: 'preview',
      isConfigured: this.inputData.chatExperience.isConfigured,
      skills: this.inputData.chatExperience.skills || []
    };

    this.defaultMessages = {
      callPreTransferMsg: (this.usecaseTableSerice.defaultConfigs && this.usecaseTableSerice.defaultConfigs.callPreTransferMsg) || '',
      chatPreTransferMsg: (this.usecaseTableSerice.defaultConfigs && this.usecaseTableSerice.defaultConfigs.chatPreTransferMsg) || '',
      chatAgentOptMsg: (this.usecaseTableSerice.defaultConfigs && this.usecaseTableSerice.defaultConfigs.chatAgentOptMsg) || '',
      chatAutomationOptMsg: (this.usecaseTableSerice.defaultConfigs && this.usecaseTableSerice.defaultConfigs.chatAutomationOptMsg) || ''
    }

    this.isEditable = this.workflowService.appState === 'configured';

    if (this.isEditable) {
      if (this.callExp.preTransferMsgType === 'custom' && !this.callExp.preTransferMsgs[0]) {
        this.callExp.preTransferMsgViewType = 'edit';
      }

      if (this.callExp.chatPreTransferMsgType === 'custom' && !this.callExp.chatPreTransferMsgs[0]) {
        this.callExp.chatPreTransferMsgViewType = 'edit';
      }

      if (this.chatExp.preTransferMsgType === 'custom' && !this.chatExp.preTransferMsgs[0]) {
        this.chatExp.preTransferMsgViewType = 'edit';
      }
    }

    if (this.authService.isAgentDesktopEnabled$.value) {
      this.getAllSkills();
    }

    setTimeout(() => {
      if (this.tabActive === 'chat') {
        $("[href='#chat']").click();
      }
    });
  }

  save() {
    this.inputData.isEnabled = this.confToggle.nativeElement.checked;
    if(this.inputData["hasAgentAssistAccess"]){
      this.inputData["triggerPoints"] = {
        "isChatEnabled": true,
        "isVoiceEnabled": true,
        "isEmailEnabled": false,
        "isSkillMatchEnabled": false,
        "isAgentGroupMatchEnabled": false,
        "agentGroups": [
        
        ],
        "isAutoDetectIntentEnabled": true,
        "isLaunchByMenuEnabled": true,
        "skillMatchRules": [
        
        ]
      }
    }
    this.inputData.callExperience.type = this.callExp.type;
    this.inputData.callExperience.preTransferMsgType = this.callExp.preTransferMsgType;
    this.inputData.callExperience.preTransferMsgs = this.callExp.preTransferMsgs;
    this.inputData.callExperience.settings.chat = (this.callExp.offerDeflection || this.callExp.type === 'deflection')? this.callExp.chatTransferType : '';
    this.inputData.callExperience.settings.chatPreTransferMsgType = this.callExp.chatPreTransferMsgType;
    this.inputData.callExperience.settings.chatPreTransferMsgs = this.callExp.chatPreTransferMsgs;
    this.inputData.callExperience.isConfigured = this.callExp.isConfigured;
    this.inputData.callExperience.skills = this.callSkills?.addedSkillsId;

    this.inputData.chatExperience.type = this.chatExp.type;
    this.inputData.chatExperience.preTransferMsgType = this.chatExp.preTransferMsgType;
    this.inputData.chatExperience.preTransferMsgs = this.chatExp.preTransferMsgs;
    this.inputData.chatExperience.isConfigured = this.chatExp.isConfigured;
    this.inputData.chatExperience.skills = this.chatSkills?.addedSkillsId;

    this.close(true);
  }

  close(saveOnClose?: boolean) {
    if (this.saveInProgress) return;
    this.saveInProgress = true;

    const _obj = {
      data: this.inputData,
      type: 'conversations',
      cb: (flag) => {
        this.saveInProgress = false;
      },
      saveOnClose: saveOnClose
    }
    this.closed.emit(_obj);
  }

  onChangeCallExpType(type: any) {
    this.callExp.type = type;
    this.callExp.chatTransferType = this.callExp.chatTransferType || 'deflection';
    this.callExp.isConfigured = true;
  }

  onClickCustomMsg(type: string, arg?: string) {
    if (arg === 'preTransferMsgType') {
      this[type].preTransferMsgType = 'custom';
      if (!this[type].preTransferMsgs[0] && this.isEditable) {
        this[type].preTransferMsgViewType = 'edit';
      }
    } else {
      this[type].chatPreTransferMsgType = 'custom';
      if (!this[type].chatPreTransferMsgs[0] && this.isEditable) {
        this[type].chatPreTransferMsgViewType = 'edit';
      }
    }
  }

  onChangeOfferDeflection() {
    this.callExp.offerDeflection = !this.callExp.offerDeflection;
    this.callExp.chatTransferType = this.callExp.chatTransferType || 'deflection';
  }

  getAllSkills() {
    const params1 = {
      orgId: this.authService.getOrgId(),
      limit: -1
    }

    const params2 = {
      name: '',
      limit: -1,
      skip: 0,
      minPoints: 0
    }

    combineLatest([
      this.service.invoke('get.allSkills', params1).pipe(
          map((res: SkillRsp) => {
            res.results = res.results.filter(val => val.status == "ACTIVE");
            return res.results.map((val)=> {
              return {
                name: val.name,
                id: val._id,
                type: 'skill',
                color: val.color
              }
            });
          }),
          catchError(err => of({error: err, type: 'error'}))
        ),
      this.service.invoke('get.skillsGp', params2).pipe(
          map((res: SkillGpRsp) => {
            res.results = res.results.filter(val => val.status == "ACTIVE" && val.skillsCount !== 0);
            return res.results.map((val) => {
              return {
                name: val.name,
                id: val.id,
                type: 'skillGp',
                count: val.skillsCount,
                color: val.color
              }
            })
          }),
          catchError(err => of({error: err, type: 'error'}))
        )
    ]).pipe( finalize(()=>{ this.skillsLoaded = true; }) )
      .subscribe(([res1, res2]:any) => {
      if(res1?.type == 'error') {
        this.workflowService.showError(res1.error, "");
      } else {
        this.allSkillData = res1;
      }
      if(res2?.type == 'error') {
        this.workflowService.showError(res2.error, "");
      } else {
        this.allSkillData = res2.concat(this.allSkillData);
      }
    });
  }


  launchPlatform() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '446px',
      height: '306px',
      panelClass: "manage-deflection-exp-popup",
      data: {
        title: this.translate.instant("COMMON.CONFIRMATION"),
        text: this.translate.instant("COMMON.PLATFORM_NAV"),
        text1: this.translate.instant("COMMON.ASSISTANT_PLATFORM"),
        buttons: [{ key: 'yes', label: this.translate.instant("BUTTONS.PROCEED") }, { key: 'no', label: this.translate.instant("BUTTONS.CANCEL") }]
      }
    });

    dialogRef.componentInstance.showLearnMore = true;

    dialogRef.componentInstance.onSelect.subscribe(result => {
      if (result === 'yes') {

        const url = this.workflowService.resolveHostUrl() + "/botbuilder";
        this.service.invoke('get.token').subscribe(res => {
          if (res.token) {
            const qp = {
              streamId: this.workflowService.getCurrentBt()._id,
              selectedAccount: (this.localStoreService.getSelectedAccount() && this.localStoreService.getSelectedAccount().accountId) || (this.authService.getSelectedAccount() && this.authService.getSelectedAccount().accountId),
              selectedBotLanguage:  this.workflowService.getCurrentBt().defaultLanguage,
              usecaseType: 'conversation',
              dgId: this.inputData.dialogId,
              state: this.inputData.state == 'configured'?'indevelopment':'published',
              appLanguage: this.localStoreService.appLanguage
            }
            // kgId: "5fbe0ab80be5c12859a73edd"
            const encodedQueryParams = btoa(JSON.stringify(qp));
            const finalUrl = `${url}/?&qp=${encodedQueryParams}#id_token=${res.token}`;
            window.open(finalUrl, "_self")
          }
        });
      } else if (result === 'learnMore') {
        window.open("https://developer.kore.ai/docs/bots/bot-builder-tool/dialog-task/dialog-tasks/");
        return;
      }

      dialogRef.close();
    });
  }

}
