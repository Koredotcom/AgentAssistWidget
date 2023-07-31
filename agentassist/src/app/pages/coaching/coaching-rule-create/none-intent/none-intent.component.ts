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
import { COACHINGCNST } from '../../coaching.cnst';

@Component({
  selector: 'app-none-intent',
  templateUrl: './none-intent.component.html',
  styleUrls: ['./none-intent.component.scss']
})
export class NoneIntentComponent implements OnInit {

  @ViewChild('tagInput', { static: true }) tagInput: ElementRef;
  @ViewChild('trigger', { static: false }) trigger: MatAutocompleteTrigger;

  @Output() closeSlide = new EventEmitter();
  @Input() currentRule: any = {};

  tagControl: FormControl = new FormControl();
  selUtteranceControl: FormControl = new FormControl();


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selAcc = this.local.getSelectedAccount();
  coachingCnst: any = COACHINGCNST;

  clickSelectedUtter = false;
  loading: boolean = false;
  clickAddUtter = false;

  tags: any = [];
  newUtterances = [];
  ruleUtterances = [];
  allTagsRules: any = [];
  deletedUtterances = [];
  selectedUtterances = [];
  filteredTagsDisplay: any = [];
  originalRuleUtterances = [];

  preVal = '';
  customUtterance = '';
  selectedUtterSeach = '';
  utteranceType: any = '';
  // allTagList : any = [];
  // newUtterancesSearch = [];
  // selectedUtterSeach = new FormControl();
  constructor(
    private service: ServiceInvokerService,
    private local: LocalStoreService,
    private auth: AuthService,
    private workflowService: workflowService
    // private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.subscribeValues();

    if (this.currentRule) {
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

  getTags() {
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      botId,
    };
    let body = {
      botId,
      limit: -1,
      page: 1,
      sortBy: 'asc',
      groupBy: 'tags'
    }
    this.service.invoke('get.allagentCoachingRule', params, body).pipe(finalize(() => {
    })).subscribe(data => {
      if (data) {
        data.forEach(item => {

          let ruleIdList = [];
          item.values.forEach(element => {
            ruleIdList.push(element._id);
          });

          let obj: any = {
            name: item.tag,
            value: ruleIdList,
            checked: false,
            type: 'tag'
          }

          this.filteredTagsDisplay.push(obj);
        });
        this.allTagsRules = JSON.parse(JSON.stringify(this.filteredTagsDisplay));
      }
    });

  }

  getRules() {
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;
    let params: any = {
      botId,
    };
    let body = {
      botId,
      limit: -1,
      page: 1,
      sortBy: 'asc',
    }
    this.service.invoke('get.allagentCoachingRule', params, body).pipe(finalize(() => {
    })).subscribe(data => {
      if (data && data.results) {
        data.results.forEach(item => {
          let obj: any = {
            name: item.name,
            value: [item._id],
            checked: false,
            type: 'rule'
          }
          this.filteredTagsDisplay.push(obj);
        });
        this.allTagsRules = JSON.parse(JSON.stringify(this.filteredTagsDisplay));
      }
    });
  }

  subscribeValues() {
    this.tagControl.valueChanges.subscribe((value) => {
      if (value) {
        this.assignOriginalToDisplayList();
        this.filteredTagsDisplay = this.filteredTagsDisplay.filter(
          (tag) => (tag.name).indexOf(value) !== -1
        );
      } else {
        this.assignOriginalToDisplayList();
      }
    });

    this.selUtteranceControl.valueChanges.subscribe((value) => {
      if (value) {
        this.assignOriginalRuleToDisplayUtteranceList();
        this.ruleUtterances = this.ruleUtterances.filter(
          (utter) => (utter.name).indexOf(value) !== -1
        );
      } else {
        this.assignOriginalRuleToDisplayUtteranceList();
      }
    });
  }

  closeSlider() {
    this.closeSlide.emit();
  }

  // add Utterance page methods start

  deleteUtterance(u) {
    let inx = this.selectedUtterances.findIndex(item => item.utterance === u.utterance);
    this.deletedUtterances.push(u._id);
    this.selectedUtterances.splice(inx, 1);
    this.selectedUtterances = [...this.selectedUtterances];
  }

  onEnter() {
    this.newUtterances.push(this.customUtterance);
    this.newUtterances = [...this.newUtterances]
    this.customUtterance = '';
  }

  deleteNewUtterance(utter) {
    let inx = this.newUtterances.findIndex(item => item === utter);
    this.newUtterances.splice(inx, 1);
    this.newUtterances = [...this.newUtterances]
  }

  save() {
    // this.currentRule.when?.utteranceCount = 
    let newU = this.newUtterances.map(item => {
      let obj = {};
      obj['utterance'] = item;
      obj['language'] = 'english';
      return obj;
    });
    let when = {}
    when['addUtterances'] = newU;
    when['deleteUtterances'] = this.deletedUtterances;
    this.currentRule['triggers'][0]['when'] = { ...when };
    delete this.currentRule['state'];
    this.service.invoke('put.agentcoachingrule', { ruleId: this.currentRule?._id }, this.currentRule)
      .pipe(finalize(() => {
        // this.loading = false;
      }))
      .subscribe((data) => {
        this.closeSlider();
      }, (err) => {

      })
  }

  // add Utterance page methods ends



  // utterance type selection page methods starts

  selectedOption(item, index) {
    let checked = this.filteredTagsDisplay[index].checked;
    if (!checked) {
      this.filteredTagsDisplay[index].checked = true;
      this.AddOrSelectTagNames(item);
    } else {
      this.filteredTagsDisplay[index].checked = false;
      this.remove(item)
    }
  }

  selectAllUtteranceType(type) {
    this.filteredTagsDisplay.map(obj => {
      if (obj.type == type) {
        this.AddOrSelectTagNames(obj);
      }
    });
  }

  AddOrSelectTagNames(tagOrrule) {
    if ((tagOrrule.name || '')) {
      let filterIndex = this.tags.findIndex((item) => {
        return item.name == tagOrrule.name;
      });
      if (filterIndex == -1) {
        this.tags.push({ name: tagOrrule.name, value: tagOrrule.value });
      }
    }
    this.trigger.openPanel();
    this.assignOriginalToDisplayList();
    setTimeout(() => {
      this.tagControl.setValue('');
    }, 0);
  }

  remove(tagOrrule): void {
    const index = this.tags.findIndex(item => {
      return item.name == tagOrrule.name;
    });
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.assignOriginalToDisplayList();
    this.trigger.openPanel();
  }

  assignOriginalToDisplayList() {
    this.filteredTagsDisplay = this.allTagsRules.map((item) => {
      return { name: item.name, value: item.value, type: item.type, checked: (this.tags.findIndex((tag) => { return tag.name == item.name })) >= 0 ? true : false }
    });
  }

  clearChipData() {
    this.tags = [];
    this.assignOriginalToDisplayList();
  }

  changeUtteranceSelectionType(type) {
    this.utteranceType = type;
    if (type == this.coachingCnst.MANUAL) {
      this.clickSelectedUtter = false;
    }
  }

  addRuleData() {
    // this.loading = true;
    this.clickSelectedUtter = true;
    this.ruleUtterances = [];
    this.trigger.closePanel();


    let ruleIdList = [];
    this.tags.forEach(element => {
      ruleIdList = [...ruleIdList, ...element.value];
    });
    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;

    let payload: any = {
      selectedRules: ruleIdList,
      botId,
      userId: this.auth.getUserId(),
    };

    // let addRuleData = [
    //   {
    //     "entities": [],
    //     "sentence": "I don't need any help with my order."
    //   },
    //   {
    //     "entities": [],
    //     "sentence": "Cancel my order immediately."
    //   },
    //   {
    //     "entities": [],
    //     "sentence": "I don't want assistance with my order."
    //   },
    // ];

    
    
    this.service.invoke('post.noneIntentUtterances', {}, payload)
    .pipe(finalize(() => {
      // this.loading = false;
    }))
    .subscribe(data => {
      console.log(data, 'from none intent api');
      if(data){
        this.formatRuleSentenceData(data);
        this.ruleUtterances = JSON.parse(JSON.stringify(this.originalRuleUtterances));
      }
      });
  }

  checkTagPresent() {
    return this.filteredTagsDisplay.some(obj => obj.type == this.coachingCnst.TAG);
  }

  checkRulePresent() {
    return this.filteredTagsDisplay.some(obj => obj.type == this.coachingCnst.RULE);
  }
  // utterance type selection page methods ends



  // utterance selection page methods start

  formatRuleSentenceData(data) {
    data.forEach(element => {
      this.originalRuleUtterances.push({ name: element.sentence, checked: true });
    });
  }

  checkSelectedUtterance() {
    return this.ruleUtterances.every(item => item.checked);
  }

  addSelectedUtteranceList() {
    this.ruleUtterances.forEach(item => {
      if (item.checked && this.newUtterances.indexOf(item.name) == -1) {
        this.newUtterances.push(item.name);
      }
    });
    this.clickSelectedUtter = false;
    this.clickAddUtter = false;
  }

  removeSelectedUtterances(item, index) {
    let checked = item.checked ? false : true;
    this.ruleUtterances[index].checked = checked;
    this.originalRuleUtterances[index].checked = checked;
  }

  selectAllUtterances() {
    this.originalRuleUtterances.forEach(item => {
      item.checked = true;
    });
    this.assignOriginalRuleToDisplayUtteranceList();
  }

  assignOriginalRuleToDisplayUtteranceList() {
    this.ruleUtterances = JSON.parse(JSON.stringify(this.originalRuleUtterances));
  }

  // utterance selection page methods end



}
