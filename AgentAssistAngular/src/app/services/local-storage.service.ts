import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setLanguageInfo(lang: string){
    window.localStorage.setItem('lang', lang);
  }

  getLanguage(): string{
    return window.localStorage.getItem('lang') as string;
  }
}
