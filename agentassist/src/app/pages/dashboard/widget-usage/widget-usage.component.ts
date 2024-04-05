import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import * as moment from 'moment';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-widget-usage',
  templateUrl: './widget-usage.component.html',
  styleUrls: ['./widget-usage.component.scss']
})
export class WidgetUsageComponent implements OnInit {

  @Input() filters: IDashboardFilter;
  
  chartOptions : any = {};
  params ={
    streamId : ''
  };
  payload: any = {
    "startDate": "",
    "endDate":"",
    "experience" : ""  // chat or voice
  }
  showCompare : boolean = false;
  currentData : any = [];
  previousData : any = [];

  constructor(private dashboardService : DashboardService, private authService : AuthService) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
   
  }

  ngOnChanges(changes : any) {
    if(changes.filters) {
      this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
      this.payload = {... this.filters}
      this.getWidgetUsageData();
    }
    // if (this.viewType && this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall) {
    // }
  }

  getWidgetUsageData() {
    
    let currentData = [
      {
          "intervalAverage": 2,
          "time": "2024-04-01T09:30:00.000Z"
      },
      {
          "intervalAverage": 2,
          "time": "2024-04-01T10:30:00.000Z"
      },
      {
          "intervalAverage": 1,
          "time": "2024-04-01T13:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T18:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T19:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T20:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T21:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T22:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T23:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T00:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T01:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T02:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T03:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T04:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T05:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T06:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T07:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T08:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T11:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T12:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T14:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T15:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T16:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T17:30:00.000Z"
      }
    ]

    let previousData =  [
      {
          "intervalAverage": 10,
          "time": "2024-04-01T09:30:00.000Z"
      },
      {
          "intervalAverage": 12,
          "time": "2024-04-01T10:30:00.000Z"
      },
      {
          "intervalAverage": 1,
          "time": "2024-04-01T13:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T18:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T19:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T20:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T21:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T22:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-03T23:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T00:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T01:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T02:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T03:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T04:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T05:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T06:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T07:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T08:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T11:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T12:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T14:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T15:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T16:30:00.000Z"
      },
      {
          "intervalAverage": 0,
          "time": "2024-04-04T17:30:00.000Z"
      }
    ]
    let seriesData = [];
    let startDate = new Date(this.payload.startDate);
    let endDate = new Date(this.payload.endDate);
    let timeDifference = endDate.getTime() - startDate.getTime();
    let hoursDifference = timeDifference / (1000 * 60 * 60);
    let type = hoursDifference <= 36 ? 'hour' : 'day';

    let currentAxisData = this.fetchAxisData(currentData, type);
    seriesData.push({
      name : 'Current',
      data: currentAxisData.intervalAverage,
      type: 'line',
      color : '#E267AC'
    })

    if(this.showCompare){
      let previousAxisData = this.fetchAxisData(previousData, type);
      seriesData.push({
        name : 'Previous',
        data: previousAxisData.intervalAverage,
        type: 'line',
        color : '#F59E0B'
      })
    }
    this.getChartOptions(currentAxisData.days, seriesData);
  }

  fetchAxisData(data, type){
    let days = [];
    if (type == 'day') {
      days = data?.map(date => moment(date.time).format('Do MMM'));
    } else {
      days = data?.map(date => moment(date.time).format('hh a'));
    }
    let intervalAverage = data?.map(data => data.intervalAverage);
    return ({days, intervalAverage})
  }

  getChartOptions(days, data){
    this.chartOptions = {
      xAxis: {
        type: 'category',
        data: days,
        axisTick: {
          alignWithLabel: true
        }
      },
      legend: {
        data: ['Current', 'Previous'],
        bottom :10,
        itemStyle: {
          type: 'plain',
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#333'
      }
      },
      yAxis: {
        type: 'value'
      },
      series: data
    };
    this.chartOptions = {...this.chartOptions}
  }
  

  // addZerosValForBarGraphData(overviewResponse) {
  //   let overviewQueueData = overviewResponse.data;
  //   let dateType = overviewResponse?.aggregationType;
  //   let dateList = [];
  //   if (overviewResponse?.aggregationType == 'day') {
  //     dateList = overviewResponse.data?.map(date => moment(date.time).format('Do MMM').toString());
  //   } else {
  //     dateList = overviewResponse.data?.map(date => moment(date.time).format('hh a').toString());
  //   }
  //   let currDate = moment(this.payload.startDate).startOf('day');
  //   let lastDate = moment(this.payload.endDate).endOf('day');
  //   console.log(currDate, "curr date", lastDate , "last date ******");
  //   console.log(this.payload, "overview payload");
    
  //   while (currDate.diff(lastDate) < 0) {
  //     let avalDate;
  //     if (dateType == 'day') {
  //       avalDate = moment(currDate).format('Do MMM').toString();
  //     } else {
  //       avalDate = moment(currDate).format('hh a').toString();
  //     }

  //     if (dateList.indexOf(avalDate) == -1) {
  //       let data = {
  //         "noOfConversations": 0,
  //         "time": currDate.toISOString()
  //       };
  //       overviewQueueData.push(data);
  //     }
  //     currDate.add(1, dateType);
  //   }
  //   overviewQueueData = overviewQueueData.sort(function (a, b) {
  //     return moment(a.time).diff(b.time);
  //   });
  //   console.log(overviewQueueData, "over view queue data");
    
  //   return overviewQueueData;
  // }

  changeSlider(){
    this.showCompare = !this.showCompare;
    this.getWidgetUsageData();
  }

}
