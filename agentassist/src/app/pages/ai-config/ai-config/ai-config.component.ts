import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-ai-config',
  templateUrl: './ai-config.component.html',
  styleUrls: ['./ai-config.component.scss']
})
export class AiConfigComponent implements OnInit, OnDestroy {
  features = [
    {
      name: 'Training Utterance Suggestions',
      description: "Generate high-quality training data quickly and easily with our platform's suggested utterances for each intent. Review and add the suggestions as needed to create a powerful training set for your bot.",
      selected: '',
      nameC: 'aa_utterance',
      selectedSrc: '',
      enable: false
    },{
      name: 'None Intent Utterance Suggestions',
      description: 'None intent utterances are used to prevent false positives while doing intent recognition',
      selected: '',
      nameC: 'aa_noneintent',
      selectedSrc: '',
      enable: false
    }
  ];
  featuresObj = JSON.parse(JSON.stringify(this.features));
  srcs = {
    azure: 'https://qa-static.kore.ai/integrations/32/azureOpenAI.png',
    openai: 'https://qa-static.kore.ai/integrations/32/openai.png'
  }
  azureObj = {
    name: 'Azure OpenAI - GPT-3',
    src: 'https://qa-static.kore.ai/integrations/32/azureOpenAI.png',
    type: 'azure',
    model: 'GPT-3',
  };
  openAiObj = {
    name: 'OpenAI - GPT-3',
    src: 'https://qa-static.kore.ai/integrations/32/openai.png',
    type: 'openai',
    model: 'GPT-3'
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
      "defaultModel": "GPT-3",
      "displayName": "OpenAI - GPT-3",
      "enable": false,
    }
  ]
  @ViewChild('openAIAndAzureConf', { static: true }) openAIAndAzureConf: SliderComponentComponent;
  azureConfig = false;
  aiConfig = false;
  isOpenAi = '';
  openAiConfig = {};
  azureAiConfig = {};
  subs = new SubSink();
  isCoachingDisable = false;
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private workflowService: workflowService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.getConfigDetails();
  // }

  ngOnInit(): void {
    this.subs.sink = this.authService.isAgentCoachongEnable$.subscribe(isEnabled => {
      this.isCoachingDisable = isEnabled;
    });
    if(!this.isCoachingDisable){
      this.router.navigate(['/config/usecases']); 
    }else{
      this.subs.sink = this.workflowService.updateBotDetails$.subscribe((ele)=>{
        if(ele){
          this.getConfigDetails();
        } 
      });
      this.getConfigDetails();
    }
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
    if(this.configOpts.length === 0){
      if(!exists){
        this.configOpts.push(this.openAiObj);
      }
      this.configArr.forEach((item)=>{
        item.displayName = this.openAiObj.name;
        item.enable = true;
        item.integration = this.openAiObj.type;
        item.defaultModel = this.openAiObj.model;
      });
      let featureList = this.configArr;
      let params: any = {
        userId: this.authService.getUserId(),
        streamId: this.workflowService.getCurrentBt(true)._id,
        llmId: this.id
      };
      if(this.id){
        this.service.invoke('post.features', params, {featureList})
        .subscribe(res => {
          this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
          this.features.forEach((iItem)=>{
            iItem.selected = 'OpenAI - GPT-3';
            iItem.selectedSrc = this.srcs['openai'];
            iItem.enable = true;
          })
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
       });
      }
    }else if(!exists){
      this.configOpts.push(this.openAiObj);
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
    // let inx = this.configOpts.findIndex((item)=>item.type === 'openai');
    if(this.configOpts.length === 0){
      if(!exists){
        this.configOpts.push(this.azureObj);
      }
      this.configArr.forEach((item)=>{
        item.displayName = this.azureObj.name;
        item.enable = true;
        item.integration = this.azureObj.type;
        item.defaultModel = this.azureObj.model;
      });
      let featureList = this.configArr;
      let params: any = {
        userId: this.authService.getUserId(),
        streamId: this.workflowService.getCurrentBt(true)._id,
        llmId: this.id
      };
      if(this.id){
        this.service.invoke('post.features', params, {featureList})
        .subscribe(res => {
          this.notificationService.notify(this.translate.instant('SUCCESSFULLY.UPDATED'), 'success');
          this.features.forEach((iItem)=>{
            iItem.selected = 'Azure OpenAI - GPT-3';
            iItem.selectedSrc = this.srcs['azure'];
            iItem.enable = true;
          })
        }, err => {
          this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
      }
    }else if(!exists){
        this.configOpts.push(this.azureObj);
    }
    this.closeModal();
  }

  integrations:any = {}
  getConfigDetails(){
    this.configOpts = [];
    let params: any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    this.service.invoke('get.AIconfigs', params)
      .subscribe(res => {
        if(!res){
          this.features = JSON.parse(JSON.stringify(this.featuresObj));
          this.integrations = {};
          this.configOpts= [];
          this.openAiConfig = {};
          this.azureAiConfig = {};
          return;
        }
        this.id = res[0]._id;
        this.configArr = res[0].featureList?.length ? res[0].featureList  : this.configArr;
        this.integrations = res[0].integrations;

        (res[0].featureList || []).forEach((item)=>{
          this.features.forEach((iIte,)=>{
            if(item.name === iIte.nameC){
              iIte.selected = item.displayName;
              iIte.selectedSrc = this.srcs[item.integration];
              iIte.enable = item.enable;
            }
          })
        })

        if(this.integrations.azure){
          this.configOpts.push(this.azureObj);
        }if(this.integrations.openai){
          this.configOpts.push(this.openAiObj);
        }
      }, err => {
        this.notificationService.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
    });
  }

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
