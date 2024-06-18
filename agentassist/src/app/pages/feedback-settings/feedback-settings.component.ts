import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { finalize } from 'rxjs/operators';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedback-settings',
  templateUrl: './feedback-settings.component.html',
  styleUrls: ['./feedback-settings.component.scss']
})
export class FeedbackSettingsComponent implements OnInit {

  @ViewChildren(NgbDropdown) suggestionDropdown: QueryList<NgbDropdown>;

  
  subs = new SubSink();
  clonedWidgetSettings:any = {};
  isLoading = false;
  feedbackForm : UntypedFormGroup;

  disableSaveButton : any = {
    dialogs : false,
    faqs : false,
    searchassist : false
  }
  selAcc = this.localstorage.getSelectedAccount();
  iId = this.authService?.isLoadingOnSm && this.selAcc && this.selAcc?.instanceBots?.length ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;

  feedbackList : any = [
    {
      title : 'Dialog Task Feedback',
      desc : 'Define the feedback message provided to agents upon completion of dialog task.',
      enableDesc : 'Enable Dialog Task Feedback',
      bkey : 'dialogs'
    },
    {
      title : 'Answers Feedback',
      desc : 'Define the feedback message provided to agents upon viewing of an Answers or Web Pages.',
      enableDesc : 'Enable Answers Feedback',
      bkey : 'searchassist'
    },
    {
      title : 'FAQ Feedback',
      desc : 'Define the feedback message provided to agents upon viewing of FAQ.',
      enableDesc : 'Enable FAQ Feedback',
      bkey : 'faqs'
    }
  ]
  showCountWarningMsg : boolean = false;
  showDuplicateWarning : boolean = false;
  showDisableWarning : boolean = false;
  selectedLang : any = {
    'dialogs' : 'en',
    'faqs' : 'en',
    'searchassist' : 'en'
  };
  suggestionTitle: string = '';
  supportedLanguageSeedData : any = {};
  languageSelectionList : any = {
    'en' : 'English (En)',
    'ar' : 'Arabic (Ar)',
    'de' : 'German (De)',
    'es' : 'Espanol (Es)',
    'fr' : 'French (Fr)',
    'it' : 'Italian (It)',
    'ja' : 'Japanese (Ja)',
    'ko' : 'Korean (Ko)',
    'zh_cn': 'Chinese (Simplified) - Zh-Cn'
  }

