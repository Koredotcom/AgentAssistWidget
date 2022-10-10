import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { CommonService } from 'src/common/services/common.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import { WebSocketService } from 'src/common/services/web-socket.service';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss'],
  providers:[RandomUUIDPipe]
})
export class AssistComponent implements OnInit {
  result;
  html;
  agentResponse;
  constructor(private templateRenderClassService:TemplateRenderClassService, 
    private webSocketService: WebSocketService,
    public randomUUIDPipe: RandomUUIDPipe,
    private service: CommonService) {
    
  }

   ngOnInit() {   
    console.log("assist tab ng on it");
    this.webSocketService.agentAssistResponse$.subscribe((res)=>{
      console.log("-------------------resssssssssssssssssss in asssit tab", res);
      if(res) {
        res['id'] = this.randomUUIDPipe.transform();
      }
      this.agentResponse = res;
      if(this.service.isAutomationOnGoing && !this.service.isParsedPayload && !res['suggestions']) {
        this.result = this.templateRenderClassService.getResponseUsingTemplate(res);
        console.log(this.result,"this.result");
        this.html = this.templateRenderClassService.AgentChatInitialize.renderMessage(this.result)[0]?.innerHTML;
        let a = document.getElementById("displayData-${uuids}");
        a.innerHTML = a.innerHTML+this.html;
      }
      
    })

  }


  // viewCustomTempAttachment(){
  //   $('.chat-container').off('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn,.viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv, .botResponseAttachments').on('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn, .viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv, .botResponseAttachments', function (e) {
  //     window.open($(this).attr('fileid'), '_blank');
  //   })
  // }

}
