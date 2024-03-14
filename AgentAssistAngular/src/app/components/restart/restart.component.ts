import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-restart',
  templateUrl: './restart.component.html',
  styleUrls: ['./restart.component.scss']
})
export class RestartComponent {

  projConstants : any = ProjConstants;
  restartCheck : string = ProjConstants.STARTOVER;

  entityList : any = [];
  automationData : any;

  @Input() assistResponseArray : any;
  @Output() handlePopupEvent = new EventEmitter();

  constructor(private rootService : RootService){
    
  }

  ngOnChanges(){    
    if(this.assistResponseArray.length){
      this.entityList  = [];
      this.automationData = this.assistResponseArray[this.assistResponseArray.length-1];
      // this.automationData.restartAutomationArray = JSON.parse(JSON.stringify(this.automationData?.automationsArray));
      for(let automation of this.automationData?.restartAutomationArray){
         automation.entityName = automation?.data?.entityDisplayName ? automation?.data?.entityDisplayName : automation.data.entityName;
        if(automation.entityName && automation?.data?.isPrompt){
          automation.entityValue = automation.entityValue ? automation.entityValue : automation.entityValue;
          // automation.disableInput = automation.entityValue ? true : false;
          this.entityList.push(automation);
        }
      }
    }
  }

  restart(){
    let entityArray = [];
    if(this.restartCheck == this.projConstants.RESTART_INPUTS){
      this.entityList.forEach(element => {
        if(element.entityName && element.entityValue){
          entityArray.push({name : element.entityName, value : element.entityValue});
        }
      });
    }
    this.handlePopupEvent.emit({ status: true,  type: this.projConstants.RESTART, inputType : this.restartCheck, entityList : entityArray });
  }

  changeRestartType(type){
    this.restartCheck = type;
  }

  cancel(){
    this.handlePopupEvent.emit({ status: false,  type: this.projConstants.RESTART });
  }

  removeEntityvalue(automation){
    automation.entityValue = '';
  }

  focusOutClick(automation, flag){
    automation.toggleOverride = flag;
  }
}
