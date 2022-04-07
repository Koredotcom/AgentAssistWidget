import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';
@Component({
  selector: 'app-language-settings',
  templateUrl: './language-settings.component.html',
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {
  languagesList: any = [];
  selectedLanguage: string;
  showLangSearchDropdown: boolean = false;
  selectedLanguageList: any = [];
  languageId: string = "";
  savedLanguages: any[] = []; 

  @ViewChild('langSearchTerm') langSearchTerm: ElementRef;
  @Output() closed = new EventEmitter();

  constructor(private workflowService: workflowService, private translate: TranslateService,
    private service: ServiceInvokerService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    let seedData = this.workflowService.seedData();
    this.languagesList = seedData.supportedLanguages;
    this.getLanguages();
  }

  getLanguages(){
    const params = {};
    this.service.invoke('get.agentLangSettings', params).subscribe(res => {
      console.log(res,"????????");
      if(res && res.length){
        this.languageId = res[0].id;
        if(res[0].languages && res[0].languages.length){
          this.selectedLanguageList = res[0].languages.map(item => {
            return {
              "name": item.label,
              "value": item.language,
              "accessLevel": item.accessLevel,
              "isActive": item.isActive
            };
          });
          let langs= _.map(this.selectedLanguageList, "value");
          this.languagesList = _.filter(this.languagesList, p => _.indexOf(langs, p.value) === -1);
        }else{
          this.selectedLanguageList = [];
         }
         this.savedLanguages = JSON.parse(JSON.stringify(this.selectedLanguageList));
      }
     }, err => {
       this.notificationService.showError(err, this.translate.instant("AGENTS.FAILED_LOAD_AGENTS_GROUP"));
     }); 
  }

  close() {
    this.closed.emit();
  }

  saveLanguages(){
    let accessLevel: any = _.pluck(this.selectedLanguageList, 'accessLevel');
    for(let item of accessLevel){
      if(!item.agent && !item.callAutomation && !item.chatAutomation){
        this.notificationService.showError(undefined, this.translate.instant("AGENTSETTINGS.ACCESS_TO_ERROR"));
        return;
      }
    }

    let arrayObj = this.selectedLanguageList.map(item => {
      return {
        "label": item.name,
        "language": item.value,
        "accessLevel": item.accessLevel,
        "isActive": item.isActive
      };
    });
    const payload = {"languages" : arrayObj};

    if(this.languageId){
      this.service.invoke("put.agentLangSettings", {"languageId": this.languageId}, payload).subscribe(res => {
        console.log(res, "save lang settings resp");
        this.notificationService.showSuccess(this.translate.instant("AGENTSETTINGS.LANG_UPDATED_SUCCESSFULLY"));
        this.close();
      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTSETTINGS.FAILED_SAVE_LANG"));
      })
    }else{
      this.service.invoke("post.agentLangSettings", {}, payload).subscribe(res => {
        console.log(res, "save lang settings resp");
        this.notificationService.showSuccess(this.translate.instant("AGENTSETTINGS.LANG_UPDATED_SUCCESSFULLY"));

        this.close();
      }, err => {
        this.notificationService.showError(err, this.translate.instant("AGENTSETTINGS.FAILED_SAVE_LANG"));
      })
    }
  }

  deleteLang(lang, index) {
    this.selectedLanguageList.splice(index, 1);
    this.languagesList.push(lang);  
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.langSearchTerm && this.langSearchTerm.nativeElement.contains(event.target)) {
      this.showLangSearchDropdown = true;
    } else {
      this.showLangSearchDropdown = false;
    }
  }

  onLanguageSelect(lang){
    this.selectedLanguage = lang.name;
    lang['accessLevel'] = {
      "agent": false,
      "callAutomation": false,
      "chatAutomation": false
    };
    lang['isActive'] = true;
    this.selectedLanguageList.push(lang);  
    this.languagesList = this.languagesList.filter(item => item.value !== lang.value);
      this.selectedLanguage = "";
  }

  disableSave(){
    let val: boolean = false;
    
    function comparer(otherArray){
      return function(current){
        return otherArray.filter(function(other){
          return other.name == current.name
        }).length == 0;
      }
    }

    let otherLanguages: any = this.selectedLanguageList.filter(comparer(this.savedLanguages));

    let accessLevel: any = _.pluck(_.filter(otherLanguages, lang => lang.isActive), 'accessLevel');
    for(let item of accessLevel){
      if(!item.agent && !item.callAutomation && !item.chatAutomation){
        val = true;
      }
    }
    if(JSON.stringify(this.selectedLanguageList) === JSON.stringify(this.savedLanguages) || val){
      return true;
    }else{
      return false;
    }
  }

  onEnter(event){
    this.showLangSearchDropdown = false;
    if(event){
      let arr: any = [];
      _.each(this.languagesList, item=>{
        if((item.name.toLowerCase()).includes(event.toLowerCase())){
          arr.push(item)
        }
      })
      if(arr && arr.length == 1){
        this.onLanguageSelect(arr[0]);
        // this.langSearchTerm.nativeElement.form.reset();
      }
    }
    this.showLangSearchDropdown = true;
  }

}
