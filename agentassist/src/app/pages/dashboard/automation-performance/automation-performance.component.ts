import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-automation-performance',
  templateUrl: './automation-performance.component.html',
  styleUrls: ['./automation-performance.component.scss']
})
export class AutomationPerformanceComponent implements OnInit {

  chartOption: EChartOption;
  automationPerformanceChartData : any = [];

  constructor(public dashboardService : DashboardService) { }

  ngOnInit(): void {
    this.updateAutomationPerformanceData();
  }

  updateAutomationPerformanceData(){
    this.dashboardService.getAutomationPerformanceData().subscribe((data : any) => {
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

    })
  }
  
  setDonutChartOptions(chartData) {
    this.chartOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        textStyle : {
          color : '#000',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: 15,
        },
        formatter : (params : any) => {
          let tooltipString  = params.marker  + ' ' + params.data.name  + " : " + params.data.percent + "%" + '</br>';
          // let tooltipSeriesList = this.dashboardService.formatterData[params.data.name];
          tooltipString = tooltipString + `<div class="automation-per-tooltip">
            <div class="title-indication">
              <div class="left-title">
                <span class="bg"></span>
                <span class="h-text">Terminated</span>
              </div>
              <div class="right-title">25%</div>
            </div>
            <div class="lable-heading">TOP 3</div>
            <div class="row-labels">
              <div class="left-title">Book Flight</div>
              <div class="right-title">33%</div>
            </div>
            <div class="row-labels">
              <div class="left-title">Reschedule</div>
              <div class="right-title">32%</div>
            </div>
            <div class="row-labels">
              <div class="left-title">Cancel</div>
              <div class="right-title">31%</div>
            </div>
            <div class="row-labels">
              <div class="left-title">Others</div>
              <div class="right-title">04%</div>
            </div>
          </div>`
          // for(let item of params.data.series){
          //   tooltipString = tooltipString + `<div style="display:flex;
          //    align-items:center;
          //    justify-content:space-between;">`
          //   tooltipString += `<span style = "
          //   font-weight: 400;
          //   font-size: 12px;
          //   line-height: 5px;
          //   color: #121314;
          //   width: 65%;
          //   padding-left: 17px;">` + item.key + `</span>`;
          //   tooltipString += `<span style="
          //   font-weight: 400;
          //   font-size: 12px;
          //   line-height: 5px;
          //   color: #121314;
          //   width: 35%;
          //   text-align: right;">` + item.value + "%" + `</span></div>` + "</br>"
          // } 
          return tooltipString
        }
      },
      // legend: {
      //   orient: 'vertical',
      //   top: 'center',
      //   left: 400,
      //   icon: 'circle',
      //   textStyle: {
      //     fontSize: 15,
      //   },
      //   formatter:function (name) {
      //     let itemValue = chartData.filter(item => item.name === name);
      //     let returnString = `${name}`;
      //     let emptySpaceCount = 'successfully completed '.length - name.length;          
      //     for(let i=0; i<=emptySpaceCount; i++){
      //       returnString = returnString + '  ';
      //     }
      //     returnString += `${itemValue[0].value}` + ' | ' + `${itemValue[0].percent}%`;
      //     return returnString;
      //   }
      // },
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
