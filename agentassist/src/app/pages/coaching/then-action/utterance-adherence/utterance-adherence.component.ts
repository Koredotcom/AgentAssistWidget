import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { OpenAIService } from '../../open-ai.service';
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
  utteranceText : string;


  @ViewChild(NgbDropdown, { static: true })
  public utteranceDropdown: NgbDropdown;

  // @ViewChild('utteranceDropdown') utteranceDropdown:NgbDropdown;

  constructor(private openAIService : OpenAIService,
    private cdRef:ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  getSuggestion(type: string) {
    this.isGeneratingText = false;
    this.openAiUtteranceArray = [];
    this.openAIService.generateText(this.utteranceText, type)
      .then((res: any) => {
        res = res.replace(/\n/g,'&&&');
        if (res) {
          this.openAiUtteranceArray = Object.assign([], res.split('&&&'));
          this.openAiUtteranceArray = this.openAiUtteranceArray.filter(function(e){return e}); 
        };
        this.isGeneratingText = true;
      })
      .catch(err => {
        this.isGeneratingText = true;
      })
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
