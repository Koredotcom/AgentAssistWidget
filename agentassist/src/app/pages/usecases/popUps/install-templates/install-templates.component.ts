import { Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { ConvertBot, Variable } from '../../../../data/install-templates.model';
import { NotificationService } from '@kore.services/notification.service';

import { combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UcDeleteConfirmComponent } from '../../../../helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

import * as _ from 'underscore';
import { AppService } from '@kore.services/app.service';

@Component({
  selector: 'app-install-templates',
  templateUrl: './install-templates.component.html',
  styleUrls: ['./install-templates.component.scss']
})
export class InstallTemplatesComponent implements OnInit {
  onSelect = new EventEmitter();
  install = {
    step: 1
  };
  streamData: any;
  varList: any = [];
  pdfURL: string = null;
  selectedImg: any = 'assets/icons/welcome/bot_icon_0.png';
  instURL: string = null;
  impInterval: any;
  convertedBtId: string;
  isLoading = true;;
  btDesc: string;
  btName: string;
  stLogsConversion: [];
  newStreamData:any = {};
  isConverting = true;
  closeDisable = false;
  allBotNames: string[];
  defaultLang: string;
  botBackup: any;
  convFailed: boolean;


  @ViewChild('imgFile') imgFile: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public workflowService: workflowService,
    private service: ServiceInvokerService,
    private authService: AuthService,
    private notificationService: NotificationService,
    public translate: TranslateService,
    public dialog: MatDialog,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.getBtStream(this.data.data);
    this.allBotNames = _.pluck(this.workflowService.deflectApps(), 'name')
    this.btName = this.data.data.name;
    this.closeDisable = this.workflowService.deflectApps().length == 0;
    this.newStreamData.iconFile = null;
    this.newStreamData.icon = 'assets/icons/welcome/bot_icon_0.png';
    this.uploadIconSelected("assets/icons/welcome/bot_icon_0.png");
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

  cancelBt() {
    this.convFailed = false;
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamData._id
    }
    this.service.invoke('delete.bt.stream', params).subscribe();
    if(_.isArray(this.authService.smartAssistBots)){
      this.closeDg();
    } else {
      this.goToBotStore();
      return;
    }
    let bt = _.isArray(this.workflowService.deflectApps())?this.workflowService.deflectApps()[0]:this.workflowService.deflectApps();
    this.workflowService.switchBt$.next(this.workflowService.deflectApps(bt));
    this.workflowService.doOpenInstallTemps = false;
  }

  getBtStream(p) {
    let streamId;
    if(this.workflowService.doOpenInstallTemps) {
      this.workflowService.setCurrentBt({...p, defaultLanguage: this.authService.btStoreQp.lang });
      streamId = p.id;
    } else {
      this.workflowService.setCurrentBt(p);
      streamId = p.resourceId;
    }
    const addParams = {
      streamId: streamId
    }
    this.service.invoke('get.addBot', addParams).subscribe(res => {
      this.btName = res.originalName;
      this.defaultLang = res.defaultLanguage;
      const params = {
        streamId: res._id
      };
      this.service.invoke('get.bt.stream', params).subscribe(res => {
        if (res.state == 'setup') {
          res.status = 'configured';
          this.streamData = res;
          if(res.solutionBotSettings.hasOwnProperty('configInstURL') && res.solutionBotSettings.hasOwnProperty('configInstFileIdURL')) {
            this.pdfURL = res.solutionBotSettings.configInstFileIdURL;
            if(res.solutionBotSettings?.configInstURL.startsWith('www.')) {
              this.instURL = `http://${res.solutionBotSettings?.configInstURL}`;
            } else {
              this.instURL = res.solutionBotSettings?.configInstURL;
            }
            this.instURL = res.solutionBotSettings?.configInstURL;
          } else if(res.solutionBotSettings.hasOwnProperty('configInstFileIdURL')) {
            this.pdfURL = res.solutionBotSettings.configInstFileIdURL;
          } else {
            if(res.solutionBotSettings?.configInstURL.startsWith('www.')) {
              this.instURL = `http://${res.solutionBotSettings?.configInstURL}`;
            } else {
              this.instURL = res.solutionBotSettings?.configInstURL;
            }
          }
          this.btDesc = res.solutionBotSettings?.botDesc;
        }
        this.isLoading = false;
      }, err => {
        this.workflowService.showError(err, "");
        this.isLoading = false;
      });

      const paramsVar = {
        userId: this.authService.getUserId(),
        streamId: res._id
      };
      this.service.invoke('get.bt.variables', paramsVar).subscribe(res => {
        this.varList = _.where(res.variables, {'variableType': 'env'});
      }, err => {
        this.workflowService.showError(err, "");
      });

    }, err => {
      this.isLoading = false;
      this.workflowService.showError(err, '');
    });

  }

  setupBot(f: NgForm) {
    let lang ='en' // this.workflowService.doOpenInstallTemps?this.defaultLang:this.workflowService.getCurrentBt().defaultLanguage;
    if(_.findIndex(this.workflowService.supportedDeflectLangs, {value: lang}) == -1) {
      this.notificationService.notify(`Only ${_.pluck(this.workflowService.supportedDeflectLangs, 'name').join(', ')} languages are supported currently`, 'error');
      return;
    }
    if(this.allBotNames.indexOf(f.value.instBtName) > -1) {
      this.notificationService.notify(`${f.value.instBtName} ${this.translate.instant('INSTALL_TEMPLATES.BT_NAME_ALREADY_TAKEN')}`, 'error');
      return;
    }
    if(lang === 'en' && !(/^[a-zA-Z0-9][a-zA-Z0-9_<>*. ]+$/.test(f.value.instBtName.trim()))) {
      this.notificationService.notify(this.translate.instant("ONBOARDING.BOT_NAME_ALLOWS"), 'warning');
      return;
    }

    this.btName = f.value.instBtName;
    this.install.step = 2;
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamData._id
    }
    let payload: any = {
      name: f.value.instBtName,
      color: this.streamData.color
    }

    if(this.newStreamData.icon?.fileId) {
      payload.icon = this.newStreamData.icon.fileId;
    }

    combineLatest([
      this.service.invoke('put.market.stream', params, payload).pipe(
        catchError(err => of({error: err, type: 'error'})
      )),
      this.service.invoke('put.bt.stream', params, payload).pipe(
        catchError(err => of({error: err, type: 'error'})
      ))
    ]).subscribe(([res1, res2]: any) => {
      if(res1 && res1.type == 'error') {
        this.workflowService.showError(res1.error, "");
        this.install.step = 1;
      }
      if(res2 && res2.type == 'error') {
        this.workflowService.showError(res2.error, "");
        this.install.step = 1;
      } else {
        this.botBackup = res2;
        if(!res2.isDeflect) {
          this.convertBot();
        }
      }
    });

    let varPickList: Variable[] = [];
    _.each(this.varList, v => {
      v['value'] = f.value[v.key];
      varPickList = varPickList.concat(_.pick(v, 'hint', 'isDeflect', 'key', 'propagateValue', 'scope', 'state', 'vNameSpace', 'value', 'variableType'));
    });

    this.service.invoke('put.bt.variables', params, varPickList).subscribe(res => {

    }, err => {
      this.workflowService.showError(err, "");
    });
  }

  convertBot() {
    let btDetails: ConvertBot = _.pick(this.streamData, 'accountId', 'createdBy', 'defaultLanguage', 'description', 'dialogsCount', 'faqsCount', 'icon', 'isDeflect', 'name', 'status', '_id');
    btDetails['instanceBotId'] = this.appService.selectedInstanceApp$.value?._id;
    this.service.invoke('post.convertbot', {}, btDetails)
      .subscribe(res => {
        this.getConvStatus(res._id);
        this.impInterval = setInterval(() => {
          this.getConvStatus(res._id);
        }, 3000);
      }, err => {
        this.workflowService.showError(err, "");
      });
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
      // this.resetBtIconList();
    }
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

  writeAndDownloadLog(filename, data) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  downloadConverLog() {
    if (this.stLogsConversion) {
      this.writeAndDownloadLog("botConversionLog.json", JSON.stringify(this.stLogsConversion));
    }
  };

  getConvStatus(convId: string) {
    const params = {
      userId: this.authService.getUserId(),
      importId: convId,
      'isAgentAssist':true
    }
    this.service.invoke('get.importconvertbotstatus', params).subscribe(
      res => {
        this.stLogsConversion = res.statusLogs;
        if (res.status == 'success' || res.status == 'failed') {
          clearInterval(this.impInterval);
          if (res.status == 'success') {
            this.convertedBtId = res.streamId;
            this.isConverting = false;
            if(_.isArray(this.authService.smartAssistBots)) {
              this.authService.smartAssistBots.push(this.botBackup);
            } else {
              this.authService.smartAssistBots = [this.botBackup];
            }
            this.authService.deflectApps.next(this.authService.smartAssistBots);
            this.workflowService.deflectApps(this.authService.smartAssistBots);
          } else if (res.status == 'failed') {
            console.log("Conversion Failed");
            this.convFailed = true;
          }
        }
      }, err => {
        this.workflowService.showError(err, "");
      }
    )
  }

  loadConvertedBot() {
    if (this.workflowService.deflectApps() && this.workflowService.deflectApps().length) {
      this.workflowService.switchBt$.next(_.findWhere(this.workflowService.deflectApps(), { _id: this.convertedBtId }));
      this.workflowService.doOpenInstallTemps = false;
      this.closeDg();
    }
  }

  goToBotStore() {
    if (this.data.data.hasOwnProperty('loadDg')) {
      this.onSelect.emit();
      this.workflowService.doOpenInstallTemps = false;
      this.workflowService.loadBotStore$.next();
    } else {
      window.location.href = `${this.workflowService.resolveHostUrl()}/botstore/store`;
    }
  }

  showConfirm() {
    let lang = this.workflowService.doOpenInstallTemps?this.defaultLang:this.workflowService.getCurrentBt().defaultLanguage;
    const params = {
      userId: this.authService.getUserId(),
      streamId: this.streamData._id
    }
    const self = this;

    function close() {
      self.service.invoke('delete.bt.stream', params).subscribe();
      let bt = _.isArray(self.workflowService.deflectApps())?self.workflowService.deflectApps()[0]:self.workflowService.deflectApps();
      self.workflowService.switchBt$.next(self.workflowService.deflectApps(bt));
      self.workflowService.doOpenInstallTemps = false;
      self.closeDg();
    }


    if(_.findIndex(this.workflowService.supportedDeflectLangs, {value: lang}) == -1) {
      close();
      return;
    }

    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '530px',
      height: '240px',
      data: {
        title: this.translate.instant('INSTALL_TEMPLATES.R_U_ABORT'),
        text: this.translate.instant('INSTALL_TEMPLATES.R_U_ABORT_DESC'),
        disableClose: true,
        isFrom: 'installTemplates',
        buttons: [{ key: 'no', label: this.translate.instant('INSTALL_TEMPLATES.NO_I_SETUP'), type: 'primary' }, { key: 'yes', label: this.translate.instant('INSTALL_TEMPLATES.YES_ABORT') }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(response => {
        if(response == 'yes') {
          close();
          dialogRef.close();
        } else if (response == 'no') {
          dialogRef.close();
        }
      });
  }

  closeDg() {
    this.onSelect.emit();
  }

}
