import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService
  ){}

  setting = '';
  defLanguage = 'en';

  ngOnInit(): void {
    this.defLanguage = this.localStorageService.getLanguage();
  }

  selectedLang(_event: any){
    this.localStorageService.setLanguageInfo(this.defLanguage);
  }
}
