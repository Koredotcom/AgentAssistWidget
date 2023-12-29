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

  constructor(private welcomeEventService: WelcomeEventsService) { }

  ngOnInit(): void {
    // this.initPriorityForm();
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

  // priority Form

  updatePriorityForm(priorityData) {
    this.priorityForm = new FormGroup({
      'AA_ON_CONNECT_EVENT': new FormControl(priorityData?.AA_ON_CONNECT_EVENT || false, Validators.required),
      'AA_GREETING_MESSAGES': new FormControl(priorityData?.AA_ON_CONNECT_EVENT || false, Validators.required)
    });

    this.priorityForm.valueChanges.subscribe((data)=> {
      this.noFormchange = false;
    }); 
  }



  updatePriorityDisableStatus() {
    this.onConnectEnable = this.welcomeTaskPreviousData['AA_ON_CONNECT_EVENT']?.enabled || false;
    this.greetingEnable = this.welcomeTaskPreviousData['AA_GREETING_MESSAGES']?.enabled || false;
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

  priorityInputClick(event, name) {
    if (event.target.checked != this.priorityForm.value[name]) {
      this.priorityForm.controls[name].setValue(event.target.checked);
      if (name == 'AA_ON_CONNECT_EVENT' && this.greetingEnable) {
        this.priorityForm.controls.AA_GREETING_MESSAGES.setValue(!event.target.checked);
      } else if (name == 'AA_GREETING_MESSAGES' && this.onConnectEnable) {
        this.priorityForm.controls.AA_ON_CONNECT_EVENT.setValue(!event.target.checked);
      }
    }
  }

}
