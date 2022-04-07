export const SMILEYLIST =  [
    {
      imgSrc: 'assets/images/smileys/joy.svg',
      title: 'Joy'
    },
    {
      imgSrc: 'assets/images/smileys/positive.svg',
      title: 'Positive'
    },
    {
      imgSrc: 'assets/images/smileys/sad.svg',
      title: 'Sad'
    },
    {
      imgSrc: 'assets/images/smileys/fear.svg',
      title: 'Fear'
    },
    {
      imgSrc: 'assets/images/smileys/disgust.svg',
      title: 'Disgust'
    },
    {
      imgSrc: 'assets/images/smileys/angry.svg',
      title: 'Angry'
    }
];

export class AgentHeader {
  start: string;
  duration: string;
  constructor(response: any) {
    this.start = new Date(response.sessionStartTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    let date1 = new Date(response.sessionStartTime).valueOf();
    let date2 = new Date(response.agentHandOffTime).valueOf();
    let diffTime = Math.abs(date2 - date1);
    this.duration = Math.ceil(diffTime / (1000 * 60)) + ' mins'; 
  }
}

export class TaskList {
  messageStoreId: string;
  status: string;
  taskName: string;
  constructor(res) {
    if(res.status == 'completedTask') { this.status = 'SUCCESS'; }
    else if(res.status == 'failedTask') { this.status = 'FAILED'; }
    else { this.status = res.status };
    this.messageStoreId = res.messageStoreId;
    this.taskName = res.taskName || res.userInput;
  }
}