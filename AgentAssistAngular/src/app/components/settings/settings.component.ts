import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { languages, ProjConstants, storageConst } from 'src/app/proj.const';
import { DirService } from 'src/app/services/dir.service';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  constructor(
    private localStorageService: LocalStorageService,
    private dirService: DirService,
    private rootService : RootService,
    private handleSubjectService : HandleSubjectService,
    private translateService : TranslateService
  ){}

  subs = new SubSink();
  setting = '';
  languages:any = languages
  defLanguage = 'en';
  selectedTheme = 'automatic';
  projConstants : any = ProjConstants;
  connectionDetails : any;
  proactiveModeEnabled: boolean = this.rootService.proactiveModeStatus;
  aaSettings : any = this.rootService.settingsData;

  ngOnInit(): void {
    this.subscribeEvents(); 
  }

  subscribeEvents(){
    this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
        this.getLocalStorageParams();
      }
    })
  }

  getLocalStorageParams(){
    let appState : any = this.localStorageService.getLocalStorageState();
    let convState = appState[this.connectionDetails.conversationId];    
    this.defLanguage = convState[storageConst.LANGUAGE] || storageConst.ENGLISH;
    this.selectedTheme = convState[storageConst.THEME] || storageConst.AUTO;

    // this.setProactiveMode(convState);
  }

  selectedLang(_event: any){
    let storageObject: any = {
      [storageConst.LANGUAGE]: this.defLanguage
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    // this.localStorageService.setLanguageInfo(this.defLanguage);
    this.translateService.use(this.defLanguage);
    this.rootService.checkRtl(this.defLanguage);
  }


  chooseTheme() {
    let storageObject: any = {
      [storageConst.THEME]: this.selectedTheme
    }
    this.localStorageService.setLocalStorageItem(storageObject);
    // this.localStorageService.setTheme(this.selectedTheme);
  }

  //proactive tab toggle click
  proactiveToggle(proactiveModeEnabled) {
    this.proactiveModeEnabled = proactiveModeEnabled;
    this.rootService.proactiveModeStatus = proactiveModeEnabled;
    this.handleSubjectService.setProactiveModeStatus(proactiveModeEnabled);
    this.updateProactiveModeState(this.proactiveModeEnabled);
  }

  updateProactiveModeState(modeStatus) {
    let storageObject: any = {
      [storageConst.PROACTIVE_MODE]: modeStatus
    }
    this.localStorageService.setLocalStorageItem(storageObject);
  }

  // setProactiveMode(convState){
  //   if(this.connectionDetails.source == this.projConstants.SMARTASSIST_SOURCE && typeof convState[storageConst.PROACTIVE_MODE] != 'boolean'){
  //     convState[storageConst.PROACTIVE_MODE] = this.connectionDetails.isProactiveAgentAssistEnabled;
  //   }
  //   let proactiveModeStatus = (typeof convState[storageConst.PROACTIVE_MODE] === 'boolean') ? convState[storageConst.PROACTIVE_MODE] : true;
  //   this.proactiveToggle(proactiveModeStatus);
  // }

  openurlInBrowser(url){
    this.rootService.openurlInBrowser(url);
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
