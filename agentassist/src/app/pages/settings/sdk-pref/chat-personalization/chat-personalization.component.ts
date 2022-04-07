import { Component, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { SettingsService } from '../../setttings.service';
import { SDKWidgetModel } from '../../settings.model';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInAnimation, fadeInOutAnimation } from 'src/app/helpers/animations/animations';
import { AuthService } from '@kore.services/auth.service';
import { FileUploadService } from '@kore.services/fileUploadService/file-upload.service';
import { ColorPickerDirective } from 'ngx-color-picker';
import { TranslateService } from '@ngx-translate/core';
import { DockStatusService } from '@kore.services/dockstatusService/dock-status.service';

declare const koreBotChat: any;
declare const $: any;
@Component({
  selector: 'app-chat-personalization',
  templateUrl: './chat-personalization.component.html',
  styleUrls: ['./chat-personalization.component.scss'],
  animations: [fadeInOutAnimation, fadeInAnimation]
})
export class ChatPersonalizationComponent implements OnInit, OnDestroy {

  selectedApp: any;
  widgets: SDKWidgetModel[] = [];
  currentWidget: SDKWidgetModel;
  activeWidget: SDKWidgetModel;
  widgetForm: FormGroup;
  loading: boolean = true;
  saveInProgress: boolean = false;
  showConfirmation: boolean = false;

  botOptions: any;
  chatConfig: any;
  koreBot: any;
  chatWindowRef: any;
  hostname = window.location.host;

  validExtensions: string[] = ['.png'];
  isLogoUploading: boolean = false;
  logoFileId: string = "";
  logoFileName: string = ""
  logo: string | ArrayBuffer = "";

  isUserIconUploading: boolean = false;
  userIconFileId: string = "";
  userIconFileName: string = "";
  userIcon: string | ArrayBuffer = "";

  isBotIconUploading: boolean = false;
  botIconFileId: string = "";
  botIconFileName: string = "";
  botIcon: string | ArrayBuffer = "";

  fontTypes: any[] = [
    {
      id: 'Arial',
      label: 'Arial'
    },
    {
      id: 'Inter',
      label: "Inter"
    }, {
      id: 'Lato',
      label: 'Lato'
    },
    {
      id: 'Sans',
      label: 'Sans'
    }
  ];

  sectionType: "general" | "header" | "body" | "user" | "bot" = "general";

  @Output() closed = new EventEmitter();
  @ViewChildren(ColorPickerDirective) colorPickers: QueryList<ColorPickerDirective>;
  constructor(
    private service: ServiceInvokerService,
    public workflowService: workflowService,
    private notificationService: NotificationService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private fUpload: FileUploadService,
    private translate: TranslateService,
    private dockService: DockStatusService
  ) { }

  ngOnInit(): void {
    this.selectedApp = this.workflowService.deflectApps();
    this.getThemeDetails();
    this.widgetForm = this.initWidgetForm();
    this.widgetForm.valueChanges.subscribe(value => this.applyStyles(value));
  }


  initWidgetForm(widget?: SDKWidgetModel) {
    return this.fb.group({
      "theme": [widget?.theme || "", Validators.required],
      "font": [widget?.font || "", Validators.required],
      "assistantName": [widget?.assistantName || "", Validators.required],
      "descEnabled": [widget?.descEnabled || false],
      "desc": [widget?.desc || ""],
      "logoEnabled": [widget?.logoEnabled || false, Validators.required],
      "logo": [widget?.logo || "", Validators.required],
      "headerBgColor": [widget?.headerBgColor || "", Validators.required],
      "headerTextColor": [widget?.headerTextColor || "", Validators.required],
      "headerTemplate": [widget?.headerTemplate || "type1", Validators.required],
      "bodyBgColor": [widget?.bodyBgColor || "", Validators.required],
      "timeStampEnabled": [widget?.timeStampEnabled || false, Validators.required],
      "userchatBgColor": [widget?.userchatBgColor || "", Validators.required],
      "userchatTextColor": [widget?.userchatTextColor || "", Validators.required],
      "userIconEnabled": [widget?.userIconEnabled || false, Validators.required],
      "userIcon": [widget?.userIcon || "", Validators.required],
      "botchatBgColor": [widget?.botchatBgColor || "", Validators.required],
      "botchatTextColor": [widget?.botchatTextColor || "", Validators.required],
      "buttonBgColor": [widget?.buttonBgColor || "", Validators.required],
      "buttonTextColor": [widget?.buttonTextColor || "", Validators.required],
      "botIconEnabled": [widget?.botIconEnabled || false, Validators.required],
      "botIcon": [widget?.botIcon || "", Validators.required],
    });
  }

  close() {
    this.closed.emit();
  }

