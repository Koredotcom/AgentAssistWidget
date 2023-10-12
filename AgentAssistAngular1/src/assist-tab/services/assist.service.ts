import { Injectable } from '@angular/core';
import { ProjConstants, ImageFileNames, ImageFilePath } from 'src/common/constants/proj.cnts';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import * as $ from 'jquery';
import { CommonService } from 'src/common/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AssistService {
  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  constructor(public sanitizeHtmlPipe: SanitizeHtmlPipe,
    public commonService : CommonService) { }

  toggleShowMoreLessButtons(faq_or_article_obj, index, type) {
    let titleElement = document.getElementById("title-" + index);
    let descElement = document.getElementById("desc-" + index);

    if (type == ProjConstants.ARTICLE) {
      titleElement = document.getElementById("articletitle-" + index);
      descElement = document.getElementById("articledesc-" + index);
    }
    faq_or_article_obj.showLessButton = !faq_or_article_obj.showLessButton;
    faq_or_article_obj.showMoreButton = !faq_or_article_obj.showMoreButton;
    if (faq_or_article_obj.showLessButton) {
      titleElement.classList.add('no-text-truncate');
      descElement.classList.add('no-text-truncate');
    } else if (faq_or_article_obj.showMoreButton) {
      titleElement.classList.remove('no-text-truncate');
      descElement.classList.remove('no-text-truncate');
    }
  }


  updateSeeMoreOnAssistTabActive() {
    let faqSuggestionList = $('[id*="faqDiv-"]');
    let actualIdList: any = [];

    faqSuggestionList.each(function () {
      let elemID = this.id.split('-');
      elemID.shift();
      let actualId = elemID.join('-');
      actualIdList.push(actualId);
    });

    actualIdList.forEach(id => {
      this.commonService.updateSeeMoreButtonForAssist(id, ProjConstants.FAQ);
      if(document.getElementById('seeMoreWrapper-' + id)){
        let seeMoreElement = document.getElementById('seeMore-' + id);
        let seeLessElement = document.getElementById('seeLess-' + id);
        $(seeMoreElement).removeClass('hide');
        $(seeLessElement).addClass('hide');
      }
    });
  }


  _createRunTemplateContiner(uuids, intentName) {
    let dynamicBlock = document.getElementById('dynamicBlock');
    let dropdownHtml = `
      <div class="dialog-task-accordiaon-info hide" id="addRemoveDropDown-${uuids}" >
      <div class="accordion-header" id="dropDownHeader-${uuids}">
      <div class="icon-info">
        <i class="ast-rule"></i>
      </div>
      <div class="header-text" id="dropDownTitle-${uuids}">${intentName}</div>
      <i class="ast-carrotup rotate-carrot" id="dialogueArrow-${uuids}"></i>
      <button class="btn-danger" id="terminateAgentDialog-${uuids}">Terminate</button>
      </div>
      <div class="collapse-acc-data" id="dropDownData-${uuids}">
      <div class="override-input-div hide" id="overRideDiv-${uuids}" >
      <button class="override-input-btn" id="overRideBtn-${uuids}">Override Input</button>
      <button class="cancel-override-input-btn hide" id="cancelOverRideBtn-${uuids}">Cancel Override</button>
      </div>

      </div>

      </div>
      `;
    dynamicBlock.innerHTML = dynamicBlock.innerHTML + dropdownHtml;
  }

  getUserMsgSmallTalkTemplate(uuids,data){
    let template = `
    <div class="collapse-acc-data before-none" id='smallTalk-${uuids}'>
    <div class="steps-run-data">
    <div class="icon_block">
        <i class="ast-agent"></i>
    </div>
    <div class="run-info-content" >
    <div class="title">Customer Said - </div>
    <div class="agent-utt">
        <div class="action-links">
            <button class="send-run-btn hide" id="sendMsg" data-msg-id="${uuids}"  data-msg-data="${this.sanitizeHtmlPipe.transform(data.userInput)}" data-text-type="sentence">Send</button>
            <div class="copy-btn hide" data-msg-id="${uuids}" data-msg-data="${this.sanitizeHtmlPipe.transform(data.userInput)}" data-text-type="sentence">
                <i class="ast-copy" data-msg-id="${uuids}" data-msg-data="${this.sanitizeHtmlPipe.transform(data.userInput)}" data-text-type="sentence"></i>
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>`;
    return template;
  }

  askUserTemplate(uuids, newTemp?, positionID?,srcChannel=null, value='', componentType=null) {
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
      <div class="title-data" id="displayData-${uuids}">${value}</div>
          <div class="action-links">
              <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${newTemp}" data-position-id="${positionID}" data-text-type="sentence">Send</button>
              <div class="copy-btn" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence">
                  <i class="ast-copy" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence"></i>
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
          <div class="title-data"><ul class="chat-container" id="displayData-${uuids}" data-msg-id="${uuids}"></ul></div>
          <div class="action-links">
              <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${newTemp}" data-position-id="${positionID}" data-text-type="sentence">Send</button>
              <div class="copy-btn hide" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence">
                  <i class="ast-copy" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence"></i>
              </div>
          </div>
      </div>
      </div>
  </div>
  `;
    }
    return template
  }

  tellToUserTemplate(uuids, newTemp?, positionID?, srcChannel=null, value='', componentType=null) {
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
            <div class="title-data" id="displayData-${uuids}">${value}</div>
            <div class="action-links">
                <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${newTemp}" data-position-id="${positionID}" data-text-type="sentence">Send</button>
                <div class="copy-btn" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence">
                    <i class="ast-copy" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence"></i>
                </div>
            </div>
            <div class="warning-template hide"  id="warningTemp">
                <img class="warning-icon" src="${this.imageFilePath}${this.imageFileNames['infoIcon']}">
                <span class="warning-text">Templates are not supported, visit your bot builder to disable it.</span>
            </div>
          </div>
        </div>
      </div>`;

    }else{
      template = `
      <div class="steps-run-data">
        <div class="icon_block">
            <i class="ast-agent"></i>
        </div>
        <div class="run-info-content" >
          <div class="title">Tell Customer</div>
          <div class="agent-utt">
            <div class="title-data" ><ul class="chat-container" id="displayData-${uuids}" data-msg-id="${uuids}"></ul></div>
            <div class="action-links">
              <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-msg-data="${newTemp}" data-position-id="${positionID}" data-text-type="sentence">Send</button>
              <div class="copy-btn hide" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence">
                  <i class="ast-copy" data-msg-id="${uuids}" data-position-id="${positionID}" data-text-type="sentence"></i>
              </div>
            </div>
            <div class="warning-template hide"  id="warningTemp">
                <img src="${this.imageFilePath}${this.imageFileNames['infoIcon']}">
                <span class="warning-text">Templates are not supported, visit your bot builder to disable it.</span>
            </div>
        </div>
      </div>
  `;
    }
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

  overrideTemplate(uuids){
    let template = `<div class="override-input-div hide" id="overRideDiv-${uuids}" >
    <button class="override-input-btn" id="overRideBtn-${uuids}">Override Input</button>
    <button class="cancel-override-input-btn hide" id="cancelOverRideBtn-${uuids}">Cancel Override</button>
  </div>`;
  return template;
  }

  historySmallTalkTemplate(ele, _id){
    let template = `
      <div class="collapse-acc-data before-none" id='smallTalk-${_id}'>
    <div class="steps-run-data">
    <div class="icon_block">
        <i class="ast-agent"></i>
    </div>
    <div class="run-info-content" >
    <div class="title">Tell Customer</div>
    <div class="agent-utt">
        <div class="title-data" id="displayData-${_id}">${ele.data.text}</div>
        <div class="action-links">
            <button class="send-run-btn" id="sendMsg" data-msg-id="${_id}"  data-msg-data="${ele.data.text}" data-text-type="sentence">Send</button>
            <div class="copy-btn" data-msg-id="${_id}" data-msg-data="${ele.data.text}" data-text-type="sentence">
                <i class="ast-copy" data-msg-id="${_id}" data-msg-data="${ele.data.text}" data-text-type="sentence"></i>
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>`;
    return template;
  }

  smallTalkTemplate(ele, uuids) {
    let template = `
      <div class="collapse-acc-data before-none" id='smallTalk-${uuids}'>
          <div class="steps-run-data">
          <div class="icon_block">
              <i class="ast-agent"></i>
          </div>
          <div class="run-info-content" >
          <div class="title">Tell Customer</div>
          <div class="agent-utt">
              <div class="title-data" id="displayData-${uuids}" data-msg-id="${uuids}">${ele.value}</div>
              <div class="action-links">
                  <button class="send-run-btn" id="sendMsg" data-msg-id="${uuids}" data-text-type="sentence">Send</button>
                  <div class="copy-btn" data-msg-id="${uuids}" data-text-type="sentence">
                      <i class="ast-copy" data-msg-id="${uuids}" data-text-type="sentence"></i>
                  </div>
              </div>
          </div>
          </div>
      </div>
      </div>`
    return template
  }

  getDialogAreaTemplate(responseId, data, imageFilePath, imageFileNames) {
    let template = `<div class="task-type" id="dialoguesArea">
      <div class="img-block-info">
          <img src="${imageFilePath}${imageFileNames['DIALOG_TASK']}">
      </div>
      <div class="content-dialog-task-type" id="dialogSuggestions-${responseId}">
        <div class="type-with-img-title">Dialog task (${data.suggestions.dialogs.length})</div>
      </div>
    </div>`;
    return template;
  }

  getFaqAreaTemplate(responseId, data, imageFilePath, imageFileNames) {
    let template = `<div class="task-type" id="faqssArea">
    <div class="img-block-info">
        <img src="${imageFilePath}${imageFileNames['FAQ_SUGGESTION']}">
    </div>
    <div class="content-dialog-task-type" id="faqsSuggestions-${responseId}">
        <div class="type-with-img-title">FAQ (${data.suggestions.faqs.length})</div>

    </div>
    </div>`;
    return template;
  }

  getArticleAreaTemplate(responseId, data, imageFilePath, imageFileNames) {
    let template = `<div class="task-type" id="articlesArea">
    <div class="img-block-info">
        <img src="${imageFilePath}${imageFileNames['FAQ_SUGGESTION']}">
    </div>
    <div class="content-dialog-task-type" id="articleSuggestions-${responseId}">
        <div class="type-with-img-title">Articles (${data.suggestions.articles.length})</div>

    </div>
    </div>`;
    return template;
  }

  getSnippetAreaTemplate(responseId, data, imageFilePath, imageFileNames){
    let template = `<div class="task-type" id="snippetsArea">
    <div class="img-block-info">
        <img src="${imageFilePath}${imageFileNames['FAQ_SUGGESTION']}">
    </div>
    <div class="content-dialog-task-type" id="snippetsSuggestions-${responseId}">
        <div class="type-with-img-title">Snippets (${data.suggestions?.searchassist?.snippets?.length})</div>

    </div>
</div>`;
    return template;
  }

  dialogTypeInfoTemplate(uuids, index, ele) {
    let template = `
    <div class="type-info-run-send" id="suggestionId-${uuids}">
        <div class="left-content">
            <div class="title-text" id="automation-${uuids + index}">
              <div class="desc-text-bot" title="${ele.name}">${ele.name}</div> 
            </div>
        </div>
        <div class="action-links">
            <button class="send-run-btn" id="run-${uuids + index}" data-child-bot-id="${ele.childBotId}" data-child-bot-name="${ele.childBotName}"
            data-dialog-run='${JSON.stringify(ele)}'>RUN</button>
            <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uuids + index}">
                <div class="elipse-icon" id="elipseIcon-${uuids + index}">
                    <i class="ast-overflow" id="overflowIcon-${uuids + index}"></i>
                </div>
                <div class="dropdown-content-elipse" id="runAgtBtn-${uuids + index}" data-dialog-run='${JSON.stringify(ele)}'>
                    <div class="list-option" id="agentSelect-${uuids + index}" data-child-bot-id="${ele.childBotId}" data-child-bot-name="${ele.childBotName}"
                    data-dialog-run='${JSON.stringify(ele)}'>Run with Agent Inputs</div>
                </div>
        </div>
    </div>`;
    return template;
  }

  faqTypeInfoTemplate(uuids, index, ele) {
    let template = `
    <div class="type-info-run-send" id="faqDiv-${uuids + index}">
        <div class="left-content" id="faqSection-${uuids + index}">
            <div class="title-text" id="title-${uuids + index}" >
            <div class="desc-text-bot" title="${ele.displayName ? ele.displayName : ele.question}"> ${(ele.answer && ele.answer.length > 1) ? (ele.displayName ? ele.displayName : ele.question + ' 1/' + ele.answer.length) : ele.displayName ? ele.displayName : ele.question}</div> 
            </div>
        </div>
    </div>`;
    return template;
  }

  articleTypeInfoTemplate(uuids, index, ele) {
    let template = `
    <div class="type-info-run-send" id="articleDiv-${uuids + index}">
        <div class="left-content" id="articleSection-${uuids + index}">
            <div class="title-text" id="articletitle-${uuids + index}" title="${ele.title}">${ele.title}</div>
        </div>

    </div>`;
    return template;
  }

  agentInputToBotTemplate(agentInputEntityName, agentInputId) {
    let template = `
    <div class="steps-run-data" id="inputFieldForAgent">
    <div class="icon_block">
    <i class="ast-agent"></i>
    </div>
    <div class="run-info-content">
    <div class="title">Input overridden. Please provide the input</div>
    <div class="agent-utt enter-details-block">
    <div class="title-data" ><span class="enter-details-title">${this.sanitizeHtmlPipe.transform(agentInputEntityName)}: </span>
    <input type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${agentInputId}">
    </div>
    </div>
    </div>
    </div>`
    return template;
  }
  userQueryTemplate(titleText,imageFilePath,imageFileNames,uuid, data) {
      let template = `
      <div class="steps-run-data last-msg-white-bg">
          <div class="icon_block_img">
              <img src="${imageFilePath}${imageFileNames['USERICON']}">
          </div>
          <div class="run-info-content" id="userInput-${uuid}">
              <div class="title">${titleText}</div>
              <div class="agent-utt">
                  <div class="title-data">"${this.sanitizeHtmlPipe.transform(data.userInput)}"</div>
              </div>

          </div>
      </div>`;
      return template
  }

  errorTemplate(imageFilePath, imageFileNames, entityDisplayName, entityType) {
    let template = `<div class="order-number-info">${entityDisplayName} :
      <span style="color:red">Value unidentified</span>
      <span style="font-size: 12px; line-height: 18px; color: #202124; padding-left: 10px"> { Expected Format: ${entityType} }<span>
  </div>`
  // <div>
  //     <img src="${imageFilePath}${imageFileNames['WARNING']}" style="padding-right: 8px;">
  //     <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
  // </div>`
    return template;
  }

  agentUttInfoTemplate(data , responseId, imageFilePath, imageFileNames){
    let template =  `
    <div class="agent-utt-info" id="agentUttInfo-${responseId}">
    <div class="user-img">
        <img src="${imageFilePath}${imageFileNames['USERICON']}">
    </div>
    <div class="text-user" >${this.sanitizeHtmlPipe.transform(data.userInput)}</div>
    </div>
    <div class="dialog-task-run-sec hide" id="automationSuggestions-${responseId}">
    </div>`
    return template;
  }

  // agentInputToBotTemplate(agentInputEntityName, agentInputId) {

  //     let template = `
  //             <div class="steps-run-data" id="inputFieldForMyBot">
  //                 <div class="icon_block">
  //                     <i class="ast-agent"></i>
  //                 </div>
  //                 <div class="run-info-content">
  //                 <div class="title">Input</div>
  //                 <div class="agent-utt enter-details-block">
  //                 <div class="title-data" ><span class="enter-details-title">${agentInputEntityName} : </span>
  //                 <input #agentInput type="text" placeholder="Enter Value" class="input-text chat-container" id="agentInput-${agentInputId}"
  //                 >
  //                 </div>
  //                 </div>
  //                 </div>
  //             </div>`;
  //     return template;
  // }

  historyFaqSuggestionsContainer(eleid, ele, res){
    $(`#faqsSuggestions-${eleid} #check-${ele}`).addClass('hide');
    let faqs = $(`#faqsSuggestions-${eleid} .type-info-run-send #faqSection-${ele}`);
    let a = $(`#faqsSuggestions-${eleid} #faqDiv-${ele}`);
    let faqActionHtml = `<div class="action-links">
        <button class="send-run-btn" id="sendMsg" data-msg-id="${ele}"  data-msg-data="${res.components[0].data.text[0]}" data-text-type="faq" data-title="${res.components[0].data.title}" data-content-id="${res.Component[0].data.taskRefId}">Send</button>
        <div class="copy-btn" data-msg-id="${ele}" data-msg-data="${res.components[0].data.text[0]}" data-text-type="faq" data-title="${res.components[0].data.title}" data-content-id="${res.Component[0].data.taskRefId}">
        <i class="ast-copy" data-msg-id="${ele}" data-msg-data="${res.components[0].data.text[0]}" data-text-type="faq" data-title="${res.components[0].data.title}" data-content-id="${res.Component[0].data.taskRefId}"></i>
        </div>
        </div>`;
    a.append(faqActionHtml);
    faqs.append(`<div class="desc-text" id="desc-${ele}">${res.components[0].data.text[0]}</div>`);
    ele.answer = res.components[0].data.text;
    if(res.components[0].data.text && res.components[0].data.text.length > 1){
      let seeMoreWrapper = `<div class="see-more-wrapper-info hide" id="seeMoreWrapper-${eleid}"></div>`;
      faqs.append(seeMoreWrapper);
      let faqIndex = 0;
      for(let ans of ele.answer){
          $(`#seeMoreWrapper-${eleid}`).append(`<div class="individual-data-text">
              <div class="desc-text-individual" id="desc-faq-${eleid+faqIndex.toString()}">${ans}</div>
              <div class="seemore-link-text hide" id="seeMore-${eleid+faqIndex.toString()}" data-see-more="true" data-actual-id="${eleid}">${this.projConstants.READ_MORE}</div>
              <div class="seemore-link-text hide" id="seeLess-${eleid+faqIndex.toString()}" data-see-less="true" data-actual-id="${eleid}">${this.projConstants.READ_LESS}</div>
              <div class="actions-send-copy">
                  <div class="send-icon" data-msg-id="${eleid+faqIndex.toString()}"  data-msg-data="${ans}" data-position-id="${eleid}">
                      <i class="ast-ast-send" data-msg-id="${eleid+faqIndex.toString()}"  data-msg-data="${ans}" data-position-id="${eleid}"></i>
                  </div>
                  <div class="copy-icon" data-msg-id="${eleid+faqIndex.toString()}" data-msg-data="${ans}" data-position-id="${eleid}">
                      <i class="ast-copy" data-msg-id="${eleid+faqIndex.toString()}" data-msg-data="${ans}" data-position-id="${eleid}"></i>
                  </div>
              </div>
          </div>`);
          faqIndex++;
      }
  }


    let faqstypeInfo = $(`#faqsSuggestions-${eleid} .type-info-run-send #faqSection-${ele}`);
    let seeMoreButtonHtml = `
      <button class="ghost-btn hide" id="seeMore-${ele}" data-see-more="true">Show more</button>
      <button class="ghost-btn hide" id="seeLess-${ele}" data-see-less="true">Show less</button>
      `;
    faqstypeInfo.append(seeMoreButtonHtml);
    setTimeout(() => {
        this.commonService.updateSeeMoreButtonForAssist(ele, this.projConstants.FAQ);
    }, 1000);
  }

}
