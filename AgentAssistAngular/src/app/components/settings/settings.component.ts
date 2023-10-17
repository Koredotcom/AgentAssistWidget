import { Component, OnInit } from '@angular/core';
import { languages } from 'src/app/proj.const';
import { DirService } from 'src/app/services/dir.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private dirService: DirService
  ){}

  setting = '';
  languages:any = languages
  defLanguage = 'en';
  selectedTheme = 'automatic';

  ngOnInit(): void {
    this.defLanguage = this.localStorageService.getLanguage() || 'en';
    this.selectedTheme = this.localStorageService.getTheme() || 'auto';
    this.checkRtl();
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
}
