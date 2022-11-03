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

  constructor(public dashboardService : DashboardService) { }

  ngOnInit(): void {
    this.setDonutChartOptions();
  }
  
  setDonutChartOptions() {
    this.chartOption = {
      tooltip: {
        trigger: 'item',
        formatter : (params : any) => {
          let tooltipString  = params.data.name + ":" + params.percent + "%" + '</br>';
          let tooltipSeriesList = this.dashboardService.formatterData[params.data.name];
          for(let item of tooltipSeriesList){
            tooltipString += item.key + ":" + item.value + "%" + "</br>";
          } 
          return tooltipString
        }
      },
      legend: {
        orient: 'vertical',
        top: 'center',
        left: 580,
        icon: 'circle'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: true,
          label: {
            color: '#000',
            fontSize: 40,
            position: 'center',
            formatter: () => {
              return 'Total'; // Use sum variable here
            },
          },
          labelLine: {
            show: false,
          },

          data: [
            { value: 7000, name: 'Successfully Completed', itemStyle: { color: '#47B39C' } },
            { value: 2500, name: 'Terminated', itemStyle: { color: '#FFC154' } },
            { value: 500, name: 'Error', itemStyle: { color: '#EC6B56' } },
            { value: 500, name: 'Other', itemStyle: { color: '#003F5C' } }
          ]
        }
      ]
    };
  }


}
