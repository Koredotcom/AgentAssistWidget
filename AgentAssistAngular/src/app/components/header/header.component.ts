import { Component, OnInit } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  assistLogo : string = ProjConstants.LOGO_PATH;
  showSentiment : boolean = true;


  constructor(private rootService : RootService){
    // if(this.rootService?.settingsData?.isCustomisedLogoEnabled?.isEnabled && this.rootService?.settingsData?.isCustomisedLogoEnabled?.fileUrl){
    //   this.assistLogo = this.rootService?.settingsData?.isCustomisedLogoEnabled?.fileUrl;
    // }else{
      // this.assistLogo = ProjConstants.LOGO_PATH;
    // }

    this.showSentiment = (this.rootService?.settingsData?.sentiment?.isEnabled === false) ? false : true;
  }

 

}

