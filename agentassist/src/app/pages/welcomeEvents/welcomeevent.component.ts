import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-welcomeevent',
  templateUrl: './welcomeevent.component.html',
  styleUrls: ['./welcomeevent.component.scss']
})
export class WelcomeeventComponent implements OnInit {
  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEvent: SliderComponentComponent;
  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  deleteWelcomeEvent(contentDeleteWelcomeEvents) {
		this.modalService.open(contentDeleteWelcomeEvents,{ centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
	}
  
  openWelcomeEvent(){
    this.newWelcomeEvent.openSlider("#newWelcome", "width600");
  }
  closeWelcomeEvent() {
    this.newWelcomeEvent.closeSlider('#newWelcome');
  }
}
