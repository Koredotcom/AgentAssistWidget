import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { COACHINGCNST } from './coaching.cnst';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {

  modalRef:any;
  modalFlowCreateRef:any;
  bottomInt: any;
  topInt: any;
  dragStart : boolean = false;
  coachingConst : any = COACHINGCNST;
  coachGroupEvent : string;
  coachGroupData : any;

  @ViewChild('ps') ps: PerfectScrollbarComponent;
  @ViewChild('newCoachingGroup', { static: true }) newCoachingGroup: SliderComponentComponent;

  constructor(private modalService: NgbModal) { }

  respData: any = {
    hasMore: false,
    results: [
      {
      "isOpen": false,
      "_id":"1",
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },
  {
      "_id":"2",
      "isOpen": false,
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"3",
      "isOpen": false,
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"4",
      "isOpen": false,
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"5",
      "isOpen": false,
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  },{
      "_id":"6",
      "isOpen": false,
      "name": "pricing",
      "displayName": "pricing",
      "description": "pricing desc",
      "rules": [
          {
              "ruleId": "1",
              "isEnabled": true // true/false
          }, 
          {
              "ruleId": "2",
              "isEnabled": false //true/false
          }
      ],
      "createdBy": "kore",
      "createdOn": "2023-05-16 20:00:00",
      "lModOn": "2023-05-16 20:00:00",
      "lModBy": "kore",
  }],
    totalCount: 5,
  }

  ngOnInit(): void {
  }

  // Delete Popup
  openDeleteRule(ruleDelete) {
		this.modalRef = this.modalService.open(ruleDelete, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
	}

  closeDeleteRule(rule?) {
		this.modalRef.close();
	}

  // END

  // Open Flow
    openFLowCreation(flowCreation) {
      this.modalFlowCreateRef = this.modalService.open(flowCreation, { centered: true, keyboard: false, windowClass: 'flow-creation-full-modal', backdrop: 'static' });
    }

    closeFLowCreation(rule?) {
      this.modalFlowCreateRef.close();
    }
  // End

  openCoachingGroup(type, editData){
    this.coachGroupEvent = type;
    this.coachGroupData  = editData;
    this.newCoachingGroup.openSlider("#newCoachingGroup", "width550");
  }
  
  closeCoachingGroup(group){
    this.coachGroupData = null;
    this.newCoachingGroup.closeSlider("#newCoachingGroup");
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    };

  }

  bottomMouseOver(){
    if(this.dragStart){
      this.clearInterVal();
      this.bottomInt = setInterval(()=>{
        let scrollTo: any;
        const scrollY = this.ps.directiveRef.ps();
        scrollTo = (scrollY.lastScrollTop as any) + 100;
        this.ps.directiveRef.scrollToTop(scrollTo);
      },200);
    }    
  }
 
  topMouseOver(){
    if(this.dragStart){
      this.clearInterVal();
      this.topInt = setInterval(()=>{
        let scrollTo: any;
        const scrollY = this.ps.directiveRef.ps();
        scrollTo = (scrollY.lastScrollTop as any) - 100;
        this.ps.directiveRef.scrollToTop(scrollTo);
      },200);
    }
  }

  clearInterVal(){
    clearInterval(this.bottomInt);
    clearInterval(this.topInt)
  }

  collapseAcc(i){
    if(!this.respData.results[i].isOpen){
      this.respData.results[i].isOpen = true;
      let obj =         {
        "id": "1",
        "name": "utterance_rule",
        "description": "utterance_rule",
        "tags":[],
        "createdBy":"",
        "createdOn":"2023-05-16 20:00:00",
        "lModBy":"",
        "lModOn":"2023-05-16 20:00:00",
        "accountId":"",
        "botId":"",
        "isEnabled": false,
        "triggers": [
            {
                "type": "utterance", //utterance/speech_analysis/variable/dialog_task
                "by":"customer", //agent or customer
                "when":{
                    "utterancesId":[""]
                },
                "frequency":{
                    "nOccurences":1,
                    "every":"20s"
                },
                "operator":"and" //and or or
            },{
                "type": "speech_analysis", //utterance/speech_analysis/variable/dialog_task
                "subType":"crossTalk",
                "frequency":{
                    "nOccurences":1,
                    "timeTaken":"20s"
                },
                "operator":"or" //and or or
            },{
                "type": "speech_analysis", //utterance/speech_analysis/variable/dialog_task
                "subType":"deadair",
                "by":"customer", //customer or agent or both
                "frequency":{
                    "nOccurences":1,
                    "timeTaken":60 //time taken in seconds
                },
                "operator":"or" //and or or
            },
            {
                "type": "speech_analysis", //utterance/speech_analysis/variable/dialog_task
                "subType":"speech_speed",
                "by":"customer", //customer or agent or both
                "frequency":{
                    "nWords":200,
                    "timeTaken":60 //time taken in seconds
                },
                "operator":"or" //and or or
            },
            {
                "type": "variable", //utterance/speech_analysis/variable/dialog_task
                "variable":"",
                "conditons":{
                    "operator":"eq", //eq,lt,gt,lte,gte,neq,range,
                    "value":"",
                    "from":"",
                    "to":""
                },
                "operator":"or" //and or or
            },
            {
                "type": "dialog_task", //utterance/speech_analysis/variable/dialog_task
                "botId":"",
                "taskId":"",
                "executionPhase": "start/end" //start or end
    
            }  
        ],
        "actions":[
            {
                "type":"nudge", //hint,nudge,alert_manager,email_manager
                "expression": "postive", //+ve,warning,neutral,critical
                "message":{
                    "title":""
                },
                "adherence":{
                    "utteranceId":[""]
                } 
            },
            {
                "type":"hint", //hint,nudge,alert_manager,email_manager
                "expression": "postive", //+ve,warning,neutral,critical
                "message":{
                    "title":"",
                    "body":"",
                    "button":"",
                    "postAction":"auto_close" //auto_close, doesnot_auto_close
                },
                "adherence":{
                    "utteranceId":[""]
                } 
            },
            {
                "type":"alert_manager", //hint,nudge,alert_manager,email_manager
                "emails":[""],
                "message":{
                    "title":"",
                    "body":""
                } 
            },
            {
                "type":"email_manager", //hint,nudge,alert_manager,email_manager
                "emails":[""],
                "when":"immediately", //immediatley or eod How to calculate EOD
                "message":{
                    "title":"",
                    "body":""
                } 
            }
        ],
        "assignees":[
            {
                "groups":[],
                "agents":[]
            }
        ],
        "state":""
      }
      this.respData.results[i].rules.push(
        {...obj, grpId: this.respData.results[i]._id}, {...obj, grpId: this.respData.results[i]._id}, {...obj, grpId: this.respData.results[i]._id}
      );
    }
  }
}
