import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service'
import { SideBarService } from '@kore.services/header.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged, finalize, map, pluck, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PerfectScrollbarComponent  } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { Logs, ResponseLogs } from '../../data/conversational-logs.model';
import { NotificationService } from '@kore.services/notification.service';
import { MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import { MatTabGroup }  from '@angular/material/tabs';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

declare const $: any;
import * as _ from 'underscore';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { fromEvent } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Moment } from 'moment';
import { TemplatesChatHistoryComponent } from '../templates-chat-history/templates-chat-history.component';
@Component({
  selector: 'app-conversational-logs',
  templateUrl: './conversational-logs.component.html',
  styleUrls: ['./conversational-logs.component.scss']
})
export class ConversationalLogsComponent implements OnInit {
  // displayedColumns: string[] = ['userId', 'phoneNumber', 'startDateAandTime', 'endDateAandTime', 'status', 'flow'];
  displayedColumns: string[] = ['phone', 'date', 'duration', 'status','recording']; //'intent', 'flow',
  isFilter = false;
  isInsights = false;
  dataSource = new MatTableDataSource<Logs>();
  selectedApp: any;
  isLoading: boolean;
  isSliderLoading = true;
  selectedLog: Logs;
  calendarFromDate: string;
  calendarToDate: string;
  filter = {
    startDate: moment().subtract({days: 7}),
    endDate: moment(),
    status: '',
    flowtype: '',
    datePeriod: '',
    intent: '',
    flowType: ''
  };
  dateOri = {
    start: moment().subtract({days: 7}),
    end: moment()
  };
  streamId: string;
  filterFlowType = [];
  filterStatus = [
    {id: 'drop-off', name: this.translate.instant("CONVERSATIONAL_LOGS.DROP_OFF_NAME")},
    {id: 'in progress', name: this.translate.instant("CONVERSATIONAL_LOGS.IN_PROGRESS")},
    {id: 'fulfilled', name: this.translate.instant("CONVERSATIONAL_LOGS.FULFILLED")},
    {id: 'not connected', name: this.translate.instant("CONVERSATIONAL_LOGS.NOT_CONNECTED")}
  ];
  fromDate: string;
  toDate: string;
  flowList = [];
  flowTypeSelected = 'Select';
  statusSelected = 'Select';
  isInProgress: boolean;
  chatHistData: any = {
    messages: []
  };
  filterForm: FormGroup;
  messageId: string = "";
  showLimit: any = 50;
  scrollSkip: any = 0;
  isMoreAvailable: boolean = false;
  dataAvailable: any = [];
  isMoreAvalLoad: boolean = false;
  flowTypeList: any = [];
  isExporting = false;
  rangeList = [
    {id: 'today', display: this.translate.instant("CONVERSATIONAL_LOGS.TODAY")},
    {id: 'yesterday', display: this.translate.instant("CONVERSATIONAL_LOGS.YESTERDAY")},
    {id: 'seven', display: this.translate.instant("CONVERSATIONAL_LOGS.LAST_7_DAYS")},
    {id: 'twoEight', display: this.translate.instant("CONVERSATIONAL_LOGS.LAST_28_DAYS")},
    {id: 'ninety', display: this.translate.instant("CONVERSATIONAL_LOGS.LAST_90_DAYS")}
  ];
  isCustCalendar = false;
  isCallLogs = true;
  ranges: any = {
    'Today': [moment().startOf('day'), moment()],
    'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
    'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment()],
    'Last 28 Days': [moment().subtract(27, 'days').startOf('day'), moment()],
    'Last 90 Days': [moment().subtract(89, 'days').startOf('day'), moment()]
  }
  calendarLocale: any;
  selectedTabIndex: number = 0;