  getThemeDetails() {
    const _params = { 'streamId': this.workflowService.getCurrentBt()._id }
    const ob1 = this.service.invoke('get.settings.widget', _params);
    const ob2 = this.service.invoke('get.settings.widgets', _params);

    forkJoin([ob1, ob2])
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.widgets = res[1];
        this.currentWidget = res[0];
        this.activeWidget = res[0];
        this.widgetForm.patchValue(this.activeWidget);

        setTimeout(() => {
          this.initChat();
          this.removeCommentSection();
        });
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_FETCHING_THEME_DETAILS'));
      });
  }

  onSave() {
    if (this.widgetForm.dirty) {
      this.showConfirmation = true;
    } else {
      this.notificationService.notify(this.translate.instant('NOTIFY.NO_CHANGES_FOUND'), "warning");
    }
  }

  onDone() {
    const _params = { 'streamId': this.workflowService.getCurrentBt()._id }
    let _payload;
    const widget = this.widgets.find(f => f.theme.trim().toLowerCase() === this.widgetForm.value.theme.trim().toLowerCase());
    if (widget) {
      _payload = { ...widget, ...this.widgetForm.value };
    } else {
      _payload = this.createPayload(this.widgetForm.value);
    }

    _payload.logo = this.logoFileId || _payload.logo;
    _payload.userIcon = this.userIconFileId || _payload.userIcon;
    _payload.botIcon = this.botIconFileId || _payload.botIcon;

    this.showConfirmation = false;
    this.saveInProgress = true;
    this.service.invoke('post.settings.widget', _params, _payload)
      .pipe(finalize(() => this.saveInProgress = false))
      .subscribe(res => {
        // const index = this.widgets.findIndex(f => f._id === res._id);
        // if (index === -1) {
        //   this.widgets.push(res);
        // } else {
        //   this.widgets.splice(index, 1, res);
        // }
        // this.currentWidget = res;
        // this.activeWidget = res;
        // this.widgetForm.patchValue(res);
        this.close();
        this.notificationService.notify(this.translate.instant('NOTIFY.UPDATED_SUCCESSFULLY'), "success");
        this.dockService.publisAndHold();
      }, err => {
        this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_UPDATE_THEME_DETAILS'));
      })
  }

  onCancel() {
    this.widgetForm.patchValue(this.currentWidget);
    this.widgetForm.markAsPristine();
  }

  createPayload(widget: SDKWidgetModel) {
    return {
      "theme": widget.theme,
      "font": widget.font,
      "assistantName": widget.assistantName,
      "descEnabled": widget.descEnabled,
      "desc": widget.desc,
      "logoEnabled": widget.logoEnabled,
      "logo": widget.logo,
      "headerBgColor": widget.headerBgColor,
      "headerTextColor": widget.headerTextColor,
      "headerTemplate": widget.headerTemplate,
      "bodyBgColor": widget.bodyBgColor,
      "timeStampEnabled": widget.timeStampEnabled,
      "userchatBgColor": widget.userchatBgColor,
      "userchatTextColor": widget.userchatTextColor,
      "userIconEnabled": widget.userIconEnabled,
      "userIcon": widget.userIcon,
      "botchatBgColor": widget.botchatBgColor,
      "botchatTextColor": widget.botchatTextColor,
      "buttonBgColor": widget.buttonBgColor,
      "buttonTextColor": widget.buttonTextColor,
      "botIconEnabled": widget.botIconEnabled,
      "botIcon": widget.botIcon,
    }
  }

  onChangeTheme(widget: SDKWidgetModel) {
    this.activeWidget = widget;

    // reset temp file uploads
    this.logoFileName = "";
    this.logo = ""
    this.userIconFileName = "";
    this.userIcon = "";
    this.botIconFileId = "";
    this.botIcon = "";

    this.widgetForm.patchValue(widget);
    this.widgetForm.markAsDirty();
  }

  onChangeFont(font: any) {
    this.widgetForm.patchValue({ font: font.id });
    this.widgetForm.markAsDirty();
  }

  onChangeHeaderTempl(type: string) {
    this.widgetForm.patchValue({ headerTemplate: type });
    this.widgetForm.markAsDirty();
  }

  onChangeColorPicker(id, colorCode) {
    this.widgetForm.patchValue({ [id]: colorCode });
    this.widgetForm.markAsDirty();
  }

  openColorPicker(id: string) {
    document.getElementById(id).click();
  }

  scrollHandler($event) {
    this.colorPickers.forEach(clrPicker => {
      clrPicker.closeDialog();
    });
  }


  onFileChange(file: File, type: string) {
    if (file) {
      const _ext = file.name.substring(file.name.lastIndexOf('.'));
      if (this.validExtensions.indexOf(_ext.toLowerCase()) === -1) {
        this.notificationService.notify(this.translate.instant('NOTIFY.INVALID_EXT', {ext: this.validExtensions.join(', ').toUpperCase()}), "error");
        return;
      }

      if (type === 'logo') {
        this.logoFileName = file.name;
        this.isLogoUploading = true;
      } else if (type === 'userIcon') {
        this.userIconFileName = file.name;
        this.isUserIconUploading = true;
      } else if (type === 'botIcon') {
        this.botIconFileName = file.name;
        this.isBotIconUploading = true;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {

        let formData = new FormData();

        formData.append('file', file);
        formData.append('fileContext', 'marketplace');
        formData.append('fileExtension', file.name.substring(file.name.lastIndexOf('.') + 1));
        formData.append('Content-Type', file.type);


        const _params = { "userId": this.authService.getUserId() }
        this.service.invoke('post.uploadfaqfile', _params, formData)
          .pipe(finalize(() => {
            this.isLogoUploading = false;
            this.isUserIconUploading = false;
            this.isBotIconUploading = false;
          }))
          .subscribe(
            res => {
              if (type === 'logo') {
                this.logoFileId = res.fileId;
                this.logo = reader.result;
                this.widgetForm.patchValue({ logo: reader.result })
              } else if (type === 'userIcon') {
                this.userIconFileId = res.fileId;
                this.userIcon = reader.result;
                this.widgetForm.patchValue({ userIcon: reader.result })
              } else if (type === 'botIcon') {
                this.botIconFileId = res.fileId;
                this.botIcon = reader.result;
                this.widgetForm.patchValue({ botIcon: reader.result })
              }
              this.widgetForm.markAsDirty();
              this.applyStyles(this.widgetForm.value);
              this.notificationService.notify(this.translate.instant('NOTIFY.FILE_UPLOADED_SUCCESSFULLY'), "success");
            }, err => { this.notificationService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_UPLOAD_FILE')) });
      };
    }
  }


  initChat() {
    this.botOptions = {
      logLevel: 'debug',
      koreAPIUrl: this.workflowService.resolveHostUrl() + '/api/',
      koreSpeechAPIUrl: '',
      ttsSocketUrl: '',
      recorderWorkerPath: '../libs/recorderWorker.js',
      koreAnonymousFn: () => { },
      JWTUrl: '',
      userIdentity: '', // Provide users email id here
      botInfo: {
        name: 'SmartAssist', //this.selectedApp.name || '',
        icon: this.selectedApp.icon || '',
        _id: this.workflowService.getCurrentBt()._id
      }, // bot name is case sensitive
      clientId: '',
      clientSecret: '',
      assertionFn: (options, callback) => {
        this.service.invoke('post.sts').subscribe(data => {
          options.assertion = data.jwt;
          options.handleError = this.koreBot.showError;
          options.chatHistory = this.koreBot.chatHistory;
          options.botDetails = this.koreBot.botDetails;
          callback(null, options);
          setTimeout(() => {
            if (this.koreBot && this.koreBot.initToken) {
              this.koreBot.initToken(options);
              this.applyStyles(this.widgetForm.value)
            }
          }, 2000);

        }, err => {
          this.koreBot.showError(JSON.stringify(err));
        })
      },
    };
    // this.botOptions.koreSocketUrl = () => 'ws://dummy';


    this.chatConfig = {
      botOptions: this.botOptions,
      allowIframe: false,
      isSendButton: false,
      isTTSEnabled: false,
      isSpeechEnabled: false,
      allowGoogleSpeech: false,
      allowLocation: false,
      loadHistory: true,
      messageHistoryLimit: 10,
      autoEnableSpeechAndTTS: false,
      graphLib: 'd3',
      chatBridge: {},
      container: '.chat-container-app'
    };

    this.chatConfig.chatBridge.beforeRenderMsg = this.beforeRenderMsg.bind(this);


    this.koreBot = koreBotChat();
    this.koreBot.show(this.chatConfig);
    $('.openChatWindow').click(function () {
      this.koreBot.show(this.chatConfig);
    });
  }

  removeCommentSection() {
    $('.kore-chat-window').removeClass('commetSectionDiv');
  }

  beforeRenderMsg() {
    setTimeout(() => {
      this.applyStyles(this.widgetForm.value);
    });
  }

  applyStyles(widget?: SDKWidgetModel) {
    if (!widget) { return; }
    this.highlightTab(this.sectionType);
    this.koreBot?.botDetails(widget);
  }

  highlightTab(type) {

    this.sectionType = type;
    const chatWindow = $('.kore-chat-window');

    chatWindow.find('.kore-chat-header').removeClass('selected-tab');
    chatWindow.find('.kore-chat-body').removeClass('selected-tab');
    chatWindow.find('li.fromCurrentUser .messageBubble').removeClass('selected-tab');
    chatWindow.find('li.fromOtherUsers .messageBubble').removeClass('selected-tab');

    switch (this.sectionType) {

      case 'general':
        break;
      case 'header':
        chatWindow.find('.kore-chat-header').addClass('selected-tab');
        break;
      case 'body':
        chatWindow.find('.kore-chat-body').addClass('selected-tab');
        break;
      case 'user':
        chatWindow.find('li.fromCurrentUser .messageBubble').addClass('selected-tab');
        break;
      case 'bot':
        chatWindow.find('li.fromOtherUsers .messageBubble').addClass('selected-tab');
        break;
    }

  }

  ngOnDestroy() {
    if (this.koreBot) { this.koreBot.destroy(); }
  }

}
