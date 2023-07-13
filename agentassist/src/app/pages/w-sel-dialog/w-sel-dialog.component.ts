import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { SideBarService } from '@kore.services/header.service';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { LocalStoreService } from '@kore.services/localstore.service';

import * as _ from 'underscore'
import { TranslateService } from '@ngx-translate/core';
import { WSelectionService } from './w-sel.service';
import { Subscription } from 'rxjs';
import { AppService } from '@kore.services/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams } from '@angular/common/http';
import { OnboardingDialogComponent } from '../onboarding/onboarding-dialog/onboarding-dialog.component';
import { MatDialog } from '@angular/material/dialog';

declare const $: any;

@Component({
  selector: 'app-w-sel-dialog',
  templateUrl: './w-sel-dialog.component.html',
  styleUrls: ['./w-sel-dialog.component.scss']
})
export class WSelDialogComponent implements OnInit, OnDestroy {

  isNewActive: boolean = true;
  activeMod = {
    initial: true,
    createNew: false,
    selectBot: false,
    import: false
  }
  selectBotMod = {
    first: true,
    second: false,
    third: false,
    fourth: false
  };
  importBotMod = {
    first: true,
    second: false,
    third: false,
    fourth: false,
    fifth: false,
    sixth: false,
    seventh: false
  };
  step: number = 2; 
  config: any;
  appsData = [];
  botList: any [];
  selectedBot = '';
  selectedBotName = '';
  userName = "";
  isNewBot = false;
  isConvertBot = false;
  importedBotData: any;
  importedVariablesData: any;
  selectedImg: any = 'assets/icons/welcome/bot_icon_0.png';
  botName = "";
  botFunctionFileId: string;
  botFunctionFileName: string;
  fileName: string;
  supportedLang: any [];
  selectedLang: any = {
    name: "English",
    value: 'en',
    dvalue: 'en'
  };
  existingBotsFetching = false;
  newStreamData:any = {};
  impBtName = "";
  impInterval: any;
  stLogs: any;
  searchBot = "";
  stLogsConversion: any;
  regularUser = false;
  selectedBt = '';
  selectedBtError = '';
  importedBtError = '';
  importedBt = '';
  importedBtStreamId = '';
  conversionNeeded = false;
  botIconsList = [
    {
      icon: 'assets/icons/welcome/bot_icon_0.png',
      isSelected: true
    },
    {
      icon: 'assets/icons/welcome/bot_icon_1.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_2.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_3.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_4.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_5.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_6.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_7.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_8.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_9.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_9_5.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_10.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_11.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_12.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_13.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_14.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_15.png',
      isSelected: false
    },
    {
      icon: 'assets/icons/welcome/bot_icon_16.png',
      isSelected: false
    }
  ];
  chooseFile = this.translate.instant('ONBOARDING.CHOOSE_FILE');
  chBtTask = [
    {id: 'botTask', name: this.translate.instant("ONBOARDING.TASK_ONLY"), isSelected: true},
    {id: 'knowledgeGraph', name: this.translate.instant("ONBOARDING.KG_GRAPH"), isSelected: true},
    {id: 'smallTalk', name: this.translate.instant("ONBOARDING.SMALL_TALK"), isSelected: true},
    {id: 'forms', name: this.translate.instant("ONBOARDING.DIGITAL_FORMS"), isSelected: true},
  ];
  nlpData = [
    {id: 'nlpSettings', name: this.translate.instant("ONBOARDING.NLP_SETTINGS"), isSelected: true},
    {id: 'utterances', name: this.translate.instant("ONBOARDING.UTTERANCES"), isSelected: true},
    {id: 'standardResponses', name: this.translate.instant("ONBOARDING.STD_RESPONSE"), isSelected: true},
  ];
  settChk = [
    {id: 'botSettings', name: this.translate.instant("ONBOARDING.BT_SETTINGS"), isSelected: true},
    {id: 'botVariables', name: this.translate.instant("ONBOARDING.BT_VARIABLES"), isSelected: true},
    {id: 'ivrSettings', name: this.translate.instant("ONBOARDING.VOICE_CALL_PROP"), isSelected: true}
  ];
  isImported = false;
  isConverted = false;
  isBackInProgress = false;
  importExportStatus: any;
  isBackup = true;
  existingBotsSub: Subscription;


