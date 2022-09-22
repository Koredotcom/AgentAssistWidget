import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private exhaustiveRepresentation: BehaviorSubject<{}> = new BehaviorSubject(null);

  constructor() { }

  formatterData : any = {
    "Successfully Completed" : [
      {
        key : "Book Ticket",
        value : "33"
      },
      {
        key : "Reschedule",
        value : "23"
      },
      {
        key : "Cancel",
        value : "31"
      },
      {
        key : "Others",
        value : "4"
      }
    ], 
    "Terminated" : [
      {
        key : "Book Ticket",
        value : "33"
      },
      {
        key : "Reschedule",
        value : "23"
      },
      {
        key : "Cancel",
        value : "31"
      },
      {
        key : "Others",
        value : "4"
      }
    ], 
    "Error" : [
      {
        key : "Book Ticket",
        value : "33"
      },
      {
        key : "Reschedule",
        value : "23"
      },
      {
        key : "Cancel",
        value : "31"
      },
      {
        key : "Others",
        value : "4"
      }
    ], 
    "Other" : [
      {
        key : "Book Ticket",
        value : "33"
      },
      {
        key : "Reschedule",
        value : "23"
      },
      {
        key : "Cancel",
        value : "31"
      },
      {
        key : "Others",
        value : "4"
      }
    ]
  }

  setExhaustiveRep(flag, component?){
    let type = component ? component : null;
    this.exhaustiveRepresentation.next({status : flag, type : type});
  }

  getExhaustiveRep() : Observable<{}>{
    return this.exhaustiveRepresentation.asObservable();
  }


  getWordCloudOptions() {
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
        data: [
          {
            name: 'Already Over',
            value: 10000,
            textStyle: {
              normal: {
                color: 'black'
              },
              emphasis: {
                color: 'blue'
              }
            }
          },
          {
            name: 'now',
            value: 4055
          },
          {
            name: 'know',
            value: 2467
          },
          {
            name: 'reaching',
            value: 2244
          },
          {
            name: 'nothing',
            value: 1898
          },
          {
            name: 'letting',
            value: 1484
          },
          {
            name: 'fall',
            value: 1112
          },
          {
            name: 'give',
            value: 965
          },
          {
            name: 'loving',
            value: 847
          },
          {
            name: 'go',
            value: 582
          },
          {
            name: 'left',
            value: 555
          },
          {
            name: 'lose',
            value: 550
          },
          {
            name: 'everything',
            value: 462
          },
          {
            name: 'never',
            value: 366
          },
          {
            name: 'breaking',
            value: 360
          },
          {
            name: 'slowly',
            value: 282
          },
          {
            name: 'all',
            value: 273
          },
          {
            name: 'here',
            value: 273
          },
          {
            name: 'skin',
            value: 273
          },
          {
            name: 'you',
            value: 273
          },
          {
            name: 'resist',
            value: 273
          },
          {
            name: 'again',
            value: 273
          },
          {
            name: 'suffocating',
            value: 273
          },
          {
            name: 'defense',
            value: 273
          },
          {
            name: 'cost',
            value: 273
          },
          {
            name: 'fading',
            value: 265
          }
        ]
      }]
    }
  }

}
