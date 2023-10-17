import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private offcanvasService: NgbOffcanvas){

  }
  selectedTab = 'assist';
  canvas:any;
  actionOnButton(selectedTab: string, canvas: any){
    this.selectedTab = selectedTab;
    if(selectedTab === 'assist'){
      document.body.classList.add("if-assist-click-offcanvas");
      return;
    }else{
      document.body.classList.remove("if-assist-click-offcanvas");
    }
    if(!this.canvas){
      this.openCanvas(canvas);
    }
  }
  openCanvas(canvas: TemplateRef<any>) {
		this.canvas = this.offcanvasService.open(canvas, { position: 'bottom', keyboard:false, backdropClass: 'custom-backdrop-off-canvas', panelClass: 'offCanvasWrapperContaier', backdrop:'static' });
	}
}
