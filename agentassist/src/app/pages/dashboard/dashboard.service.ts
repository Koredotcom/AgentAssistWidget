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

  setExhaustiveRep(flag, component?) {
    let type = component ? component : null;
    this.exhaustiveRepresentation.next({ status: flag, type: type });
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
          let tooltipString = params.data.name + ":" + params.data.value + '</br>';
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
      "dashboardkpi": {
        totalSessions: {
          count: 7535,
          percent: 2.3,
          increment: false
        },
        totalSuggestions: {
          count: 7537,
          percent: 2.3,
          increment: true
        },
        avgSuggestions: {
          count: 3.2
        },
        accuracy: {
          count: 63,
          percent: 2.3,
          increment: true
        }
      }
    })
  }

  getCustomerAspectData(selection, type) {
    let customerData: any = {
      Agent_Initiated: {
        All: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Automations'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Articles'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Faqs',
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          }
        ],
        Articles: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Articles'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Articles'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Articles'
          }
        ],
        Faqs: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Faqs'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Faqs'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Faqs'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          }
        ],
        Automations: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Automations'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Automations'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          },
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Automations'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          }
        ]

      },
      Agent_Suggested: {

        All: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          }
        ],
        Articles: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Articles'
          }
        ],
        Faqs: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Faqs'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          }
        ],
        Automations: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Automations'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          }
        ]

      },
      All: {

        All: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          }
        ],
        Articles: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Articles'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Articles'
          }
        ],
        Faqs: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Faqs'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Faqs'
          }
        ],
        Automations: [
          {
            intentName: "Reschedule Flight",
            count: 234,
            percent: 32,
            type : 'Automations'
          },
          {
            intentName: "Cancel Flight",
            count: 180,
            percent: 18,
            type : 'Automations'
          }
        ]

      }
    }
    return of(customerData[selection][type]);
  }

  getAgentAspectData() {
    return of({
      totalSearchReq: {
        count: 2345,
        percent: 2.3,
        increment: false
      },
      searchResultsUsed: {
        count: 23,
        percent: 2.3,
        increment: true
      },
      actualData: [
        {
          intentName: "Book Flight",
          count: 1320,
          percent: 50
        },
        {
          intentName: "Cancel Flight",
          count: 1000,
          percent: 30
        },
        {
          intentName: "Reschedule Flight",
          count: 700,
          percent: 20
        },
        {
          intentName: "Rearrange Flight",
          count: 1320,
          percent: 50
        },
        {
          intentName: "Rebook Flight",
          count: 1000,
          percent: 30
        },
        {
          intentName: "schedule Flight",
          count: 700,
          percent: 20
        }
      ]
    })
  }

  getAutomationPerformanceData() {
    return of({
      total: 21474,
      actualData: [
        {
          name: "Successfully Completed",
          count: 7000,
          percent: 70,
          seriesData: [
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
        },
        {
          name: "Terminated",
          count: 2500,
          percent: 25,
          seriesData: [
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
        },
        {
          name: "Error",
          count: 500,
          percent: 5,
          seriesData: [
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
        },
        {
          name: "Other",
          count: 500,
          percent: 5,
          seriesData: [
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
        },

      ]
    })
  }

  getAutomationOverrideReportData() {
    return of({
      overrideRate: 12,
      actualData: [
        {
          intentName: "Book Flight",
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
          intentName: "Cancel Flight",
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
          intentName: "Book Flight",
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
          intentName: "Cancel Flight",
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
          intentName: "Book Flight",
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
          intentName: "Cancel Flight",
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
      totalResp: 7535,
      helpful: 73,
      nothelpful: 27,
      actualData: [
        {
          intentName: "Book Flight",
          responses: 700,
          like: {
            count: 340,
            percent: 68
          },
          dislike: {
            count: 340,
            percent: 32
          }
        },
        {
          intentName: "Cancel Flight",
          responses: 700,
          like: {
            count: 340,
            percent: 68
          },
          dislike: {
            count: 340,
            percent: 32
          }
        },
        {
          intentName: "Book Flight",
          responses: 700,
          like: {
            count: 340,
            percent: 68
          },
          dislike: {
            count: 340,
            percent: 32
          }
        },
        {
          intentName: "Cancel Flight",
          responses: 700,
          like: {
            count: 340,
            percent: 68
          },
          dislike: {
            count: 340,
            percent: 32
          }
        }
      ]

    }
    )
  }

}
