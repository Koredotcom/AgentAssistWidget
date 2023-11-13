import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { ProjConstants, RenderResponseType } from 'src/app/proj.const';
import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() automationData : any;
  @Input() agentassistArrayIndex : number;
  @Input() agentassistResponseArrayLength : number;

  renderResponseType : any = RenderResponseType;

  constructor(private rootService : RootService, private randomUUIDPipe : RandomUuidPipe){

  }


  ngOnChanges(changes: any) {
    console.log(this.automationData, "automation data");
    
    if (this.automationData && changes?.automationData?.currentValue && changes.automationData.currentValue?.automationsArray) {
      this.automationData = changes.automationData.currentValue;
      this.formatAssistAutomation(changes.automationData.currentValue.automationsArray);
    }
  }

  formatAssistAutomation(automationsArray) {
    let i = 0;
    for (let automation of automationsArray) {
      let templateRender = (!automation?.result?.parsedPayload || automation?.noTemplateRender || (automation?.componentType == 'dialogAct' && (automation?.srcChannel != 'msteams' && automation?.srcChannel != 'rtm'))) ? false : true
      automation.templateRender = templateRender;

      // if(automation?.result?.parsedPayload && automation?.templateRender)
      if (automation?.templateRender) {
        automation.template = this.rootService.getTemplateHtml(automation.templateRender, automation.result);
      }
      // automation.agentInputId = this.randomUUIDPipe.transform();
      // automation.agentInputEntityName = 'Enter Details';
      automation.showOverrideDiv = automation.hideOverrideDiv ? false : ((automation.data.isPrompt && automation.proactiveModeStatus ? true : false));

      this.updateSendCopyParams(automation);
      if (automation.data.newEntityDisplayName || automation.data.newEntityName) {
        automation.agentInputEntityName = automation.data.newEntityDisplayName ? automation.data.newEntityDisplayName : automation.data.newEntityName;
      } else if (automation.data.entityDisplayName || automation.data.entityName) {
        automation.agentInputEntityName = automation.data.entityDisplayName ? automation.data.entityDisplayName : automation.data.entityName;
      }
      i++;

    }
    console.log(automationsArray, 'automations array');
    
  }

  updateSendCopyParams(automation) {
    automation.showSend = (this.rootService.connectionDetails.isCallConversation || ((!automation.connectionDetails.source || automation.connectionDetails.source !== ProjConstants.SMARTASSIST_SOURCE) && automation.template)) ? false : true;
    automation.showCopy = (this.rootService.connectionDetails.isCallConversation) ? false : ((!automation.template && automation.data?.componentType != 'dialogAct') ? true : false);
    let sendData = null;
    if ((automation.data?.buttons && automation.data?.buttons[0]?.value)) {
      sendData = automation.data?.buttons[0].value
    } else if ((automation.data?.components && automation.data?.components[0] && automation.data?.components[0]?.data?.text)) {
      sendData = automation.data?.components[0].data.text;
    }
    automation.sendData = automation.result?.parsedPayload ? automation.temp : sendData;
  }

}
