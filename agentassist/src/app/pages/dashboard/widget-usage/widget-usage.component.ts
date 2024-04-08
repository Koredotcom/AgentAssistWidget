import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-widget-usage',
    templateUrl: './widget-usage.component.html',
    styleUrls: ['./widget-usage.component.scss']
})
export class WidgetUsageComponent implements OnInit {

    @Input() filters: IDashboardFilter;

    chartOptions: any = {};
    params = {
        streamId: ''
    };
    payload: any = {
        "startDate": "",
        "endDate": "",
        "experience": ""  // chat or voice
    }
    showCompare: boolean = false;
    currentData: any = [];
    previousData: any = [];
    subs = new SubSink();
    widgetUsageData: any = {};

    constructor(private dashboardService: DashboardService, private authService: AuthService, private service: ServiceInvokerService,
        private decimalPipe : DecimalPipe) { }

    ngOnInit(): void {
        this.params.streamId = this.authService.smartAssistBots[0]._id;
        this.subscribeEvents();

    }

    subscribeEvents() {
        this.subs.sink = this.dashboardService.getDashboardFilterUpdated().subscribe((filters: any) => {
            if (filters && Object.keys(filters).length > 0) {
                this.payload = Object.assign({}, filters);
                this.params.streamId = this.dashboardService.getSelectedBotDetails()._id;
                this.getWidgetUsageData();
            }
        });
    }

    gettooltipData(data){
        let obj: any = {
            value: data.intervalAverage ? parseInt(this.decimalPipe.transform(data.intervalAverage / 60000)) : 0,
        }
        if (this.widgetUsageData.aggregationType == 'hour') {
            const momentDate = moment(data.time);
            let formattedString = momentDate.format('hh a');
            formattedString += ' (' + momentDate.format('Do MMM') + ')'; // Append month name
            obj.name = formattedString;
        }
        return obj;
    }

    getWidgetUsageData() {
        let seriesData = [];
        this.payload.isCompare = this.showCompare;
        this.service.invoke('widgetUsage', this.params, this.payload).subscribe((data: any) => {
            this.widgetUsageData = data;
            if (data.currentData?.length > 0) {
                this.widgetUsageData.currentData = this.addZerosValForBarGraphData(this.widgetUsageData.currentData);
                let intervalAverage = this.widgetUsageData.currentData?.map(data => this.gettooltipData(data));
                seriesData.push({
                    name: 'Current',
                    data: intervalAverage,
                    type: 'line',
                    color: '#E267AC'
                })
            }

            if (this.showCompare && data.previousData?.length > 0) {
                this.widgetUsageData.previousData = this.addZerosValForBarGraphData(this.widgetUsageData.previousData);
                let intervalAverage = this.widgetUsageData.currentData?.map(data => this.gettooltipData(data));
                seriesData.push({
                    name: 'Previous',
                    data: intervalAverage,
                    type: 'line',
                    color: '#F59E0B'
                });

                if(data.previousAvg){
                    this.widgetUsageData.percent =  ((this.widgetUsageData.currentAvg - this.widgetUsageData.previousAvg)/this.widgetUsageData.previousAvg) * 100
                    this.widgetUsageData.percent = this.decimalPipe.transform(this.widgetUsageData.percent/6000, '1.2-2');
                }
            }            
            this.getChartOptions(seriesData);
        },(err)=> {
            this.widgetUsageData = {};
        });

    }

    calculateInterval(){
        let interval = 0;
        if(this.widgetUsageData.aggregationType == 'hour'){
            const startDate = moment(this.payload.startDate);
            const endDate = moment(this.payload.endDate);
            const durationInMilliseconds = endDate.diff(startDate);
            const durationInHours = moment.duration(durationInMilliseconds).asHours();
            if(durationInHours <= 24){
                interval = 1;
            }else if(durationInHours > 24 && durationInHours <= 48){
                interval = 2
            }else{
                interval = 3
            }
        }        
        return interval;
    }

