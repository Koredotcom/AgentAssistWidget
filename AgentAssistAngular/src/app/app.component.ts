import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { WebSocketService } from '../common/services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgentAssistWidget';
  isGrantSuccess = false;
  errorMsg;
  constructor(private webSocketService: WebSocketService, private service: CommonService,
    private route: ActivatedRoute, private handleSubjectService : HandleSubjectService){

  }
  ngOnInit(){
    this.route.queryParams
    .subscribe(params => {
      this.service.configObj = params;
      console.log(params, "params");
      
      if(params.token && params.botid && params.agentassisturl){
        this.service.grantCall(params.token, params.botid, params.agentassisturl).then((res)=>{
          console.log(res,"sucess")
          this.isGrantSuccess = true;
          this.handleSubjectService.setConnectionDetails(params);
        }).catch((err)=>{
          if (err.status === 500) {
              this.errorMsg =  "Issue identified with the backend services! Please reach out to AgentAssist Admin.";
          } else {
            this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin.";
          }
          this.isGrantSuccess = false;
        });
      }
  
    }
  );
    // this.webSocketService.init();
    // this.webSocketService.registerEvents();
    // setTimeout(()=>{
    //   this.service.triggerWelcomeEvent();
    // }, 300)
  }

}
