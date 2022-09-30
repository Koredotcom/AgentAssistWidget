import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss']
})
export class AssistComponent implements OnInit {
  result;
  html;
  constructor(private templateRenderClassService:TemplateRenderClassService) {
    
  }

   ngOnInit() {
    console.log("assist tab ng on it");
    let message = {
      "conversationId": "c-099914a-6ca1-4797-ab40-a5b18e0d214c",
      "botId": "st-fa82e7df-fa85-574c-92c7-a6ad6d6da07d",
      "agentId": "",
      "experience": "chat",
      "positionId": "dg-lt85oo5vzgj",
      "intentName": "book ticket",
      "entities": [],
      "type": "button",
      "value": "Next Action - Ask customer...",
      "event": "agent_assist_response",
      "volleyTone": [],
      "totalTone": [
          {
              "name": "positive",
              "value": 1,
              "count": 5,
              "totalLevel": 5
          }
      ],
      "isPrompt": false,
      "userInput": "book ticket",
      "sentimentTone": {
          "sentiment": "positive",
          "emoji": "&#128515;",
          "strength": 5
      },
      "buttons": [
          {
              "type": "text",
              "value": "Sample message for Message0006"
          }
      ],
      "uniqueTaskId": "dg-910b44a9-1beb-54a0-8985-d13a6498868f"
  }
    this.result = this.templateRenderClassService.getResponseUsingTemplate(message);
    console.log(this.result,"this.result");
    this.html = this.templateRenderClassService.AgentChatInitialize.renderMessage(this.result)[0].innerHTML;
    let a = document.getElementById("displayData-${uuids}");
    a.innerHTML = a.innerHTML+this.html;
   // console.log(this.templateRenderClassService.AgentChatInitialize.renderMessage(this.result),"xxxxxxxxxxxxxxxxxxxxxxxx")
  // this.viewCustomTempAttachment();
  }

  // viewCustomTempAttachment(){
  //   $('.chat-container').off('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn,.viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv, .botResponseAttachments').on('click', '.buttonTmplContentBox li,.listTmplContentChild .buyBtn, .viewMoreList .viewMore,.listItemPath,.quickReply,.carouselImageContent,.listRightContent,.checkboxBtn,.likeDislikeDiv, .botResponseAttachments', function (e) {
  //     window.open($(this).attr('fileid'), '_blank');
  //   })
  // }

}
