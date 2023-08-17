import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { COACHINGCNST } from '../../coaching.cnst';
import { CoachingService } from '../../coaching.service';

@Component({
  selector: 'app-adherence-selection',
  templateUrl: './adherence-selection.component.html',
  styleUrls: ['./adherence-selection.component.scss']
})
export class AdherenceSelectionComponent implements OnInit {

  @Input() adherenceForm: FormGroup;
  @Input() createOrEdit: string = '';
  @Input() adherenceSelection : string;
  @Input() adhereClick : boolean;
  @Output() deleteAdherence = new EventEmitter();

  openSetUtterance : boolean = false;
  coachingConst : any = COACHINGCNST;
  sessionList : any = COACHINGCNST.SESSION_LIST;
  selectedAdherenceType : string;
  selectedSession : string;
  selectedMinutes : number;
  selectedMessages : number;
  variableMessage : number;
  VariableMinute : number;
  openAdherenceSlider : boolean = false;
  ackButtonText : string = COACHINGCNST.GOT_IT;
  selectedAckButtonText : string = COACHINGCNST.GOT_IT;
  
  
  private adherenceSlider: SliderComponentComponent;
  @ViewChild('adherenceSlider') set content(content: SliderComponentComponent) {
    if(content) { // initially setter gets called with undefined
         this.adherenceSlider = content;
    }
 }

  constructor(private cdRef : ChangeDetectorRef,
    private coachingService : CoachingService,
    private fb : FormBuilder,
    private service : ServiceInvokerService) { }

