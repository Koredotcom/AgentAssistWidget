import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { Router } from '@angular/router';
import { SideBarService } from '@kore.services/header.service';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { LocalStoreService } from '@kore.services/localstore.service';

import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '@kore.services/app.service';

@Component({
  selector: 'app-update-bot',
  templateUrl: './update-bot.component.html',
  styleUrls: ['./update-bot.component.scss']
})
export class UpdateBotComponent implements OnInit {

  importedVariablesData: any;
  importedBotData: any;
  botFunctionFileId: string;
  botFunctionFileName: string;
  newStreamData:any = {};
  overrideStatus: any;
  stLogs: any;
  isBackInProgress = false;
  import = {
    type: 'full'
  };
  mst = {
    btSel: true,
    settings: true,
    nlp: true,
    dashboard: true
  };
  update = {
    step: 0
  };
  rd = {
    ut: 'append'
  };
  importExportStatus: any;
  isBackup = true;
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
  importedBtStreamId = '';
  selectedBt = '';
  importedBtError = '';
  chooseFile = this.translate.instant("ONBOARDING.CHOOSE_FILE");

  @Output() wSel = new EventEmitter();
  @ViewChild('btDef') btDef: ElementRef;
  @ViewChild('cgFile') cgFile: ElementRef;
  @ViewChild('scptFile') scptFile: ElementRef;

  constructor(private router: Router,
              private headerService: SideBarService,
              public workflowService: workflowService,
              private notificationService: NotificationService,
              private service: ServiceInvokerService,
              private localStoreService: LocalStoreService,
              private translate: TranslateService,
              private appService: AppService,
              public authService: AuthService) { }

  ngOnInit(): void {
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

  importDone() {
    if(this.workflowService.deflectApps() && this.workflowService.deflectApps().length) {
      this.workflowService.switchBt$.next(_.findWhere(this.workflowService.deflectApps(), {_id: this.importedBtStreamId}));
      this.wSel.emit();
    } else {
      this.notificationService.notify(this.translate.instant('ONBOARDING.PLEASE_WAIT_LOADING'), 'warning');
      return;
    }
  }

  proceedBackup(cb) {
    const params = { 
      // streamId:this.authService.smartAssistBots.map(x=>x._id),
      streamId : this.workflowService.getCurrentBt(true)._id,
      'isAgentAssist':true };
    const self = this;
    let payload = {
      "exportType":'latest',
      "exportOptions":{
        "tasks": _.pluck(_.where(this.chBtTask, {isSelected: true}), 'id'),
        "nlpData": _.pluck(_.where(this.nlpData, {isSelected: true}), 'id'),
        "settings": _.pluck(_.where(this.settChk, {isSelected: true}), 'id'),
        "customDashboard": this.mst.dashboard
      },
      'allTasks': true,
      'IncludeDependentTasks': true,
      'subTasks': {
        dialogs: [],
        alerts: [],
        actions: []
      }
    };

    this.notificationService.notify(this.translate.instant('ONBOARDING.BACKUP_BOT'), 'success');

    this.service.invoke('post.importbot.export', params, payload).subscribe(
      res => {
        console.log(res);
        if(res.status == 'success') {

        } else if(res.status == 'pending') {
          this.importExportStatus = setInterval(() => {
              pollStatus();
          }, 3000);
        } else {

        }
      }, err => {
        this.workflowService.showError(err, this.translate.instant('ONBOARDING.EXPORT_FAILED'));
        this.isBackInProgress = false;
      }
    );

    function pollStatus() {
      self.service.invoke('get.importbot.exportStatus', params).subscribe(
        res => {
          if(res.status == 'success' || res.status == 'failed') {
            clearInterval(self.importExportStatus);
            if(res.status == 'success') {
              self.notificationService.notify(self.translate.instant('ONBOARDING.DOWNLOAD_START'), 'success');
              fileUrl(res.fileId, res.downloadURL);
            }
            if(res.status == 'failed') {
              self.notificationService.notify(self.translate.instant('ONBOARDING.FAILED_FETCH_FILEID'), 'error');
              return;
            }
          }
        }, err => {
          self.workflowService.showError(err, 'Status failed');
          self.isBackInProgress = false;
        }
      )
    }

    function fileUrl(fileId: string, url?: string) {
      self.service.invoke('get.importbot.exportUrl', {'fileId': fileId}).subscribe(
        res => {
          // const storeURL = '&clientfilename='+ self.workflowService.getCurrentBt().name + '.zip&batchtesting=true';
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
          self.workflowService.showError(err, 'Failed to fetch file URL');
          self.isBackInProgress = false;
        }
      )
    }
  }

  override() {
    const self = this;
    if (!this.importedVariablesData) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_CONFIG_FILE_REQ"), "error")
      return;
    }
    if (!this.importedBotData) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BT_DEF_FILE_REQ"), "error");
      return;
    }

    if(this.isBackup) {
      this.isBackInProgress = true;
      this.proceedBackup(cb);
      return;
    } else {
      cb();
    }