  @Output() wSel = new EventEmitter();
  @ViewChild('btDef') btDef: ElementRef;
  @ViewChild('cgFile') cgFile: ElementRef;
  @ViewChild('scptFile') scptFile: ElementRef;
  @ViewChild('imgFile') imgFile: ElementRef;

  constructor(private router: Router,
              private headerService: SideBarService,
              public workflowService: workflowService,
              private notificationService: NotificationService,
              private service: ServiceInvokerService,
              private translate: TranslateService,
              private localStoreService: LocalStoreService,
              public authService: AuthService,
              private wSelService: WSelectionService,
              private appService: AppService,
              private modalService: NgbModal,
              private dialog: MatDialog,
              
              ) { }

  ngOnInit(): void {
    this.userName = this.localStoreService.getAuthInfo().currentAccount.userInfo.fName + " " + this.localStoreService.getAuthInfo().currentAccount.userInfo.lName;
    this.newStreamData.iconFile = null;
    this.newStreamData.icon = 'assets/icons/welcome/bot_icon_0.png';
    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      this.supportedLang = res.supportedLanguages;
      this.supportedLang = res.deflectSeedData.supportedLanguages;
      this.supportedLang = this.supportedLang || [{
        name: "English",
        value: 'en',
        dvalue: 'en'
      }];
    });
    if (!this.workflowService.deflectAppsData.length && !this.workflowService.deflectAppsData._id) {
      this.regularUser = false;
    } else {
      this.regularUser = true;
    }
    this.getExistingBots();

  }


  getExistingBots() {
    this.existingBotsFetching = true;
    this.existingBotsSub = this.wSelService.getExistingBots(this.supportedLang).subscribe(responseBots => {
      this.botList = responseBots;
      this.existingBotsFetching = false;
    }, error => {
      this.botList = [];
      this.workflowService.showError(error, this.translate.instant("ONBOARDING.FAILED_TO_LOAD"));
      this.existingBotsFetching = false;
    });
  }

  toStep(n: number) {
    this.step = n;
  }

  resetMod() {
    this.activeMod = {
      initial: false,
      createNew: false,
      selectBot: false,
      import: false
    }
  }

  resetSelectBot() {
    this.selectBotMod = {
      first: false,
      second: false,
      third: false,
      fourth: false
    };
  }

  resetImportBot() {
    this.importBotMod = {
      first: false,
      second: false,
      third: false,
      fourth: false,
      fifth: false,
      sixth: false,
      seventh: false
    }
  }

  resetBtIconList() {
    this.botIconsList.map(
      res => {
        res.isSelected = false;
        return res;
      }
    );
  }

  btSelected(bt) {
    this.resetBtIconList();
    _.findWhere(this.botIconsList,bt).isSelected = true;
    this.uploadIconSelected(bt.icon);
    this.selectedImg = bt.icon;
  }

  importBotSwitch(flag: string) {
    this.resetImportBot();
    this.importBotMod[flag] = true;
  }

  selectBotSwitch(flag: string) {
    this.resetSelectBot();
    this.selectBotMod[flag] = true;
  }

  modSwitch(flag: string) {
    this.resetMod();
    this.activeMod[flag] = true;
    if(flag == 'createNew') {
      this.uploadIconSelected(this.botIconsList[0].icon);
    }
    else if(flag == 'import'){
      this.activeMod['import'] = true;
      this.uploadIconSelected(this.botIconsList[0].icon);
    }
  }

  modSwitchCreate(event) {
    this.resetMod();
    if(!event.target.checked) {
      this.activeMod['createNew'] = true;
      this.uploadIconSelected(this.botIconsList[0].icon);
    } else {
      this.activeMod['import'] = true;
      this.uploadIconSelected(this.botIconsList[0].icon);
    }
  }

  createApp() {
    if(!this.botName.trim()) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.PLS_ENTER"), 'warning');
      return;
    }
    if(this.selectedLang.value === 'en' && !(/^[a-zA-Z0-9][a-zA-Z0-9_<>*. ]+$/.test(this.botName.trim()))) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BOT_NAME_ALLOWS"), 'warning');
      return;
    }

    if(!this.selectedLang.value) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.SEL_LANG"), 'warning');
      return;
    }
    if(_.pluck(this.authService.smartAssistBots, 'name').indexOf(this.botName.trim()) > -1) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_WITH_SAME_NAME"), 'warning');
      return;
    }



    this.config = {
      name: this.botName.trim(),
      icon: this.newStreamData.icon.fileId,
      defaultLanguage: this.selectedLang.value
    }
    this.headerService.isOnboardingPage = true;
    this.appsData = this.workflowService.deflectApps();
    this.isNewBot = true;
    this.onSubmit();
  }

  proceedBackup(cb) {
    const params = {
      streamId: this.selectedBot,
      'isAgentAssist':true
    };
    const self = this;
    let payload = {
      "exportType":'latest',
      "exportOptions":{
        "tasks": _.pluck(_.where(this.chBtTask, {isSelected: true}), 'id'),
        "nlpData": _.pluck(_.where(this.nlpData, {isSelected: true}), 'id'),
        "settings": _.pluck(_.where(this.settChk, {isSelected: true}), 'id'),
        "customDashboard": true
      },
      'allTasks': true,
      'IncludeDependentTasks': true,
      'subTasks': {
        dialogs: [],
        alerts: [],
        actions: []
      }
    };

    this.notificationService.notify(this.translate.instant("ONBOARDING.BACKUP_BOT"), 'success');

    this.service.invoke('post.importbot.export', params, payload).subscribe(
      res => {
        console.log(res);
        if(res.status == 'success') {
        this.close();
        } else if(res.status == 'pending') {
          this.importExportStatus = setInterval(() => {
              pollStatus();
          }, 3000);
        } else {

        }
      }, err => {
        this.workflowService.showError(err, this.translate.instant("ONBOARDING.EXPORT_FAILED"));
        this.isBackInProgress = false;
      }
    );

    function pollStatus() {
      self.service.invoke('get.importbot.exportStatus', params).subscribe(
        res => {
          if(res.status == 'success' || res.status == 'failed') {
            clearInterval(self.importExportStatus);
            if(res.status == 'success') {
              self.notificationService.notify(self.translate.instant("ONBOARDING.DOWNLOAD_START"), 'success');
              fileUrl(res.fileId, res.downloadURL);
            }
            if(res.status == 'failed') {
              self.notificationService.notify(self.translate.instant("ONBOARDING.FAILED_FETCH_FILEID"), 'error');
              return;
            }
          }
        }, err => {
          self.workflowService.showError(err, self.translate.instant("ONBOARDING.STATUS_FAILED"));
          self.isBackInProgress = false;
        }
      )
    }

    function fileUrl(fileId: string, url?) {
      self.service.invoke('get.importbot.exportUrl', {'fileId': fileId}).subscribe(
        res => {
          // const storeURL = '&clientfilename='+ self.selectedBotName +'.zip&batchtesting=true';
          // let hrefURL = res.fileUrl + storeURL;
          let hrefURL = url;
          var element = document.createElement('a');
          element.setAttribute('href', hrefURL);
          element.setAttribute('target', '_self');
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          self.isBackInProgress = false;
          cb();
        }, err => {
          self.workflowService.showError(err, this.translate.instant("ONBOARDING.FAILED_FETCH_FILE_URL"));
          self.isBackInProgress = false;
        }
      )
    }
  }

  convertBot(payload?) {
    const self = this;
    let selectedBotDetails;
    if(this.isBackup && this.activeMod.selectBot) {
      this.isBackInProgress = true;
      this.proceedBackup(cb);
      return;
    } else {
      cb();
    }

    function cb() {
      self.selectBotSwitch('second');
      if(payload) {
        selectedBotDetails = payload;
        self.selectedBt = self.impBtName.trim();
      } else {
        selectedBotDetails = _.findWhere(self.botList, {_id: self.selectedBot});
        self.selectedBt = selectedBotDetails.name;
      }

      selectedBotDetails.streamId = self.selectedBot;     
      self.service.invoke('post.convertbot', {}, selectedBotDetails)
          .subscribe(res=>{
            self.getConvStatus(res._id);
            self.impInterval = setInterval(() => {
              self.getConvStatus(res._id);
            }, 3000);
          }, err =>{
            self.selectBotSwitch('fourth');
            try {
              self.selectedBtError = err.error.errors[0].msg;
            } catch(e) {
              self.selectedBtError = self.translate.instant("ONBOARDING.BT_CONVERSION");
            }
            self.showError(err, self.translate.instant("ONBOARDING.FAILED_TO_CONVERT"));
          }); 
    }
  }

  conversionDone() {
    if(this.workflowService.deflectApps() && this.workflowService.deflectApps().length) {
      this.workflowService.switchBt$.next(_.findWhere(this.workflowService.deflectApps(), {_id: this.importedBtStreamId}));
      this.wSel.emit();
    } else {
      this.notificationService.notify(this.translate.instant('ONBOARDING.PLEASE_WAIT_LOADING'), 'warning');
      return;
    }
  }

  upDefFile(file: File) {
    if(file.name.slice(file.name.indexOf('.')) !== ".json") {
      this.notificationService.notify(this.translate.instant("ONBOARDING.PLS_UPLOAD"), "warning");
      this.btDef.nativeElement.value = '';
      this.importedBotData = null;
      return;
    }
    const self = this;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      self.importedBotData = reader.result;
    };
  }

  upVarFile(file: File) {
    if(file.name.slice(file.name.indexOf('.')) !== ".json") {
      this.notificationService.notify(this.translate.instant("ONBOARDING.PLS_UPLOAD"), "warning");
      this.cgFile.nativeElement.value = '';
      this.importedVariablesData = null;
      return;
    }
    const self = this;
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      self.importedVariablesData = reader.result;
    };
  }

  upScriptFile(file: File) {
    if(file.name.slice(file.name.indexOf('.')) !== ".js") {
      this.notificationService.notify(this.translate.instant("ONBOARDING.PLS_UPLOAD_JS"), "warning");
      this.scptFile.nativeElement.value = '';
      return;
    }
    const params = {
      userId: this.authService.getUserId()
    };
    let formData = new FormData();
    formData.append('file', file);
    formData.append('fileContext', 'bulkImport');
    formData.append('fileExtension', 'txt');
    this.service.invoke('post.uploadfaqfile', params, formData).subscribe(
      res => {
        console.log(res);
        this.botFunctionFileName = file.name;
        this.botFunctionFileId = res.fileId;
      }, err => {
        this.workflowService.showError(err, this.translate.instant("ONBOARDING.FAILED_TO_UPLOAD"));
      }
    )
  }

  upImgFile(file: File) {
    var _ext = file.name.substring(file.name.lastIndexOf('.'));
    if (_ext.toLowerCase() !== '.png') {
      this.notificationService.notify(this.translate.instant("ONBOARDING.PLS_UPLOAD_ONLY"), 'error');
      this.imgFile.nativeElement.value = "";
      return;
    }
    else {
      const self = this;
      var reader = new FileReader();
      reader.onload = function(loadEvent) {
        self.selectedImg = loadEvent.target.result;
      };
      reader.readAsDataURL(file);
      this.newStreamData.iconFile = file;
      this.uploadStreamIcon();
      this.resetBtIconList();
    }
  }

  navigateToUc() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/config/usecases']);
    });
  }

  onLangSelect(lang) {
    this.selectedLang = lang;
  }

  importSelect() {
    this.modSwitch('import'); 
    this.importBotSwitch('first');
    this.step = 2;
  }

  uploadIconSelected(iconPath: string) {
    const self = this;

    function getFileBlob (url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.addEventListener('load', function() {
          cb(xhr.response);
      });
      xhr.send();
    };

    function blobToFile (blob, name) {
      blob.lastModifiedDate = new Date();
      blob.name = name;
      return blob;
    };

    function getFileObject (filePathOrUrl, cb) {
      getFileBlob(filePathOrUrl, function (blob) {
         cb(blobToFile(blob, 'newBot.png'));
     });
    };

    function getStreamIconData() {
       getFileObject(iconPath, function (fileObject) {
        self.newStreamData.iconFile = fileObject;
        self.uploadStreamIcon();
       });
    }
    getStreamIconData();
  }


  uploadStreamIcon() {
    if (this.newStreamData.iconFile.name) {
      var _ext = this.newStreamData.iconFile.name.substring(this.newStreamData.iconFile.name.lastIndexOf('.'));
      if (_ext.toLowerCase() !== '.png') {
        this.notificationService.notify(this.translate.instant("ONBOARDING.UPLOAD_ONLY_PNG"), 'error');
        return;
      } else {
        const params = {
          userId: this.authService.getUserId()
        };
        
        var data = new FormData();
        data.append('file', this.newStreamData.iconFile);
        data.append('fileContext', 'marketplace');
        data.append('fileExtension', 'png');
    
        this.service.invoke('post.uploadfaqfile', params, data).subscribe(
          res => {
            let fileUploaded = {
              fileName: this.newStreamData.iconFile.name,
              fileId: res.fileId
            };
            this.newStreamData.icon = fileUploaded;
          }, err => {
            this.workflowService.showError(err, this.translate.instant("ONBOARDING.FAILED_UPLOAD"));
          }
        );
      }
    }
  }

  importDone() {
    if(this.workflowService.deflectApps() && this.workflowService.deflectApps().length) {
      this.workflowService.switchBt$.next(_.findWhere(this.workflowService.deflectApps(), {_id: this.importedBtStreamId}));
      this.wSel.emit();
    } else {
      this.notificationService.notify(this.translate.instant('ONBOARDING.PLEASE_WAIT_LOADING'), 'warning');
      return;
    }
  }

  importBackStep() {
    this.importedBotData = null;
    this.botName = "";
	  this.importedVariablesData = null;
    this.impBtName = "";
    this.step = 1;
    this.conversionNeeded = false;
    const defaultIconSel = {
      "icon": "assets/icons/welcome/bot_icon_0.png",
      "isSelected": false
    }
    this.importBotSwitch('first');
    this.stLogs = null;
    this.stLogsConversion = null;
    this.btSelected(defaultIconSel);
  }

  selectBackStep () {
    this.toStep(1);
    this.conversionNeeded = false;
    this.stLogs = [];
    this.stLogsConversion = [];
    this.searchBot = "";
  }

  backStep() {
    this.step = 1;
    this.botName = "";
    this.conversionNeeded = false;
    this.selectedImg = 'assets/icons/welcome/bot_icon_0.png';
    const defaultIconSel = {
      "icon": "assets/icons/welcome/bot_icon_0.png",
      "isSelected": false
    }
    this.selectedLang = {
      name: "English",
      value: 'en',
      dvalue: 'en'
    };
    this.stLogs = [];
    this.stLogsConversion = [];
    this.btSelected(defaultIconSel);
  }

  importBot(flag?) {
    if(!this.impBtName.trim()) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.PLS_ENTER_BOT_NAME"), 'warning');
      return;
    }
    if((/[ `!@#$%^&()+\-=\[\]{};':"\\|,\/?~]/.test(this.impBtName.trim())) || (/^[_<>*. ]+/.test(this.impBtName.trim()))) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BOT_NAME_ALLOWS"), 'warning');
      return;
    }
    if (!this.importedBotData) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_DEF_FILE_REQ"), "warning");
      return;
    }
    if (!this.importedVariablesData) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CONFIG_FILE_REQ"), "warning")
      return;
    }

    if(_.pluck(this.authService.smartAssistBots, 'name').indexOf(this.impBtName.trim()) > -1) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_WITH_SAME_NAME"), 'warning');
      return;
    }

    const params = {
      userId: this.authService.getUserId(),
      "isAgentAssist":true
    };
    this.importedVariablesData = JSON.parse(this.importedVariablesData);
    this.importedBotData = JSON.parse(this.importedBotData);

    if(this.checkConversionPropertyValue('isAgentAssist') && this.checkConversionPropertyValue('isLinkedSmartAssist')){
      this.conversionNeeded = true;
    } else {
      this.conversionNeeded = false;
    }

    this.importedVariablesData.color = '#3366ff';
    this.importedVariablesData.name = this.impBtName.trim();
    this.importedVariablesData.purpose = "customer";
    this.importedVariablesData.icon = this.newStreamData.icon.fileId;

    const payload = {
      "botDefinition": this.importedBotData,
      "configInfo": this.importedVariablesData,
      "botFunctions":[
        {
          "fileId":this.botFunctionFileId,
          "fileName":this.botFunctionFileName
        }
      ],
      "isAgentAssist": true,
      "instanceBotId": this.appService.selectedInstanceApp$.value?._id
    };
    this.importedBt = this.impBtName.trim();
    if(this.conversionNeeded) {
      this.importBotSwitch('fifth');
    } else {
      this.importBotSwitch('second');
    }
    this.service.invoke('post.importbot', params, payload).subscribe(
      res => {
        const self = this;
        self.getImpStatus(res._id);
        this.impInterval = setInterval(() => {
          self.getImpStatus(res._id);
        }, 3000);
      }, err => {
        if(this.conversionNeeded) {
          this.importBotSwitch('seventh');
        } else {
          this.importBotSwitch('fourth');
        }
        try {
          this.importedBtError = err.error.errors[0].msg;
        } catch(e) {
          this.importedBtError = this.translate.instant("ONBOARDING.IMPORT_FAILED");
        }
        this.workflowService.showError(err, this.translate.instant("ONBOARDING.FAILED_IMPORT"));
      }
    );
  }

  checkConversionPropertyValue(propName){
    if(!this.importedBotData.hasOwnProperty(propName) || (this.importedBotData.hasOwnProperty(propName) && !this.importedBotData[propName])){
      return true
    }
    return false
  }


  getConvStatus(convId: string) {
    const params = {
      userId: this.authService.getUserId(),
      importId: convId,
      'isAgentAssist': true
      
    }
    this.service.invoke('get.importconvertbotstatus', params).subscribe(
      res => {
        this.stLogsConversion = res.statusLogs;
        if(res.status == 'success' || res.status == 'failed') {
          clearInterval(this.impInterval);
          if(res.status == 'success') {
            if(this.conversionNeeded) {
              this.isConverted = true;
              this.importBotSwitch('sixth');
            } else {
              let temp = this.activeMod.selectBot?this.selectBotSwitch('third'):this.importBotSwitch('third');
            }
            this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CONVERSION_SUCCESSFUL"), "success");
            this.importedBtStreamId = res.streamId;
            this.authService.getDeflectApps();
          } else if (res.status == 'failed') {
            let temp = this.activeMod.selectBot?this.selectBotSwitch('third'):this.importBotSwitch('fourth');
            this.importedBtError = this.translate.instant("ONBOARDING.BT_IMPORT_FAILED")
          }
        }
      }, err => {
        if(this.conversionNeeded) {
          this.importBotSwitch('seventh');
        } else {
          this.importBotSwitch('fourth');
        }
        try {
          this.importedBtError = err.error.errors[0].msg;
        } catch(e) {
          this.importedBtError = this.translate.instant("ONBOARDING.BT_CONVERSION");
        }
        this.showError(err, this.translate.instant("ONBOARDING.FAILED_TO_CONVERT"));
      }
    )
  }

  getImpStatus(impId: string) {
    const params = {
      userId: this.authService.getUserId(),
      importId: impId
    }
    this.service.invoke('get.importbotstatus', params).subscribe(
      res => {
        this.stLogs = res.statusLogs;
        if(res.status == 'success' || res.status == 'failed') {
          clearInterval(this.impInterval);
          if(res.status == 'success') {
            this.notificationService.notify(this.translate.instant("ONBOARDING.IMPORT_SUCCESSFUL"), "success");
            this.importedBtStreamId = res.streamId;
            this.authService.getDeflectApps();
            if(this.conversionNeeded) {
              this.selectedBot = res.streamId;
              this.isImported = true;
              const convPayload = {
                _id: res.streamId,
                status: 'configured'
              }
              this.convertBot(convPayload);
            } else {
               this.importBotSwitch('third');
            }
          } else if (res.status == 'failed') {
            if(this.conversionNeeded) {
              this.importBotSwitch('seventh');
            } else {
               this.importBotSwitch('fourth');
            }
            this.importedBtError = this.translate.instant("ONBOARDING.BT_IMPORT_FAILED")
          }
        }
      }, err => {
        if(this.conversionNeeded) {
          this.importBotSwitch('seventh');
        } else {
           this.importBotSwitch('fourth')
        }
        try {
          this.importedBtError = err.error.errors[0].msg;
        } catch(e) {
          this.importedBtError = this.translate.instant("ONBOARDING.BT_CONVERSION");
        }
        this.showError(err, this.translate.instant("ONBOARDING.FAILED_TO_CONVERT"));
      }
    )
  }

  downloadBothLogs() {
    this.downloadLog();
    this.downloadConverLog();
  }

  downloadLog () {
    if(this.stLogs) {
      this.writeAndDownloadLog("botImportLog.json", JSON.stringify(this.stLogs));
    }
  };

  downloadConverLog () {
    if(this.stLogsConversion) {
      this.writeAndDownloadLog("botConversionLog.json", JSON.stringify(this.stLogsConversion));
    }
  };

  writeAndDownloadLog(filename, data) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  close() {
    this.modalService.dismissAll();
    this.wSel.emit();
  }

  convertBotSelection() {
    this.modSwitch('selectBot'); 
    this.getExistingBots();
    this.selectBotSwitch('first');
    this.step = 2;
  }

  
  onSubmit() {
    this.dialog.closeAll();
    const payload = this.config;
    // payload.deflectAppStatus.virtualAssistant.enabled = !!this.config.deflectAppStatus.virtualAssistant.type;
    this.service.invoke('post.automationbots',{params:{'isAgentAssist':true}}, payload).subscribe(
      res => {
        if(!res.name){
              res.name = payload.name
        }
        if(_.isArray(this.appsData)) {
          this.appsData.unshift(res);
        }
        this.wSel.emit();
       this.authService.smartAssistBots = this.appsData;
        this.authService.deflectApps.next(this.appsData);
        this.workflowService.deflectApps(this.appsData);
        this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CREATION_SUCCESS"), 'success');
        setTimeout(() => {
          this.router.navigate(['/config/usecases']);
          this.workflowService.switchBt$.next(res);
          this.wSel.emit();
          this.isNewBot = false;
        }, 500);
      },
      errRes => {
        this.isNewBot = false;
        this.showError(errRes, this.translate.instant("ONBOARDING.FAILED_CREATE"));
      }
    
    );
  
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  ngOnDestroy() {
    if(this.existingBotsSub) {
      this.existingBotsSub.unsubscribe();
    }
  }

}
