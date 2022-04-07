import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';
import { PALETTES } from '../../usecases/uc-main/uc-header/uc-header.model';
import { UsecasesMainService } from '../../usecases/uc-main/uc-main.service';
import { workflowService } from '@kore.services/workflow.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, finalize, map, startWith } from 'rxjs/operators';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AuthService } from '@kore.services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/helpers/components/confirmation-dialog/confirmation-dialog.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillsRoutingComponent } from '../skills-routing/skills-routing.component';
import { SkillGpRsp, SkillRsp, SkillsLite } from 'src/app/data/skills.model';
import { SkillsDdComponent } from '../../usecases/skills-dd/skills-dd.component';
import { UsecaseOb } from '../../usecases/uc-main/uc-table-main/uc-table-main.model';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import { Router } from '@angular/router';

declare const $: any;
@Component({
  selector: 'app-new-conversations',
  templateUrl: './new-conversations.component.html',
  styleUrls: ['./new-conversations.component.scss']
})
export class NewConversationsComponent implements OnInit, OnChanges, AfterViewInit {
  conv: any = {
    usecaseName: '',
    category: '',
    categoryColor: '',
    isEnabled: true,
    utterances: {
      alternates: []
    },
    hasAgentAssistAccess: true,
    isAgentAssistOnly: false,
    isBotUsecase: true,
    isAgentUsecase: true
  };

