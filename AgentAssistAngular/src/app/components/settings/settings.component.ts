import { Component, OnInit } from '@angular/core';
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
  defLanguage = 'en';

  ngOnInit(): void {
    this.defLanguage = this.localStorageService.getLanguage();
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
}