  constructor(private workflowService : workflowService, private service : ServiceInvokerService,
    private authService : AuthService, private notificationService : NotificationService, private translate: TranslateService,
    private fb: UntypedFormBuilder, private localstorage : LocalStoreService, private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  subscribeEvents(){
    this.subs.sink = this.workflowService.updateBotDetails$.subscribe((bot)=>{
      if(bot){
        this.isLoading = true;
        this.getAgentAssistSettingsNew();
      }
    });

    this.subs.sink = this.workflowService.seedData$.subscribe(res => {      
      if(res?.agentAssistSeedData?.supportedLanguages){
        this.feedbackList.forEach((element : any) => {
          this.supportedLanguageSeedData[element.bkey] = {};
          Object.keys(res?.agentAssistSeedData?.supportedLanguages).forEach((key) => {
            if(res?.agentAssistSeedData?.supportedLanguages[key]?.negativeKeyWords){
              this.supportedLanguageSeedData[element.bkey][key] = JSON.parse(JSON.stringify(res?.agentAssistSeedData?.supportedLanguages[key]?.negativeKeyWords[element.bkey]));
            }
          });
        });
      }
      this.getAgentAssistSettingsNew();      
    });
  }

  getAgentAssistSettingsNew() {
    let botId = this.workflowService?.getCurrentBtSmt(true)._id
    let params = {
      orgId: this.authService?.getOrgId(),
    };
    let body = {
      botId
    }
    this.service.invoke("get.agentAssistSettings", params, body).subscribe(
      (res) => {
        if (res) {
          res = this.checkBackwardCompatibility(res);
          this.clonedWidgetSettings = JSON.parse(JSON.stringify(res));
          this.isLoading = false;
          this.createOrUpdateFeedbackForm(res?.agentAssistSettings?.feedback, true);
        }
      },
      (err) => {
        this.isLoading = false;
        this.notificationService.showError(
          err,
          this.translate.instant("FALLBACK_ERROR_MSG")
        );
      }
    )
  }

  checkBackwardCompatibility(res){
    if(!res?.agentAssistSettings?.feedback || Object.keys(res?.agentAssistSettings?.feedback)?.length <= 0){
      res.agentAssistSettings.feedback = {};
    }
    for(let obj of this.feedbackList){
      if(!res.agentAssistSettings?.feedback[obj.bkey] || !res.agentAssistSettings?.feedback[obj.bkey]?.negativeKeyWords || !res.agentAssistSettings?.feedback[obj.bkey]?.negativeKeyWords[this.selectedLang[obj.bkey]]){
        let langSpecificList = this.prepareLanguageSpecificList(this.supportedLanguageSeedData[obj.bkey]['en']);
        res.agentAssistSettings.feedback[obj.bkey] = {
          isEnabled : true,
          acceptComment : true,
          negativeKeyWords : {
            'en' : JSON.parse(JSON.stringify(langSpecificList))
          }
        }
      }
    }
    return res;
  }

  getNegativeKeywordsForEachLang(type, obj, isUpdate) {
    let returnObj = {};
    if (isUpdate && obj && obj[type]?.negativeKeyWords && Object.keys(obj[type]?.negativeKeyWords)?.length) {
        let languageKeys = Object.keys(obj[type].negativeKeyWords);
        returnObj = languageKeys.reduce((acc, lang) => {
            acc[lang] = [obj[type].negativeKeyWords[lang]]; // Change to array
            return acc;
        }, {});
    } else {
        returnObj = this.prepareLanguageSpecificList(this.supportedLanguageSeedData[type][this.selectedLang]);
    }
    return returnObj;
}

createOrUpdateFeedbackForm(obj, isUpdate?) {
    this.feedbackForm = this.fb.group({
        dialogs: this.fb.group({
            isEnabled: [isUpdate ? (obj?.dialogs?.isEnabled ?? true) : true],
            acceptComment: [isUpdate ? (obj?.dialogs?.acceptComment ?? true) : true],
            negativeKeyWords: this.fb.group(this.getNegativeKeywordsForEachLang('dialogs', obj, isUpdate))
        }),
        faqs: this.fb.group({
            isEnabled: [isUpdate ? (obj?.faqs?.isEnabled ?? true) : true],
            acceptComment: [isUpdate ? (obj?.faqs?.acceptComment ?? true) : true],
            negativeKeyWords: this.fb.group(this.getNegativeKeywordsForEachLang('faqs', obj, isUpdate))

        }),
        searchassist: this.fb.group({
            isEnabled: [isUpdate ? (obj?.searchassist?.isEnabled ?? true) : true],
            acceptComment: [isUpdate ? (obj?.searchassist?.acceptComment ?? true) : true],
            negativeKeyWords: this.fb.group(this.getNegativeKeywordsForEachLang('searchassist', obj, isUpdate))
        })
    });
}

  saveFeedbackForm(type){
    this.disableSaveButton[type] = true;
    let params = {
      orgId: this.authService?.getOrgId(),
      aasId: this.clonedWidgetSettings?.id
    };    
    const payload = {
      "orgId": this.authService?.getOrgId(),
      "accountId": this.localstorage?.getSelectedAccount()?.accountId,
      "iId": this.iId,
      "id": this.clonedWidgetSettings?.id,
      updatedByAId: this.clonedWidgetSettings?.updatedByAId,
      "agentAssistSettings" : JSON.parse(JSON.stringify(this.clonedWidgetSettings.agentAssistSettings)) || {}
    }
      
      payload.agentAssistSettings.feedback[type] = this.feedbackForm.value[type];
      
      this.subs.sink = this.service.invoke("put.agentAssistSettings",params, payload)
      .pipe(finalize(() => this.disableSaveButton[type] = false))
      .subscribe(
        (res) => {
          if (res) {
            this.notificationService.showSuccess(this.translate.instant("FEEDBACK_SETTINGS_SAVED"));
            this.updateIndividualFeedbackForm(res,type);
          }
        },
        (err) => {
          this.createOrUpdateFeedbackForm(this.clonedWidgetSettings?.agentAssistSettings?.feedback);
          this.notificationService.showError(
            err,
            this.translate.instant("SAVE_FEEDBACK_FALLBACK_ERROR_MSG")
          );
        }
      );
      // 
  }
  updateIndividualFeedbackForm(res,type){
    if(res?.agentAssistSettings?.feedback && res?.agentAssistSettings?.feedback[type]){
      this.feedbackForm?.get(type)?.patchValue(res?.agentAssistSettings?.feedback[type]);
      this.clonedWidgetSettings.agentAssistSettings.feedback[type] = JSON.parse(JSON.stringify(res?.agentAssistSettings?.feedback[type]));
    }
  }

  toggleFeedbackEvent(event, type){
    let enabled = event.target.checked;
    this.feedbackForm?.get(type)?.patchValue({isEnabled : enabled});
    if(!enabled){
      this.showCountWarningMsg = false;
      this.showDisableWarning = false;
      this.showDuplicateWarning = false;
    }
  }

  toggleFeedbackComment(event,type){
    let enabled = event.target.checked;
    this.feedbackForm?.get(type)?.patchValue({acceptComment : enabled});
  }

  cancel(type){
    let feedbackTypeSettings = JSON.parse(JSON.stringify(this.clonedWidgetSettings?.agentAssistSettings?.feedback[type]))
    this.feedbackForm.get(type).patchValue(feedbackTypeSettings);
  }


  toggleMsgEnable(event, index, type){
    let suggestionSettings = this.feedbackForm?.get(type)?.get('negativeKeyWords')?.get(this.selectedLang[type])?.value;

    let enableCount = 0;
    let duplicateName = false;
    let suggestionNameList = [];
    let zeroEnableStatus = true;
    if(event.target.checked){
      for(let suggestion of suggestionSettings){
        if(suggestion.isEnabled){
          enableCount++;
        }
        if(suggestionNameList.indexOf(suggestion.key) >= 0){          
          duplicateName = true;
        }
        suggestionNameList.push(suggestion.key);
      }
    }else{
      suggestionSettings.forEach((element, inx) => {
        if(element.isEnabled && (inx != index)){
          zeroEnableStatus = false;
        }
      });
    }
    this.showCountWarningMsg = enableCount >= 5 ? true : false;
    this.showDuplicateWarning = duplicateName ? true : false;
    // this.showDisableWarning = !event.target.checked && zeroEnableStatus ? true : false;

    if(this.showCountWarningMsg || this.showDuplicateWarning){
      event.target.checked = !event.target.checked;
    }else{
      suggestionSettings[index].isEnabled = event.target.checked;
      this.feedbackForm?.get(type)?.get('negativeKeyWords')?.get(this.selectedLang[type]).patchValue(suggestionSettings);    
    }
  }

  submitSuggestion(value, index, type){
    
    let duplicateName = false;
    let suggestionSettings = this.feedbackForm?.get(type)?.get('negativeKeyWords')?.get(this.selectedLang[type]).value;

    

    if(suggestionSettings[index].key === value || value == ''){
      this.closeDropdown();
      return;
    }

    suggestionSettings.forEach((suggestion, elinx) => {
      if(index != elinx){
        if(suggestion.key === value){
          duplicateName = true;
          this.showDuplicateWarning = true;
          this.showCountWarningMsg = false;
          this.showDisableWarning = false;
        }
      }
    });

    if(!duplicateName){
      this.closeDropdown();
      suggestionSettings[index].key = value;
      this.feedbackForm?.get(type)?.get('negativeKeyWords')?.get(this.selectedLang[type]).patchValue(suggestionSettings);
    }
  }

  closeDropdown(){
    this.suggestionTitle = '';
    this.suggestionDropdown?.forEach(dropdown => {
      if(dropdown){
        dropdown.close();
      }
    });
  }

  updateLanguageSelection(type, lang) {    
    this.selectedLang[type] = lang;
    let negativeKeyWordsGroup = this.feedbackForm.get(type)?.get('negativeKeyWords') as UntypedFormGroup;
    if (!negativeKeyWordsGroup.get(lang)) {
      let langSpecificList = this.prepareLanguageSpecificList(this.supportedLanguageSeedData[type][lang]);
      negativeKeyWordsGroup.addControl(lang, this.fb.control(langSpecificList));
      this.feedbackForm.updateValueAndValidity();
    }
  }

  prepareLanguageSpecificList(seedData){
   seedData = JSON.parse(JSON.stringify(seedData));
   let acc =  seedData.reduce((accumulator, item, index) => {    
      accumulator.push({ 
        isEnabled : index <= 4 ? true : false,
        key : item
       });
      return accumulator;
    }, [])
    return acc
  }

  asIsOrder(a, b) {
    return 1;
  }
}
