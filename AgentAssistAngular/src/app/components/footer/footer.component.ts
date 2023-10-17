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
  selectedTab = '';
  canvas:any;
  actionOnButton(selectedTab: string, canvas: any){
    this.canvas?.close();
    this.selectedTab = selectedTab;
    if(selectedTab === 'assist'){
      return;
    }
    this.openCanvas(canvas);
  }
  openCanvas(canvas: TemplateRef<any>) {
		this.canvas = this.offcanvasService.open(canvas, { position: 'bottom', keyboard:false, backdropClass: 'custom-backdrop-off-canvas', panelClass: 'offCanvasWrapperContaier' });
	}
}
