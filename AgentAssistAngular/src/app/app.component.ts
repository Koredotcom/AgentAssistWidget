import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/common/services/common.service';
import { WebSocketService } from '../common/services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgentAssistWidget';

  constructor(private webSocketService: WebSocketService, private service: CommonService,
    private route: ActivatedRoute){

  }
  ngOnInit(){
    this.route.queryParams
    .subscribe(params => {
      this.service.configObj = params;
    }
  );
    this.webSocketService.init();
    this.webSocketService.registerEvents();
    setTimeout(()=>{
      this.service.triggerWelcomeEvent();
    }, 300)
  }

}
