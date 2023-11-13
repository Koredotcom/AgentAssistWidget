import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { coachingConst } from 'src/app/proj.const';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.scss']
})
export class HintsComponent implements OnInit{

  subs = new SubSink();

  coachingHints : any = [];
  coachingConst : any = coachingConst;
  @ViewChild('overlayhint', {static: false}) private overlayhint: ElementRef;

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
      if(data?.action === 'hint'){
        this.handleHintData(data);
      }
    });
  }

   handleHintData(hintObject){
    let uQ = hintObject.actionId;
    this.coachingHints.unshift(hintObject);
    this.hintScrollBottom(true);
    if(hintObject?.message?.postAction !== 'doesnot_auto_close'){
      setTimeout(() => {
        let inx = this.coachingHints.findIndex((item)=> item.actionId === uQ);
        if(inx >= 0){
          this.coachingHints.splice(inx, 1);
        }
      }, (hintObject.message?.time < 900 ? hintObject.message?.time : 900) * 1000);
    }
  }

  closeHint(uQ){
    let inx = this.coachingHints.findIndex((item)=> item.actionId === uQ);
    if(inx >= 0){
      this.coachingHints.splice(inx, 1);
    }
  }

  hintScrollBottom(flag){
    if(flag && this.overlayhint){
      this.overlayhint.nativeElement.scrollTop = 0;
    }
  }

  hintAckPressed(data) {
    data["ackPressed"] = true;
    this.webSocketService.emitEvents(EVENTS.agent_coaching_ackpress, data);
  }

}
