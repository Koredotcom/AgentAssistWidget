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
  showTranscript : boolean = false;


  constructor(private offcanvasService: NgbOffcanvas, private localStorageService : LocalStorageService,
    private rootService: RootService, 
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cdRef : ChangeDetectorRef,
    private serviceInvoker : ServiceInvokerService){

  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
    if(targetElement?.className?.includes('custom-backdrop-off-canvas')){
      this.selectedTab = this.projConstants.ASSIST;
      this.changeTab(this.selectedTab);
      this.canvas = null;
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
        // this.updateActiveTab();
        if(this.connectionDetails?.isCallConversation){
          this.showTranscript = (this.rootService?.settingsData?.transcripts?.isEnabled === false) ? false : true;
        }
      }
    });

    this.subs.sink = this.rootService.activeTab$.subscribe(tab => {
      if(tab){
        let selectedTab = (!this.showTranscript && tab === this.projConstants.TRANSCRIPT) ? this.projConstants.ASSIST : tab;
        this.actionOnButton(selectedTab);
        this.updateLocalStorageForTabSwitch(selectedTab);
      }
    });

    this.subs.sink = this.rootService.userBotConversationDetailsSubject.subscribe((res)=> {
      if(!this.rootService.connectionDetails.isCallConversation && res && res?.userBotConversationDetails?.sessionId && res?.userBotConversationDetails.sessionId !== ''){
        this.hideUserBotHistory = false;
      }
    });
    this.updateActiveTab();
  }
  
  updateLocalStorageForTabSwitch(tab){
    let storageObject: any = {};
    storageObject = {
      [storageConst.ACTIVE_TAB]: tab
    }
    this.localStorageService.setLocalStorageItem(storageObject);
  }
 
  actionOnButton(selectedTab: string){
    if(this.selectedTab != selectedTab){
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
