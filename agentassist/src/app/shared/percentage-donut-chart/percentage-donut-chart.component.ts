import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-percentage-donut-chart',
  templateUrl: './percentage-donut-chart.component.html',
  styleUrls: ['./percentage-donut-chart.component.scss']
})
export class PercentageDonutChartComponent implements OnInit, OnChanges {

  option: EChartOption;
  data: any[];
  @Input() value: number = 0;
  @Input() isActive: boolean = false;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.setOptions();
  }

  setOptions() {
    this.data = [
      { value: this.value, name: 'A', itemStyle: { color: this.isActive ? '#A6DCE1' : '#009DAB' } },
      { value: (100 - this.value), name: 'B', itemStyle: { color: this.isActive ? '#ffffff' : '#E5E8EC' } },
    ];
    this.option = {
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      series: [
        {
          name: 'Series 1',
          type: 'pie',
          radius: ['50%', '70%'],
          silent: true,
          startAngle: 70,
          label: {
            color: '#26344A',
            fontSize: 10,
            fontFamily: 'Lato',
            position: 'center',
            formatter: () => {
              return parseInt(this.data[0].value) ? this.data[0].value + '%' : '';
            },
          },
          labelLine: {
            show: false,
          },
          data: this.data,
        },
      ],
    };
  }

}
