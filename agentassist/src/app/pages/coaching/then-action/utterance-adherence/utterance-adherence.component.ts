import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { OpenAIService } from '../../open-ai.service';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { COACHINGCNST } from '../../coaching.cnst';
import { CoachingService } from '../../coaching.service';
@Component({
  selector: 'app-utterance-adherence',
  templateUrl: './utterance-adherence.component.html',
  styleUrls: ['./utterance-adherence.component.scss']
})
export class UtteranceAdherenceComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() createOrEdit = '';
  @Output() onClose = new EventEmitter();
  @Output() saveUtterance = new EventEmitter();

  color: ThemePalette = 'primary';
  // createOrEdit = false; //true on edit, false on create;
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  loaded = false;
  isGeneratingText: boolean = null;
  openAiUtteranceArray: any = [];
  searchKey = new FormControl();
  sampleUtterPrice: any = ['price high', 'price too high', 'price is much', 'price expensive'];
  sampleUtterNoResp: any = ['hey', 'hello there!', 'helloo', 'can you here me!'];
  utteranceText: string;
  selectedUtterancesArray: any = [];
  addButtonClick: boolean = false;
  utterances = {};
  addedUtterances = [];
  deletedUtter = [];
  selectedNewUtterances = [];
  public utteranceDropdown: NgbDropdown;

  constructor(private openAIService: OpenAIService,
    private cdRef: ChangeDetectorRef,
    private service: ServiceInvokerService,
    private cService: CoachingService
  ) { }

  ngOnInit(): void {
    let form = this.form.value;
    if (this.createOrEdit === COACHINGCNST.EDIT) {
      this.getAddedUtterances();
    }else{
      this.selectedNewUtterances.push(...form?.when.addUtterances);
      this.selectedNewUtterances.forEach((item)=>{
        this.utterances[item.utterance] = true;
      })
    }
    this.searchKey.valueChanges
      .pipe(
        tap(() => { 
          this.openAiUtteranceArray = [];
        },
        debounceTime(300)
        )
      )
      .subscribe((val) => {
        this.loaded = false;
        this.formatUtterArray(val.includes('price') ? this.sampleUtterPrice : this.sampleUtterNoResp);
      });
  }

  getAddedUtterances() {
    let form = this.form?.value;
    this.service.invoke("get.agentcoachingutteranceByRef",
      {
        refId: this.form.value._id,
      }).subscribe((data) => {
        let deletedItem = form?.when?.deleteUtterances;
        if (deletedItem?.length > 0) {
          this.selectedUtterancesArray = (data || []).filter((item) => {
            return !deletedItem.includes(item._id)
          });
        } else {
          this.selectedUtterancesArray = [...data];
        };
        this.selectedNewUtterances.push(...form?.when.addUtterances);
        this.selectedNewUtterances.forEach((item)=>{
          this.utterances[item.utterance] = true;
        });
      })
  }

  formatUtterArray(openAiUtteranceArray) {
    setTimeout(() => {
      this.openAiUtteranceArray = [];
      for (let utter of openAiUtteranceArray) {
        const u = this.getAddedUtteranceKeys()
        if(!u[utter]){
          let obj: any = {
            enabled: false,
            value: utter,
            _id: null
          }
          this.openAiUtteranceArray.push(obj);
        }
        this.loaded = true;
      }
    }, 500);
  }


  getAddedUtteranceKeys(): {}{
    return [...this.selectedUtterancesArray, ...this.selectedNewUtterances].reduce((acc, item)=>{
      acc[item.utterance] = true;
      return acc;
    }, {})
  }

  saveUtteranceStrings() {
    (this.form.controls.when as FormGroup).controls?.deleteUtterances?.setValue([...this.cService.deletedUIds, ...this.form.value.when.deleteUtterances]);
    (this.form.controls.when as FormGroup).controls?.addUtterances?.setValue(this.selectedNewUtterances);
    const le = this.selectedNewUtterances?.length + this.selectedUtterancesArray?.length;
    (this.form.controls.when as FormGroup).controls?.utteranceCount?.setValue(le > 0 ? le : '');
    this.closeAdherence(COACHINGCNST.UTTERANCE);
    this.cService.deletedUIds = [];
  }

  getSelectedUtterance() {
    return this.openAiUtteranceArray.map((item) => item.value)
  }

  saveUtterances() {
    this.selectedNewUtterances = Object.keys(this.utterances).map((item) => {
      return { utterance: item, language: 'english' };
    });
  }

  changeUtterActiveStatus(utter) {
    utter.enabled = !utter.enabled;
    if (utter.enabled) {
      this.utterances[utter.value] = true;
    } else {
      delete this.utterances[utter.value];
    }
  }

  clearAIsuggestions(ref) {
    this.clearSeachVal();
    ref.close();
  }

  clearSeachVal() {
    this.searchKey.patchValue('', { emitEvent: false });
  }

  closeAdherence(e?) {
    this.onClose.emit(e);
    this.cService.deletedUIds = [];
  }

  deleteUtternce(utter, i) {
    if (utter._id) {
      this.cService.deletedUIds.push(utter._id);
    }
    this.selectedUtterancesArray.splice(i, 1);
  }

  deleteUtternceNew(utter, i) {
    this.selectedNewUtterances.splice(i, 1);
    this.cdRef.detectChanges();
    delete this.utterances[utter];
  }

}
