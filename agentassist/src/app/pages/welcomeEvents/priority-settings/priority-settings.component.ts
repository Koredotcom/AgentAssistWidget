import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { WelcomeEventsService } from '../welcome-events.service';

@Component({
  selector: 'app-priority-settings',
  templateUrl: './priority-settings.component.html',
  styleUrls: ['./priority-settings.component.scss']
})
export class PrioritySettingsComponent implements OnInit {

  @Output() savePrioritySettings = new EventEmitter();

  welcomeTaskData: any = {};
  welcomeTaskPreviousData: any = {};


  priorityForm: FormGroup;

  onConnectEnable: boolean = false;
  greetingEnable: boolean = false;

  subs = new SubSink();
  noFormchange : boolean = true;

  onConnectStr = 'AA_ON_CONNECT_EVENT';
  greetMsgStr = 'AA_GREETING_MESSAGES';

  constructor(private welcomeEventService: WelcomeEventsService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.subs.sink = this.welcomeEventService.welcomeEventData$.subscribe((data) => {
      if (data) {
        this.welcomeTaskData = data;
        this.welcomeTaskPreviousData = JSON.parse(JSON.stringify(this.welcomeEventService.formatWelcomeTaskData(this.welcomeTaskData)));
        this.updatePriorityForm(this.welcomeTaskData?.priority);
        this.updatePriorityDisableStatus();
      }else{
        this.noFormchange = false;
      }
    })
  }

  updatePriorityForm(priorityData) {
    this.priorityForm = new FormGroup({
      event : new FormControl(priorityData?.event || false, Validators.required)
    });

    this.priorityForm.valueChanges.subscribe((data)=> {
      this.noFormchange = false;
    }); 
  }

  updatePriorityDisableStatus() {
    this.onConnectEnable = this.welcomeTaskPreviousData[this.onConnectStr]?.enabled || false;
    this.greetingEnable = this.welcomeTaskPreviousData[this.greetMsgStr]?.enabled || false;
  }

  cancelPriority() {
    this.updatePriorityForm(this.welcomeTaskPreviousData?.priority);
    this.noFormchange = true;
  }

  savePriority() {
    let payLoad = {
      priority: [this.priorityForm.value]
    }
    this.noFormchange = true;

    console.log(this.priorityForm.value, "priority form value");
    // this.savePrioritySettings.emit(payLoad);
  }

}
