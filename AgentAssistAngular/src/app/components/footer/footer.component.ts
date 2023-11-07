import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjConstants, storageConst } from 'src/app/proj.const';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RootService } from 'src/app/services/root.service';
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



  constructor(private offcanvasService: NgbOffcanvas, private localStorageService : LocalStorageService,
    private rootService: RootService, 
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.rootService.socketConnection$.subscribe(res => {
      if(res){
        this.connectionDetails  = this.rootService.getConnectionDetails();
      }
    });

    this.rootService.activeTab$.subscribe(tab => {
      if(tab){
        this.actionOnButton(tab);
      }
    })

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
    this.renderer.removeClass(this.document.body, className);
  }
  openCanvas(canvas) {
		this.canvas = this.offcanvasService.open(canvas, { position: 'bottom', keyboard:false, backdropClass: 'custom-backdrop-off-canvas', panelClass: 'offCanvasWrapperContaier', backdrop:'static' });
	}

  minMaxButtonClick(event){
    console.log("parent class ****");
    let className = 'if-maximized-canvas';
    if(this.document.body.classList.contains(className)){
      this.renderer.removeClass(this.document.body, className);
    }else{
      this.renderer.addClass(this.document.body, className);
    }
   
    
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
