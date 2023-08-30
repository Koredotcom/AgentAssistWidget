import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { VIEWTYPE } from './dashboard.cnst';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private exhaustiveRepresentation: BehaviorSubject<{}> = new BehaviorSubject(null);
  public agentAspectView: string = VIEWTYPE.WORDCLOUD;
  public dashboardfilterUpdated$ = new Subject();


  constructor() { }

  formatterData: any = {
    "Successfully Completed": [
      {
        key: "Book Ticket",
        value: "33"
      },
      {
        key: "Reschedule",
        value: "23"
      },
      {
        key: "Cancel",
        value: "31"
      },
      {
        key: "Others",
        value: "4"
      }
    ],
    "Terminated": [
      {
        key: "Book Ticket",
        value: "33"
      },
      {
        key: "Reschedule",
        value: "23"
      },
      {
        key: "Cancel",
        value: "31"
      },
      {
        key: "Others",
        value: "4"
      }
    ],
    "Error": [
      {
        key: "Book Ticket",
        value: "33"
      },
      {
        key: "Reschedule",
        value: "23"
      },
      {
        key: "Cancel",
        value: "31"
      },
      {
        key: "Others",
        value: "4"
      }
    ],
    "Other": [
      {
        key: "Book Ticket",
        value: "33"
      },
      {
        key: "Reschedule",
        value: "23"
      },
      {
        key: "Cancel",
        value: "31"
      },
      {
        key: "Others",
        value: "4"
      }
    ]
  }

  setExhaustiveRep(flag, component?, data?) {
    let type = component ? component : null;
    this.exhaustiveRepresentation.next({ status: flag, type: type, data : data });
  }

  getExhaustiveRep(): Observable<{}> {
    return this.exhaustiveRepresentation.asObservable();
  }

  setDashboardFilterUpdated(filters){
    this.dashboardfilterUpdated$.next(filters);
  }

  getDashboardFilterUpdated(){
    return this.dashboardfilterUpdated$.asObservable();
  }


  getWordCloudOptions(actualData) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          let tooltipString = params.marker  + ' ' + params.data.name + ":" + params.data.value + '</br>';
          return tooltipString
        }
      },
      series: [{
        type: 'wordCloud',
        gridSize: 3,
        sizeRange: [15, 55],
        rotationRange: [0, 0],
        shape: 'pentagon',
        width: 600,
        height: 400,
        textStyle: {
          normal: {
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: actualData
      }]
    }
  }

  getKPIData() {
    return of({
      "totalSessions": {
          "count": 1,
          "percent": 10,
          "increment": false
      },
      "totalSuggestions": {
          "count": 1,
          "percent": 10,
          "increment": true
      },
      "avgSuggestions": {
          "count": 1
      }
   });
  }

  getCustomerAspectData(selection, type) {
    return of({
      "hasMore": true,
      "totalCount": 9,
      "fetched": 5,
      "all": [
          {
              "name": "submit form",
              "type": "dialog",
              "count": 2,
              "percent": 33.333333333333336
          },
          {
              "name": "Mobile Enquiry",
              "type": "dialog",
              "count": 2,
              "percent": 33.333333333333336
          },
          {
              "name": "Book Ticket",
              "type": "dialog",
              "count": 1,
              "percent": 16.666666666666668
          }
      ]
   });
  }

  getAgentAspectData() {

    return of({
      "totalReq": 1,
      "fetched": 1,
      "hasMore": false,
      "totalSearchReq": {
          "count": 1,
          "percent": 1,
          "increment": true
      },
      "searchResultsUsed": {
          "count": 2,
          "percent": 4,
          "increment": false
      },
      "actualData": [
          {
              "input": "mobile enquiry",
              "count": 1
          },
          {
            input: "Book Flight",
            count: 1320,
            percent: 50
          },
          {
            input: "Cancel Flight",
            count: 1000,
            percent: 50
          },
          {
            input: "Reschedule Flight",
            count: 700,
            percent: 50
          },
          {
            input: "Rearrange Flight",
            count: 1320,
            percent: 50
          },
          {
            input: "Rebook Flight",
            count: 1000,
            percent: 50
          },
          {
            input: "schedule Flight",
            count: 700,
            percent: 50
          }
      ]
   });
  }

  getAutomationPerformanceData() {

    return of({
      "total": 17,
      "actualData": [
        {
          "name": "Successfully Completed",
          "count": 12,
          "percent": 70.58823529411765,
          "seriesData": [
            {
              "key": "EndOfTheDialog",
              "value": 7
            },
            {
              "key": "entCheck",
              "value": 3
            },
            {
              "key": "informationInput",
              "value": 2
            }
          ]
        },
        {
          "name": "Terminated or Error",
          "count": 2,
          "percent": 11.764705882352942,
          "seriesData": [
            {
              "key": "form",
              "value": 2
            }
          ]
        },
        {
          "name": "Other",
          "count": 3,
          "percent": 70.58823529411765,
          "seriesData": [
            {
              "key": "informationInput",
              "value": 2
            },
            {
              "key": "entCheck",
              "value": 1
            }
          ]
        }
      ]
    });
  }

  getAutomationOverrideReportData() {
    return of({
      overrideRate: 12,
      actualData: [
        {
          intentName: "Book Flight1",
          totalOverides: 4463,
          entity_override: [
            {
              entityName: "PNR1",
              override: 2000
            },
            {
              entityName: "Transaction Id1",
              override: 2463
            },
            {
              entityName: "PNR2",
              override: 2000
            },
            {
              entityName: "Transaction Id2",
              override: 2463
            }
          ]
        },
        {
          intentName: "Cancel Flight1",
          totalOverides: 4463,
          entity_override: [
            {
              entityName: "PNR1",
              override: 2000
            },
            {
              entityName: "Transaction Id1",
              override: 2463
            },
            {
              entityName: "PNR2",
              override: 2000
            },
            {
              entityName: "Transaction Id2",
              override: 2463
            },
            {
              entityName: "PNR3",
              override: 2000
            },
            {
              entityName: "Transaction Id4",
              override: 2463
            }
          ]
        },
        {
          intentName: "Book Flight2",
          totalOverides: 4463,
          entity_override: [
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            },
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            }
          ]
        },
        {
          intentName: "Cancel Flight2",
          totalOverides: 4463,
          entity_override: [
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            },
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            },
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            }
          ]
        },
        {
          intentName: "Book Flight3",
          totalOverides: 4463,
          entity_override: [
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            },
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            }
          ]
        },
        {
          intentName: "Cancel Flight3",
          totalOverides: 4463,
          entity_override: [
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            },
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            },
            {
              entityName: "PNR",
              override: 2000
            },
            {
              entityName: "Transaction Id",
              override: 2463
            }
          ]
        }
      ]
    })
  }

  getAgentFeedbackData() {

    return of({
      "hasMore": false,
      "fetched": 4,
      "totalResp": 4,
      "helpfulResp": 2,
      "nothelpfulResp": 2,
      "usecases": [
          {
              "intentName": "entCheck",
              "responses": 2,
              "liked": 1,
              "disliked": 1,
              "likedPercent": "50.0",
              "dislikedPercent": "50.0"
          },
          {
              "intentName": "undefined",
              "responses": 1,
              "liked": 1,
              "disliked": 0,
              "likedPercent": "100.0",
              "dislikedPercent": "0.0"
          },
          {
              "intentName": "form",
              "responses": 1,
              "liked": 0,
              "disliked": 1,
              "likedPercent": "0.0",
              "dislikedPercent": "100.0"
          },
          {
            "intentName": "book ticket",
            "responses": 2,
            "liked": 1,
            "disliked": 1,
            "likedPercent": "50.0",
            "dislikedPercent": "50.0"
        },
        {
            "intentName": "show balance",
            "responses": 1,
            "liked": 1,
            "disliked": 0,
            "likedPercent": "100.0",
            "dislikedPercent": "0.0"
        },
        {
            "intentName": "book flight",
            "responses": 1,
            "liked": 0,
            "disliked": 1,
            "likedPercent": "0.0",
            "dislikedPercent": "100.0"
        }
      ]
   })
  }

}
