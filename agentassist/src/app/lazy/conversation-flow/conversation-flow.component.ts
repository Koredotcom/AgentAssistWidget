import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conversation-flow',
  templateUrl: './conversation-flow.component.html',
  styleUrls: ['./conversation-flow.component.scss']
})
export class ConversationFlowComponent implements OnInit {
  
  converFlowLegend = [{
    title: "Voice",
    color: "#3366ff",
    type: 'square'
  },{
    title: "Chat",
    color: "#F5A623",
    type: 'square'
  },{
    title: "Task Completed",
    color: "#09A624",
    type: 'circle'
  },{
    title: "Task Failed",
    color: "#D2000D",
    type: 'circle'
  },{
    title: "In Progress",
    color: "#007EFF",
    type: 'circle'
  }];

  voiceList = [
    {
      name: 'Book Ticket',
      type: 'taskCompleted'
    }, {
      name: 'Check Weather',
      type: 'taskFailed'
    }, {
      name: 'Place to Visit',
      type: 'inProgress'
    }, {
      name: 'Place to Visit',
      type: 'taskCompleted'
    }
  ];

  chatList = [
    {
      name: 'Place to Visit',
      type: 'taskCompleted'
    }, {
      name: 'Place to Visit',
      type: 'taskFailed'
    }, {
      name: 'Place to Visit',
      type: 'inProgress'
    }, {
      name: 'Place to Visit',
      type: 'taskCompleted'
    }
  ]


  constructor() { }

  ngOnInit() {
  }

}
