import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { ChecklistService } from '../../checklist.service';

@Component({
  selector: 'app-trigger-by',
  templateUrl: './trigger-by.component.html',
  styleUrls: ['./trigger-by.component.scss']
})
export class TriggerByComponent implements OnInit {

  @Input() adherenceForm: FormGroup;
  searchKey = new FormControl('');
  loaded = false;
  utterances = {};
  openAiUtteranceArray = [];
  selectAll = false;
  customUtt = false;
  addButtonClick = false;
  selectedNewUtterances = [];
  selectedUtterancesArray = [];
  constructor(
    private workflowService: workflowService,
    private clS: ChecklistService,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.searchKey.valueChanges
      .pipe(
        debounceTime(300),
        tap(()=>{
          this.utterances = {};
        })
      )
      .subscribe((val) => {
        this.loaded = false;
        this.formatUtterArray(this.searchKey.value?.trim());
      });
  }

  formatUtterArray(text) {
    if(!this.clS.metaForUtternace?.enable){
      this.loaded = true;
      return;
    }
    let params: any = {
      streamId: this.workflowService.getCurrentBt(true)._id
    };
    let body = {
      "intentName": text,
      "meta": {
          params: this.clS.metaForUtternace?.params,
          "integration": this.clS.metaForUtternace?.integration,
          "model": this.clS.metaForUtternace?.defaultModel
      }
    }
    this.service.invoke("get.utternaces", params, body)
    .pipe(finalize(()=>{
      this.customUtt = false;
      this.selectAll = false;
    }))
    .subscribe((data) => {
      this.loaded = true;
      console.log("translatetranslate", data);
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

  get aForm(){
    return this.adherenceForm.controls['adherence'];
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

  clearAIsuggestions(ref) {
    this.clearSeachVal();
    ref.close();
    this.customUtt = false;
    this.selectAll = false;
  }

  clearSeachVal() {
    this.searchKey.patchValue('', { emitEvent: false });
  }

  saveUtterances() {
    if(this.customUtt){
      this.utterances[this.searchKey?.value] = true;
    }
    Object.keys(this.utterances).forEach((item) => {
      this.selectedNewUtterances.push({ utterance: item, language: 'english' });
    });
  }

  deleteUtternceNew(utter, i) {
    this.selectedNewUtterances.splice(i, 1);
    this.cdRef.detectChanges();
    delete this.utterances[utter];
  }

  deleteUtternce(utter, i) {
    // if (utter._id) {
    //   this.deletedUIds[utter._id] = true;
    // }
    // this.selectedUtterancesArray.splice(i, 1);
  }

}
