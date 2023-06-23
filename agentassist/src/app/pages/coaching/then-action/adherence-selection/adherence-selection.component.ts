import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  
  
  private adherenceSlider: SliderComponentComponent;
  @ViewChild('adherenceSlider') set content(content: SliderComponentComponent) {
    if(content) { // initially setter gets called with undefined
         this.adherenceSlider = content;
    }
 }

  constructor(private cdRef : ChangeDetectorRef,
    private coachingService : CoachingService,
    private fb : FormBuilder) { }

  ngOnChanges(changes : any){
    if(changes?.createOrEdit?.currentValue === COACHINGCNST.EDIT){
      const formVal = this.adherenceForm.value;
      //adherence edit
      this.selectedAdherenceType = formVal.adherence.adType;
      this.selectedSession = formVal.adherence.session ? formVal.adherence.session : COACHINGCNST.SELECTED_ACTION_ANYTIME;
      this.selectedMinutes = formVal.adherence.nMins ? formVal.adherence.nMins : COACHINGCNST.SELECTED_ACTION_MINS;
      this.selectedMessages = formVal.adherence.nMessages ? formVal.adherence.nMessages : COACHINGCNST.SELECTED_ACTION_MESSAGES;      
    }else if(changes?.createOrEdit?.currentValue === COACHINGCNST.CREATE){
      const formVal = this.adherenceForm.value;
      //adherence create
      this.selectedSession = COACHINGCNST.SELECTED_ACTION_ANYTIME;
      this.selectedMinutes = COACHINGCNST.SELECTED_ACTION_MINS;
      this.selectedMessages = COACHINGCNST.SELECTED_ACTION_MESSAGES;
    }
    if(this.adherenceSelection){
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
    this.adherenceForm.addControl('adherence',this.fb.group(this.coachingService.getAdherenceForm()))
    this.deleteAdherence.emit(true);
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
        (<FormGroup>this.adherenceForm.controls.adherence).addControl('utteranceCount', new FormControl(''));
  
      };
    }
    this.resetFormValidatorsBasedOnAdherenceSeletion(type);
  }

  resetFormValidatorsBasedOnAdherenceSeletion(type){
    if(type){
      let actualParams = COACHINGCNST.ADHERENCE_SELECTION_LIST[type];
      for(let key in (this.adherenceForm.controls?.adherence as FormGroup)?.controls){
        if(actualParams.includes(key)){
          (this.adherenceForm.controls?.adherence as FormGroup)?.controls[key].setValidators(Validators.required);
        }else{
          (this.adherenceForm.controls?.adherence as FormGroup)?.controls[key].clearValidators();
        }
        (this.adherenceForm.controls?.adherence as FormGroup)?.controls[key].updateValueAndValidity();
      }
      (this.adherenceForm.controls?.adherence as FormGroup)?.controls?.adType.setValue(type);
    }    
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


}