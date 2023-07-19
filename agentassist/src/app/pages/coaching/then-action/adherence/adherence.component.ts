import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { OpenAIService } from '../../open-ai.service';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { COACHINGCNST } from '../../coaching.cnst';
import { CoachingService } from '../../coaching.service';
import { AuthService } from '@kore.services/auth.service';
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-adherence',
  templateUrl: './adherence.component.html',
  styleUrls: ['./adherence.component.scss']
})
export class AdherenceComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() createOrEdit = '';
  @Output() onClose = new EventEmitter();
  @Output() saveUtterance = new EventEmitter();
  // @ViewChild('searchRef') searchRef : ElementRef;

  color: ThemePalette = 'primary';
  // createOrEdit = false; //true on edit, false on create;
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  loaded = false;
  isGeneratingText: boolean = null;
  openAiUtteranceArray: any = [];
  searchKey = new FormControl();
  utteranceText: string;
  selectedUtterancesArray: any = [];
  addButtonClick: boolean = false;
  utterances = {};
  addedUtterances = [];
  deletedUtter = [];
  selectedNewUtterances = [];
  deletedUIds = {};
  selectAll = false;
  customUtt = false;
  public utteranceDropdown: NgbDropdown;

  constructor(
    // private openAIService: OpenAIService,
    private cdRef: ChangeDetectorRef,
    private service: ServiceInvokerService,
    private cs: CoachingService,
    private authService: AuthService,
    private workflowService: workflowService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    let form = this.form?.value;
    if (this.createOrEdit === COACHINGCNST.EDIT) {
      this.getAddedUtterances();
    }else{
      if(form?.adherence?.addUtterances?.length){
        this.selectedNewUtterances?.push(...form?.adherence.addUtterances);
      }
      this.selectedNewUtterances?.forEach((item)=>{
        this.utterances[item.utterance] = true;
      })
    }
    this.searchKey.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe((val) => {
        this.loaded = false;
        this.formatUtterArray(this.searchKey.value?.trim());
      });
  }

  getAddedUtterances() {
    let form = this.form?.value;
    this.service.invoke("get.agentcoachingutteranceByRef",
      {
        refId: this.form.value._id,
      }).subscribe((data) => {
        let deletedItem = form?.adherence?.deleteUtterances;
        if (deletedItem?.length > 0) {
          this.selectedUtterancesArray = (data || []).filter((item) => {
            return !deletedItem.includes(item._id)
          });
        } else {
          this.selectedUtterancesArray = [...data];
        };
        this.selectedNewUtterances.push(...form?.adherence.addUtterances);
        this.selectedNewUtterances.forEach((item)=>{
          this.utterances[item.utterance] = true;
        });
      })
  }

  formatUtterArray(text) {
    if(!this.cs.metaForUtternace?.integration){
      this.loaded = true;
      return;
    }
    let params: any = {
      userId: this.authService.getUserId(),
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    let body = {
      "intentName": text,
      "meta": {
          params: this.cs.metaForUtternace?.params,
          "integration": this.cs.metaForUtternace?.integration,
          "model": this.cs.metaForUtternace?.defaultModel
      }
  }
    this.service.invoke("get.utternaces", params, body).subscribe((data) => {
      this.loaded = true;
      this.openAiUtteranceArray = (data || []).map((item)=>{
        return {...item, enabled: false}
      });
    }, (err)=>{
      this.loaded = true;
      try{
        let type = JSON.parse(err.error?.errors[0]?.msg)?.type;
        if(type === 'insufficient_quota'){
          this.notificationService.showError({}, this.translate.instant("QUOTA_EXCEEDED"));
        }
      }catch(e){
        this.notificationService.showError(this.translate.instant("QUOTA_EXCEEDED"));
      }
    });
  }


  getAddedUtteranceKeys(): {}{
    return [...this.selectedUtterancesArray, ...this.selectedNewUtterances].reduce((acc, item)=>{
      acc[item.utterance] = true;
      return acc;
    }, {})
  }

  saveUtteranceStrings() {
    (this.form.controls.adherence as FormGroup).controls?.deleteUtterances?.setValue([...Object.keys(this.deletedUIds), ...this.form.value.adherence.deleteUtterances]);
    (this.form.controls.adherence as FormGroup).controls?.addUtterances?.setValue(this.selectedNewUtterances);
    const le = this.selectedNewUtterances?.length + this.selectedUtterancesArray?.length;
    (this.form.controls.adherence as FormGroup).controls?.utteranceCount?.setValue(le > 0 ? le : '');
    this.closeAdherence(COACHINGCNST.UTTERANCE);

  }

  getSelectedUtterance() {
    return this.openAiUtteranceArray.map((item) => item.value)
  }

  saveUtterances() {
    if(this.customUtt){
      this.utterances[this.searchKey?.value] = true;
    }
    this.selectedNewUtterances = Object.keys(this.utterances).map((item) => {
      return { utterance: item, language: 'english' };
    });
  }

  selectAllSearchUttereances(event) {
    if(event.target.checked) {
      this.customUtt = true;
      this.openAiUtteranceArray.forEach(utter => {
        utter.enabled = true;
        this.utterances[utter.sentence] = true;
        this.selectAll = true;
      })
    } else {
      this.customUtt = false;
      this.openAiUtteranceArray.forEach(utter => {
        utter.enabled = false
        this.selectAll = false;
        delete this.utterances[utter.sentence];
      })
    }
  }

  checkUtterActiveStatus() {
    // for(let utterences of this.openAiUtteranceArray) {
    //   if(!utterences.enabled) {
    //     return false;
    //   }
    // }
    // return true;
    return (this.openAiUtteranceArray.every((utterence)=>utterence.enabled) && this.customUtt);
  }

  customUttChange(checked){
    this.customUtt = checked;
    if(checked){
      if(this.checkUtterActiveStatus()) {
        this.selectAll = true;
      }
    }else{
      this.selectAll = false;
    }
  }

  changeUtterActiveStatus(utter) {
    utter.enabled = !utter.enabled;
    if (utter.enabled) {
      this.utterances[utter.sentence] = true;
      if(this.checkUtterActiveStatus()) {
        this.selectAll = true;
      }
    } else {
      if(this.selectAll) {
        this.selectAll = !this.selectAll;
      }
      delete this.utterances[utter.sentence];
    }
  }

  clearAIsuggestions(ref) {
    this.clearSeachVal();
    ref.close();
    this.customUtt = false;
    this.selectAll = false;
  }

  clearSeachVal() {
    this.searchKey.patchValue('', { emitEvent: false });
  }

  closeAdherence(e?) {
    this.onClose.emit(e);
  }

  deleteUtternce(utter, i) {
    if (utter._id) {
      this.deletedUIds[utter._id] = true;
    }
    this.selectedUtterancesArray.splice(i, 1);
  }

  deleteUtternceNew(utter, i) {
    this.selectedNewUtterances.splice(i, 1);
    this.cdRef.detectChanges();
    delete this.utterances[utter];
  }

  // get diabledCheckbox(): boolean{
  //     return [...this.selectedUtterancesArray, ...this.selectedNewUtterances].some((item)=>{
  //       return item.utterance == this.searchKey.value;
  //     })
  //   }
  // get getAddedCount(): number{
  //   return Object.keys(this.utterances)?.length || 0;
  // }
}
