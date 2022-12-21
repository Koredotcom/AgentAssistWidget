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
  "channel": string,
  "startedOn": any,
  "endedOn": any,
  "conversationId": string,
  "duration": number,
  "automations":[]
}

export interface ResponseLogs {
  data: Logs[];
  hasMore: boolean;
  totalCount: number;
}

export const MOCK_LOGS= {
  "hasMore": false,
  "totalCount": 2,
  "data": [
    {
      "_id": 123456,
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "book flight"]
    },
    {
      "_id": 123873,
      "channel": "voice",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "What is covid-19?"]
    },
    {
      "_id": 1234867556,
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "book flight"]
    },
    {
      "_id": 123456,
      "channel": "voice",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "What is covid-19?"]
    },
    {
      "_id": 123443656,
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "book flight"]
    },
    {
      "_id": 123434656,
      "channel": "voice",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "What is covid-19?"]
    },
    {
      "_id": 12334234556,
      "channel": "chat",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "book flight"]
    },
    {
      "_id": 123435456,
      "channel": "voice",
      "startedOn": 1670419522574,
      "endedOn": 1670419674594,
      "conversationId": "c-639094425f9bd6639428b7c5",
      "duration": 152020,
      "automations":["book ticket", "What is covid-19?"]
    }
  ]
}
