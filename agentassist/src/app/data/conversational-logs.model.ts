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
        "phoneNumber": "+17607058888",
        "messageId": "ms-5ef050f7-64ca-59e0-94c3-002fb44dd424",
        "startedOn": 1608030690106,
        "endedOn": 1608030790106,
        "userId": 'u-0c33e5d2-d070-5f10-8e8e-639a9d68dcef',
        "intentIdentified": [
          "TaskB",
          "TaskA"
        ],
        "status": "drop-off",
        "flow": [
          "welcomeMessageTwilio"
        ]
      },
      {
        "phoneNumber": "+17607058888",
        "messageId": "ms-474b8c55-195d-5a90-a6b8-5cd68b822b2e",
        "startedOn": 1606836295081,
        "endedOn": 1606836495081,
        "userId": 'u-0c33e5d2-d070-5f10-8e8e-639a9d68dcef',
        "intentIdentified": [
          "TaskB",
          "TaskA"
        ],
        "status": "fulfilled",
        "flow": [
          "welcomeMessageTwilio",
          "phoneNumberStart"
        ]
      },
      {
        "phoneNumber": "+17607058888",
        "messageId": "ms-474b8c55-195d-5a90-a6b8-5cd68b822b2e",
        "startedOn": 1606836295081,
        "endedOn": 1606836495081,
        "userId": 'u-0c33e5d2-d070-5f10-8e8e-639a9d68dcef',
        "intentIdentified": [
          "TaskB",
          "TaskA"
        ],
        "status": "in progress",
        "flow": [
          "welcomeMessageTwilio",
          "phoneNumberStart"
        ]
      }
    ]
  }
  
  