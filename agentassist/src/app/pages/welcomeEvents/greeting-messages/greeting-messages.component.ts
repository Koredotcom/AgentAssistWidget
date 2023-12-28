import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-greeting-messages',
  templateUrl: './greeting-messages.component.html',
  styleUrls: ['./greeting-messages.component.scss']
})
export class GreetingMessagesComponent implements OnInit {


  @ViewChild('newWelcomeEvent', { static: true }) newWelcomeEventSlider: SliderComponentComponent;

  @Input() welcomeTaskData : any;
  @Input() welcomeTaskPreviousData : any;

  greetingForm : FormGroup;
  greetingActiveTab : string = 'chat';

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges){
    console.log(changes, "changes******");
    if(changes?.welcomeTaskData?.currentValue && changes?.welcomeTaskPreviousData?.currentValue){
     
    }
  }

  changeGreetingActiveTab(tab){
    this.greetingActiveTab = tab;
  } 

  // slider events

  deleteWelcomeEvent(contentDeleteWelcomeEvents) {
    this.modalService.open(contentDeleteWelcomeEvents,{ centered: true, windowClass: 'delete-welcome-events-dialog', backdrop: 'static', keyboard: false });
  }
  
  openWelcomeEvent(){
    this.newWelcomeEventSlider.openSlider("#newWelcome", "width550");
  }

  closeWelcomeEvent() {
    this.newWelcomeEventSlider.closeSlider('#newWelcome');
  }

  openModal(contentDeleteWelcomeEvents){
    this.modalService.open(contentDeleteWelcomeEvents, {backdropClass: 'adjust-zindex-above-slider', modalDialogClass:'confirm-copy', centered: true, backdrop: 'static', keyboard: false});

  }

}
