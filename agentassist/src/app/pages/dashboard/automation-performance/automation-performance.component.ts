import { DecimalPipe } from '@angular/common';
import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardService } from '../dashboard.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { AuthService } from '@kore.services/auth.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-automation-performance',
  templateUrl: './automation-performance.component.html',
  styleUrls: ['./automation-performance.component.scss']
})
export class AutomationPerformanceComponent implements OnInit {

  chartOption: EChartOption;
  @Input() filters : IDashboardFilter;
  @Input() viewType : string;
  onChangeCall : boolean = false;
  automationPerformanceChartData : any = [];
  payload: any = {
    "startDate": " ",
    "endDate":" ",
    "experience" : " "  // CHAT OR VOICE
  }

  params ={
    streamId : ''
  };

  subs = new SubSink();

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;

  constructor(public dashboardService : DashboardService, private decimalPipe : DecimalPipe, private service : ServiceInvokerService, private authService : AuthService) { }

  ngOnInit(): void {
    this.params.streamId = this.authService.smartAssistBots[0]._id;
    this.subscribeEvents();
    // this.updateAutomationPerformanceData();
  }

  ngOnChanges(changes : any){
    if(changes.filters) {
      this.params.streamId = this.filters?.botId !== '' ? this.filters.botId : this.params.streamId;
      this.payload = {...this.filters}
      this.updateAutomationPerformanceData();
    }
    // if( this.filters && Object.keys(this.filters).length > 0 && !this.onChangeCall){
    //   this.params.streamId = this.filters?.botId !== '' ? this.filters.botId : this.params.streamId;
    //   this.payload = {...this.filters}
    //   this.updateAutomationPerformanceData();
    // }
  }

  subscribeEvents(){
    this.subs.sink = this.dashboardService.getDashboardFilterUpdated().subscribe((filters : any) => {
      if(filters && Object.keys(filters).length > 0){
        this.payload = Object.assign({}, filters);
        this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
        this.updateAutomationPerformanceData();
      }
    });
  }

  updateAutomationPerformanceData(){
    this.service.invoke('automationPerformance', this.params, this.payload).subscribe((data : any) => {
      this.automationPerformanceChartData = [];
      let colorObj : any = {
        "Successfully Completed" : '#47B39C',
        "Terminated" : "#FFC154",
        "Error" : '#EC6B56',
        "Other" : '#003F5C'
      }
      if(data && data.actualData){
        for(let automation of data.actualData){
          let obj : any = {
            name : automation.name,
            value : automation.count,
            percent : automation.percent,
            series : automation.seriesData,
            total : data.total,
            itemStyle : {
              color : colorObj[automation.name]
            }
          }
          this.automationPerformanceChartData.push(obj);
        }
      }
      this.setDonutChartOptions(this.automationPerformanceChartData);
    });
    // this.dashboardService.getAutomationPerformanceData().subscribe((data : any) => {
    //   this.automationPerformanceChartData = [];
    //   let colorObj : any = {
    //     "Successfully Completed" : '#47B39C',
    //     "Terminated" : "#FFC154",
    //     "Error" : '#EC6B56',
    //     "Other" : '#003F5C'
    //   }
    //   if(data && data.actualData){
    //     for(let automation of data.actualData){
    //       let obj : any = {
    //         name : automation.name,
    //         value : automation.count,
    //         percent : automation.percent,
    //         series : automation.seriesData,
    //         total : data.total,
    //         itemStyle : {
    //           color : colorObj[automation.name]
    //         }
    //       }
    //       this.automationPerformanceChartData.push(obj);
    //     }
    //   }
    //   this.setDonutChartOptions(this.automationPerformanceChartData);

    // })


  }

  setDonutChartOptions(chartData) {
    this.chartOption = {
      tooltip: {
        position : 'right',
        trigger: 'item',
        backgroundColor: '#fff',
        textStyle : {
          color : '#000',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: 15,
        },
        formatter : (params : any) => {
          let tooltipString  = '';
          // let tooltipSeriesList = this.dashboardService.formatterData[params.data.name];
          tooltipString = tooltipString + `<div class="automation-per-tooltip">
            <div class="title-indication">
              <div class="left-title">`
              +
                `<span class="bg" style="background:`+params.color+`"></span>
                 <span class="h-text">${params.data?.name}</span>`
              + 
              `
              </div>
              <div class="right-title">${this.decimalPipe.transform((params.data?.percent ? params.data?.percent : '0'),'1.1-1')}%</div>
            </div>
            <div class="lable-heading">TOP 3</div>`
            for(let item of params.data?.series){
              tooltipString = tooltipString +  `<div class="row-labels">
              <div class="left-title">${item.key}</div>
              <div class="right-title">${this.decimalPipe.transform(((item.value * 100) / params.data?.value), '1.1-1')}%</div>
            </div>`
            }

          return tooltipString
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          label: {
            color: '#000',
            fontSize: 25,
            position: 'center',
            formatter: () => {
              // let returnString = `<div>Total</div>` + `<span>${chartData[0].total}</span>`
              return `Total\n` + chartData[0].total; // Use sum variable here
              // return returnString;
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
          center: ['30%', '50%']
        }
      ]
    };
  }


}
