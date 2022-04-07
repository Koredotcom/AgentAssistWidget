import { Component, OnInit, ViewEncapsulation, OnDestroy, SimpleChange, ViewChild } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { workflowService } from '@kore.services/workflow.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import * as _ from 'underscore';
@Component({
  selector: 'bt-mainmenu',
  templateUrl: './bt-mainmenu.component.html',
  styleUrls: ['./bt-mainmenu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BTMainmenuComponent implements OnInit, OnDestroy {
  active : any = {};
  currentBt: any;
  searchBt = "";
  bots: any[] = [];
  smartABots: string[];
  subs = new SubSink();

  @ViewChild(NgbDropdown) private dropdown: NgbDropdown;

  constructor(private workflow: workflowService,
              private authService: AuthService) { 

  }

  ngOnInit() {
    this.workflow.btNavigation$.subscribe(data => {
      if (data === null) {
        return;
      }
      if (data.navSelect) {
        this.makeAllMenusInactive();
        this.markActive(data.navSelect);
      }
    })
    this.currentBt = this.workflow.getCurrentSelectedBotId;
    this.subs.sink = this.authService.deflectApps.subscribe(res => {
      if (!res) return;
      this.bots = res.map(bot => {
        bot['taskCount'] = this.getTasksCount(bot);
        return bot;
      })
    })
  }

  // ngOnChanges(changes: SimpleChange) {
  //   this.currentBt = this.workflow.getCurrentSelectedBotId;
  // }

  getTasksCount(bot) {
    if (!bot?.taskCounts?.dialogs) return '';

    let countsMap: any = bot?.taskCounts?.dialogs.map(e => e.count);
    if (countsMap?.length) {
      return countsMap.reduce((a, b) => a + b, 0);
    } else {
      return 0;
    }
  }

  makeAllMenusInactive() {
    this.active = {
      summary:false, channels:false, storyboard:false, dialogtask:false, alerttask:false, 
      actiontask : false, smalltalk:false, publish:false, changelogs:false, digitalforms: false,
      digitalviews: false, training : false, thresholds: false, nlsettings: false,
      defaultdialog : false, events : false, manageinterruptions: false, amendentity: false,
      multiintentdetection: false, sentimentmanagement: false, standardresponses: false, ignorewords: false,
      utterancetesting:false, batchtesting:false, conversationtesting:false,
      generalsettings:false, languages: false, piisettings:false, botfunctions: false, authprofiles: false,
      managesessions: false, envvariables: false, contentvariables: false,
      agenttransfer: false, botkit:false, webmobilesdk: false, manageapps: false, apiscopes: false,
      botversions:false, importexport:false, deletebot:false,
      usagemetrics: false, containmentmetrics: false, nlpmetrics: false, conversationalflows: false
    };
  }
  markActive(selectedMenu) {
    this.makeAllMenusInactive();
    this.active[selectedMenu] = true;
  }
  ngOnDestroy() {
  }
  collapsableMenus = {
    "summary" : true,
    "conversationalskills" : true,
    "digitalskills" : true,
    "naturallanguage" : true,
    "intelligence" : true,
    "testing" : true,
    "configurations" : true,
    "integrations" : true,
    "botmanagement" : true,
    "analyze" : true
  }
  toggleMenu(menuItem) {
    /*let keys = Object.keys(this.collapsableMenus);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] !== menuItem) {
        this.collapsableMenus[keys[i]] = true;
      }
    }*/
    this.collapsableMenus[menuItem] = !this.collapsableMenus[menuItem];
  }
  performBTNavigation(mainTab, link) {
    this.markActive(link);
    this.workflow.btNavigation$.next({"mainTab": mainTab, "link": link})
  }

  navigatetoBotBuilder(bot) {
    this.workflow.getCurrentSelectedBotId = JSON.parse(JSON.stringify(bot));
    this.workflow.btNavigation$.next({'switchBot': true})
    this.currentBt = JSON.parse(JSON.stringify(bot));
    this.dropdown.close();
  }

}
