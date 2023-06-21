import { Injectable } from '@angular/core';
import { RawHtmlPipe } from 'src/common/pipes/raw-html.pipe';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';

@Injectable({
    providedIn: 'root'
})
export class MybotDataService {

    constructor(private sanitizeHtmlPipe: SanitizeHtmlPipe, private rawHtmPipe : RawHtmlPipe) { }

    getMybotMsgResponse(myBotuuids, botId) {
        return {
            "type": "bot_response",
            "from": "bot",
            "message": [],
            "messageId": myBotuuids,
            "botInfo": {
                "chatBot": "sample Bot",
                "taskBotId": botId
            },
            "createdOn": "2022-03-21T07:56:18.225Z",
            "icon": "https://uat.kore.ai:443/api/getMediaStream/market/f-cb381255-9aa1-5ce2-95e3-71233aef7084.png?n=17648985&s=IlRvUlUwalFVaFVMYm9sZStZQnlLc0l1UlZvdlNUUDcxR2o3U2lscHRrL3M9Ig$$",
            "traceId": "873209019a5adc26"
        }
    }
    prepareMybotMsgBody(elem) {
        let payloadType = (elem.value).replace(/(&quot\;)/g, "\"");
        let parsedPayload: any;
        try {
            if (payloadType.indexOf('text') !== -1 || payloadType.indexOf('payload') !== -1) {
                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                parsedPayload = JSON.parse(withoutSpecials);
            }
        } catch (error) {
            if (payloadType.text) {
                let withoutSpecials = payloadType.replace(/^\s+|\s+$/g, "");
                parsedPayload = withoutSpecials;
            }
        }

        let body: any = {};
        body['type'] = elem.type;
        if (!parsedPayload) {
            body['component'] = {
                "type": elem.type,
                "payload": {
                    "type": elem.type,
                    "text": elem.value
                }
            };
            body['cInfo'] = {
                "body": elem.value
            };

        } else {
            body['component'] = parsedPayload.payload ? parsedPayload : parsedPayload.text;
            if (parsedPayload?.type === 'message') {
                body['cInfo'] = {
                    "body": ''
                };
            } else if (parsedPayload?.text) {
                body['cInfo'] = {
                    "body": parsedPayload.text
                };
            } else {
                body['cInfo'] = {
                    "body": parsedPayload
                };
            }
        }
        return body;
    }

    createDialogTaskAccordionTemplate(agentBotuuids, intentName) {
        let dialogTaskAccordion = `
                <div class="dialog-task-accordiaon-info hide" id="MyBotaddRemoveDropDown-${agentBotuuids}">
                    <div class="accordion-header" id="dropDownHeader-${agentBotuuids}">
                        <div class="icon-info">
                            <i class="ast-rule"></i>
                        </div>
                        <div class="header-text" id="dropDownTitle-${agentBotuuids}">${intentName}</div>
                        <i class="ast-carrotup rotate-carrot" id="dialogueArrow-${agentBotuuids}"></i>
                        <button class="btn-danger" id="myBotTerminateAgentDialog-${agentBotuuids}">Terminate</button>
                    </div>
                    <div class="collapse-acc-data" id="dropDownData-${agentBotuuids}">
                
                
                    </div>
                </div>`;
        return dialogTaskAccordion;
    }

    askUserTemplate(myBotuuids, newTemp, positionID,srcChannel=null, value='', componentType=null) {
        let template= '';
        if(componentType && componentType == 'dialogAct' && srcChannel != 'msteams' && srcChannel != 'rtm'){
          template = `
          <div class="steps-run-data">
          <div class="icon_block">
              <i class="ast-agent"></i>
          </div>
          <div class="run-info-content" >
          <div class="title">Ask customer</div>
          <div class="agent-utt">
          <div class="title-data" id="displayData-${myBotuuids}">${value}</div>
              <div class="action-links ">
                  <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}" data-msg-data="${newTemp}" data-position-id="${positionID}">Send</button>
                  <div class="copy-btn" data-msg-id="${myBotuuids}" data-position-id="${positionID}">
                      <i class="ast-copy" data-msg-id="${myBotuuids}" data-position-id="${positionID}"></i>
                  </div>
              </div>
          </div>
          </div>
      </div>
      `;
          
        }else{ 
            template = `
                <div class="steps-run-data">
                   <div class="icon_block">
                       <i class="ast-agent"></i>
                   </div>
                   <div class="run-info-content" >
                   <div class="title">Ask customer</div>
                   <div class="agent-utt">
                       <div class="title-data"><ul class="chat-container" id="displayData-${myBotuuids}"></ul></div>
                       <div class="action-links data-send-btn">
                           <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}" data-msg-data="${newTemp}" data-position-id="${positionID}">Send</button>
                           <div class="copy-btn hide" data-msg-id="${myBotuuids}" data-position-id="${positionID}">
                               <i class="ast-copy" data-msg-id="${myBotuuids}" data-position-id="${positionID}"></i>
                           </div>
                       </div>
                   </div>
                   </div>
               </div>
    `;
        }
        return template
    }

