import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-ai-config',
  templateUrl: './ai-config.component.html',
  styleUrls: ['./ai-config.component.scss']
})
export class AiConfigComponent implements OnInit {
  features = [
    {
      name: 'Training Utterance Suggestions',
      description: "Generate high-quality training data quickly and easily with our platform's suggested utterances for each intent. Review and add the suggestions as needed to create a powerful training set for your bot.",
      selected: '',
      nameC: 'aa_utterance',
      selectedSrc: ''
    },{
      name: 'None Intent Utterance Suggestions',
      description: 'None intent utterances are used to prevent false positives while doing intent recognition',
      selected: '',
      nameC: 'aa_noneintent',
      selectedSrc: ''
    }
  ];
  azureObj = {
    name: 'Azure OpenAI - GPT-3',
    src: 'https://qa-static.kore.ai/integrations/32/azureOpenAI.png',
    type: 'azure',
    model: 'GPT-3',
  };
  openAiObj = {
    name: 'OpenAI - GPT-3.5',
    src: 'https://qa-static.kore.ai/integrations/32/openai.png',
    type: 'openai',
    model: 'GPT-3.5'
  };
  configOpts = [];

  configArr = [
    {
      "defaultModel": "GPT-3",
      "displayName": "Azure OpenAI - GPT-3",
      "integration": "azure",
      "name": "aa_utterance",
      "enable": false,
      "params": {
          "temperature": 0.7,
          "max_tokens": 1068,
          "Instructions": "1. Structurally different samples\n2. Different entity combinations\n3. Some utterances without entities",
      }
  },
  {
      "params": {
          "temperature": 0.7,
          "max_tokens": 1068,
          "Instructions": "1. Structurally different samples\n2. Different entity combinations\n3. Some utterances without entities",
      },
      "name": "aa_noneintent",
      "integration": "openai",
      "defaultModel": "GPT-3.5",
      "displayName": "OpenAI - GPT-3.5",
      "enable": false,
    }
  ]
  @ViewChild('openAIAndAzureConf', { static: true }) openAIAndAzureConf: SliderComponentComponent;
  azureConfig = false;
  aiConfig = false;
  isOpenAi = '';
  openAiConfig = {};
  azureAiConfig = {};
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.getConfigDetails();
  // }

  ngOnInit(): void {
    this.getConfigDetails();
  }

  openAzureConf(){
    this.azureConfig = true;
    this.openAIAndAzureConf.openSlider("#openAIAndAzureConf", "width550");
  }

  openOpenAIConf(){
    this.aiConfig = true;
    this.openAIAndAzureConf.openSlider("#openAIAndAzureConf", "width550");
  }  

  closeModal(){
    this.openAIAndAzureConf.closeSlider("#openAIAndAzureConf");
    this.aiConfig = false;
    this.azureConfig = false;
  }
  
  openPolieGuidelines(policiesAndGuideLines) {
    this.modalService.open(policiesAndGuideLines, {backdropClass: 'light-blue-backdrop', windowClass: 'dark-modal', centered: true, backdrop: 'static', keyboard: false});
  }

  closePolieGuidelines() {
    this.modalService.dismissAll();
  }
  id = '';
  saveSuccess(res){
    this.integrations["openai"] = res.integrations.openai;
    this.id = res._id;
    let exists = false;
    this.configOpts.forEach((item)=>{
      if(item.type == this.openAiObj.type){
        exists = true;
      };
    });
    if(!exists){
      this.configOpts.push(this.openAiObj);
    }
    if(this.configOpts.length === 0){
      this.configArr.forEach((item)=>{
        item.displayName = this.openAiObj.name;
        item.enable = true;
        item.integration = this.openAiObj.type;
        item.defaultModel = this.openAiObj.model;
      });
      let payload = this.configArr;
      let params: any = {
        userId: this.authService.getUserId(),
        streamId: this.workflowService.getCurrentBt(true)._id,
        llmId: this.id
      };
      if(this.id){
        this.service.invoke('post.features', params, payload)
        .subscribe(res => {
          this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
          this.features.forEach((iItem)=>{
            iItem.selected = 'OpenAI - GPT-3.5';
          })
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
       });
      }
    }
    this.closeModal()
  }

  successAzureObj(res){
    this.integrations["azure"] = res.integrations.azure;
    this.id = res._id;
    let exists = false;
    this.configOpts.forEach((item)=>{
      if(item.type == this.azureObj.type){
        exists = true;
      };
    });
    if(!exists){
      this.configOpts.push(this.azureObj);
    }
    // let inx = this.configOpts.findIndex((item)=>item.type === 'openai');
    if(this.configOpts.length === 0){
      this.configArr.forEach((item)=>{
        item.displayName = this.azureObj.name;
        item.enable = true;
        item.integration = this.azureObj.type;
        item.defaultModel = this.azureObj.model;
      });
      let payload = this.configArr;
      let params: any = {
        userId: this.authService.getUserId(),
        streamId: this.workflowService.getCurrentBt(true)._id,
        llmId: this.id
      };
      if(this.id){
        this.service.invoke('post.features', params, {featureList: payload})
        .subscribe(res => {
          this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
          this.features.forEach((iItem)=>{
            iItem.selected = 'Azure OpenAI - GPT-3';
          })
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
      } 
    }
    this.closeModal();
  }
  
  integrations:any = {}
  getConfigDetails(){
    let params: any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    this.service.invoke('get.AIconfigs', params)
      .subscribe(res => {
        this.id = res[0]._id;
        this.configArr = res[0].featureList || this.configArr;
        this.integrations = res[0].integrations;
        if(this.integrations.azure){
          this.configOpts.push(this.azureObj);
        }if(this.integrations.openai){
          this.configOpts.push(this.openAiObj);
        }
        if(this.integrations.featureList){
          this.integrations.featureList.forEach((item)=>{
            this.features.forEach((iItem)=>{
              if(iItem.nameC === iItem.name){
                iItem.selected = item.displayName;
              }
            });
          })
        }
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
    });
  }

  // selectNone(name, type, model){
  //   const inx = this.configArr.findIndex((item)=> item.name === 'aa_noneintent');
  //   this.configArr[inx].displayName = name;
  //   this.configArr[inx].integration = type;
  //   this.configArr[inx].defaultModel = model;
  // }

  selectOption(item, name){
    const inx = this.configArr.findIndex((item)=> item.name === name);
    this.configArr[inx].displayName = item.name;
    this.configArr[inx].integration = item.type;
    this.configArr[inx].defaultModel = item.model;
    this.features.forEach((iItem)=>{
      if(iItem.nameC === name){
        iItem.selected = item.name;
        iItem.selectedSrc = item.src;
      }
    });
    let params = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id,
      llmId: this.id
    };
    this.service.invoke('post.features', params, {featureList: this.configArr})
    .subscribe(res => {
      this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
    }, err => {
      this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
    });
  }

  changed(event, name){
    this.configArr.forEach((item)=>{
      if(item.name === name){
        item.enable = event.target.checked;
      }
    });
    let params = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id,
      llmId: this.id
    };
    this.service.invoke('post.features', params, {featureList: this.configArr})
    .subscribe(res => {
      this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
    }, err => {
      this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
    });
  }
}