  triggerPoints: any = {
    "isChatEnabled": true,
    "isVoiceEnabled": true,
    "isEmailEnabled": true,
    "isSkillMatchEnabled": false,
    "isAgentGroupMatchEnabled": false,
    "agentGroups": [],
    "isAutoDetectIntentEnabled": true,
    "isLaunchByMenuEnabled": true,
    "skillMatchRules": []
  };

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
    skills: string[],
    responses: any[]
  };

  chatExp: {
    type: 'automatedDialog' | 'agentTransfer',
    preTransferMsgType: 'default' | 'custom',
    preTransferMsgs: string[],
    preTransferMsgViewType: 'preview' | 'edit',
    isConfigured: boolean,
    skills: string[],
    responses: any[]
  };

  defaultMessages: {
    callPreTransferMsg: string;
    chatPreTransferMsg: string;
    chatAgentOptMsg: string;
    chatAutomationOptMsg: string;
  };

  allSkillData: SkillsLite[];

  isEditable: boolean = true;

  skillsLoaded = false;
  hideInfo = false;

  viewType: 'preview' | 'edit' = 'preview';
  defaultMessage: string = "Our company believes in supporting our local farmers, economy and community by sourcing as many of our ingredients as possible from Pennsylvania. The bounty of local produce inspires our weekly market pizza specials, helpin, Our company believes in supporting our local farmers, economy and community by sourcing as many of our ingredients as possible from Pennsylvania. The bounty of local produce inspires our weekly market pizza specials, helpin...";


  selectedPallete: string = '';
  streamId: string;
  filteredCategories: any[];

  utterancesForm: FormGroup;
  altUtterances: FormArray;


  saveInProgress: boolean = false;
  submitted: boolean = false;

  stats = {
    failed: 0,
    success: 0,
    total: 0
  }

  agentGroups: any[] = [];
  selectedAgentGroups: any[] = [];

  responseMode: 'standard' | 'advanced' = 'standard';
  options: MdEditorOption = {
    showPreviewPanel: false,
    hideIcons: ['TogglePreview'],
    shiftEnter: true
  }

  @Input() inputData: UsecaseOb;
  @Input() tabActive: string = '';
  @Input() ucType: 'faq' | 'dialog' = 'dialog';
  @Input() categoryList: any[] = [];
  @Input() defaultConfigs: any = {};
  @Output() onClose = new EventEmitter();
  @ViewChild('autoCompleteInput') autoComplete: MatAutocompleteTrigger;
  @ViewChild('ucName') ucNameEle: ElementRef<HTMLElement>;
  @ViewChild('usecaseNameModel') usecaseNameModel: any;
  @ViewChild('categoryEle') categoryEle: any;
  @ViewChild('routingComp') routingComp: SkillsRoutingComponent;
  @ViewChild('confToggle') confToggle: ElementRef;
  @ViewChild('callSkills') callSkills: SkillsDdComponent;
  @ViewChild('chatSkills') chatSkills: SkillsDdComponent;
  constructor(
    private router: Router,
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public usecaseService: UsecasesMainService,
    private localStoreService: LocalStoreService,
    public authService: AuthService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt(true)._id;
    this.init();

    if (this.ucType === 'dialog') {
      this.getAgentGroups();
      this.getAllSkills();
    }

    setTimeout(() => {
      if (this.tabActive === 'call') {
        $("[href='#call']").click();
      } else if (this.tabActive === 'chat') {
        $("[href='#chat']").click();
      }
    });
  }

  init() {
    if (this.inputData) this.conv = JSON.parse(JSON.stringify(this.inputData));

    if (this.ucType === 'dialog') {
      if (!this.conv.triggerPoints) this.conv.triggerPoints = this.triggerPoints;

      
      this.conv.isAgentUsecase = true;
    }

    this.onCategory(this.conv.category);
    this.filteredCategories = this.categoryList;

    if (this.ucType === 'faq') {
      this.utterancesForm = this.fb.group({
        primaryUtterance: [(this.inputData?.utterances?.primary?.text) || '', Validators.required],
        altUtterances: this.fb.array([])
      });
    } else {
      this.utterancesForm = this.fb.group({
        altUtterances: this.fb.array([])
      });
    }
    this.altUtterances = ((this.utterancesForm.get('altUtterances')) as FormArray);

    (this.conv?.utterances?.alternates || []).forEach(utterance => this.addAltUtterance(utterance));
    if (this.altUtterances.length === 0) { this.addAltUtterance('') }


    this.callExp = {
      type: this.conv?.callExperience?.type || 'automatedDialog',
      preTransferMsgType: this.conv?.callExperience?.preTransferMsgType || 'default',
      preTransferMsgs: this.conv?.callExperience?.preTransferMsgs || [],
      offerDeflection: !!this.conv?.callExperience?.settings?.chat,
      chatTransferType: this.conv?.callExperience?.settings?.chat,
      chatPreTransferMsgType: this.conv?.callExperience?.settings?.chatPreTransferMsgType || 'default',
      chatPreTransferMsgs: this.conv?.callExperience?.settings?.chatPreTransferMsgs || [],
      preTransferMsgViewType: 'preview',
      chatPreTransferMsgViewType: 'preview',
      isConfigured: this.conv?.callExperience?.isConfigured,
      skills: this.conv?.callExperience?.skills || [],
      responses: (this.conv?.callExperience?.responses || []).map(res => {
        res.answer = decodeURIComponent(res.answer);
        res.viewType = 'preview';
        res.truncate = true;
        return res;
      })
    };


    this.chatExp = {
      type: this.conv?.chatExperience?.type || 'automatedDialog',
      preTransferMsgType: this.conv?.chatExperience?.preTransferMsgType || 'default',
      preTransferMsgs: this.conv?.chatExperience?.preTransferMsgs || [],
      preTransferMsgViewType: 'preview',
      isConfigured: this.conv?.chatExperience?.isConfigured,
      skills: this.conv?.chatExperience?.skills || [],
      responses: (this.conv?.chatExperience?.responses || []).map(res => {
        res.answer = decodeURIComponent(res.answer);
        res.viewType = 'preview';
        res.truncate = true;
        return res;
      })
    };

    if (!this.callExp?.responses.length) {
      this.callExp.responses.push({
        answer: decodeURIComponent('Response not yet provided'),
        viewType: 'preview',
        truncate: true
      })
    }
    if (!this.chatExp?.responses.length) {
      this.chatExp.responses.push({
        answer: decodeURIComponent('Response not yet provided'),
        viewType: 'preview',
        truncate: true
      })
    }

    this.defaultMessages = this.defaultConfigs || {
      callPreTransferMsg: '',
      chatPreTransferMsg: '',
      chatAgentOptMsg: '',
      chatAutomationOptMsg: ''
    }

    this.conv.isEnabled = this.conv.isEnabled === false ? false : true;

  }

  ngOnChanges() {
    if (!this.inputData) return;
  }

  ngAfterViewInit() {
    if (!this.inputData) {
      setTimeout(() => this.ucNameEle.nativeElement.focus(), 200);
    }
  }

  getAgentGroups() {
    const params = {
      name: "",
      sortBy: "",
      limit: -1,
      page: 1
    };

    this.service.invoke('get.agentsGp', params).subscribe(res => {
      this.agentGroups = res.results;
      if (this.inputData) {
        this.selectedAgentGroups = [];
        _.each(this.conv.triggerPoints.agentGroups, item => {
          this.selectedAgentGroups.push(_.findWhere(this.agentGroups, { "id": item }));
        })
      }
    }, err => {
      this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
    });
  }

  addAltUtterance(utterance: any, isNew?: boolean) {
    if (isNew) {
      this.altUtterances.insert(0, this.fb.group({
        id: utterance.id,
        text: [utterance.text, Validators.required]
      }));
      setTimeout(() => $('.added-utt input')[0].focus());
    } else {

      const formGroup = this.fb.group({
        id: utterance.id,
        text: [utterance.text, Validators.required]
      });

      if (utterance.status === 'failed') {
        formGroup.addControl('reason', new FormControl(utterance.reason));
      }
      this.altUtterances.push(formGroup);
    }
  }

  removeAltUtterance(index) {
    this.altUtterances.removeAt(index);
  }

  isNoSearchResultFound(value) {
    return this.altUtterances.controls.filter(altUtterance => (altUtterance.get('text').value || '').toLowerCase().includes(value)).length === 0;
  }

  onCatInput(value = '') {
    this.filteredCategories = value ? this._filter(value) : this.categoryList.slice();
  }

  onCategory(selectedCategory: string) {
    if (selectedCategory) {
      this.selectedPallete = _.findWhere(this.categoryList, { category: selectedCategory })?.colorCode;
    }
  }

  getCPayload() {
    let payload = {
      category: this.conv.category.trim(),
      colorCode: '',
    }
    if (this.categoryList.length > 23) {
      payload.colorCode = this.usecaseService.getRandomColor();
    } else {
      payload.colorCode = PALETTES[this.categoryList.length];
    }
    return payload;
  }


  createCategory(event: any, prior?: boolean) {
    if (!this.conv.category) { return; }
    this.autoComplete.closePanel();
    if (_.where(this.categoryList, { category: this.conv.category.trim() }).length > 0) {
      this.onCategory(this.conv.category.trim());
      return;
    }
    let params = {
      streamId: this.streamId
    };
    let payload = this.getCPayload();

    this.service.invoke('post.createCategory', params, payload)
      .subscribe(res => {
        this.notificationService.notify('"' + payload.category + '"' + this.translate.instant("USECASES.CAT_CREATED_SUCCESSFULLY"), 'success');
        this.selectedPallete = payload.colorCode;
        this.categoryList.push(payload);
      }, err => {
        this.saveInProgress = false;
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
      });
  }

  createConversation(payload?) {
    let params = { streamId: this.streamId };
    let ucPayload = {
      usecaseType: this.ucType,
      usecaseName: this.conv.usecaseName.trim(),
      category: this.conv.category.trim(),
      categoryColor: this.selectedPallete
    }
    this.service.invoke('post.createUsecase', params, ucPayload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        // this.agentAssistService.addUsecase(res);
        // this.notificationService.notify(this.translate.instant("USECASES.ADDED") + " " + ucPayload.usecaseName + this.translate.instant("USECASES.USECASE_SPACE") + " ", 'success');
        // this.close(res);

        // res.triggerPoints = this.conv.triggerPoints;
        this.conv = $.extend(true, {}, res, this.conv);
        this.inputData = this.prepareUsecasePayload();

        this.init();

        this.updateConversation(true);
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_UC"));
      });
  }

  prepareUsecasePayload() {
    const utterances: any[] = this.utterancesForm.value.altUtterances.map(e => {
      if (e.id) {
        const text = this.conv.utterances.alternates.find(f => f.id === e.id).text;
        if (text !== e.text) { e['oldText'] = text; }
        return e;
      } else {
        return { text: e.text || '' }
      }
    });

    // Deleted utterances
    if (this.conv.usecaseType === 'dialog') {
      this.conv.utterances.alternates.forEach(e => {
        if (!utterances.find(f => f.id === e.id)) {
          utterances.push({ id: e.id, text: '', 'oldText': e.text });
        }
      })
    }
    const payload = JSON.parse(JSON.stringify(this.conv));
    payload.utterances.alternates = utterances;

    if (this.ucType === 'dialog') {
      payload.triggerPoints.skillMatchRules = this.routingComp?.getSkillMatchRules() || [];
      payload.triggerPoints.agentGroups = this.selectedAgentGroups.map(e => e.id);

      payload.callExperience.type = this.callExp.type;
      payload.callExperience.preTransferMsgType = this.callExp.preTransferMsgType;
      payload.callExperience.preTransferMsgs = this.callExp.preTransferMsgs;
      payload.callExperience.settings.chat = (this.callExp.offerDeflection || this.callExp.type === 'deflection') ? this.callExp.chatTransferType : '';
      payload.callExperience.settings.chatPreTransferMsgType = this.callExp.chatPreTransferMsgType;
      payload.callExperience.settings.chatPreTransferMsgs = this.callExp.chatPreTransferMsgs;
      payload.callExperience.isConfigured = this.callExp.isConfigured;
      payload.callExperience.skills = this.callSkills?.addedSkillsId;

      payload.chatExperience.type = this.chatExp.type;
      payload.chatExperience.preTransferMsgType = this.chatExp.preTransferMsgType;
      payload.chatExperience.preTransferMsgs = this.chatExp.preTransferMsgs;
      payload.chatExperience.isConfigured = this.chatExp.isConfigured;
      payload.chatExperience.skills = this.chatSkills?.addedSkillsId;
    } else if (this.ucType === 'faq') {
      payload.utterances.primary.text = this.conv.usecaseName; //this.utterancesForm.value.primaryUtterance;
      payload.callExperience.responses = this.callExp?.responses;
      payload.chatExperience.responses = this.chatExp?.responses;
      delete payload.hasAgentAssistAccess;
      delete payload.isAgentAssistOnly;
    }

    return payload;
  }

  updateConversation(isNew?: boolean) {

    const payload = this.prepareUsecasePayload();

    this.service.invoke('post.editUsecase', { streamId: this.streamId, usecaseId: payload.taskRefId }, payload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe((res) => {
        if (res) {
          this.inputData = res;
          if (res.utterances && res.utterances.alternates.some(e => e.status === 'failed')) {
            this.stats.total = res.utterances.alternates.length;
            this.stats.failed = res.utterances.alternates.filter(e => e.status === 'failed').length;
            this.stats.success = this.stats.total - this.stats.failed;
            this.init()
          } else {

            if (isNew) {
              this.notificationService.notify(this.translate.instant("USECASES.ADDED") + " " + this.inputData.usecaseName + this.translate.instant("USECASES.USECASE_SPACE") + " ", 'success');
            } else {
              this.notificationService.notify(this.translate.instant("USECASES.UC_UPDATED"), "success");
            }
            this.close(res);
          }
          // res.utterances.alternates = (res.utterances?.alternates || []).filter(e => e.status !== 'failed');
          // this.notificationService.notify(this.translate.instant("USECASES.UC_UPDATED"), "success");
          // this.close(res);
        } else {
          this.notificationService.notify(this.translate.instant("USECASES.UC_UNABLE"), "error");
        }
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.UC_FAILED"));
      });
  }

  onSave() {

    this.submitted = true;
    if (this.usecaseNameModel.invalid && this.categoryEle.invalid) {
      this.notificationService.notify(this.translate.instant("CONVERSATION.USERCASE.CATEGORY_REQU"), 'error');
      this.notificationService.notify(this.translate.instant("CONVERSATION.USECASE.NAME_REQU"), 'error');
      return;
    }
    if (this.usecaseNameModel.invalid) {
      this.notificationService.notify(this.translate.instant("CONVERSATION.USECASE.NAME_REQU"), 'error');
      return;
    }
    if (this.categoryEle.invalid) {
      this.notificationService.notify(this.translate.instant("CONVERSATION.USERCASE.CATEGORY_REQU"), 'error');
      return;
    }

    this.saveInProgress = true;
    if (!this.conv.usecaseName.trim()) {
      this.notificationService.notify(this.translate.instant('USECASES_INVALID_NAME'), 'error');
      return;
    }
    if (this.doesCatExists(this.conv.category)) {
      if (this.inputData) {
        this.updateConversation();
      } else {
        this.createConversation();
      }
    } else {
      let params = {
        streamId: this.streamId
      };
      let payload = this.getCPayload();
      this.service.invoke('post.createCategory', params, payload)
        .subscribe(res => {
          this.selectedPallete = payload.colorCode;
          this.categoryList.push(payload);
          if (this.inputData) {
            this.updateConversation();
          } else {
            this.createConversation();
          }
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
  }

  doesCatExists(value: string) {
    return _.where(this.categoryList, { category: value }).length > 0
  }



  launchPlatform() {
    this.workflowService.setEditInBotPlatform();
    this.router.navigate(['/bt']);
    this.performBTNavigation('build',"dialogtask");
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '446px',
    //   height: '306px',
    //   panelClass: "manage-deflection-exp-popup",
    //   data: {
    //     title: this.translate.instant("COMMON.CONFIRMATION"),
    //     text: this.translate.instant("COMMON.PLATFORM_NAV"),
    //     text1: this.translate.instant("COMMON.ASSISTANT_PLATFORM"),
    //     buttons: [{ key: 'yes', label: this.translate.instant("BUTTONS.PROCEED") }, { key: 'no', label: this.translate.instant("BUTTONS.CANCEL") }]
    //   }
    // });

    // dialogRef.componentInstance.showLearnMore = true;
    // dialogRef.componentInstance.onSelect.subscribe(result => {
    //   if (result === 'yes') {
    //     this.workflowService.setEditInBotPlatform();
        // this.workflowService.redirectPlatform(this.workflowService.getCurrentBt(true)._id, (this.localStoreService.getSelectedAccount() && this.localStoreService.getSelectedAccount().accountId) || (this.authService.getSelectedAccount() && this.authService.getSelectedAccount().accountId), this.workflowService.getCurrentBt().defaultLanguage, 'conversation', this.inputData.dialogId, this.inputData.state == 'configured' ? 'indevelopment' : 'published', this.localStoreService.appLanguage);
    //     this.close();
    //   } 
    //   else if (result === 'learnMore') {
    //     window.open("https://developer.kore.ai/docs/bots/bot-builder-tool/dialog-task/dialog-tasks/");
    //     return;
    //   }

    //   dialogRef.close();
    // });
  }

  performBTNavigation(mainTab, link) {
    let navData = {
      navType: 'direct'
    }
    this.workflowService.directFlag = true;
    this.workflowService.mainTab = mainTab;
    this.workflowService.link = link;
    this.workflowService.btNavigation$.next(navData);
  }

  close(conv?) {
    this.onClose.emit(conv);
  }


  disableSaveOnSkillGp() {
    if (this.conv.triggerPoints.isSkillMatchEnabled) {
      for (let item of this.conv.triggerPoints.skillMatchRules) {
        for (let step of item.steps) {
          if (step.entity && step.values.length) {
            // return false;
          } else {
            return true;
          }
        }
      }
    } else {
      return false
    }
  }

  disabledSaveOnAgentGpMatch() {
    return this.conv.triggerPoints.isAgentGroupMatchEnabled && !this.selectedAgentGroups.length;
  }

  disableSave() {
    return !this.conv.usecaseName || !this.conv.category || this.disableSaveOnSkillGp() || this.disabledSaveOnAgentGpMatch()
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.categoryList.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
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
          return res.results.map((val) => {
            return {
              name: val.name,
              id: val._id,
              type: 'skill',
              color: val.color
            }
          });
        }),
        catchError(err => of({ error: err, type: 'error' }))
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
        catchError(err => of({ error: err, type: 'error' }))
      )
    ]).pipe(finalize(() => { this.skillsLoaded = true; }))
      .subscribe(([res1, res2]: any) => {
        if (res1?.type == 'error') {
          this.workflowService.showError(res1.error, "");
        } else {
          this.allSkillData = res1;
        }
        if (res2?.type == 'error') {
          this.workflowService.showError(res2.error, "");
        } else {
          this.allSkillData = res2.concat(this.allSkillData);
        }
      });
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

  /** FAQ  Start*/

  addAnotherResponse(type?: string) {
    if (type === 'phone') {
      this.callExp.responses.push({ answer: "", viewType: 'edit' });
    } else {
      this.chatExp.responses.push({ answer: "", viewType: 'edit' });
    }
  }

  removeAnotherResponse(index, type?: string) {
    if (type === 'phone') {
      this.callExp.responses.splice(index, 1);
    } else {
      this.chatExp.responses.splice(index, 1);
    }
  }

  closeAnotherResponse(responseObj, index, type?: string) {
    responseObj.viewType = "preview";
    responseObj.truncate = true;
    if (type === 'phone') {
      if (this.callExp.responses[index]) {
        this.callExp.responses[index] = this.callExp.responses[index];
      } else {
        this.callExp.responses.splice(index, 1);
      }

    } else {
      if (this.chatExp.responses[index]) {
        this.chatExp.responses[index] = this.chatExp.responses[index];
      } else {
        this.chatExp.responses.splice(index, 1);
      }
    }
  }


  onClickDone(responseObj, index, type?: string) {
    responseObj.viewType = 'preview';
    responseObj.truncate = true;
    // this.tempData = JSON.parse(JSON.stringify(this.inputData));
  }

  hideAddBtn(type?: string) {
    if (type === 'phone') {
      return this.callExp.responses.some(f => f.viewType === 'edit');
    } else {
      return this.chatExp.responses.some(f => f.viewType === 'edit');
    }
  }

  showCopyBtn(responseObj, i, type?: string) {
    const isEmpty = responseObj.answer === '' || responseObj.answer === 'Response not yet provided';

    if (!isEmpty) return false;

    let otherText;
    if (type === 'phone') {
      otherText = this.chatExp.responses[i]
    } else {
      otherText = this.callExp.responses[i]
    }

    return otherText && otherText.answer.trim() && otherText.answer !== 'Response not yet provided';
  }

  copyFormCall(responseObj, i, $event) {
    $event.stopPropagation();
    const obj = this.inputData.callExperience.responses[i];
    if (obj) {
      responseObj.answer = obj.answer;
    }
  }
  copyFormChat(responseObj, i, $event) {
    $event.stopPropagation();
    const obj = this.chatExp.responses[i];
    if (obj) {
      responseObj.answer = obj.answer;
    }
  }

  chatOnEnterKey(responseObj, i) {
    setTimeout(() => this.onClickDone(responseObj, i));
  }

  /** FAQ END */

  onChangeUCType(type: string, value) {
    if (type === 'bot') {
      if (value) {
        this.conv.isAgentAssistOnly = false;
      } else {
        this.conv.isAgentAssistOnly = true;
        this.conv.hasAgentAssistAccess = true;
        this.conv.isAgentUsecase = true;
      }
    } else {
      if (value) {
        this.conv.hasAgentAssistAccess = true;
      } else {
        this.conv.hasAgentAssistAccess = false;
        this.conv.isAgentAssistOnly = false;
        this.conv.isBotUsecase = true;
      }
    }

    // console.info("Bot Only Usecase: ", !this.conv.isAgentAssistOnly && !this.conv.hasAgentAssistAccess);
    // console.info("Agent Only Usecase: ", this.conv.isAgentAssistOnly && this.conv.hasAgentAssistAccess);
    // console.info("Both: ", !this.conv.isAgentAssistOnly && this.conv.hasAgentAssistAccess);
  }

}
