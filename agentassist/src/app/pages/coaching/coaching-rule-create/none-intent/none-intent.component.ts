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
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoachingConfirmationComponent } from '../../coaching-confirmation/coaching-confirmation.component';
import { FilterPipe } from 'src/app/helpers/filters/filter.pipe';

@Component({
  selector: 'app-none-intent',
  templateUrl: './none-intent.component.html',
  styleUrls: ['./none-intent.component.scss']
})
export class NoneIntentComponent implements OnInit {

  @ViewChild('tagInput', { static: true }) tagInput: ElementRef;
  @ViewChild('trigger', { static: false }) trigger: MatAutocompleteTrigger;
  @ViewChild('newUtteranceScroll') newUtteranceScroll : PerfectScrollbarComponent;
  @ViewChild('tabBody', { read: ElementRef }) public homescroll: ElementRef<any>;


  @Output() closeSlide = new EventEmitter();
  @Input() currentRule: any = {};
  @Input() configFeatures : any;


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selAcc = this.local.getSelectedAccount();
  coachingCnst: any = COACHINGCNST;

  clickAddUtter = false;
  loading: boolean = false;
  clickSelectedUtter = false;
  openapiEnable : boolean = false;
  selectAllTagFlag : boolean = false;
  selectAllRuleFlag : boolean = false;

  tags: any = [];
  newUtterances = [];
  ruleUtterances = [];
  allTagList : any = [];
  allRuleList : any = [];
  allTagsRules: any = [];
  deletedUtterances = [];
  selectedUtterances = [];
  filteredTagsDisplay: any = [];
  modalRef : any;
  dataloaded : boolean = false;

