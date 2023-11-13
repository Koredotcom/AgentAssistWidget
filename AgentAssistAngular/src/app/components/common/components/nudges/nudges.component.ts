import { Component } from '@angular/core';
import { coachingConst } from 'src/app/proj.const';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-nudges',
  templateUrl: './nudges.component.html',
  styleUrls: ['./nudges.component.scss']
})
export class NudgesComponent {

  subs = new SubSink();

  coachingNudges : any = [];

  coachingConst : any = coachingConst;

  constructor(private webSocketService : WebSocketService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
  
  subscribeEvents(){
    this.subs.sink = this.webSocketService.agentCoachingResponse$.subscribe((data)=>{
      if(data?.action === 'nudge'){
        this.handleNudgeData(data);
      }
    });
  }

   handleNudgeData(data){
    let uQ = data.actionId;
    this.coachingNudges.unshift(data);
    setTimeout(() => {
      let inx = this.coachingNudges.findIndex((item)=> item.actionId === uQ);
      if(inx >= 0){
        this.coachingNudges.splice(inx, 1);
      }
    }, 7000);
  }

  closeNudge(uQ){
    let inx = this.coachingNudges.findIndex((item)=> item.actionId === uQ);
    if(inx >= 0){
      this.coachingNudges.splice(inx, 1);
    }
  }


}
