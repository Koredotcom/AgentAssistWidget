export class CallHistoryModel {
    userId: string;
    phNumber: string;
    dateTime: string;
    time: string;
    startTime: string;
    endTime: string;
    duration: string;
    status: string;
    messageId: string;
    email: string;
    symbol: string;
  
    constructor (res: any, dateTime, time, duration) {
        this.userId = res.userId;
        this.phNumber = res.phoneNumber;
        this.email = res.email;
        this.startTime = res.startedOn;
        this.endTime = res.endedOn;
        this.dateTime = dateTime;
        this.time = time;
        this.duration = duration;
        this.status = res.status;
        this.messageId = res.messageId;
        this.symbol = res.flow.join(' > ');
    }
}


export interface Logs {
  phoneNumber: string;
  messageId: string [];
  userId: string;
  startedOn: any;
  endedOn: any;
  intentIdentified: string [];
  status: string;
  flow: string [];
  isActive?: boolean;
  userDetails: any;
  duration: number;
  scId?: any;
}

export interface ResponseLogs {
  data: Logs[];
  hasMore: boolean;
  totalCount: number;
}


export var mock_logs = {
  "hasMore": false,
  "totalCount": 2,
  "data": [
    {
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020
    },
    {
      "channel": "voice",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c6",
      "duration": 152020
    }
  ]
}

  
  