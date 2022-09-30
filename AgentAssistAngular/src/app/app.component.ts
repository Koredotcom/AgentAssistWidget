import { Component } from '@angular/core';
import { WebSocketService } from '../common/services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgentAssistWidget';
  constructor(private webSocketService: WebSocketService){

  }
  ngOnInit(){
    this.webSocketService.init();
  }
}
