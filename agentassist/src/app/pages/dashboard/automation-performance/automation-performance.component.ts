import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardService } from '../dashboard.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-automation-performance',
  templateUrl: './automation-performance.component.html',
  styleUrls: ['./automation-performance.component.scss']
})
export class AutomationPerformanceComponent implements OnInit {

  chartOption: EChartOption;
  automationPerformanceChartData : any = [];

  constructor(public dashboardService : DashboardService, private decimalPipe : DecimalPipe, private service : ServiceInvokerService) { }

  ngOnInit(): void {
    this.updateAutomationPerformanceData();
  }

  updateAutomationPerformanceData(){
    let payload = {
      "startTime": " ",
      "endTime":" ",
      "experience" : " "  // CHAT OR VOICE
    }

    let params = {
      streamId : ""
    }

    this.service.invoke('automationPerformance', params, payload).subscribe((data : any) => {
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
          console.log(params, 'params');

          let tooltipString  = '';
          // let tooltipSeriesList = this.dashboardService.formatterData[params.data.name];
          tooltipString = tooltipString + `<div class="automation-per-tooltip">
            <div class="title-indication">
              <div class="left-title">
                <span class="bg"></span>
                <span class="h-text">${params.data.name}</span>
              </div>
              <div class="right-title">${this.decimalPipe.transform(params.data.percent,'2.2-2')}%</div>
            </div>
            <div class="lable-heading">TOP 3</div>`
            for(let item of params.data.series){
              tooltipString = tooltipString +  `<div class="row-labels">
              <div class="left-title">${item.key}</div>
              <div class="right-title">${item.value}%</div>
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
