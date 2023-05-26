import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { OpenAIService } from '../../open-ai.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-utterance-adherence',
  templateUrl: './utterance-adherence.component.html',
  styleUrls: ['./utterance-adherence.component.scss']
})
export class UtteranceAdherenceComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;

  isGeneratingText : boolean = null;
  openAiUtteranceArray : any = [];
  sampleUtterArray : any = ['price high', 'price too high', 'price is much', 'price expensive'];
  utteranceText : string;
  selectedUtterancesArray : any = [];


  @ViewChild(NgbDropdown, { static: true })
  public utteranceDropdown: NgbDropdown;

  @Output() saveUtterance = new EventEmitter();

  // @ViewChild('utteranceDropdown') utteranceDropdown:NgbDropdown;

  constructor(private openAIService : OpenAIService,
    private cdRef:ChangeDetectorRef,
    private service : ServiceInvokerService) { }

  ngOnInit(): void {
    this.formatUtterArray(this.sampleUtterArray);
  }

  formatUtterArray(openAiUtteranceArray){
    for(let utter of openAiUtteranceArray){
      if(utter && utter.length > 1){
        let obj : any = {
          enabled : false,
          value : utter
        }
        this.openAiUtteranceArray.push(obj);
      }
    }
  }

  getSuggestion(type: string) {
    this.isGeneratingText = false;
    // this.openAiUtteranceArray = [];
    this.openAIService.generateText(this.utteranceText, type)
      .then((res: any) => {
        res = res.replace(/\n/g,'&&&');
        if (res) {
          let openAiUtteranceArray = Object.assign([], res.split('&&&'));
          this.formatUtterArray(openAiUtteranceArray);
        };
        this.isGeneratingText = true;
      })
      .catch(err => {
        this.isGeneratingText = true;
      })
  }

  saveUtteranceStrings(){
    let utteranceArray : any = this.getSelectedUtterance();
    let saveUtteranceArray = this.selectedUtterancesArray.filter((utterObj : any) => {
      if(utteranceArray.includes(utterObj.utterance)){
        return true;
      }
    });
    this.saveUtterance.emit(saveUtteranceArray);
  }

  getSelectedUtterance(){
    let utteranceArray : any = [];
    this.openAiUtteranceArray.forEach((item) => {
      if(item.enabled){
        utteranceArray.push(item.value);
      }
    });
    return utteranceArray;
  }

  getUtteranceIds(){
    let utteranceArray : any = this.getSelectedUtterance();
    let payload : any = {
      utterance : utteranceArray
    }    
    this.service.invoke('post.agentcoachingutterance',{}, payload).pipe(finalize(() => {
    })).subscribe(data => {
      if (data) {
        this.selectedUtterancesArray = Object.assign([], data);
      }
    });
  }

  changeUtterActiveStatus(utter){
    utter.enabled = !utter.enabled;    
  }

  clearAIsuggestions(){
    this.utteranceText = '';
    this.isGeneratingText = false;
    this.openAiUtteranceArray = [];
    this.cdRef.detectChanges();
  }

  closeAdherence(e?) {
    this.onClose.emit(e);
  }
}