    getChartOptions(data) {
        let days = this.getDateList(this.widgetUsageData.currentData);
        let interval = this.calculateInterval();
       
        this.chartOptions = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow"
                }
              },
            xAxis: {
                type: 'category',
                data: days,
                axisTick: {
                    alignWithLabel: true
                },
            },
            yAxis: {
                type: 'value'
            },
            series: data
        };
        if(interval){
            this.chartOptions.xAxis.axisLabel = {
                show : true,
                interval : interval
            }
        }
        if(this.widgetUsageData.aggregationType == 'hour'){
            this.chartOptions.tooltip.formatter =  (params) => {
                let tooltipContent = '<div style="text-align: left;">';
                tooltipContent += '<strong>' + params[0].data.name + '</strong>';
                params.forEach((item) => {
                    tooltipContent += '<br/>' + item.marker + ' ' + item.seriesName + ': ' + item.value;
                });
                tooltipContent += '</div>';
                return tooltipContent;
            }
        }
        this.chartOptions = { ...this.chartOptions }
    }

    changeSlider() {
        this.showCompare = !this.showCompare;
        this.getWidgetUsageData();
    }

    getDateList(widgetUsageData){
        let dateList = [];
        if (this.widgetUsageData?.aggregationType == 'day') {
            dateList = widgetUsageData?.map(date => moment(date.time).format('Do MMM').toString());
        } else if (this.widgetUsageData?.aggregationType == 'hour') {
            dateList = widgetUsageData?.map(date => {
                const momentDate = moment(date.time);
                let formattedString = momentDate.format('hh a');
                return formattedString;
            });
        } else if (this.widgetUsageData.aggregationType == 'week') {
            dateList = widgetUsageData?.map(date => this.getWeekOfMonth(date.time));
        }
        return dateList;
    }

    getWeekOfMonth(date) {
        const startOfMonth = moment(date).startOf('month');
        const diff = moment(date).diff(startOfMonth, 'days');
        const startingDayOfWeek = startOfMonth.day();
        const daysInFirstWeek = 7 - startingDayOfWeek; // Days in the first week of the month
        const daysAfterFirstWeek = diff - daysInFirstWeek;
        let weekStr = 'th week of (' +  moment(date).format('MMM') + ')'
        return Math.ceil((daysAfterFirstWeek + 1) / 7) + 1 + weekStr;
    }

    addZerosValForBarGraphData(widgetUsageData) {
        let dateType = (this.widgetUsageData?.aggregationType == 'week') ? 'weeks' : this.widgetUsageData?.aggregationType;
        let dateList = this.getDateList(widgetUsageData)
        let startOfType = (this.widgetUsageData.aggregationType == 'week') ? 'week' : 'day';
        let currDate = moment(this.payload.startDate).startOf(startOfType as moment.unitOfTime.StartOf);
        let lastDate = moment(this.payload.endDate).endOf(startOfType as moment.unitOfTime.StartOf);
        if(dateType == 'day' || dateType == 'hour'){
            while (currDate.diff(lastDate) < 0) {
                let avalDate;
                if (dateType == 'day') {
                    avalDate = moment(currDate).format('Do MMM').toString();
                } else if(dateType == 'hour') {
                    avalDate = moment(currDate).format('hh a').toString();
                } else if(dateType == 'week'){
                    avalDate = this.getWeekOfMonth(currDate);
                }
    
                if (dateList.indexOf(avalDate) == -1) {
                    let data = {
                        intervalAverage: 0,
                        noOfConversations: 0,
                        "time": currDate.toISOString()
                    };
                    widgetUsageData.push(data);
                }
                
                currDate.add(1, dateType);
            }
        }
        widgetUsageData = widgetUsageData.sort(function (a, b) {
            return moment(a.time).diff(b.time);
        });
        return widgetUsageData;
    }


}
