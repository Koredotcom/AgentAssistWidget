import { Component, ElementRef, Input,TemplateRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { EVENTS } from '../helpers/events';
import { ProjConstants, RenderResponseType, supportLanguage } from '../proj.const';
import { CommonService } from '../services/common.service';
import { HandleSubjectService } from '../services/handle-subject.service';
import { RootService } from '../services/root.service';
import { WebSocketService } from '../services/web-socket.service';
import { ServiceInvokerService } from '../services/service-invoker.service';
import { finalize } from 'rxjs/operators';
import { ChunkFileUploadService } from '../helpers/chunk-file-upload.service';
import { FileUploadService } from '../helpers/file-chunk-upload.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const CHUNK_SIZE = 1024 * 1024 * 2;
@Component({
  selector: 'app-ask-customer',
  templateUrl: './ask-customer.component.html',
  styleUrls: ['./ask-customer.component.scss']
})
export class AskCustomerComponent {

  @Input() automation: any;
  @Input() listView : boolean;
  @Input() automationArrayLength;
  @Input() automationIndex;
  @Input() responseArray;
  @Input() responseArrayIndex;
  @Input() assistAutomationData;

  @ViewChild('askCustNode',{static: false}) private askCustNode : ElementRef;

  subs = new SubSink();
  fileObj = {
    fileName: '',
    fileType: '',
    fileId: '',
    fileURL: ''
  };
  largeFileFlag = false;
  fileTypeFlag = false;
  uploadInprogress: boolean = false;
  uploadedFileData: any;
  filePreview:SafeResourceUrl;
  selectedPreview = false;
  attachmentModalView:any;
  projConstants: any = ProjConstants;
  renderResponseType: any = RenderResponseType;
  inputName: string = supportLanguage.AWAITING;

  constructor(public rootService: RootService, private websocketService: WebSocketService, private translateService : TranslateService,
    private commonService : CommonService, private handleSubjectService : HandleSubjectService, private serviceInvoker : ServiceInvokerService,
   private chunkFileUploadService: ChunkFileUploadService, private fileUploadService: FileUploadService, private domSanitizer : DomSanitizer, public modalService: NgbModal) {

  }

  ngOnInit(){
    this.subscribeEvents();
    this.hideSendAndCopy();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.assistTemplateClick$.subscribe(val => {
      if(val && ((this.automation.type == RenderResponseType.AUTOMATION && this.automationIndex === this.automationArrayLength -1) || (this.automation.type == RenderResponseType.SMALLTALK && this.responseArrayIndex === this.responseArray?.length))){
        this.handleTemplateClick();
      }
    })

    this.subs.sink = this.rootService.mybotTemplateClick$.subscribe(val => {
      if(val && ((this.automation.type == RenderResponseType.AUTOMATION && this.automationIndex === this.automationArrayLength -1) || (this.automation.type == RenderResponseType.SMALLTALK && this.responseArrayIndex === this.responseArray?.length))){
        this.handleTemplateClick();
      }
    });

    this.subs.sink = this.handleSubjectService.proactiveModeSubject.subscribe((response: any) => {
      if (response != null && response != undefined && this.automation?.tab === this.projConstants.ASSIST && !this.assistAutomationData?.endAutomation) {
        this.handleOverrideFlag(!response, !response);
        this.handlePlaceHolderText(response);
      }
    });
    this.handlePlaceHolderText(true);
  }

  handlePlaceHolderText(flag){
    this.automation.placeholderText = (flag && this.automation?.tab == this.projConstants.ASSIST && this.rootService.proactiveModeStatus && !this.automation.toggleOverride && !this.automation.hideOverrideDiv) ? 'waiting...' : '';
  }

  handleOverrideFlag(toggleOverride, hideOverrideDiv){
    this.automation.toggleOverride = toggleOverride;
    this.automation.hideOverrideDiv = hideOverrideDiv;
  }

  handleTemplateClick(){
    this.automation.hideOverrideDiv = true;
    this.automation.userInput = this.projConstants.NO;
    this.grayOutCurrentAutomation();
    this.spinnerUpdate();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes?.automation?.currentValue?.toggleOverride) {
      this.inputName = supportLanguage.OVERRIDE;
    }
    if(changes?.automation?.currentValue?.entityValue){
      if(this.automation.entityValue && (typeof this.automation.entityValue == 'object') && Object.keys(this.automation.entityValue)?.length > 0){
        this.automation.entityValue = JSON.stringify(this.automation.entityValue);
      }
    }
    if(changes?.assistAutomationData?.currentValue?.endAutomation){
      this.handleOverrideFlag(false, true);
      this.handlePlaceHolderText(false);
    }
  }

  hideSendAndCopy(){
    // Both send and copy
    this.automation.hideActionButtons = ((this.automation.connectionDetails.isCallConversation) ||
       (this.automation.templateRender && this.automation.template && this.automation.connectionDetails.source != this.projConstants.SMARTASSIST_SOURCE)) ? true : false;

    // only copy button
    if((this.rootService.settingsData?.isAgentResponseCopyEnabled === false) || (this.automation.templateRender && this.automation.template && this.automation.connectionDetails.source == this.projConstants.SMARTASSIST_SOURCE)){
      this.automation.hideCopyButton = true; 
    }

    if(this.rootService.settingsData?.isAgentResponseEnabled === false){
      this.automation.hideSendButton = true;
    }

    if(this.automation.hideSendButton && this.automation.hideCopyButton){
      this.automation.hideActionButtons = true;
    }    
  }

  confirmOverride() {
    if (!this.automation.toggleOverride && this.rootService.activeTab != this.projConstants.MYBOT) {
      this.inputName = supportLanguage.OVERRIDE;
      this.automation.toggleOverride = true;
      if (!this.rootService.OverRideMode) {
        this.handleOverridBtnClick(this.automation.connectionDetails, this.automation.dialogId, this.automation.toggleOverride);
      }
      this.handlePlaceHolderText(false);
    }
  }

  cancelOverride() {
    if (this.rootService.activeTab != this.projConstants.MYBOT) {
      this.inputName = supportLanguage.AWAITING;
      this.automation.toggleOverride = false;
      this.automation.entityValue = this.automation.errorCount ? this.automation.entityValue : '';
      if(this.rootService.OverRideMode && this.rootService.proactiveModeStatus && !this.rootService.manualAssistOverrideMode){
        this.handleOverridBtnClick(this.automation.connectionDetails, this.automation.dialogId, this.automation.toggleOverride);
      }
      this.handlePlaceHolderText(true);
    }
  }

  handleOverridBtnClick(connectionDetails, dialogId, toggleOverride) {
    this.websocketService.handleOverrideMode(toggleOverride, dialogId);
  }

  handleAgentInput() {
    if(this.automation?.data?.entityType === 'attachment') {
      if(this.uploadedFileData?.files && this.uploadedFileData?.files?.length > 0) {
        this.automation.hideOverrideDiv = true;
        this.fileUploadCall(this.uploadedFileData?.files[0]);
      }
    } else if(this.automation.entityValue){
      this.automation.hideOverrideDiv = true;
      this.automation.userInput = this.projConstants.NO;
      if (this.rootService.activeTab == this.projConstants.ASSIST) {
        this.assistInputValue(this.automation.entityValue);
      } else if (this.rootService.activeTab == this.projConstants.MYBOT) {
        this.mybotInputValue(this.automation.entityValue)
      }
    }
    this.grayOutCurrentAutomation();
  }

  assistInputValue(inputValue) {
    let connectionDetails = Object.assign({}, this.automation.connectionDetails);
    connectionDetails.value = inputValue;
    connectionDetails.positionId = this.automation.dialogId;
    // connectionDetails.entities = this.commonService.isRestore ? JSON.parse(this.commonService.previousEntitiesValue) : this.commonService.entitiestValueArray
    connectionDetails.childBotId = this.automation.data.childBotId;
    connectionDetails.childBotName = this.automation.data.childBotName;
    connectionDetails.sourceMsgId = this.automation.sourceMsgId || '';
    if(this.automation?.data?.entityType === 'attachment') {
      connectionDetails.attachments = [
        {
            "fileName": this.fileObj?.fileName || '',
            "fileType": this.fileObj?.fileType || '',
            "fileId": this.fileObj.fileId || '',
            "url": {
                "fileUrl": this.fileObj.fileURL || ''
            }
        }
      ]
    }
    let assistRequestParams = this.rootService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
    this.spinnerUpdate();
  }

  mybotInputValue(inputValue) {
    let connectionDetails: any = Object.assign({}, this.automation.connectionDetails);
    connectionDetails.value = inputValue;
    connectionDetails.isSearch = false;
    connectionDetails.positionId = this.automation.dialogId;
    connectionDetails.childBotName = this.rootService?.childBotDetails.childBotName;
    connectionDetails.childBotId = this.rootService?.childBotDetails.childBotId;
    connectionDetails.sourceMsgId = this.automation.sourceMsgId || '';
    if(this.automation?.data?.entityType === 'attachment') {
      connectionDetails.attachments = [
        {
            "fileName": this.fileObj?.fileName || '',
            "fileType": this.fileObj?.fileType || '',
            "fileId": this.fileObj.fileId || '',
            "url": {
                "fileUrl": this.fileObj.fileURL || ''
            }
        }
      ]
    }
    let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
    this.spinnerUpdate();
  }

  handleSendCopyButton(method, automation) {
    automation.send = (method === this.projConstants.SEND) ? 'send' : 'copied';
    let sendData = this.prepareSendText(automation.sendData);
    this.commonService.handleSendCopyButtonForNodes(method, sendData, this.automation);
    this.responseArray = this.commonService.grayOutPreviousAutomation(this.responseArray, this.automationIndex, this.responseArrayIndex);
    this.responseArray = structuredClone(this.responseArray);
  }

  grayOutCurrentAutomation(){
    this.automation.grayOut = true;
  }

  spinnerUpdate(){
    console.log(this.automation, "spinner update ********");
    
    this.automation.showSpinner = true;
    setTimeout(() => {
      if(this.automation.showSpinner){
        this.automation.showSpinner = false;
        this.automation.grayOut = false;
        this.automation.disableInput = false;
      }
    }, 10000);
  }

  prepareSendText(sendData){
    if(!this.automation.templateRender){
      let format = this.rootService?.settingsData?.agentActions?.sharingFormat ? this.rootService?.settingsData?.agentActions?.sharingFormat : 'plainString';
      if(format == 'plainString'){
        sendData = this.rootService.extractTextFromElement(this.askCustNode.nativeElement);
      }
    }
    return sendData;
  }

  // adding the files by selection
  addFiles(event: Event, files) {
    const inputFile = event.target as HTMLInputElement;
    if(this.automation?.data?.entityType === 'attachment') {
      this.removeFile();
    }
    this.uploadedFileData = inputFile;
    // this.fileUploadCall(files[0]);
    this.fileObj.fileName = files[0].name;
  }

  removeFile() {
    this.largeFileFlag = false;
    this.fileTypeFlag = false;
    this.fileObj = {
      fileName: '',
      fileType: '',
      fileId: '',
      fileURL: ''
    }
  }

  // file upload method
  fileUploadCall(file){
    if (!file) {
      return;
    }

    if(file?.size >= 25000000){ // file size restricting to 25MB
      this.automation.hideOverrideDiv = false;
      this.automation.toggleOverride = false;
      this.largeFileFlag = true;
      return;
    }

    const self = this;
    var reader = new FileReader();
    reader.readAsText(file);
    this.fileObj.fileName = file.name;
    this.fileObj.fileType = file?.type;
    reader.onload = function (e) {
    };

    let chunkUpload = file.size > CHUNK_SIZE;
    if(chunkUpload){
      this.chunkFileUploadService.getFileToken().subscribe(token =>{
        console.log(token);
        if(token){
          this.chunkFileUploadService.uploadChunkFile(token, file).subscribe(fileId =>{
            console.log("fileId received>>>>>>>", fileId);
            if(fileId){
              console.log(fileId);
              this.getuploadedFileURL(fileId)
              // this.botDefFileId = fileId;
            }
          })
        }
      });
    } else {
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      let formData: any = new FormData();
      formData.append('file', file);
      formData.append('fileContext', 'bulkImport');
      formData.append('fileExtension', file?.name.substring(file?.name.lastIndexOf('.') + 1));
      formData.append('Content-Type', file?.type);
      formData.append('fileName', file?.name)

      self.uploadInprogress = true;
      this.serviceInvoker.invoke('post.uploadfile', {}, formData, {},  this.rootService?.connectionDetails?.agentassisturl)
      .pipe(finalize(() => { }))
        .subscribe(
          (res : any) => {
            this.largeFileFlag = false;
            this.fileTypeFlag = false;
            this.fileObj.fileId = res?.fileId;
            this.getuploadedFileURL(res?.fileId);
          }, err => {
          });
    }
      
    
  }

  // get uploaded file preview method
  getuploadedFileURL(fileId){
    this.serviceInvoker.invoke('get.uploadedfile', {'fileId': fileId}, {}, {}, this.rootService?.connectionDetails?.agentassisturl).subscribe((res) => {
      if(res) {
        this.largeFileFlag = false;
        this.fileObj.fileURL = res?.fileUrl;
        this.filePreview = res?.fileUrl;
        this.automation.userInput = this.projConstants.NO;
        if (this.rootService.activeTab == this.projConstants.ASSIST) {
          this.assistInputValue(this.automation.entityValue);
        } else if (this.rootService.activeTab == this.projConstants.MYBOT) {
          this.mybotInputValue(this.automation.entityValue)
        }
      }
    })
  }

  downloadFile(url) {
    const fileUrl = url.fileURL;
    // this.serviceInvoker.invoke().subscribe(blob => {
    //   const a = document.createElement('a');
    //   const objectUrl = URL.createObjectURL(blob);
    //   a.href = objectUrl;
    //   a.download = 'file.pdf'; // Set the file name here
    //   a.click();
    //   URL.revokeObjectURL(objectUrl);
    // });
  }

  previewFile(url) {
    this.selectedPreview = true;
    const fileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url.fileUrl);

  }
  cancelFilePreview() {
    this.selectedPreview = false;
  }


  openAttachmentView(data){
    this.attachmentModalView = this.modalService.open(data ,{windowClass: 'attachment-full-popup', centered: true, backdrop:'static', keyboard:false, backdropClass: 'attachment-full-popup-backdrop'});
  }

  closeAttachmentView(){
    this.attachmentModalView.close();
  }
}
