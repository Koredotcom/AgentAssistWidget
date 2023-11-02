import { Component, OnDestroy, OnInit } from '@angular/core';
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
    private handleSubjectService : HandleSubjectService
  ){}

  subs = new SubSink();
  setting = '';
  languages:any = languages
  defLanguage = 'en';
  selectedTheme = 'automatic';
  projConstants : any = ProjConstants;
  connectionDetails : any;
  proactiveModeEnabled: boolean = false;


  ngOnInit(): void {
    this.defLanguage = this.localStorageService.getLanguage() || 'en';
    this.selectedTheme = this.localStorageService.getTheme() || 'auto';
    this.checkRtl();
    this.subscribeEvents();
    this.setProactiveMode();
  }

  subscribeEvents(){
    this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
      }
    })
  }

  selectedLang(_event: any){
    this.localStorageService.setLanguageInfo(this.defLanguage);
    this.checkRtl();
  }

  checkRtl(){
    if(this.defLanguage === 'ar'){
      this.dirService.setDirection('rtl');
    }else{
      this.dirService.setDirection('ltr');
    }
  }

  chooseTheme(){
    this.localStorageService.setTheme(this.selectedTheme);
  }

    //proactive tab toggle click
    proactiveToggle(proactiveModeEnabled) {
      this.proactiveModeEnabled = (proactiveModeEnabled == ProjConstants.PROACTIVE_INITIAL_MODE) ? true : proactiveModeEnabled;
      this.handleSubjectService.setProactiveModeStatus(proactiveModeEnabled);
      this.updateProactiveModeState(this.proactiveModeEnabled);
    }
  
    updateProactiveModeState(modeStatus){
      let storageObject: any = {
        [storageConst.PROACTIVE_MODE]: modeStatus
      }
      this.localStorageService.setLocalStorageItem(storageObject);
  }
  
  setProactiveMode(){
    let appState : any = this.localStorageService.getLocalStorageState();
    let convState = appState[this.connectionDetails.conversationId];
    if(this.connectionDetails.source == this.projConstants.SMARTASSIST_SOURCE && typeof convState[storageConst.PROACTIVE_MODE] != 'boolean'){
      convState[storageConst.PROACTIVE_MODE] = this.connectionDetails.isProactiveAgentAssistEnabled;
    }
    let proactiveModeStatus = (typeof convState[storageConst.PROACTIVE_MODE] === 'boolean') ? convState[storageConst.PROACTIVE_MODE] : true;
    this.proactiveToggle(proactiveModeStatus);
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
