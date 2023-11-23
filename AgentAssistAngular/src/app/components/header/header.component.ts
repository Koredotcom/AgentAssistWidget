import { Component, OnInit } from '@angular/core';
import { coachingConst, ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';
import { EChartsOption } from 'echarts';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  assistLogo : string;


  constructor(private rootService : RootService){
    if(this.rootService?.settingsData?.isCustomisedLogoEnabled?.isEnabled && this.rootService?.settingsData?.isCustomisedLogoEnabled?.fileUrl){
      this.assistLogo = this.rootService?.settingsData?.isCustomisedLogoEnabled?.fileUrl;
    }else{
      this.assistLogo = ProjConstants.LOGO_PATH;
    }
  }

 

}

