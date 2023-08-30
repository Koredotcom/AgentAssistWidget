import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, SimpleChange, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { DashboardService } from '../dashboard.service';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';

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
  agentAspectData : any;
  agentAspectTableData : any = [];
  onChangeCall : boolean = false;


  constructor(public dashboardService: DashboardService, private cdr: ChangeDetectorRef,
    private renderer : Renderer2) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChange){    
    if(this.viewType && this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall ){        
      this.handleOnChangeCall()
      this.updateAgentAspectData();
    }
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
    this.wordCloudChart.resize();
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
      this.updateViewData(this.widgetData);
    }else{      
      this.dashboardService.getAgentAspectData().subscribe((data : any) => {
        if(data){
          this.updateViewData(data);
        } 
      })
    }
  }

  updateViewData(data){
    this.agentAspectData = data;
    if(data.actualData && data.actualData.length > 0){
      this.formatWorldCloudData(data.actualData);
      if(this.viewType == VIEWTYPE.PARTIAL_VIEW){
        this.agentAspectTableData = data.actualData.length <= 3 ? data.actualData : data.actualData.slice(0,3);
      }else {
        this.agentAspectTableData = data.actualData;
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

}
