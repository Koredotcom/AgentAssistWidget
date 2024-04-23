import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import * as moment from 'moment';
import { MillisToDurationPipePipe } from 'src/app/helpers/filters/millis-to-duration-pipe.pipe';
import { MillisecondsToDateAndHourPipe } from 'src/app/helpers/filters/milliseconds-to-date-and-hour.pipe';
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
        private decimalPipe : DecimalPipe, private milliPipe : MillisToDurationPipePipe, private milliDate : MillisecondsToDateAndHourPipe) { }

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
            value: data.intervalAverage ? parseFloat(this.decimalPipe.transform(data.intervalAverage / 60000, '1.2-2')) : 0,
            date : data.time ? this.milliDate.transform(new Date(data.time).getTime()) : ''
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
            if(data.currentData?.length > 0 || data.previousData?.length > 0){
                this.widgetUsageData = data;
                if (data.currentData) {
                    this.widgetUsageData.currentData = this.addZerosValForBarGraphData(this.widgetUsageData.currentData, this.payload.startDate, this.payload.endDate);
                    let intervalAverage = this.widgetUsageData.currentData?.map(resp => this.gettooltipData(resp));
                    seriesData.push({
                        name: 'Current',
                        data: intervalAverage,
                        type: 'line',
                        color: '#E267AC'
                    })
                }
    
                if (this.showCompare && data.previousData) {
                    let diff = new Date(this.payload.endDate).getTime() - new Date(this.payload.startDate).getTime();
                    let prevStartDate = new Date(new Date(this.payload.startDate).getTime() - diff);
                    let prevEndDate = this.payload.startDate;
                    this.widgetUsageData.previousData = this.addZerosValForBarGraphData(this.widgetUsageData.previousData, prevStartDate, prevEndDate);
                    let intervalAverage = this.widgetUsageData.previousData?.map(resp => this.gettooltipData(resp));
                    seriesData.push({
                        name: 'Previous',
                        data: intervalAverage,
                        type: 'line',
                        color: '#F59E0B'
                    });
    
                    if(data.previousAvg){
                        this.widgetUsageData.percent =  ((this.widgetUsageData.currentAvg - this.widgetUsageData.previousAvg)/this.widgetUsageData.previousAvg) * 100;
                        if(this.widgetUsageData.percent < 0){
                            this.widgetUsageData.decrement = true;
                            this.widgetUsageData.percent = Math.abs(this.widgetUsageData.percent)
                        }
                    }
                }            
                this.getChartOptions(seriesData);
            }else{
                this.widgetUsageData = {};
            }
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
        let days = this.getDateList(this.widgetUsageData.currentData, true);
        let interval = this.calculateInterval();
       
        this.chartOptions = {
            grid: {
                top: '10%',
                left: '5%',
                right: '5%',
                bottom: '10%',
                containLabel : true
              },
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
                type: 'value',
                name: 'Time in (Minutes)',
                nameLocation: 'middle',
                nameGap : 50
            },
            series: data
        };
        if(interval){
            this.chartOptions.xAxis.axisLabel = {
                show : true,
                interval : interval
            }
        }
        if(this.widgetUsageData.aggregationType){
            this.chartOptions.tooltip.formatter =  (params) => {
                let tooltipContent = '<div style="text-align: left;">';
                // tooltipContent += '<strong>' + params[0].data.name + '</strong>';
                params.forEach((item,index) => {
                    if(index != 0){
                        tooltipContent += '</br>'
                    }
                    tooltipContent += item.marker + ' ' + item.seriesName + ': ' + item.value;
                    // console.log(item, "itme");
                    
                    if(item?.data?.date){
                        tooltipContent += ' (' + item.data.date + ')';
                    }
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

    getDateList(widgetUsageData , axis?){
        let dateList = [];
        if (this.widgetUsageData?.aggregationType == 'day') {
            dateList = widgetUsageData?.map(date => moment(date.time).format('Do MMM').toString());
        } else if (this.widgetUsageData?.aggregationType == 'hour') {
            dateList = widgetUsageData?.map(date => {
                const momentDate = moment(date.time);
                let formattedString = axis ? momentDate.format('hh a') : momentDate.format('Do MMM').toString() +  momentDate.format('hh a');
                if(axis && formattedString == '12 am'){
                    formattedString = '(' + momentDate.format('Do MMM').toString() + ')'
                }
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

    addZerosValForBarGraphData(widgetUsageData, startDate, endDate) {
        let dateType = (this.widgetUsageData?.aggregationType == 'week') ? 'weeks' : this.widgetUsageData?.aggregationType;
        let dateList = this.getDateList(widgetUsageData)
        let startOfType = (this.widgetUsageData.aggregationType == 'week') ? 'week' : 'day';
        let currDate = moment(startDate).startOf(startOfType as moment.unitOfTime.StartOf);
        let lastDate = moment(endDate).endOf(startOfType as moment.unitOfTime.StartOf);
        if(dateType == 'day' || dateType == 'hour'){
            while (currDate.diff(lastDate) < 0) {
                let avalDate;
                if (dateType == 'day') {
                    avalDate = moment(currDate).format('Do MMM').toString();
                } else if(dateType == 'hour') {
                    avalDate = moment(currDate).format('Do MMM').toString() + moment(currDate).format('hh a').toString();
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
