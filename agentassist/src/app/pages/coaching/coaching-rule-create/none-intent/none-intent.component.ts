import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { debounceTime, finalize } from 'rxjs/operators';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AuthService } from '@kore.services/auth.service';
import { workflowService } from '@kore.services/workflow.service';

@Component({
  selector: 'app-none-intent',
  templateUrl: './none-intent.component.html',
  styleUrls: ['./none-intent.component.scss']
})
export class NoneIntentComponent implements OnInit {

  @ViewChild('tagInput', {static : true}) tagInput: ElementRef;
  @ViewChild('trigger', {static : false}) trigger : MatAutocompleteTrigger;

  tagControl :  FormControl = new FormControl();
  @Output() closeSlide = new EventEmitter();
  @Input() currentRule:any = {};
  clickAddUtter = false;
  tags:any = [];
  filteredTagsDisplay : any;
  allTagList : any = ['rule3', 'rule4', 'rule5', 'rule6'];
  selectedUtterances = [];
  // serachedUtterances = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // selectedUtterSeach = new FormControl();
  
  selectedUtterSeach = '';
  preVal = '';
  customUtterance = '';
  newUtterances = [];
  selAcc = this.local.getSelectedAccount();
  allTags: any = [];
  allRules: any = [];
  // newUtterancesSearch = [];
  constructor(
    private service: ServiceInvokerService,
    private local: LocalStoreService,
    private auth: AuthService,
    private workflowService: workflowService
    // private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filteredTagsDisplay = this.allTagList.map((item) => {
      return {name : item, checked : false}
    });
    this.subscribeValues();
    if(this.currentRule){
      this.service.invoke("get.agentcoachingutteranceByRef",
      {
        refId: this.currentRule?.triggers[0]._id,
      }).subscribe((data) => {
        this.selectedUtterances = data.filter(utter => !utter.default);
        // this.cd.markForCheck();
        // this.selectedUtterances = JSON.parse(JSON.stringify(data));
        // this.serachedUtterances = JSON.parse(JSON.stringify(this.selectedUtterances));
      })
    }
    // this.selectedUtterSeach.valueChanges
    // .pipe(
    //   debounceTime(300)
    // )
    // .subscribe((val)=>{
    //   val = val.trim();
    //   if(val){
    //     this.preVal = val;
    //     this.serachedUtterances = this.selectedUtterances.filter(item=> item.utterance.toLowerCase()?.includes(val.toLowerCase()))
    //   }else{
    //     this.serachedUtterances = [...this.selectedUtterances]
    //   }
    // })
    this.getTags();
    this.getRules();
  }

  getTags(){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      botId,
    };
    let body = {
      botId,
      limit: -1,
      page: 1,
      sortBy : 'asc',
      groupBy: 'tags'
    }
    this.service.invoke('get.allagentCoachingRule', params, body).pipe(finalize(() => {
    })).subscribe(data => {
      if (data) {
        this.allTags = data;
      }
    });
  }

  getRules(){
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      botId,
    };
    let body = {
      botId,
      limit: -1,
      page: 1,
      sortBy : 'asc',
    }
    this.service.invoke('get.allagentCoachingRule', params, body).pipe(finalize(() => {
    })).subscribe(data => {
      if (data) {
        this.allRules = data.results;
      }
    });
  }


  subscribeValues(){
    this.tagControl.valueChanges.subscribe((value)=> {
      console.log(value, "value");
      
      if(value){
        this.assignOriginalToDisplayList();
        this.filteredTagsDisplay = this.filteredTagsDisplay.filter(
          (tag) => (tag.name).indexOf(value) !== -1
        );
      }else{
        this.assignOriginalToDisplayList();
      }
    });
  }

  selectedOption(item, index){
    let checked = this.filteredTagsDisplay[index].checked;
    if(!checked){
      this.AddOrSelectTagNames(item);
    }else{
      this.remove(item)
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value?.trim();
    this.AddOrSelectTagNames(value);
    
  }

  AddOrSelectTagNames(value) {
    // Add our fruit
    if ((value || '')) {
      let filterIndex = this.tags.findIndex((item) => {
        return item.name == value;
      });
      if (filterIndex == -1) {
        this.tags.push({ name: value });
      }
      
      if(this.allTagList.indexOf(value) == -1){
        this.allTagList.push(value);
      }
    }
  
    this.trigger.openPanel();  
    this.assignOriginalToDisplayList();
    this.tagInput.nativeElement.value = '';
    setTimeout(() => {
      this.tagControl.setValue('');
    }, 0);
  }

  remove(tag): void {    
    const index = this.tags.findIndex(item =>{
      return item.name == tag;
    });    
    if (index >= 0) {
      this.tags.splice(index, 1);
    }    
    this.assignOriginalToDisplayList();
    this.trigger.openPanel();  
  }

  assignOriginalToDisplayList(){    
    this.filteredTagsDisplay = this.allTagList.map((item) => {      
      return {name : item, checked : (this.tags.findIndex((tag) => {return tag.name == item})) >= 0 ? true : false}
    });    
  } 

  closeSlider(){
    this.closeSlide.emit();
  }
  deletedUtterances = [];
  deleteUtterance(u){
    let inx = this.selectedUtterances.findIndex(item => item.utterance === u.utterance);
    this.deletedUtterances.push(u._id);
    this.selectedUtterances.splice(inx, 1);
    this.selectedUtterances = [...this.selectedUtterances];
  }
  
  onEnter(){
    this.newUtterances.push(this.customUtterance);
    this.newUtterances = [...this.newUtterances]
    this.customUtterance = '';
  }

  deleteNewUtterance(utter){
    let inx = this.newUtterances.findIndex(item => item === utter);
    this.newUtterances.splice(inx, 1);
    this.newUtterances = [...this.newUtterances]
  }

  save(){
    console.log(this.currentRule);
    // this.currentRule.when?.utteranceCount = 
    let newU = this.newUtterances.map(item=> {
      let obj = {};
      obj['utterance'] = item;
      obj['language'] = 'english';
      return obj;
    });
    let when = {}
    when['addUtterances'] = newU;
    when['deleteUtterances'] = this.deletedUtterances;
    this.currentRule['triggers'][0]['when'] = {...when};
    delete this.currentRule['state'];
    this.service.invoke('put.agentcoachingrule', {ruleId : this.currentRule?._id}, this.currentRule)
    .pipe(finalize(()=>{
      // this.loading = false;
    }))
    .subscribe((data)=>{
      console.log("datadatadatadatadatadatadatadatadata", data);
      this.closeSlider();
    }, (err)=>{

    })
  }
}
