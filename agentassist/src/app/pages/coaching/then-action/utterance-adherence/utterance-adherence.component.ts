import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { OpenAIService } from '../../open-ai.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { COACHINGCNST } from '../../coaching.cnst';
@Component({
  selector: 'app-utterance-adherence',
  templateUrl: './utterance-adherence.component.html',
  styleUrls: ['./utterance-adherence.component.scss']
})
export class UtteranceAdherenceComponent implements OnInit, OnChanges {

  @Input() form : FormGroup;
  @Output() onClose = new EventEmitter();
  color: ThemePalette = 'primary';
  createOrEdit = false; //true on edit, false on create;
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  loaded = false;
  // loading = false;
  isGeneratingText : boolean = null;
  openAiUtteranceArray : any = [];
  searchKey = new FormControl();
  sampleUtterPrice : any = ['price high', 'price too high', 'price is much', 'price expensive'];
  sampleUtterNoResp : any = ['hey', 'hello there!', 'helloo', 'can you here me!'];
  utteranceText : string;
  selectedUtterancesArray : any = [];
  addButtonClick : boolean = false;


  @ViewChild(NgbDropdown, { static: true })
  public utteranceDropdown: NgbDropdown;

  @Output() saveUtterance = new EventEmitter();

  // @ViewChild('utteranceDropdown') utteranceDropdown:NgbDropdown;
  addedUtterances = [];
  constructor(private openAIService : OpenAIService,
    private cdRef:ChangeDetectorRef,
    private service : ServiceInvokerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes.createOrEdit.currentValue === COACHINGCNST.CREATE){

    // }
    // if(changes.createOrEdit.currentValue === COACHINGCNST.EDIT){
    //   this.service.invoke("get.agentcoachingutteranceByRef",
    //   {
    //     refId: this.form.value._id,
    //   }).subscribe((data)=>{
    //     this.addedUtterances = [...data] || [];
    //     this.selectedUtterancesArray = [...data] || [];
    //     this.loaded = true;
    //   })
    // }
  }

  getAddedUtterances(){
    this.service.invoke("get.agentcoachingutteranceByRef",
      {
        refId: this.form.value._id,
      }).subscribe((data)=>{
        this.addedUtterances = [...data] || [];
        this.selectedUtterancesArray = [...data] || [];
        this.loaded = true;
      })
  }

  ngOnInit(): void {
    let form = this.form.value;
    if(form?.when?.utterancesId.length > 0){
      this.getAddedUtterances();
      this.createOrEdit = true;
    }else{
      this.createOrEdit = false;
    }
    this.searchKey.valueChanges
    .pipe(debounceTime(300))
    .subscribe((val)=>{
      this.loaded  =false;
      this.formatUtterArray(val.includes('price') ? this.sampleUtterPrice : this.sampleUtterNoResp);
    })
  }

  formatUtterArray(openAiUtteranceArray){
    this.openAiUtteranceArray = [];
    setTimeout(() => {      
      for(let utter of openAiUtteranceArray){
          let obj : any = {
            enabled : false,
            value : utter
          }
        this.openAiUtteranceArray.push(obj);
        this.loaded  =true;
      }
    }, 500);
  }

  // getSuggestion(type: string) {
  //   this.isGeneratingText = false;
  //   // this.openAiUtteranceArray = [];
  //   this.openAIService.generateText(this.utteranceText, type)
  //     .then((res: any) => {
  //       res = res.replace(/\n/g,'&&&');
  //       if (res) {
  //         let openAiUtteranceArray = Object.assign([], res.split('&&&'));
  //         this.formatUtterArray(openAiUtteranceArray);
  //       };
  //       this.isGeneratingText = true;
  //     })
  //     .catch(err => {
  //       this.isGeneratingText = true;
  //     })
  // }

  saveUtteranceStrings(){
    // let utteranceArray : any = this.getSelectedUtterance();
    let saveUtteranceArray = this.selectedUtterancesArray.map((utterObj : any) => {
      // if(utteranceArray.includes(utterObj.utterance)){
      //   return true;
      // }
      return utterObj?.id;
    });
    (this.form.controls.when as FormGroup).controls?.utterancesId?.setValue(saveUtteranceArray);
    this.closeAdherence(COACHINGCNST.UTTERANCE);
  }

  getSelectedUtterance(){
    let utteranceArray : any = [];
    this.openAiUtteranceArray.forEach((item) => {
      if(item.enabled){
        utteranceArray.push({utterance: item.value, language: "english"});
      }
    });
    return utteranceArray;
  }

  getUtteranceIds(){
    this.addButtonClick = true;
    // let utteranceArray : any = this.getSelectedUtterance();
    let payload : any = {
      utterances : this.getSelectedUtterance(),
      type: "trigger"
    }
    this.service.invoke('post.agentcoachingutterance',{
      refId: this.form.value._id,
    }, payload).pipe(finalize(() => {
    })).subscribe(data => {
      this.addButtonClick = false;
      if (data) {
        this.isGeneratingText = false;
        this.selectedUtterancesArray = data;
      }
    },(error)=>{
      this.addButtonClick = false;
    });
  }

  changeUtterActiveStatus(utter){
    utter.enabled = !utter.enabled;    
  }
  prevVal = ''
  createNewUtter(e, val){
    this.prevVal = val;
    console.log(e.target.checked)
    if(e.target.checked){
      let exist = this.openAiUtteranceArray.find((item)=>item.value === val);
      if(!exist){
        this.openAiUtteranceArray.push({
          enabled : true,
          value : val
        })
      }
    }else{
      let inx = this.openAiUtteranceArray.findIndex((item)=>item.value === val);
      this.openAiUtteranceArray.splice(inx, 1);
    }

  }

  clearAIsuggestions(){
    // this.utteranceText = '';
    // this.isGeneratingText = false;
    // this.openAiUtteranceArray = [];
    // this.cdRef.detectChanges();
  }

  closeAdherence(e?) {
    this.onClose.emit(e);
  }
}
