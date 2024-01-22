import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjConstants, storageConst } from 'src/app/proj.const';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy{

  @ViewChild('content', {static: false}) private content: ElementRef<HTMLDivElement>


  selectedTab = ProjConstants.ASSIST;
  canvas:any;
  projConstants : any = ProjConstants;
  connectionDetails : any;
  subs = new SubSink();
  maxButton = true;
  sourceDesktop : string = this.rootService.connectionDetails.source;
  hideUserBotHistory : boolean = true;



  constructor(private offcanvasService: NgbOffcanvas, private localStorageService : LocalStorageService,
    private rootService: RootService, 
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cdRef : ChangeDetectorRef,
    private serviceInvoker : ServiceInvokerService){

  }

  ngOnInit(): void {
    this.getUserBotHistory(this.rootService.connectionDetails);
    // this.subscribeEvents();
  }

  @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
    if(targetElement?.className?.includes('custom-backdrop-off-canvas')){
      this.canvas = null;
      this.selectedTab = this.projConstants.ASSIST;
      this.changeTab(this.selectedTab);
    }
  }


  ngAfterViewInit(){
    this.subscribeEvents();
    this.minMaxButtonClick(true);
    this.cdRef.detectChanges();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();        
        this.updateActiveTab();
      }
    });

    this.subs.sink = this.rootService.activeTab$.subscribe(tab => {
      if(tab){
        this.selectedTab = tab;
        this.actionOnButton(tab);
        this.updateLocalStorageForTabSwitch(tab);
      }
    });
  }

  getUserBotHistory(params){
    let userBotConversationDetails = this.rootService.getUserBotConvosDataDetails() || {};
    let botId = userBotConversationDetails?.botId || params?.botId;
    let userId = userBotConversationDetails?.userId;
    let sessionId = userBotConversationDetails?.sessionId; 
    console.log(userBotConversationDetails, "user bot conversation details***");
    if((userBotConversationDetails?.botId || this.rootService.connectionDetails?.botId) && userBotConversationDetails?.userId && userBotConversationDetails?.sessionId) {
      this.serviceInvoker.invoke('get.userBotHistory', { botId: botId, convId: params.conversationId, userId, sessionId }, {}, { userBotHistory: 'true', botId : botId }, params.agentassisturl).subscribe((data)=> {
        if(data && data.messages?.length > 0){
          this.hideUserBotHistory = false;
        }else{
          this.hideUserBotHistory = true;
        }
        this.rootService.setUserBotHistory(data);
      },(error)=> {
        this.hideUserBotHistory = true;
        this.rootService.setUserBotHistory(null);
      });
    }
  }
  
  updateLocalStorageForTabSwitch(tab){
    let storageObject: any = {};
    storageObject = {
      [storageConst.ACTIVE_TAB]: tab
    }
    this.localStorageService.setLocalStorageItem(storageObject);
  }
 
  actionOnButton(selectedTab: string){
    let canvas = this.content;
    this.selectedTab = selectedTab;
    let offclickCanvasClass = 'if-assist-click-offcanvas'
    if(selectedTab === ProjConstants.ASSIST){
      document.body.classList.add(offclickCanvasClass);
      return;
    }else{
      document.body.classList.remove(offclickCanvasClass);
    }
    if(!this.canvas){
      this.openCanvas(canvas);
    }

    let className = 'if-maximized-canvas';
    if(this.selectedTab == ProjConstants.SETTINGS || this.rootService.notLookingForClick){
      if(this.document.body.classList.contains(className)){
        this.renderer.removeClass(this.document.body, className);
      }
      this.rootService.notLookingForClick = false;
      this.maxButton = false;
    }else{
      this.renderer.addClass(this.document.body, className);
      this.maxButton = true;
    }
    // let className = 'if-maximized-canvas';
    // this.renderer.removeClass(this.document.body, className);
  }

  updateActiveTab(){
    let appState : any = this.localStorageService.getLocalStorageState();
    let convState = appState[this.connectionDetails.conversationId];
    let activeTab = convState[storageConst.ACTIVE_TAB];
    this.changeTab(activeTab);
  }

  changeTab(selectedTab){
    this.rootService.setActiveTab(selectedTab);
  }
  openCanvas(canvas) {
		this.canvas = this.offcanvasService.open(canvas, { position: 'bottom', keyboard:false, backdropClass: 'custom-backdrop-off-canvas', panelClass: 'offCanvasWrapperContaier' });
	}

  minMaxButtonClick(event){
    let className = 'if-maximized-canvas';
    if(this.document.body.classList.contains(className)){
      this.renderer.removeClass(this.document.body, className);
      this.maxButton = false;
    }else{
      this.renderer.addClass(this.document.body, className);
      this.maxButton = true;
    }
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