    tellToUserTemplate(myBotuuids, newTemp, positionID, srcChannel=null, value='', componentType=null) {
        let template= '';
        if(componentType && componentType == 'dialogAct' && (srcChannel != 'msteams' && srcChannel != 'rtm') ){
          template = `
          <div class="steps-run-data">
          <div class="icon_block">
              <i class="ast-agent"></i>
          </div>
          <div class="run-info-content" >
          <div class="title">Tell Customer</div>
          <div class="agent-utt">
          <div class="title-data" id="displayData-${myBotuuids}">${value}</div>
              <div class="action-links data-send-btn">
                  <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}" data-msg-data="${newTemp}" data-position-id="${positionID}">Send</button>
                  <div class="copy-btn" data-msg-id="${myBotuuids}" data-position-id="${positionID}">
                      <i class="ast-copy" data-msg-id="${myBotuuids}" data-position-id="${positionID}"></i>
                  </div>
              </div>
          </div>
          </div>
      </div>
      `;
           
        }else{ 
            template = `
                <div class="steps-run-data">
                   <div class="icon_block">
                       <i class="ast-agent"></i>
                   </div>
                   <div class="run-info-content" >
                   <div class="title">Tell Customer</div>
                   <div class="agent-utt">
                       <div class="title-data" ><ul class="chat-container" id="displayData-${myBotuuids}"></ul></div>
                       <div class="action-links data-send-btn">
                           <button class="send-run-btn" id="sendMsg" data-msg-id="${myBotuuids}" data-msg-data="${newTemp}" data-position-id="${positionID}">Send</button>
                           <div class="copy-btn hide" data-msg-id="${myBotuuids}" data-position-id="${positionID}">
                               <i class="ast-copy" data-msg-id="${myBotuuids}" data-position-id="${positionID}"></i>
                           </div>
                       </div>
                   </div>
                   </div>
               </div>
    `;
        }
        return template;
    }

    userQueryTemplate(imageFilePath,imageFileNames,myBotuuids, data) {
        let template = `
                <div class="steps-run-data">
                    <div class="icon_block_img">
                        <img src="${imageFilePath}${imageFileNames['USERICON']}">
                    </div>
                    <div class="run-info-content" id="userInput-${myBotuuids}">
                        <div class="title">You Entered -</div>
                        <div class="agent-utt">
                            <div class="title-data">${this.sanitizeHtmlPipe.transform(data.userInput)}</div>
                        </div>
                        
                    </div>
                </div>`;
        return template
    }

    mybotErrorTemplate(imageFilePath,imageFileNames,entityDisplayName) {
        let template = `
                <div class="order-number-info">${entityDisplayName} : 
                        <span style="color:red">Value unidentified</span>
                </div>
                <div>
                    <img src="${imageFilePath}${imageFileNames['WARNING']}" style="padding-right: 8px;">
                    <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
                </div>`;
        return template;
    }

    agentInputToBotTemplate(agentInputEntityName, agentInputId, connectionDetails, myBotDialogPositionId) {
        
        let template = `
                <div class="steps-run-data" id="inputFieldForMyBot">
                    <div class="icon_block">
                        <i class="ast-agent"></i>
                    </div>
                    <div class="run-info-content">
                    <div class="title">Input</div>
                    <div class="agent-utt enter-details-block">
                    <div class="title-data" ><span class="enter-details-title">${agentInputEntityName} : </span>
                    <input #agentInput type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${agentInputId}"  data-conv-id="${connectionDetails.conversationId}" data-bot-id="${connectionDetails.botId}"  data-mybot-input="true" data-position-id="${myBotDialogPositionId}"
                    >
                    </div>
                    </div>
                    </div>
                </div>`;
        return template;
    }

    smallTalkTemplateForTemplatePayload(ele, uuids,data, res, newTemp?){
        let tellOrAskCustomer = data.isPrompt ? 'Ask Customer' : 'Tell Customer';
        let template = `
        <div class="collapse-acc-data before-none" id='smallTalk-${uuids}'>
            <div class="steps-run-data">
            <div class="icon_block">
                <i class="ast-agent"></i>
            </div>
            <div class="run-info-content" >
            <div class="title">${tellOrAskCustomer}</div>
            <div class="agent-utt">
            </div>
            </div>
        </div>
        </div>`
      return template
    }

}
