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
  
  subs = new SubSink();

  exhaustiveView : boolean = true;
  partialView : boolean = true;
  wordCloudOptions: any;
  wordCloudChart: any;

  constructor(public dashboardService: DashboardService, private cdr: ChangeDetectorRef,
    private renderer : Renderer2) { }

  ngOnInit(): void {
    console.log("ng onit inside aspect ", this.viewType);
  }

  ngAfterViewInit() {
    this.wordCloudChart = ''; 
    this.initializeDefaultValues();
    this.setWordCloudOptions();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.wordCloudChart.resize();
  }

  initializeDefaultValues(){
    if(this.viewType == this.VIEWTYPELIST.PARTIAL_VIEW){
      this.partialView = true;
      this.exhaustiveView = false;
      this.wordCloudChart = echarts.init(this.wordCloudDiv.nativeElement);
    }else{
      this.exhaustiveView = true;
      this.partialView = false;
      this.wordCloudChart = echarts.init(this.wordCloudExhaustiveDiv.nativeElement);
    }
    this.cdr.detectChanges();
  }

  setWordCloudOptions() { 
    this.wordCloudOptions = this.dashboardService.getWordCloudOptions();
    setTimeout(() => {
      this.wordCloudChart.resize();
      this.wordCloudChart.setOption(this.wordCloudOptions);
    }, 500);
  }

  
}
