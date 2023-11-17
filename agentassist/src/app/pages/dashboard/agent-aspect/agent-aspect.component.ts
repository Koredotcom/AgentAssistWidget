import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, Renderer2, SimpleChange, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { DashboardService } from '../dashboard.service';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { finalize, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-agent-aspect',
  templateUrl: './agent-aspect.component.html',
  styleUrls: ['./agent-aspect.component.scss']
})
export class AgentAspectComponent implements OnInit, AfterViewInit {

  @ViewChild('wordCloud') wordCloudDiv: ElementRef;
  @ViewChild('wordCloudExhaustive') wordCloudExhaustiveDiv : ElementRef;
  @Output() openSliderChild = new EventEmitter();


  @Input() viewType : string;
  @Input() filters : IDashboardFilter;
  @Input() widgetData : any;

  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;

  wordCloudOptions: any;
  wordCloudChart: any;
  agentAspectData : any = {};
  agentAspectTableData : any = [];
  agentAspectPartialTableData: any = []
  onChangeCall : boolean = false;
  params ={
    streamId : ''
  };
  payload: any = {
    "startDate": "",
    "endDate":"",
    "experience" : "",  // chat or voice
    "skip":0,  // pages to skip (default 0)
    "limit":3, // number of record to be fetched
    "fetched":0  // count of previously fetched responses (default 0)
  }

  isLoading: boolean = false;
  hasMore: boolean = false;
  skip = 0
  limit = 30;
  fetched = 0;


  constructor(public dashboardService: DashboardService, private cdr: ChangeDetectorRef,
    private renderer : Renderer2, private service : ServiceInvokerService, private authService: AuthService, private zone : NgZone, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    // this.updateAgentAspectData();
  }

  ngOnChanges(changes : any){
    if( changes.viewType || changes.filters || !this.onChangeCall) {
      this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
      this.payload = {... this.filters}
      this.handleOnChangeCall()
      this.updateAgentAspectData();
    }
    // if(this.viewType && this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall ){
    //   this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
    //   this.payload = {... this.filters}
    //   this.handleOnChangeCall()
    //   this.updateAgentAspectData();
    // }
  }

  handleOnChangeCall(){
    this.onChangeCall = true;
    setTimeout(() => {
      this.onChangeCall = false;
    }, 10);
  }

  ngAfterViewInit() {
    this.wordCloudChart = '';
    this.initializeDefaultValues();
    // this.setWordCloudOptions();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.wordCloudChart?.resize();
  }

  initializeDefaultValues(){
    if(this.viewType == this.VIEWTYPELIST.PARTIAL_VIEW){
      this.wordCloudChart = echarts.init(this.wordCloudDiv.nativeElement);
    }else{
      this.wordCloudChart = echarts.init(this.wordCloudExhaustiveDiv.nativeElement);
    }
    this.cdr.detectChanges();
  }

  setWordCloudOptions(data) {
    this.wordCloudOptions = this.dashboardService.getWordCloudOptions(data);
    setTimeout(() => {
      this.wordCloudChart.resize();
      this.wordCloudChart.setOption(this.wordCloudOptions);
    }, 500);
  } 

  updateAgentAspectData(){
    if(this.viewType == VIEWTYPE.EXHAUSTIVE_VIEW && this.widgetData){
      // let this = this;
      this.isLoading = true;
      this.cdRef.detectChanges();
      let botId = this.dashboardService.getSelectedBotDetails()._id;
      let params: any = {
        streamId :botId,
      };
      let body: any = {
        limit: this.limit,
        skip: this.skip,
        fetched: this.fetched
      }
      body = {...body, ... this.payload}
      this.service.invoke('agentsLookingfor', params, body).pipe(finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })).subscribe(data => {
        if (data) {
          this.skip = this.skip+1;
          this.hasMore = data.hasMore;
          this.fetched = data.fetched;
          this.updateViewData(data);
          // this.agentAspectTableData.push(...data.actualData);
          this.cdRef.detectChanges();
        }
      });
  } else{
      // this.dashboardService.getAgentAspectData().subscribe((data : any) => {
      //   if(data){
      //     this.updateViewData(data);
      //   }
      // })
      

      this.service.invoke('agentsLookingfor', this.params, this.payload).subscribe((data : any) => {
        this.updateViewData(data);
      });
    }
  }

  updateViewData(data){
    
    if(data.actualData && data.actualData.length > 0){
      this.agentAspectData = {...this.agentAspectData, ...data};
      this.formatWorldCloudData(data.actualData);
      if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
        this.agentAspectPartialTableData = data.actualData.length <= 3 ? data.actualData : data.actualData.slice(0,3);
      }else {
        console.log(this.agentAspectTableData, data.actualData);
        this.agentAspectTableData.push(...data.actualData);
        // this.agentAspectTableData = data.actualData;
      }
    }
  }

  formatWorldCloudData(agentAspectTableData){
    let worldCloudData : any = [];
    for(let data of agentAspectTableData){
      let obj : any = {
        name : data.input,
        value : data.count
      };
      worldCloudData.push(obj);
    }
    worldCloudData[0].textStyle = {
      normal: {
        color: 'black'
      },
      emphasis: {
        color: 'blue'
      }
    }
    this.setWordCloudOptions(worldCloudData);
  }

  openSlider(componentName){
    this.openSliderChild.emit({componentName : componentName, data : this.agentAspectData});
  }

  onReachEnd(event){
    if(!this.isLoading && this.hasMore && event.target.scrollTop > 0){
      // this.zone.run(()=>{
        this.updateAgentAspectData();
      // })
    }
  }

}