  preVal = '';
  customUtterance = '';
  selectedUtterSeach = '';
  utteranceType: any = '';
  listedUtterSearch = '';
  tagRuleSearch = '';

 
  // allTagList : any = [];
  // newUtterancesSearch = [];
  // selectedUtterSeach = new FormControl();
  constructor(
    private service: ServiceInvokerService,
    private local: LocalStoreService,
    private auth: AuthService,
    private workflowService: workflowService,
    private modalService : NgbModal, 
    private filterPipe : FilterPipe
    // private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.dataloaded = false;
    if (this.currentRule) {
      this.service.invoke("get.agentcoachingutteranceByRef",
        {
          refId: this.currentRule?.triggers[0]._id,
        }).subscribe((data) => {
          this.dataloaded = true;
          this.selectedUtterances = data.filter(utter => !utter.default);
          // this.cd.markForCheck();
          // this.selectedUtterances = JSON.parse(JSON.stringify(data));
          // this.serachedUtterances = JSON.parse(JSON.stringify(this.selectedUtterances));
        }, (err)=> {
          this.dataloaded = true;
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
    this.checkOpenAiConfig();
  }

  checkOpenAiConfig(){
    this.openapiEnable = this.configFeatures?.find(item => item.name === "aa_noneintent" && item.enable)
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
          if(item.tag){
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
            this.allTagList.push(item.tag);
          }
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
          this.allRuleList.push(item.name);
        });
        this.allTagsRules = JSON.parse(JSON.stringify(this.filteredTagsDisplay));
      }
    });
  }


  closeSlider(isSave?) {
    if((this.newUtterances.length || this.deletedUtterances.length) && !isSave){
      this.modalRef = this.modalService.open(CoachingConfirmationComponent, { centered: true, keyboard: false, windowClass: 'delete-uc-rule-modal', backdrop: 'static' });
      this.modalRef.result.then(emitedValue => {
        if(emitedValue){
          this.closeSlide.emit();
        }
      });
    }else{
      this.closeSlide.emit();
    }
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
    setTimeout(() => {
      this.newUtteranceScroll.directiveRef.scrollToTop(this.homescroll.nativeElement.scrollHeight);
      this.newUtteranceScroll.directiveRef.update();
    });
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
        this.closeSlider(true);
      }, (err) => {

      })
  }

  // add Utterance page methods ends



  // utterance type selection page methods starts

  selectedOption(item, index) {
    let checkIndex = this.filteredTagsDisplay.findIndex(el => {
      return el.name == item.name && el.type == item.type;
    });
    let checked = this.filteredTagsDisplay[checkIndex].checked;
    if (!checked) {
      this.filteredTagsDisplay[checkIndex].checked = true;
      this.AddOrSelectTagNames(item);
    } else {
      this.filteredTagsDisplay[checkIndex].checked = false;
      this.remove(item)
    }
  }

  selectAllUtteranceType(type, flag) {
    let selectedUtterances = this.filterSearchData(type);
    let selectedUtteranceObj : any = selectedUtterances.reduce((acc,item)=> {
      if(item.type == type){
        acc[item.name] = item;
      }
      return acc;
    },{});

    for(let key in selectedUtteranceObj){
      if(flag){
        this.remove(selectedUtteranceObj[key], false);
      }else{
        this.AddOrSelectTagNames(selectedUtteranceObj[key], false);
      }
    }
  }

  filterSearchData(type){
    let filterTags = this.filteredTagsDisplay.filter(item => item.type == type);
    let selectedUtterances = this.filterPipe.transform(filterTags,[this.tagRuleSearch, 'name']);
    return selectedUtterances;
  }

  checkSelectedAllTags() {
    let selectedUtterances = this.filterSearchData(this.coachingCnst.TAG);
    return selectedUtterances.every(item => item.checked);
  }

  checkSelectedAllRules() {
    let selectedUtterances = this.filterSearchData(this.coachingCnst.RULE);
    return selectedUtterances.every(item => item.checked);
  }


  checkSelectAllStatus(tagOrRule, type){
    if(type == this.coachingCnst.REMOVE){
      if(tagOrRule.type == this.coachingCnst.TAG){
        this.selectAllTagFlag = false;
      }else{
        this.selectAllRuleFlag = false;
      }  
    }else if(type == this.coachingCnst.ADD){  
      let tags = this.tags.reduce((acc,item)=> {
        if(item.type == type){
          acc[item.name] = true;
        }
        return acc;
      }, {});
      if(tagOrRule.type == this.coachingCnst.TAG){
        let selectedUtterances = this.filterSearchData(this.coachingCnst.TAG);
        this.selectAllTagFlag = selectedUtterances.every(item => tags[item]);        
      }else{
        let selectedUtterances = this.filterSearchData(this.coachingCnst.RULE);
        this.selectAllRuleFlag = selectedUtterances.every(item => tags[item]);  
        // this.selectAllRuleFlag = this.allRuleList.every(item => tags[item]);
      }
    }
  }

  AddOrSelectTagNames(tagOrrule, checkStatus = true) {
    if ((tagOrrule.name || '')) {
      let filterIndex = this.tags.findIndex((item) => {
        return item.name == tagOrrule.name && item.type == tagOrrule.type;
      });
      if (filterIndex == -1) {
        this.tags.push({ name: tagOrrule.name, value: tagOrrule.value, type : tagOrrule.type });
        this.selectOrUnselectCheckList(tagOrrule, true);
      }
    }
    this.trigger.openPanel();
    if(checkStatus){
      this.checkSelectAllStatus(tagOrrule, this.coachingCnst.ADD);
    }
  }

  remove(tagOrrule, checkStatus = true): void {
    const index = this.tags.findIndex(item => {
      return item.name == tagOrrule.name && item.type == tagOrrule.type;
    });
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.selectOrUnselectCheckList(tagOrrule, false);
    }
    this.trigger.openPanel();
    if(checkStatus){
      this.checkSelectAllStatus(tagOrrule, this.coachingCnst.REMOVE);
    }
  }

  selectOrUnselectCheckList(tagOrrule, check){
    let index = this.filteredTagsDisplay.findIndex(item => {
      return item.name == tagOrrule.name && item.type == tagOrrule.type;
    });
    this.filteredTagsDisplay[index].checked = check;
  }

  assignOriginalToDisplayList() {
    this.filteredTagsDisplay = this.allTagsRules.map((item) => {
      return { name: item.name, value: item.value, type: item.type, checked: false }
    });
  }

  clearChipData() {
    this.tagRuleSearch = '';
    this.selectAllRuleFlag = false;
    this.selectAllTagFlag = false;
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
    this.loading = true;
    this.clickSelectedUtter = true;
    this.ruleUtterances = [];
    this.trigger.closePanel();


    let ruleIdList = [];
    this.tags.forEach(element => {
      ruleIdList = [...ruleIdList, ...element.value];
    });

    ruleIdList = ruleIdList.reduce((a, it)=>{
      a[it] = true;
      return a;
    }, {});

    let botId = this.auth.isLoadingOnSm && this.selAcc ? this.selAcc['instanceBots'][0]?.instanceBotId : this.workflowService.getCurrentBt(true)._id;

    let payload: any = {
      selectedRules: Object.keys(ruleIdList),
      botId,
      userId: this.auth.getUserId(),
    };
    
    
    this.service.invoke('post.noneIntentUtterances', {}, payload)
    .subscribe(data => {
      this.loading = false;
      if(data){
        this.formatRuleSentenceData(data);
      }
      },(err)=> {
        this.loading = false;
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
      this.ruleUtterances.push({ name: element.sentence, checked: true });
    });
  }

  checkSelectedUtterance() {
    let selectedUtterances = this.filterPipe.transform(this.ruleUtterances,[this.listedUtterSearch, 'name']);
    return selectedUtterances.every(item => item.checked);
  }

  addSelectedUtteranceList() {
    this.ruleUtterances.forEach(item => {
      if (item.checked && this.newUtterances.indexOf(item.name) == -1) {
        this.newUtterances.push(item.name);
      }
    });
    this.newUtterances = [...this.newUtterances];
    this.clickSelectedUtter = false;
    this.clickAddUtter = false;
  }

  removeSelectedUtterances(item, index) {
    let checked = item.checked ? false : true;
    this.ruleUtterances.forEach((ele) => {
      if(ele.name == item.name){
        ele.checked = checked;
      }
    });    
    this.ruleUtterances = [...this.ruleUtterances];
  }

  selectAllUtterances(event) {
    let selectedUtterances = this.filterPipe.transform(this.ruleUtterances,[this.listedUtterSearch, 'name']);
    let selectedUtteranceObj : any = selectedUtterances.reduce((acc,item)=> {
      acc[item.name] = true;
      return acc;
    },{});

    this.ruleUtterances.forEach(item => {
      if(selectedUtteranceObj[item.name]){
        item.checked = event.target.checked;
      }
    });
    this.ruleUtterances = [...this.ruleUtterances];
  }

  checkAddSelectedButtonState(){
    return this.ruleUtterances.some(item => item.checked);
  }

  // utterance selection page methods end



}
