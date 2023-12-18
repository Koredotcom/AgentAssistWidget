import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { coachingConst } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sentiment-score',
  templateUrl: './sentiment-score.component.html',
  styleUrls: ['./sentiment-score.component.scss']
})
export class SentimentScoreComponent {


  connectionDetails: any = {};
  subs = new SubSink();
  coachingConst : any = coachingConst;

  chartOption: EChartsOption = {};
  initChartOption : EChartsOption = {};
  showFullSentiChart : boolean = false;
  sentiObject : any = coachingConst.SENTI_CHART_YAXIS_LIST;
  showSentiChart : boolean = false;
  mergeSentiOptions : any = {};
  currentPolarity : string;
  

  constructor(private rootService : RootService, private commonService : CommonService,
    private websocketService : WebSocketService){
  }

  ngOnInit(){

    // setInterval(() => {
    //   let object: any = {
    //     "botId": "st-6e32a4bb-3b5f-558d-9a88-a824a39a0334",
    //     "event": "realtime_sentiment_response",
    //     "conversationId": "CH10de3ef1dcc14b66b0f65e56be9aa740",
    //     "sentiment": { "label": "dissatisfied", "coarse": "negative", "polarity": 3, "text": "fuckoff", "timestamp": 1687876568281 },
    //     "messageId": "1687876568271",
    //     "isPrompt": false
    //   }
    //   object.sentiment.polarity = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    //   this.handleRealtimeSentiResponse(object.sentiment);
    // }, 1000)

    this.subscribeEvents();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }


  ngAfterViewInit() {
    this.setRealtimeIntialOptions();
  }

  subscribeEvents(){
    this.subs.sink = this.rootService.socketConnection$.subscribe(res => {
      if (res) {
        this.connectionDetails = this.rootService.getConnectionDetails();
      }
    });

    this.subs.sink = this.websocketService.realtimeSentimeResponse$.subscribe((data)=> {
      if(data && data.sentiment){
        this.handleRealtimeSentiResponse(data.sentiment);
      }
    });
  }


  handleRealtimeSentiResponse(data){
    if(!this.commonService.realtimeSentiData[this.connectionDetails.conversationId]){
      this.commonService.realtimeSentiData[this.connectionDetails.conversationId] = [];
    }
    let polarity = coachingConst.SENTI_POLARITY_MAP[data?.polarity];
    if(data?.polarity > 0 && data?.polarity <=10){
      this.commonService.realtimeSentiData[this.connectionDetails.conversationId].push(polarity);
      this.formatRealtimeSentiChartData();
    }
  }

  formatRealtimeSentiChartData(){
    this.setSentimentAnalysisOption();
  }

  toggleSentiChart(){
    this.showFullSentiChart = !this.showFullSentiChart;
    this.setSentimentAnalysisOption(true)
  }

  setSentimentAnalysisOption(flag = false) {
    let chartData =  this.initChartOption?.series[0]?.data ;
    let xAxisData =  this.initChartOption?.xAxis['data'];

    let fullChartData = this.chartOption?.series[0]?.data;
    let fullxAxisData = this.chartOption?.xAxis['data'];
    
    if(!flag){
      let previousData  = this.commonService.realtimeSentiData[this.connectionDetails.conversationId]
      if(previousData?.length > 0){
        let polaritySum = 0;
        previousData.forEach(ele =>{
          polaritySum += ele;
        });
        let average = 0;
        if(previousData?.length){
          average = parseFloat((polaritySum/previousData?.length).toFixed(2));
        }
        if(average == 0){
          chartData.push(-0.1);
          fullChartData.push(-0.1);
        }else{
          chartData.push(average);
          fullChartData.push(average);
        }

        if(chartData.length > 10){
          xAxisData.push(chartData.length);
        } 
        if(fullChartData.length > 100){
          fullxAxisData.push(chartData.length);
        }
        this.updatePolarity(average);
      }
    }

    this.mergeSentiOptions = {
      xAxis : {
        data : this.showFullSentiChart ? fullxAxisData : xAxisData
      },
      series: [
        {
          data: this.showFullSentiChart ? fullChartData : chartData,
          type: 'bar',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          }
        }
      ]
    }
    this.showSentiChart = true;
    // console.log(chartData, "chartData");
    
  }

  updatePolarity(avg){
    let polarityStr = '';
    if(avg > 0){
      polarityStr = 'Positive'
    }else if(avg == 0 || avg >= -0.25){
      polarityStr = 'Neutral'
    }else if(avg < -0.25){
      polarityStr = 'Negative'
    }
    this.currentPolarity = polarityStr;
  }

  setRealtimeIntialOptions(){
    this.chartOption = this.commonService.getSentiAnalysisChartOptions(this.sentiObject);
    this.initChartOption = this.commonService.getInitialSentiChartOptions(this.sentiObject);
  }
}