  ngOnChanges(changes : any){
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.adherenceForm.value;
      //adherence edit
      this.selectedAdherenceType = formVal.adherence.adType;
      this.selectedSession = formVal.adherence.session ? formVal.adherence.session : COACHINGCNST.SELECTED_ACTION_ANYTIME;
      this.selectedMinutes = formVal.adherence.nMins ? formVal.adherence.nMins : COACHINGCNST.SELECTED_ACTION_MINS;
      this.selectedMessages = formVal.adherence.nMessages ? formVal.adherence.nMessages : COACHINGCNST.SELECTED_ACTION_MESSAGES;    
      this.selectedAckButtonText = formVal.adherence.ackText ? formVal.adherence.ackText : COACHINGCNST.GOT_IT;   
    }else if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      const formVal = this.adherenceForm.value;
      //adherence create
      this.selectedSession = COACHINGCNST.SELECTED_ACTION_ANYTIME;
      this.selectedMinutes = COACHINGCNST.SELECTED_ACTION_MINS;
      this.selectedMessages = COACHINGCNST.SELECTED_ACTION_MESSAGES;
      this.selectedAckButtonText = COACHINGCNST.GOT_IT;
    }
    if(this.adhereClick && this.adherenceSelection){
      this.clickOnAdherenceSelection(this.adherenceSelection);
    }
  }


  ngOnInit(): void {
  }

  closeAdherence(group){
    this.openAdherenceSlider = false;
    this.adherenceSlider.closeSlider("#adherenceSlider");
    
  }

  openAdherence(){
    this.openAdherenceSlider = true;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.adherenceSlider.openSlider("#adherenceSlider", "width900");
    },);
  }


  deleteAdherenceClick(){
    // this.clickOnAdherenceSelection(null);
    this.adherenceForm.removeControl('adherence');
    this.adherenceForm.addControl('adherence',this.fb.group(this.coachingService.getAdherenceForm(this.selectedAdherenceType)));
    if(this.selectedAdherenceType == this.coachingConst.UTTERANCE){
      this.deleteUtterances();
    }else{
      this.deleteAdherence.emit(false);
    }
  }

  deleteUtterances(){
    let utterIds : any = [];
    this.service.invoke("get.agentcoachingutteranceByRef",
    {
      refId: this.adherenceForm.value._id,
    }).subscribe((data) => {
      
      if(data?.length > 0){
        data.forEach(element => {
          utterIds.push(element._id);
        });        
        if(utterIds.length > 0){
          (this.adherenceForm.controls.adherence as FormGroup).controls?.deleteUtterances?.setValue([...utterIds]);
         
        }
      }
      
      this.deleteAdherence.emit(utterIds.length);
    });
  }

  onEnterMinOrMessages(e){

    this.selectedMessages = COACHINGCNST.SELECTED_ACTION_MESSAGES;
    this.selectedMinutes = COACHINGCNST.SELECTED_ACTION_MINS;

    if(this.selectedSession == COACHINGCNST.ACTION_SESSION_NMINS){
      this.selectedMinutes = e ? e : 1;
      (this.adherenceForm.controls.adherence as FormGroup).controls?.nMins.setValue(this.selectedMinutes);
    }else if(this.selectedSession == COACHINGCNST.ACTION_SESSION_NMESSAGES){
      this.selectedMessages = e ? e : 1;
      (this.adherenceForm.controls.adherence as FormGroup).controls?.nMessages.setValue(this.selectedMessages);
    }
    
  }


  clickOnAdherenceSelection(type){
    this.selectedAdherenceType = type;
    if(type){
      for(let item in COACHINGCNST.ADHERENCE_REMOVE_LIST){
        let adherenceSelectionList = COACHINGCNST.ADHERENCE_REMOVE_LIST[item];
        if(item != type){
          for(let param of adherenceSelectionList){
            (<FormGroup>this.adherenceForm.controls.adherence).removeControl(param);
          }
        }
      }
      if(type == COACHINGCNST.UTTERANCE){

        (<FormGroup>this.adherenceForm.controls.adherence).addControl('session', new FormControl(this.selectedSession));
        (<FormGroup>this.adherenceForm.controls.adherence).addControl('utteranceCount', new FormControl('',[Validators.required]));
        // setTimeout(() => {
        //   (this.adherenceForm.controls?.adherence as FormGroup)?.controls['utteranceCount'].setValidators(Validators.required);
        //   (this.adherenceForm.controls?.adherence as FormGroup)?.controls['utteranceCount'].updateValueAndValidity();
        // }, 100);
      }else if(type == COACHINGCNST.ACKNOWLEDGE){
        (<FormGroup>this.adherenceForm.controls.adherence).addControl('ackText', new FormControl(this.selectedAckButtonText,[Validators.required]));
      }
    }
    (this.adherenceForm.controls?.adherence as FormGroup)?.controls?.adType.setValue(type);
  }

  clickOnSessionSelection(session){
    this.selectedSession = session;
    for(let item in COACHINGCNST.HINT_NUDGE_SESSION_VALIDATORS){
      let sessionSelectionList = COACHINGCNST.HINT_NUDGE_SESSION_VALIDATORS[item];
      if(item != session){
        for(let param of sessionSelectionList){
          (<FormGroup>this.adherenceForm.controls?.adherence).removeControl(param);
        }
      }
    }

    if(session === COACHINGCNST.ACTION_SESSION_ANYTIME){
      //  add controls for anytime
    }else if(session === COACHINGCNST.ACTION_SESSION_NMINS){
      (<FormGroup>this.adherenceForm.controls?.adherence).addControl(COACHINGCNST.ACTION_SESSION_NMINS, new FormControl(COACHINGCNST.SELECTED_ACTION_MINS));
    }else if(session == COACHINGCNST.ACTION_SESSION_NMESSAGES){
      (<FormGroup>this.adherenceForm.controls?.adherence).addControl(COACHINGCNST.ACTION_SESSION_NMESSAGES, new FormControl(COACHINGCNST.SELECTED_ACTION_MESSAGES));
    };
    this.resetFormValidatorsBasedOnSession(session);
  }


  resetFormValidatorsBasedOnSession(sessionType){
    if(sessionType){
      let actualParams = COACHINGCNST.HINT_NUDGE_SESSION_VALIDATORS[sessionType];
      for(let key in (this.adherenceForm.controls?.adherence as FormGroup)?.controls){
        if(actualParams?.includes(key)){
          (this.adherenceForm.controls?.adherence as FormGroup)?.controls[key].setValidators(Validators.required);
        }else{
          (this.adherenceForm.controls?.adherence as FormGroup)?.controls[key].clearValidators();
        }
        (this.adherenceForm.controls?.adherence as FormGroup)?.controls[key].updateValueAndValidity();
      }
      (this.adherenceForm.controls?.adherence as FormGroup)?.controls?.session.setValue(sessionType);
    }
  }

  submitAckButtonText(){
    if(!this.ackButtonText){
      this.ackButtonText = 'Ok';
    }
    this.selectedAckButtonText = this.ackButtonText;
    (this.adherenceForm.controls.adherence as FormGroup).controls?.ackText?.setValue(this.ackButtonText);
  }


}
