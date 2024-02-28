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
  }

  setSentimentAnalysisOption() {
    let chartData = this.chartOption.series[0].data;
    if(this.commonService.realtimeSentiData[this.connectionDetails.conversationId]?.length > 0){
      let polaritySum = 0;
      this.commonService.realtimeSentiData[this.connectionDetails.conversationId].forEach(ele =>{
        polaritySum += ele;
      })
      let average = polaritySum/this.commonService.realtimeSentiData[this.connectionDetails.conversationId].length;
      chartData.push([chartData.length, average]);
      this.updatePolarity(average);
    }
    

    this.mergeSentiOptions = {
      series: [
        {
          data: chartData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2
          },
          markPoint: {
            animation: false,
            symbol: 'circle',
            data: [
              { 
                xAxis: chartData[chartData.length-1][0], 
                yAxis: chartData[chartData.length-1][1],
                symbolSize: 10
              }
            ]
          }
        }
      ]
    }
    this.showSentiChart = true;
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
