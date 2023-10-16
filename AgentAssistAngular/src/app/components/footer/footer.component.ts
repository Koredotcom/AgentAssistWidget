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
  openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'bottom' });
	}
}