    function cb() {
      self.importedVariablesData = JSON.parse(self.importedVariablesData);
      self.importedBotData = JSON.parse(self.importedBotData);
  
      self.importedVariablesData.color = '#3366ff';
      // self.importedVariablesData.name = ''; //self.impBtName.trim();
      self.importedVariablesData.purpose = "customer";
      self.importedVariablesData.icon = ''; //self.newStreamData.icon.fileId;
      let payload;
      let apiCall;
      if(self.import.type == "full") {
        payload = {
          "botDefinition": self.importedBotData,
          "configInfo": self.importedVariablesData,
          "botFunctions":[
            {
              "fileId":self.botFunctionFileId,
              "fileName":self.botFunctionFileName
            }
          ],
          "isDeflect": true,
          "isLinkedSmartAssist": true,
          "importOptions": {
            "nlpData": [
              "nlpSettings",
              "utterances",
              "standardResponses"
            ],
            "settings": [
              "botSettings",
              "botVariables",
              "ivrSettings"
            ],
            "options": {
              "utterances": {
                "append": true,
                "replace": false
              }
            },
            "tasks": [
              "botTask",
              "knowledgeGraph",
              "smallTalk",
              "forms"
            ],
            "customDashboard": true
          }
        };
        apiCall = 'post.importbot.overrideFull';
      } else {
        payload = {
          "botDefinition": self.importedBotData,
          "configInfo": self.importedVariablesData,
          "botFunctions":[
            {
              "fileId":self.botFunctionFileId,
              "fileName":self.botFunctionFileName
            }
          ],
          "isDeflect": true,
          "isLinkedSmartAssist": true
        };
        payload.importOptions = {
          "tasks": _.pluck(_.where(self.chBtTask, {isSelected: true}), 'id'),
          "nlpData": _.pluck(_.where(self.nlpData, {isSelected: true}), 'id'),
          "settings": _.pluck(_.where(self.settChk, {isSelected: true}), 'id'),
          "customDashboard": self.mst.dashboard
        };
        if(_.findWhere(self.nlpData, {id: "utterances"}).isSelected) {
          payload.options = {
            utterances: {
              append: self.rd.ut == 'append',
              replace: self.rd.ut == 'replace'
            }
          }
        }
        apiCall = 'post.importbot.overrideIncrement';
      }
      const params = {
        userId: self.authService.getUserId(),
        streamId: self.workflowService.getCurrentBt()._id,
        fullImport: true,
        incrementalImport: true,
        instanceBotId: self.appService.selectedInstanceApp$.value?._id
      };
      self.update.step = 1;
      self.service.invoke(apiCall, params, payload).subscribe(
        res => {
          self.checkStatus(res._id);
          self.overrideStatus = setInterval(()=>{
            self.checkStatus(res._id);
          }, 3000)
  
        }, err => {
          self.update.step = 3;
          self.workflowService.showError(err, self.translate.instant("ONBOARDING.FAILED_UPDATE_BOT"));
          try {
            self.importedBtError = err.error.errors[0].msg;
          } catch(e) {
            self.importedBtError = self.translate.instant("ONBOARDING.FAILED_UPDATE_BOT");
          }
        }
      )
    }

  }

  chkUnchkAllBtTask() {
    for (var i = 0; i < this.chBtTask.length; i++) {
      this.chBtTask[i].isSelected = this.mst.btSel;
    }
  }

  isAllSelBtTask() {
    this.mst.btSel = this.chBtTask.every(function(item:any) {
        return item.isSelected == true;
    });
  }

  chkUnchkAllNlp() {
    for (var i = 0; i < this.nlpData.length; i++) {
      this.nlpData[i].isSelected = this.mst.nlp;
    }
  }

  isAllSelNlp() {
    this.mst.nlp = this.nlpData.every(function(item:any) {
        return item.isSelected == true;
    });
  }

  chkUnchkAllSettings() {
    for (var i = 0; i < this.settChk.length; i++) {
      this.settChk[i].isSelected = this.mst.settings;
    }
  }

  isAllSelSettings() {
    this.mst.settings = this.settChk.every(function(item:any) {
        return item.isSelected == true;
    });
  }

  downloadLog () {
    this.writeAndDownloadLog("botUpdateLog.json", JSON.stringify(this.stLogs));
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

  checkStatus(imId) {
    const params = {
      userId: this.authService.getUserId(),
      importId: imId
    };
    this.service.invoke('get.importbotstatus', params).subscribe(
      res => {
        this.stLogs = res.statusLogs;
        if(res.status == 'success' || res.status == 'failed') {
          clearInterval(this.overrideStatus);
          if(res.status == 'success') {
            this.update.step = 2;
            this.importedBtStreamId = res.streamId;
            if(!_.isArray(this.workflowService.deflectApps())) {
              this.selectedBt = this.workflowService.deflectApps().name;
            } else {
              this.selectedBt = _.findWhere(this.workflowService.deflectApps(), {_id: res.streamId}).name;
            }
            this.notificationService.notify(this.translate.instant("ONBOARDING.BT_UPDATED_SUCCESSFULLY"), "success");
            this.authService.getDeflectApps();
          } else if(res.status == 'failed') {
            this.importedBtStreamId = res.streamId;
            if(!_.isArray(this.workflowService.deflectApps())) {
              this.selectedBt = this.workflowService.deflectApps().name;
            } else {
              this.selectedBt = _.findWhere(this.workflowService.deflectApps(), {_id: res.streamId}).name;
            }
            this.update.step = 3;
          }
        }
      }, err => {
        this.workflowService.showError(err, this.translate.instant("ONBOARDING.FAILED_CHECK_STATUS"));
      }
    );
  }

  close() {
    this.wSel.emit();
  }

}
