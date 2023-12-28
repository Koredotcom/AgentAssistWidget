import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-priority-settings',
  templateUrl: './priority-settings.component.html',
  styleUrls: ['./priority-settings.component.scss']
})
export class PrioritySettingsComponent implements OnInit {

  @Input() welcomeTaskData : any;
  @Input() welcomeTaskPreviousData : any;

  priorityForm : FormGroup;

  onConnectEnable : boolean = false;
  greetingEnable : boolean = false;

  constructor() { }

    ngOnInit(): void {
      this.initPriorityForm();
    }

    ngOnChanges(changes : SimpleChanges){
      if(changes?.welcomeTaskData?.currentValue && changes?.welcomeTaskPreviousData?.currentValue){
        this.updatePriorityDisableStatus();
        this.updatePriorityForm(this.welcomeTaskData?.priority);
      }
    }

    // priority Form

    initPriorityForm(){
      this.priorityForm = new FormGroup({
        'AA_ON_CONNECT_EVENT': new FormControl(false, Validators.required),
        'AA_GREETING_MESSAGES': new FormControl(false, Validators.required)
      });
    }
  
    updatePriorityForm(priorityData){
      this.priorityForm.setValue({
        'AA_ON_CONNECT_EVENT': priorityData?.AA_ON_CONNECT_EVENT || false,
        'AA_GREETING_MESSAGES': priorityData?.AA_ON_CONNECT_EVENT || false
      });
    }
  
    
     
    updatePriorityDisableStatus(){      
      this.onConnectEnable = this.welcomeTaskPreviousData['AA_ON_CONNECT_EVENT']?.enabled || false;
      this.greetingEnable = this.welcomeTaskPreviousData['AA_GREETING_MESSAGES']?.enabled || false;
    }
  
    cancelPriority(){
      this.updatePriorityForm(this.welcomeTaskPreviousData?.priority);
    }
  
    savePriority(){
      console.log(this.priorityForm.value, "priority form value");
    }
  
    priorityInputClick(event, name){    
      if(event.target.checked != this.priorityForm.value[name]){
        this.priorityForm.controls[name].setValue(event.target.checked);
        if(name == 'AA_ON_CONNECT_EVENT' && this.greetingEnable){
          this.priorityForm.controls.AA_GREETING_MESSAGES.setValue(!event.target.checked);
        }else if(name == 'AA_GREETING_MESSAGES' && this.onConnectEnable){
          this.priorityForm.controls.AA_ON_CONNECT_EVENT.setValue(!event.target.checked);
        }
      }
    }

}
