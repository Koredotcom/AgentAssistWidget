import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { connectionObj } from 'src/common/constants/proj.cnts';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
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
    private route: ActivatedRoute, private handleSubjectService : HandleSubjectService, private randomID : KoreGenerateuuidPipe){
    
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
          // this.webSocketService.socketConnection();
        }).catch((err)=>{
          this.errorMsg = "jwt token generation failed";
        })
        } else {
          this.errorMsg = "Issue identified in configuration settings! Please reach out to AgentAssist Admin."
        }
       
      });
  
    }


    // this.webSocketService.init();
    // this.webSocketService.registerEvents();
    // setTimeout(()=>{
    //   this.service.triggerWelcomeEvent();
    // }, 300)
  }