  // flowTSel = new FormControl();
  @ViewChild('allSelected') private allSelected: MatOption;
  @Input() isFromAnalytics: boolean = false;
  @Input() flow: 'chatAutomation' | 'voiceAutomation' | 'agentTransferStart' | 'voiceAgentTransferStart';
  @Output() closeCDR = new EventEmitter();
  constructor(
    public workflowService: workflowService,
    private headerService: SideBarService,
    private service: ServiceInvokerService,
    private translate: TranslateService,
    private dockService: DockStatusService,
    private notificationService: NotificationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.iconRegistry.addSvgIcon('filter_icon',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/add.svg'));
    this.iconRegistry.addSvgIcon('agent_chat',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/agent-chat.svg'));
    this.iconRegistry.addSvgIcon('agent_voice',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/agent-voice.svg'));
    this.iconRegistry.addSvgIcon('conver_chat',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/chat.svg'));
    this.iconRegistry.addSvgIcon('conver_voice',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/voice.svg'));
    this.iconRegistry.addSvgIcon('play',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/play.svg'));
    this.iconRegistry.addSvgIcon('download',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/download.svg'));
    this.iconRegistry.addSvgIcon('export_conver',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/export.svg'));
    this.iconRegistry.addSvgIcon('calendar',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar.svg'));
    this.iconRegistry.addSvgIcon('sorting',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/conversational-logs/sort.svg'));
   }

  @ViewChild(SliderComponentComponent, { static: true }) sliderComponent: SliderComponentComponent;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild('drawer') drawer: SliderComponentComponent;
  @ViewChild('inpSearch') inpSearch: ElementRef;
  @ViewChild('tabGroup') tabGp: MatTabGroup;
  @ViewChild(DaterangepickerDirective, { static: false }) picker: DaterangepickerDirective;
  @ViewChild(TemplatesChatHistoryComponent, { static: false }) templatesChatHistoryComponent: TemplatesChatHistoryComponent;

  config: any = {
    suppressScrollX: true
  };
  lastScrollTop: any = 0;

  ngOnInit() {
    let toogleObj = {
      "title": this.translate.instant("NAV.CONVERSATIONAL_LOGS"),
      "toShowWidgetNavigation": this.workflowService.showAppCreationHeader()
    }
    this.headerService.toggle(toogleObj);
    this.selectedApp = this.workflowService.getCurrentBt();
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.filterForm = this.fb.group({
      flowTSel: new FormControl([]),
      dateForm: new FormControl('seven'),
      statusForm: new FormControl(''),
      intentIdentified: new FormControl('')
    });
    this.calendarLocale = {
      applyLabel: this.translate.instant('BUTTONS.APPLY'),
      cancelLabel: this.translate.instant('BUTTONS.CANCEL'),
      customRangeLabel: this.translate.instant('CALENDAR.CUSTOM_RANGE')
    }
    this.fromDate = this.filter.startDate.format('Do MMM YYYY');
    this.toDate = this.filter.endDate.format('Do MMM YYYY');
    if(this.isFromAnalytics){
      this.getCallLogsData(null, this.flow);
    } else {
      this.getCallLogsData();
    }
    this.workflowService.seedData$.subscribe(res => {
      if (!res) return;
      if(res.deflectSeedData && res.deflectSeedData.flowTypeMap) {
        _.map(res.deflectSeedData.flowTypeMap, (v, i)=>{
          let obj = {
            id: v,
            name: i
          };
          this.filterFlowType.push(obj);
        });
      }
    });
    this.service.invoke('get.flow.types', {streamId: this.streamId}).subscribe(
      res => {
        this.isSliderLoading = false;
        this.flowTypeList = res;
      }, err => {
        this.isSliderLoading = false;
        this.workflowService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_FETCH_FLOW_TYPES"));
      }
    );
  }

  setInputDet() {
    fromEvent(this.inpSearch.nativeElement, 'input')
    .pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged())
      .subscribe((val)=>{
        this.scrollSkip = 0;
        this.getCallLogsData(val);
      });
  }

  openDate() {
    this.picker.open();
  }


  durationCalc(dur: number) {
    // var startTime = resp.startedOn;
    // var endTime = resp.endedOn;
    // var duration = moment.duration(endTime.diff(startTime));
    var duration = moment.duration(dur);
    var hours = Math.trunc(duration.asHours());
    var minutes = Math.trunc(duration.asMinutes())%60;
    var seconds = Math.trunc(duration.asSeconds())%60;
    let diff;
    if(!hours) {
      if(!minutes) {
        if(!seconds) {
          diff = "0s"
        } else {
          diff = seconds + 's';
        }
      } else {
        diff = minutes+"m " + seconds+"s";
      }
    } else {
      diff = hours+"h " +  minutes+"m " + seconds+"s";
    }
    return diff;
  }

  openFilter() {
    this.isInsights = false;
    this.isFilter = true;
    this.drawer.openSlider('#drawer-slider', "right500");
  }

  closeDrawer() {
    this.drawer.closeSlider("#drawer-slider");
    this.filterForm.setValue({
      flowTSel: this.filter.flowType,
      dateForm: this.filter.datePeriod,//_.find(this.rangeList, {id: this.filter.datePeriod}).display,
      statusForm: this.filter.status,
      intentIdentified: this.filter.intent
    });
    if(this.selectedLog) {
      this.selectedLog.isActive = false;
    }
    this.isInsights = false;
    this.isFilter = false;
    this.selectedTabIndex = 0;
    if(this.templatesChatHistoryComponent && this.templatesChatHistoryComponent.wavesurfer){
      this.templatesChatHistoryComponent.wavesurfer.stop();
      this.templatesChatHistoryComponent.wavesurfer.unAll();
      this.templatesChatHistoryComponent.wavesurfer.destroy();
    }
  }

  getChatHistory(elem) {
    this.isLoading = true;
    this.isInProgress = true;
    const self = this;
    const msgIds = elem.messageId;
    this.messageId = elem.messageId[0];
    callHistory(msgIds[0], msgIds.length, 0);
    function callHistory(msgId, len, i) {
      const _params = {
        "msgId": msgId,//this.data.userId, //this.authService.getUserId(),
        "streamId": self.streamId,
        "dateFrom": self.filter.startDate.toISOString(),
        "dateTo": self.filter.endDate.toISOString()
      };
      self.service.invoke('get.callflow.chatHistory',_params)
      .subscribe(
        res => {     
          self.chatHistData.messages = self.chatHistData.messages.concat(res.messages);
          if(len == i+1) {
            self.isInProgress = false;
          } else {
            callHistory(msgIds[i+1], msgIds.length, i+1);
          }
          setTimeout(function(){
            if(document.getElementsByClassName('user-message active').length) { document.getElementsByClassName('user-message active')[0].scrollIntoView(); }
            if(document.getElementsByClassName('bot-message active').length) { document.getElementsByClassName('bot-message active')[0].scrollIntoView(); }
          });
        });
    }
  }

  scrollToActive() {
    setTimeout(function(){
      if(document.getElementsByClassName('user-message active')[0]) { document.getElementsByClassName('user-message active')[0].scrollIntoView(); }
    });
  }

  updateStatus(data) { 
    this.statusSelected = data.name;
  }

  updateFlowType(data) { 
    this.flowTypeSelected = data.name; 
  }

  applyFilter() {
    this.scrollSkip = 0;
    this.getCallLogsData(null, this.flow);
    this.closeDrawer();
  }

  openCalendar(e) {
    e.stopPropagation(); 
    this.isCustCalendar = true;
    setTimeout(()=>{
      this.picker.open(e);
    });
  }


  exportConverLogs() {
    let _params = { 'appId': this.workflowService.getCurrentBt()._id }
    this.isExporting = true;
    this.notificationService.notify(this.translate.instant("CONVERSATIONAL_LOGS.EXPORT_STARTED"), 'success');
    // let payload = {};
    let _payload = {
      "start": this.filter.startDate.toISOString(),
      "end": this.filter.endDate.toISOString(),
      "limit" : this.showLimit,
      "skip" : this.scrollSkip,
      "sort" : {"date":"desc"},  
      "status" : this.filter.status,
      "flowtype": this.filter.flowtype
    }
    this.service.invoke('post.converLogs.export', _params, _payload).subscribe(
      res=>{
        this.dockService.isAnyRecordInprogress$.next(true);
        this.dockService.getDockStatus('ANALYSE')
        .subscribe(res=>{ 
          _.extend(res.store,{toastSeen: true});
          this.isExporting = false;
          this.dockService.isAnyRecordInprogress$.next(false);
          let fileName = res.store.urlParams;
          this.dockService.updateProgress( _.pick(res, 'store'), res._id).pipe(pluck('fileId')).subscribe(res=>{
            this.notificationService.notify(this.translate.instant("CONVERSATIONAL_LOGS.EXPORT_COMPLETE"), 'success');
            this.dockService.downloadDockFile(res, fileName);
          })
        }, err=>{ 
          this.isExporting = false;
          this.workflowService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_GET_PR"));
        })
      }, err => {
        this.isExporting = false;
        this.workflowService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_EXPORT"));
      }
    );
  }


  sortData(event) {
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      if(event.direction == 'asc') {
        return a.startedOn > b.startedOn ? 1 : -1;
      } else {
        return a.startedOn < b.startedOn ? 1 : -1;
      }
    });
  }

  onReachEnd() {
    if(!this.isMoreAvailable) {
      return;
    }
    const _self = this;
    let _params = { 'appId': this.workflowService.getCurrentBt()._id }
    this.scrollSkip = this.scrollSkip + this.showLimit;
    let _payload = <any>{
      "start": this.filter.startDate,
      "end": this.filter.endDate,
      "limit" : this.showLimit,
      "skip" : this.scrollSkip,
      "sort" : {"date":"desc"},  
      "status" : this.filter.status,
      "intent": this.filterForm.value.intentIdentified,
      "flowtype": _.without(this.filter.flowType, 0)
    }
    this.service.invoke('post.callLogs.data', _params, _payload)
    .pipe(
      tap((res: any) => {
        _.map(res.data, (val)=>{
          val.startedOn = moment(val.startedOn);
          val.endedOn = moment(val.endedOn);
          return {...val, isActive: false}
        });
      }),
      finalize(()=>{ this.isLoading = false; }))
      .subscribe(
        (res: ResponseLogs) => {
          res.data.map(val => {
            val.flow = _.filter(val.flow, v =>  v == "voiceAgentTransferStart" || v == "agentTransferStart" || v == "chatAutomation" || v == "voiceAutomation");
            return val;
          });
          this.dataSource.data = [...this.dataSource.data, ...res.data];
          this.isMoreAvailable = res.hasMore;
          setTimeout(()=>{
            this.cdr.detectChanges();
          }, 100);
        }, err => {
          this.isCallLogs = false;
          this.workflowService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_LOAD_RESULTS"));
        });
    }

  getCallLogsData(phoneNumber?, flowType?: string) {
    const _self = this;
    let _params = { 'appId': _self.selectedApp._id || _self.selectedApp[0]._id }
    let findFT = this.filterFlowType.length?_.findWhere(this.filterFlowType, {name: this.flowTypeSelected}):"";
    this.filter.flowtype = findFT?findFT.id:'';
    this.filter.status = this.filterForm.value.statusForm;
    this.filter.flowType = this.filterForm.value.flowTSel;
    this.filter.intent = this.filterForm.value.intentIdentified;
    this.filter.datePeriod = this.filterForm.value.dateForm;
    let _payload = <any>{
      "start": this.filter.startDate,
      "end": this.filter.endDate,
      "limit" : this.showLimit,
      "skip" : this.scrollSkip,
      "sort" : {"date":"desc"},  
      "status" : this.filter.status,
      "intent": this.filterForm.value.intentIdentified,
      "flowtype": _.without(this.filter.flowType, 0)
    }
    if(phoneNumber) {
      _payload.phoneNumber = phoneNumber
    }
    if(this.isFromAnalytics) {
      _payload.flowtype = [flowType];
    }

    this.service.invoke('post.callLogs.data', _params, _payload)
    .pipe(
      tap((res: ResponseLogs) => {
        _.map(res.data, (val)=>{
          val.startedOn = moment(val.startedOn);
          val.endedOn = moment(val.endedOn);
          return {...val, isActive: false}
        });
      }),
      finalize(()=>{ this.isLoading = false; }))
      .subscribe(
        (res: ResponseLogs) => {
          this.isCallLogs = false;
          res.data.map(val => {
            val.flow = _.filter(val.flow, v =>  v == "voiceAgentTransferStart" || v == "agentTransferStart" || v == "chatAutomation" || v == "voiceAutomation");
            return val;
          });
          this.dataSource.data = res.data;
          this.isMoreAvailable = res.hasMore;
          setTimeout(()=>{
            _self.setInputDet();
            _self.dataSource.sort = _self.sort;
          }, 100);
        }, err => {
          this.isCallLogs = false;
          this.dataSource.data = [];
          this.workflowService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_FETCH_RESULTS"));
        });
    }

  openLogs(log: Logs) {
    this.selectedLog = log;
    this.isInsights = true; 
    this.drawer.closeSlider('#drawer-slider');
    log.isActive = true;
    const params = {
      streamId: this.streamId
    }
    const payload = {
      start: log.startedOn,
      end: log.endedOn,
      userId: log.userId
    }
    this.flowList = [];
    this.drawer.openSlider('#drawer-slider', "right500");
    this.chatHistData.messages = [];
    this.getChatHistory(log);
    this.service.invoke('post.flow.events',params, payload).subscribe(
      res=>{
        this.isInsights = true;
        this.isSliderLoading = false;
        _.each(res, val => { 
          if(_.pairs(val)[0][1].length) {
            this.flowList.push(_.pairs(val)[0]);
          }
        });
        setTimeout(()=>{
          this.tabGp.realignInkBar();
        }, 500);
      }, err =>{
        this.isSliderLoading = false;
        this.isInsights = true;
        this.workflowService.showError(err, this.translate.instant("CONVERSATIONAL_LOGS.FAILED_FETCH_RESULTS"));
      }
    )
  }


  isInvalidDate = (m: Moment) => {
    return m.isBefore(moment().subtract(90, 'days')) || m.isAfter(moment());
  }

  onDateSelect(event) {
    if(event.value == 'today') {
      this.filter.startDate = moment().startOf('day');
      this.filter.endDate = moment();
    } else if(event.value == 'yesterday') {
      this.filter.startDate = moment().subtract({ days: 1 }).startOf('day');
      this.filter.endDate = moment().subtract({ days: 1 }).endOf('day');
    } else if(event.value == 'seven') {
      this.filter.startDate = moment().subtract({ days: 6 }).startOf('day');
      this.filter.endDate = moment();
    } else if(event.value == 'twoEight') {
      this.filter.startDate = moment().subtract({ days: 27 }).startOf('day');
      this.filter.endDate = moment();
    } else if(event.value == 'ninety') {
      this.filter.startDate = moment().subtract({ days: 89 }).startOf('day');
      this.filter.endDate = moment();
    }
  
    this.fromDate = this.filter.startDate.format('Do MMM YYYY');
    this.toDate = this.filter.endDate.format('Do MMM YYYY');
  }

  receiveMessage($event) {
    var rangeSelect = $event;
    this.isCustCalendar = false;
    this.filter.startDate = moment(rangeSelect.startDate).startOf('day');
    this.filter.endDate = moment(rangeSelect.endDate).endOf('day');
    this.fromDate = this.filter.startDate.format('Do MMM YYYY');
    this.toDate = this.filter.endDate.format('Do MMM YYYY');
    this.filterForm.get('dateForm').patchValue('Custom');
  }

  startDateClicked($event) {
    // this.calendarFromDate = moment($event.startDate._d).format('Do MMM YYYY');
  }
  endDateClicked($event) {
    // this.calendarToDate = moment($event.endDate._d).format('Do MMM YYYY');
  }

  tosslePerOne(all){ 
    if (this.allSelected.selected) {  
      this.allSelected.deselect();
      return false;
    }
    if(this.filterForm.controls.flowTSel.value.length==this.filterFlowType.length) {
      this.allSelected.select();
    }
  }
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.filterForm.controls.flowTSel
        .patchValue([...this.filterFlowType.map(item => item.id), 0]);
    } else {
      this.filterForm.controls.flowTSel.patchValue([]);
    }
  }

  onCloseCDR(){
    this.closeCDR.emit();
  }

  resetFilters(){
    this.scrollSkip = 0;
    this.filterForm.reset();
    this.filterForm = this.fb.group({
      flowTSel: new FormControl([]),
      dateForm: new FormControl('seven'),
      statusForm: new FormControl(''),
      intentIdentified: new FormControl('')
    });
    
    this.filter = {
      startDate: moment().subtract({days: 7}),
      endDate: moment(),
      status: '',
      flowtype: '',
      datePeriod: '',
      intent: '',
      flowType: ''
    };
    this.fromDate = this.filter.startDate.format('Do MMM YYYY');
    this.toDate = this.filter.endDate.format('Do MMM YYYY');
    this.getCallLogsData(null, this.flow);
    this.closeDrawer();
  }

  downloadAudioRecording(event, rowData){
    event.stopPropagation();
    if(rowData && rowData.scId){
      this.service.invoke('get.conversation.callrecoding', {streamId: this.streamId, recordingId: rowData.scId}).subscribe(
        res => {
            if(res && res.recording){
              console.log("bot name",this.workflowService.getCurrentBt(), rowData);
              let fileName = this.workflowService.getCurrentBt().name+"_"+rowData.phoneNumber+"_"+rowData.startedOn.format('Do MMM, YYYY')+".mp3";
              let a = document.createElement('a');
              a['href'] = res.recording;
              a['download'] = fileName;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }else{
              this.notificationService.notify(this.translate.instant("CONVERSATIONAL_LOGS.NO_AUDIO_RECORD_DOWNLOAD"),"warning");
            }
        }, err => {
          this.notificationService.showError(err);
        }
      );
    }
  }

}
