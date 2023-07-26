import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { workflowService } from '@kore.services/workflow.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';

@Component({
  selector: 'app-checklist-create',
  templateUrl: './checklist-create.component.html',
  styleUrls: ['./checklist-create.component.scss']
})
export class ChecklistCreateComponent implements OnInit {

  @Output() closeCheckList = new EventEmitter();
  @ViewChild('checklistCreateSlider', { static: true }) checklistCreateSlider: SliderComponentComponent;
  
  checkListForm : FormGroup;
  stageForm : FormGroup;
  selAcc = this.local.getSelectedAccount();
  


  constructor( private fb: FormBuilder,
    private auth: AuthService, 
    private local: LocalStoreService,
    private workflowService: workflowService ) { }

  ngOnInit(): void {
  }

  createCheckListForm(){
    this.checkListForm = new FormGroup(
      { 
        "botId": new FormControl(this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id, [Validators.required]),
        "name": new FormControl('',[Validators.required]),
        "description": new FormControl(''),
        "type" : new FormControl('', [Validators.required]),
        "status" : new FormControl('',[Validators.required]),
        "triggerSetting" : new FormGroup({
          'allinteractions' : new FormControl(false),
          'selectedAgent' : this.fb.array([]),
          'selectedQueues' : this.fb.array([]),
          'selectedSkills' : this.fb.array([]),
        }),
        "stages": this.fb.array([], [Validators.required])
      }
    );
  }

  createGroupForm(){
    this.stageForm = new FormGroup({
      "botId": new FormControl(this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id, [Validators.required]),
      "name": new FormControl('',[Validators.required]),
      "color" : new FormControl(''),
      "triggerBy" : new FormControl('')
    })
  }

  closeCheckListScreen(){
    this.closeCheckList.emit(true);
  }

  openSettings(){
    this.checklistCreateSlider.openSlider("#checklistCreate", "width940");
  }

  closeSettings(){
    this.checklistCreateSlider.closeSlider('#checklistCreate');
  }

}
