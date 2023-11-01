import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '@kore.services/app.service';
import { workflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { IframeService } from '@kore.services/iframe.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  showSideMenu = true;
  subscription: Subscription;
  isUnifiedPlatform =false;
  isSidenavCollapsed = false;
  selectedMenuItem= {};

  constructor(
    public appService: AppService, 
    private _activatedRoute: ActivatedRoute,
    private localStoreService: LocalStoreService,
    private iframeEvents: IframeService,
    private router: Router,
    private platformLocation: PlatformLocation ,
    private workflowService: workflowService) {
    }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService.isUnifiedPlatform();

    // let element = this._activatedRoute.snapshot.queryParams;
    // if (element?.isUnifiedPlatform) {
    //   let data = this.localStoreService.getLocalStoreValue('unifyData');
    //   if (data?.screen) {
    //     this.setView({payload: { screen: data.screen,  isView: data.isView }});
    //   }
    // }
    this.workflowService.hideTestFlow = false;
    this.subscription = this.iframeEvents.builderxEvents$.subscribe((data: any) => {
    this.setView(data);
      });
  }

  setView(data) {
    if (data?.payload?.screen) {
      if (data.payload.isView || data?.payload?.screen == 'sAhome') {
        this.showSideMenu = 1 as any;
        document.getElementById('unifyBotFluidContainer').classList.remove('uContainerWidth');
      } else {
        this.showSideMenu = data.payload.isView;
        document.getElementById('unifyBotFluidContainer')?.classList?.add('uContainerWidth');
      }
    }
  }

   minimizeSidenav(event){
    this.isSidenavCollapsed = event
    if(event){
      document.getElementById('unifiedContainer')?.classList?.add('collapsed-unified-left-menu');
      document.getElementById('unifiedContainer')?.classList?.add('is-unified-deflect-container');
    }else{
      // document.getElementById('unifiedContainer')?.classList?.add('is-unified-deflect-container');
      document.getElementById('unifiedContainer').classList.remove('collapsed-unified-left-menu');
    }
  }
  sideMenuSelected(event){
    this.selectedMenuItem = event;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
