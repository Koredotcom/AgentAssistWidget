import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';
import { DashboardService } from '../dashboard.service';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';

@Component({
  selector: 'app-agent-aspect',
  templateUrl: './agent-aspect.component.html',
  styleUrls: ['./agent-aspect.component.scss']
})
export class AgentAspectComponent implements OnInit, AfterViewInit {

  @ViewChild('wordCloud') wordCloudDiv: ElementRef;
  @ViewChild('wordCloudExhaustive') wordCloudExhaustiveDiv : ElementRef;

  @Input() viewType : string;
  public DASHBORADCOMPONENTTYPELIST = DASHBORADCOMPONENTTYPE;
  public VIEWTYPELIST = VIEWTYPE;

  wordCloudOptions: any;
  wordCloudChart: any;
  agentAspectData : any;
  agentAspectTableData : any = [];


  constructor(public dashboardService: DashboardService, private cdr: ChangeDetectorRef,
    private renderer : Renderer2) { }

  ngOnInit(): void {
    console.log(this.viewType, this.dashboardService.agentAspectView, "view type and agent aspect vie3w");
    this.updateAgentAspectData();
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
    this.dashboardService.getAgentAspectData().subscribe(data => {
      console.log(data, "inside agent aspect data");
      if(data){
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
    })
  }

  formatWorldCloudData(agentAspectTableData){
    let worldCloudData : any = [];
    for(let data of agentAspectTableData){
      let obj : any = {
        name : data.intentName,
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
  
}
