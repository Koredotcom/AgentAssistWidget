import * as _ from 'underscore';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { workflowService } from '@kore.services/workflow.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AppService } from '@kore.services/app.service';

@Component({
  selector: 'app-bt-container',
  templateUrl: './bt-container.component.html',
  styleUrls: ['./bt-container.component.scss']
})
export class BTContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('btiframe') iframe: ElementRef<HTMLIFrameElement>;
  @Input() hideMenu = false;
  btNavigationType = '';
  currentBot : any = null;
  smartABots: string[];
  RETRY_INTERVAL = 1000;
  NO_OF_RETRIES = 60;
  builderSafeUrl:SafeResourceUrl;
  directFlag = false;
  mainTab;
  link;
  hideClicks = true;
  getTokenSub : any;
  btNavSub : any;
  routeParamsSub : any;
  private log_prefix = 'btcontainer >>>';
  constructor(private route: ActivatedRoute, public workflowService: workflowService,
    private authService: AuthService, private router: Router, private domSanitizer : DomSanitizer,
    private service: ServiceInvokerService,  private localStoreService: LocalStoreService,
    private appService: AppService) { 
    
  }
  ngOnDestroy(): void {
    this.getTokenSub.unsubscribe();
    this.btNavSub.unsubscribe();
    this.routeParamsSub.unsubscribe();
    clearInterval(this.maximizeInterval);
    clearInterval(this.publishInterval);
  }
  ngAfterViewInit(): void {

  }
  isWelcomeScreenLoaded() {
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = null;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var btns = doc.querySelectorAll(".welcomeMessage");
        if (btns && btns.length > 0) {
            clearInterval(interval);
            resolve(true)
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(false);
        }
      }, this.RETRY_INTERVAL)
      
    });
  }
  whichScreenIsLoaded() {
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = null;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var btns = doc.querySelectorAll(".btnSolidBlue");
        if (btns && btns.length > 0) {
          for (var i = 0; i < btns.length; i++) {
            if (btns[i] && btns[i].getAttribute("ng-click") === `showForm($event, 'dialogTasks')`) {
              clearInterval(interval);
              return resolve("dialog")
            }
          }
        }
        btns = doc.querySelectorAll(".welcomeMessage");
        if (btns && btns.length > 0) {
            clearInterval(interval);
            return resolve("welcome")
        }

        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(false);
        }
      }, this.RETRY_INTERVAL)
      
    });
  }
  performBTNavigation(navData) {
    var link = navData.link;
    var mainTab = navData.mainTab;
    this.loading = true;
    // if (window.location.href.indexOf("/bt") !== -1) {
      if (mainTab !== 'analyze' && mainTab !== 'manage') {
        this.checkTabClick(mainTab).then(e=> {
          if (e !== null) {
            this.simulateClick(e);
            this.navigateToSubMenu(link);
            this.loading = false;
          }
        })
      } else {
        // analyze is a menu not a tab so need to handle differently
        this.navigateToAnalyzeMenu(link).then(e => {
          if (e) {
            this.simulateClick(e);
          }
          this.loading = false;
        })
      }
  
    // } 
    // else {
    //   this.router.navigate([link]);
    // }
  }
  navigateToAnalyzeMenu(link) {
    let linkToClickMap = {
      "usagemetrics" : `callbacks.navigateTo(null,'botDashboard')`,
      "containmentmetrics" : `callbacks.navigateTo(null,'containmentDashboard')`,
      "nlpmetrics" : `callbacks.navigateTo(null,'metrics')`,
      "conversationalflows" : `callbacks.navigateTo(null,'sessionFlow')`
    }
    var ngclickValue = linkToClickMap[link];
    var interval = null;
    var doc = null;
    var noOfTries = this.NO_OF_RETRIES;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var element = doc.querySelector(`[ng-click="${ngclickValue}"]`);
        console.log(`${this.log_prefix}  analyze link `,link, element)
        if (element) {
            clearInterval(interval);
            resolve(element);
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(false);
        }
      }, this.RETRY_INTERVAL)
    })
  }
  getIframeElement() {
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    //var doc = this.iframe.nativeElement.contentDocument;
    var iframe = null;
    
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        iframe = document.getElementById('btiframe');
        if (iframe && this.iframe?.nativeElement?.contentDocument) {
          clearInterval(interval);
          return resolve(iframe);
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          return resolve(null);
        }
      }, this.RETRY_INTERVAL);
    });
  }
  gotBotBuilderUrl = false;
  ngOnInit(): void {
    this.loading = true;
    this.hideClicks = true;
    this.btNavSub = this.workflowService.btNavigation$.subscribe(navData => {
      console.log('NavData: ',navData);
      if (!navData) {
        return;
      }
      if ((!this.gotBotBuilderUrl && (this.workflowService.directFlag || this.workflowService.editInPlatform)) || (navData.switchBot === true)) {
        this.getBotBuilderURL();
      }
      if (navData.builderUrl) {
        console.log('builderUrl: ',navData.builderUrl);
        this.getIframeElement().then(f => {
          this.initMenuClassMap();
          console.log(`${this.log_prefix}  userprofile`, this.authService.userProfile);
          this.loading = true;
          this.whichScreenIsLoaded().then(loaded => {
            console.log(`${this.log_prefix}  whichScreenIsLoaded`, loaded);
            if (loaded === 'dialog') {
              if (this.workflowService.directFlag) {
                this.performBTNavigation({"mainTab" :this.workflowService.mainTab, "link":this.workflowService.link})
                this.workflowService.directFlag = false;
              } else {
                if (this.btNavigationType === '' || !this.btNavigationType) {
                  this.btNavigationType = 'build'
                }
                this.performBTNavigation({"mainTab" : this.btNavigationType, "link" : "summary"});
                this.workflowService.btNavigation$.next({navSelect : "summary"}); 
              }
            } else if (loaded === 'welcome') {
              this.navigateToBTUseCase();
            }
            this.loading = false;
          });
          /*this.isWelcomeScreenLoaded().then(loaded => {
            console.log(`${this.log_prefix}  isWelcomeScreenLoaded`, loaded);
            if (loaded) {
              this.navigateToBTUseCase();
            } else {
              this.whichScreenIsLoaded().then(loaded => {
                console.log(`${this.log_prefix}  whichScreenIsLoaded`, loaded);
                if (loaded) {
                  this.performBTNavigation({"mainTab" : this.btNavigationType, "link" : "summary"});
                  this.workflowService.btNavigation$.next({navSelect : "summary"}); 
                }
              });
            }
          })*/
        })
        return;
      }
      if (navData.link) {
        console.log('link',navData.link);
        this.performBTNavigation(navData);
      }
    });
    if (this.workflowService.deflectAppsData.length || this.workflowService.deflectAppsData._id) {
      this.smartABots = this.authService.smartAssistBots;
      this.smartABots.forEach((v: any) => {
        v.name = v.name.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
      });
      this.currentBot = _.findWhere(this.authService.smartAssistBots, { _id: this.workflowService.deflectApps()._id || this.workflowService.deflectApps()[0]._id });
      this.workflowService.setCurrentBt(this.currentBot);
    }
    this.routeParamsSub = this.route.params.subscribe((params: Params) => {
      console.log(`${this.log_prefix}  params`, params);
      console.log(`${this.log_prefix} bots`, this.authService.smartAssistBots);
      this.initMenuClassMap();
      if (params && params.type) {
        this.btNavigationType = params["type"];
      } 
      if (this.btNavigationType === 'deploy') {
        this.workflowService.btNavigation$.next({navSelect : "channels"});
        this.hideClicks = false;
      } else if (this.btNavigationType === "build") {
        this.workflowService.btNavigation$.next({navSelect : "dialogtask"});
        this.hideClicks = false;
      }else if (this.btNavigationType === 'build') {
        this.workflowService.btNavigation$.next({navSelect : "summary"});
        this.hideClicks = false;
      } 
    });
    this.getBotBuilderURL();
    this.maximizeBTScreen();
    this.onPublish();
  }
  maximizeInterval = null;
  maximized = false;
  maximizeBTScreen() {
    var doc = null;
    this.maximizeInterval = setInterval(()=> {
      if (this.iframe) {
        doc = this.iframe.nativeElement.contentDocument;
        var element = doc?.getElementsByClassName('btFullpageModal');
        if (element && element.length > 0) {
          var elementInOpenedState = false;
          for (var i = 0; i < element.length; i++) {
            if (element[i].style.display === 'block') {
              elementInOpenedState = true;
              if (!this.maximized) {
                var closeAction = doc.getElementsByClassName("closeBtn");
                this.hideAppMenu();
                if (closeAction && closeAction.length > 0) {
                  closeAction[0].addEventListener("click", this.unHideAppMenu.bind(this));
                }
              }
            }
          }
          if (!elementInOpenedState) {
            this.unHideAppMenu();
          }
        }
      }
    }, 500);
  }
  unHideAppMenu() {
    var appMenu = document.getElementsByTagName("APP-MAINMENU");
    var doc = this.iframe.nativeElement.contentDocument;
    var closeAction = doc.getElementsByClassName("closeBtn");
    if (closeAction && closeAction.length > 0) {
      closeAction[0].removeEventListener("click", this.unHideAppMenu.bind(this));
    }
    if (appMenu && appMenu.length) {
      (<HTMLElement> appMenu[0]).style.display = 'block';
    }
    setTimeout(() => {
      this.maximized = false;
    }, 200);

  }
  hideAppMenu() {
    var appMenu = document.getElementsByTagName("APP-MAINMENU");
    if (appMenu && appMenu.length) {
      (<HTMLElement> appMenu[0]).style.display = 'none';
    }
    this.maximized = true;
  }
  checkAndClickStartCreate() {
    var interval = null;
    var doc = null;
    var noOfTries = 5;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var element = doc.querySelector(`[ng-click="startCreate('bots')"]`);
        console.log(`${this.log_prefix}  startCreate button`,element)
        if (element && element.getAttribute("ng-click") === "startCreate('bots')") {
            clearInterval(interval);
            resolve(true);
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(false);
        }
      }, this.RETRY_INTERVAL)
    })
  }
  checkTabClick(navType) {
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = null;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var elements = doc.getElementsByClassName('tabClick');

        console.log(`${this.log_prefix}  tab click`,elements)
        if (elements && elements.length > 0) {
          for (var i = 0; i < elements.length; i++) {
            var e = elements[i];
            var att = e.getAttribute('ng-class');
            if (navType === 'deploy') {
              if (att && att.indexOf(`selectedTab === 'deploy'`) !== -1) {
                console.log(`${this.log_prefix}  element ng-class`, att);
                clearInterval(interval);
                return resolve(e);
              }
            } else if (navType === 'build') {
              console.log(att)
              if (att && att.indexOf(`selectedTab === 'skills'`) !== -1) {
                console.log(`${this.log_prefix}  element ng-class`, att);
                clearInterval(interval);
                return resolve(e);
              }
            }
          }
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(null);
        }
      }, this.RETRY_INTERVAL)
    })
  }
  findClickableElement(element) {
    if (element.getAttribute) {
      var att = <HTMLElement> element.getAttribute("ng-click");
      if (att) {
        console.log(`${this.log_prefix}  clickable element`, element);
        return att;
      }
      var children = element.children;
      for (var i = 0; i < children.length; i++) {
        return this.findClickableElement(children[i]);
      }
    }
    return null;
  }
  findAndNavigateToMenu(menuId) {
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = this.iframe.nativeElement.contentDocument;
    
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var menuElement = doc.getElementById(menuId);
        console.log(`${this.log_prefix}  ${menuId}`,menuElement)
        if (menuElement) {
          var elementToClick = menuElement;
          if (elementToClick !== null) {
            clearInterval(interval);
            resolve(elementToClick);
          }
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(null);
        }
      }, this.NO_OF_RETRIES);
    });
    
  }

  checkAndClickSelectedBot() {
    var interval = null;
    var noOfTries = 5;
    var doc = null;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var elements = doc.getElementsByClassName('botName');

        console.log(`${this.log_prefix}  bot tiles`,elements)
        if (elements && elements.length > 0) {
          for (var i = 0; i < elements.length; i++) {
            if (elements[i].innerText === this.currentBot.name) {
              clearInterval(interval);
              resolve(elements[i]);
            }
          }
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(null);
        }
      }, this.RETRY_INTERVAL)
    })
  }
  checkAndClickBackArrow() {
    var interval = null;
    var noOfTries = 2;
    var doc = null;
    return new Promise((resolve, reject) => {
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var elements = doc.querySelectorAll('.backArrowGray,.btx-carrot-left');

        console.log(`${this.log_prefix}  backArrowGray`,elements)
        if (elements && elements.length > 0) {
            clearInterval(interval);
            resolve(elements[0]);
        }

        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(null);
        }
      }, this.RETRY_INTERVAL)
    }).then(element => {
      if (element !== null) {
        this.simulateClick(element);
      }
      return element;
    });
  }
  isTitleOverflowFound() {
    // titleOverflow
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = null;
    return new Promise((resolve, reject) => {
      doc = this.iframe.nativeElement.contentDocument;
      interval = setInterval(() => {
        
        doc = this.iframe.nativeElement.contentDocument;
        var elements = doc.querySelectorAll("titleOverflow");
        console.log(`${this.log_prefix}  titleOverflow`,elements)
        if (elements && elements.length > 0) {
          resolve(true);
        }
        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(null);
        }
      }, this.RETRY_INTERVAL)
    }).then(element => {
      if (element !== null) {
        this.simulateClick(element);
      }
      return element;
    });
  }
  checkBotFromDropDown() {
    let streamName = this.currentBot.name;
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = null;
    return new Promise((resolve, reject) => {
      doc = this.iframe.nativeElement.contentDocument;
      var btn = doc.getElementById("botsListingDropDown");
      if (btn) {
        this.simulateClick(btn);
      }
      interval = setInterval(() => {
        doc = this.iframe.nativeElement.contentDocument;
        var elements = doc.querySelectorAll('.botTitle');

        console.log(`${this.log_prefix}  botTitle`,elements)
        if (elements && elements.length > 0) {
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.innerText === streamName) {
              resolve(element);
              clearInterval(interval);
            }
          }
        }

        noOfTries--;
        if (noOfTries === 0) {
          clearInterval(interval);
          resolve(null);
        }
      }, this.RETRY_INTERVAL)
    }).then(element => {
      if (element !== null) {
        this.simulateClick(element);
      }
      return element;
    });

  }
  loading = false
  menuToElementMap : any;
  initMenuClassMap() {
    this.menuToElementMap = {
      "summary" : "menuHeader_botSummary",
      "storyboard" : "popOverEvent_conversationalSkillsstoryboard",
      "dialogtask" : "popOverEvent_conversationalSkillsdialogTasks",
      "knowledgegraph" : "popOverEvent_conversationalSkillsknowledgeCollection",
      "alerttask" : "popOverEvent_conversationalSkillsalertTasks",
      "actiontask" : "popOverEvent_conversationalSkillsactionTasks",
      "smalltalk" : "popOverEvent_conversationalSkillssmallTalk",
      "channels" : "menuHeader_channles",
      "publish" : "menuHeader_publish",
      "changelogs" : "menuHeader_changeLogs",
      "digitalforms" : "popOverEvent_digitalSkillsuiForms",
      "digitalviews": "popOverEvent_digitalSkillswidgets",
      "training" : "popOverEvent_trainingmachineLearningUtterances",
      "thresholds" : "popOverEvent_trainingmlThresholds",
      "nlsettings" : "popOverEvent_trainingnlAdvancedSettings",
      "defaultdialog" : "popOverEvent_intelligencedefaultDialog",
      "events" : "popOverEvent_intelligenceeventsManage",
      "manageinterruptions" : "popOverEvent_intelligenceadvancedSettings",
      "amendentity" : "popOverEvent_intelligenceamendEntity",
      "multiintentdetection" : "popOverEvent_intelligencemultiIntentDetection",
      "sentimentmanagement" : "popOverEvent_intelligencesentimentManagement",
      "standardresponses" : "popOverEvent_intelligencestandardResponses",
      "ignorewords" : "popOverEvent_intelligenceignoreWords",
      "utterancetesting" : "popOverEvent_botTestingtestTrain",
      "batchtesting" : "popOverEvent_botTestingbatchTesting",
      "conversationtesting" : "popOverEvent_botTestingconversationTesting",
      "generalsettings" : "popOverEvent_configurationsgeneralSettings",
      "languages" : "popOverEvent_configurationslanguageManagement",
      "piisettings" : "popOverEvent_configurationsIIPMasking",
      "botfunctions" : "popOverEvent_configurationsbotFunctions",
      "authprofiles" : "popOverEvent_configurationsauthorization",
      "managesessions" : "popOverEvent_configurationsmanageSessions",
      "envvariables" : "popOverEvent_configurationsvariableManagement",
      "contentvariables" : "popOverEvent_configurationsvariableManagementContent",
      "agenttransfer" : "popOverEvent_apiExtensionsagentTransfer",
      "botkit" : "popOverEvent_apiExtensionsbotkitSDK",
      "webmobilesdk" : "popOverEvent_apiExtensionswebMobileSDK",
      "manageapps" : "popOverEvent_apiExtensionsapps",
      "apiscopes" : "popOverEvent_apiExtensionsmanageApps",
      "botversions" : "popOverEvent_botManagementbotVersion",
      "importexport" : "popOverEvent_botManagementbotImportExport",
      "deletebot" : "popOverEvent_botManagementdeleteBot"
    }
  }
  navigateToSubMenu(navType) {
    this.hideClicks = true;
    console.log('test: ',navType);
    var subMenuItems = Object.keys(this.menuToElementMap);
    if (subMenuItems.indexOf(navType) !== -1) {
      this.findAndNavigateToMenu(this.menuToElementMap[navType]).then(element => {
        if (element !== null) {
          if (navType === 'publish' || navType === 'changelogs') {
            if(navType === 'publish') {
              this.published = true;
            }
            var ele = <HTMLElement> element;
            this.simulateClick(ele.children[0].children[1])
          } else {
            this.simulateClick(element);
            this.hideClicks = false;
          }
          this.hideTopNavBar();
          this.hideLeftNavBar();
          this.adjustRightSection();
          this.loading = false;
          this.hideClicks = false;
        }
      })
    }
  }
  publishInterval = null;
  published = false;
  onPublish () {
    var doc = null;
    // bot is publish required changes
    // var closeAction = doc.getElementsByClassName("closeCancel");
    // if(closeAction && closeAction > 0) {
    //   this.hideLeftNavBar();

    // }
    // 
    this.publishInterval = setInterval(()=> {
      if (this.iframe) {
        doc = this.iframe.nativeElement.contentDocument;
        var element = doc.getElementsByClassName('leftNav');
        this.hideLeftNavBar();
        this.adjustRightSection();
        if (element && element.length > 0) {
          var elementInOpenedState = false;
          for (var i = 0; i < element.length; i++) {
            if (element[i].style.display === 'block') {
              elementInOpenedState = true;
              if (!this.published) {
                var closeAction = doc.getElementsByClassName("closeCancel");
                this.hideLeftNavBar();
                if (closeAction && closeAction.length > 0) {
                  closeAction[0].addEventListener("click", this.hideLeftNavBar.bind(this));
                }
              }
            }
          }
          if (!elementInOpenedState) {
            this.unHideAppMenu();
          }
        }
      }
    }, 500);
    // 
  }

  navigateToBTUseCase() {
    if (this.iframe === null || this.iframe === undefined  || this.iframe.nativeElement === null) {
      return;
    }
    this.initMenuClassMap();
    // this.currentBot = this.workflowService.getCurrentBt();
    // this.currentBot = this.workflowService.getCurrentSelectedBotId;
    console.log(`${this.log_prefix}  currentBT`, this.currentBot);

    let doc = this.iframe.nativeElement.contentDocument;
    console.log(`${this.log_prefix}  doc`, doc, this.btNavigationType);
    this.checkAndClickBackArrow().then(element => {
      // check whether we have a button with ng-click="startCreate('bots')"
      if (!element) {
          this.checkAndClickStartCreate().then(foundStartCreateButton => {
              console.log(`${this.log_prefix} foundStartCreateButton`, foundStartCreateButton);
              if (foundStartCreateButton) {
                doc = this.iframe.nativeElement.contentDocument;
                var element = doc.querySelector(`[ng-click="startCreate('bots')"]`);
                console.log(`${this.log_prefix} foundStartCreateButton`, element);
                this.simulateClick(element);
              }
              // now check for the bot tile matching the current bot selected and click that bot
              this.checkAndClickSelectedBot().then(element => {
                if (element !== null) {
                  console.log(`${this.log_prefix} botTileText`, element);
                  var mainDivToBeClicked = (<HTMLElement> element).parentElement.parentElement.parentElement;
                  this.simulateClick(mainDivToBeClicked);
                }
              }).then(()=> {
                return this.checkBotFromDropDown()
              }).then(() => {
                var navType = this.btNavigationType;
                var subMenuItems = Object.keys(this.menuToElementMap);
                if (subMenuItems.indexOf(this.btNavigationType) !== -1 ) {
                  navType = "build";
                }
                // once bot tile is clicked, select the tab
                this.checkTabClick(navType).then(element => {
                  if (element !== null) {
                    this.simulateClick(element);
                  }
                  this.navigateToSubMenu(this.btNavigationType);
                }).then(() => {
                  this.hideTopNavBar();
                  this.hideLeftNavBar();
                  this.adjustRightSection();
                  doc = this.iframe.nativeElement.contentDocument;
                  var btn = doc.getElementById("botsListingDropDown");
                  if (btn) {
                    (<HTMLButtonElement> btn).disabled = true;
                  }
                  this.loading = false;
                })
              })
          })
      }
    });
  }
  goFullScreen() {
    // if the screen contains any of the below CSS classes then we need to goto full screen
    // expandedView
    // btFullpageModal
    // smallTalkFullContainer
    var interval = null;
    var noOfTries = this.NO_OF_RETRIES;
    var doc = null;
    doc = this.iframe.nativeElement.contentDocument;
    interval = setInterval(() => {
      var fullScreenClasses = doc.querySelectorAll(".expandedView,.btFullpageModal,.smallTalkFullContainer");
      console.log(`${this.log_prefix}  fullscreen`, fullScreenClasses);
      if (fullScreenClasses && fullScreenClasses.length > 0) {
        clearInterval(interval);
        return;
      }
      noOfTries--;
      if (noOfTries === 0) {
        clearInterval(interval);
        return;
      }
    }, this.RETRY_INTERVAL);
  }
  adjustLeftNavHeight() {
    setTimeout(() => {
      var doc = this.iframe.nativeElement.contentDocument;
      var elements = doc.getElementsByClassName("bt-leftNav");
      if (elements && elements.length > 0) {
        var leftNav = <HTMLElement> elements[0];
        leftNav.setAttribute('style', 'height:100% !important;max-height:100% !important');
        console.log(`${this.log_prefix}  setting leftNav height`, leftNav);
      }
    }, 2000);
  }
  adjustRightSection() {
    var doc = this.iframe.nativeElement.contentDocument;
    var elements = doc.getElementsByClassName("bt-rightNav");
    if (elements && elements.length > 0) {
      var leftNav = <HTMLElement> elements[0];
      leftNav.style.paddingLeft = '0px';
    }
  }
  hideLeftNavBar() {
    var doc = this.iframe.nativeElement.contentDocument;
    var elements = doc.getElementsByClassName("bt-leftNav");
    if (elements && elements.length > 0) {
      var leftNav = <HTMLElement> elements[0];
      leftNav.style.display = 'none';
      leftNav.style.left = '0px';
    }

    setTimeout(() => {
      this.published = false;
    }, 200);
  }
  hideTopNavBar() {
    var doc = this.iframe.nativeElement.contentDocument;
    
    var navBar = <HTMLElement> doc.querySelector(`[ng-show="showHeader"]`)
    if (navBar) {
      navBar.style.display = 'none';
      navBar.style.height = '0px';
      navBar.style.width = '0px';
    }
  }
  simulateClick(element) {
    var clickEvent = new MouseEvent("click", {
      "view": window,
      "bubbles": true,
      "cancelable": false
    });
    element.dispatchEvent(clickEvent);
  }

  getBotBuilderURL() {
    const url = "/botbuilder";
    let steamId;
    let dgId = '';
    let state = 'indevelopment';
    if(this.workflowService.editInPlatform && this.workflowService.directFlag) {
      steamId = this.workflowService.currentSelectedBotDetails._id;
    }
    if(this.workflowService.emailBool && (this.workflowService.selectedBotDailogId !== '') && (this.workflowService.emailBotEIBP !== '')) {
      dgId = this.workflowService.selectedBotDailogId;
      steamId = this.workflowService.emailBotEIBP._id;
      state = this.workflowService.dialogTaskState;
    }
    if(this.workflowService.directFlag && !this.workflowService.editInPlatform) {
      const instanceBot = this.appService.selectedInstanceApp$.value;
      steamId = instanceBot._id;
    } else if(!this.workflowService.directFlag && !this.workflowService.editInPlatform && !this.workflowService.emailBool) {
      steamId = this.workflowService.getCurrentSelectedBotId._id;
    }

    this.getTokenSub = this.service.invoke('get.token').subscribe(res => {
      if (res.token) {
        const qp = {
          // streamId: this.workflowService.getCurrentBt()._id,
          streamId: steamId,
          selectedAccount: (this.localStoreService.getSelectedAccount() && this.localStoreService.getSelectedAccount().accountId) || (this.authService.getSelectedAccount() && this.authService.getSelectedAccount().accountId),
          usecaseType: 'conversation',
          dgId: dgId,
          state: state,
          appLanguage: this.localStoreService.appLanguage,
          selectedBotLanguage:  this.workflowService.currentSelectedBotDetails?.defaultLanguage,
          iframeBodyClass: 'loadInSmartassist'
        }
        console.log(qp);
        const encodedQueryParams = btoa(JSON.stringify(qp));
        const finalUrl = `${url}/?qp=${encodedQueryParams}#id_token=${res.token}`;
        const builderUrl = this.workflowService.resolveHostUrl() + finalUrl; //this.domSanitizer.bypassSecurityTrustResourceUrl(finalUrl);
        this.builderSafeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(finalUrl);
        console.log(this.builderSafeUrl);
        this.gotBotBuilderUrl = true;
        this.workflowService.btNavigation$.next({"builderUrl" : this.builderSafeUrl});  
      }
      this.workflowService.setemailDetails();
      this.workflowService.editInPlatform = false;
    });
  }
}
