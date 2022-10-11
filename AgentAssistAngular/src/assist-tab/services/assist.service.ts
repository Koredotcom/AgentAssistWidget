import { Injectable } from '@angular/core';
import { ProjConstants } from 'src/common/constants/proj.cnts';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';

@Injectable({
  providedIn: 'root'
})
export class AssistService {

  constructor(public sanitizeHtmlPipe: SanitizeHtmlPipe) { }

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


  updateSeeMoreButtonForAssist(id, faq_or_article_obj, type) {
    let faqSourceTypePixel = 5;
    let titleElement = document.getElementById("title-" + id);
    let descElement = document.getElementById("desc-" + id);
    let divElement = document.getElementById('faqDiv-' + id);
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let viewLinkElement;
    if (type == ProjConstants.ARTICLE) {
      titleElement = document.getElementById("articletitle-" + id);
      descElement = document.getElementById("articledesc-" + id);
      divElement = document.getElementById('articleDiv-' + id);
      seeMoreElement = document.getElementById('articleseeMore-' + id);
      viewLinkElement = document.getElementById('articleViewLink-' + id);
    }
    if (titleElement && descElement && divElement) {
      titleElement.classList.add('no-text-truncate');
      descElement.classList.add('no-text-truncate');
      let divSectionHeight = descElement.clientHeight || 0;
      if (divSectionHeight > (24 + faqSourceTypePixel)) {
        faq_or_article_obj.showMoreButton = true;
      } else {
        faq_or_article_obj.showMoreButton = false;
        if (type == ProjConstants.ARTICLE) {
          viewLinkElement.classList.remove('hide');
        }
      }
      titleElement.classList.remove('no-text-truncate');
      descElement.classList.remove('no-text-truncate');
    }
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
      <i class="ast-carrotup"></i>
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

  askUserTemplate(uuids) {
    let template = `
    <div class="steps-run-data">
    <div class="icon_block">
        <i class="ast-agent"></i>
    </div>
    <div class="run-info-content" >
    <div class="title">Ask customer</div>
    <div class="agent-utt">
        <div class="title-data"><ul class="chat-container" id="displayData-${uuids}"></ul></div>
        <div class="action-links">
            <button class="send-run-btn" id="sendMsg">Send</button>
            <div class="copy-btn hide">
                <i class="ast-copy"></i>
            </div>
        </div>
    </div>
    </div>
</div>
`;
    return template
  }

  tellToUserTemplate(uuids) {
    let template = `
    <div class="steps-run-data">
    <div class="icon_block">
        <i class="ast-agent"></i>
    </div>
    <div class="run-info-content" >
    <div class="title">Tell Customer</div>
    <div class="agent-utt">
        <div class="title-data" ><ul class="chat-container" id="displayData-${uuids}"></ul></div>
        <div class="action-links">
            <button class="send-run-btn" id="sendMsg">Send</button>
            <div class="copy-btn hide">
                <i class="ast-copy"></i>
            </div>
        </div>
    </div>
    </div>
</div>
`;
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
              <div class="title-data" id="displayData-${uuids}">${ele.value}</div>
              <div class="action-links">
                  <button class="send-run-btn" id="sendMsg">Send</button>
                  <div class="copy-btn">
                      <i class="ast-copy"></i>
                  </div>
              </div>
          </div>
          </div>
      </div>
      </div>`
    return template
  }

  getDialogAreaTemplate(responseId, data) {
    let template = `<div class="task-type" id="dialoguesArea">
      <div class="img-block-info">
          <img src="./images/dialogtask.svg">
      </div>
      <div class="content-dialog-task-type" id="dialogSuggestions-${responseId}">
        <div class="type-with-img-title">Dialog task (${data.suggestions.dialogs.length})</div>
      </div>
    </div>`;
    return template;
  }

  getFaqAreaTemplate(responseId, data) {
    let template = `<div class="task-type" id="faqssArea">
    <div class="img-block-info">
        <img src="./images/kg.svg">
    </div>
    <div class="content-dialog-task-type" id="faqsSuggestions-${responseId}">
        <div class="type-with-img-title">FAQ (${data.suggestions.faqs.length})</div>
        
    </div>
    </div>`;
    return template;
  }

  getArticleAreaTemplate(responseId, data) {
    let template = `<div class="task-type" id="articlesArea">
    <div class="img-block-info">
        <img src="./images/kg.svg">
    </div>
    <div class="content-dialog-task-type" id="articleSuggestions-${responseId}">
        <div class="type-with-img-title">Articles (${data.suggestions.articles.length})</div>
        
    </div>
    </div>`;
    return template;
  }

  dialogTypeInfoTemplate(uuids, ele) {
    let template = `
    <div class="type-info-run-send" id="suggestionId-${uuids}">
        <div class="left-content">
            <div class="title-text" id="automation-${uuids}">${ele.name}</div>
        </div>
        <div class="action-links">
            <button class="send-run-btn" id="run-${uuids}"
            >RUN</button>
            <div class="elipse-dropdown-info" id="showRunForAgentBtn-${uuids}">
                <div class="elipse-icon" id="elipseIcon-${uuids}">
                    <i class="ast-overflow" id="overflowIcon-${uuids}"></i>
                </div>
                <div class="dropdown-content-elipse" id="runAgtBtn-${uuids}">
                    <div class="list-option" id="agentSelect-${uuids}"
                    >Run with Agent Inputs</div>
                </div>
        </div>
    </div>`;
    return template;
  }

  faqTypeInfoTemplate(uuids, index, ele) {
    let template = `
    <div class="type-info-run-send" id="faqDiv-${uuids + index}">
        <div class="left-content" id="faqSection-${uuids + index}">
            <div class="title-text" id="title-${uuids + index}">${ele.question}</div>
            
            
        </div>
    </div>`;
    return template;
  }

  articleTypeInfoTemplate(uuids, index, ele) {
    let template = `
    <div class="type-info-run-send" id="articleDiv-${uuids + index}">
        <div class="left-content" id="articleSection-${uuids + index}">
            <div class="title-text" id="articletitle-${uuids + index}">${ele.title}</div>
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
    <div class="title-data" ><span class="enter-details-title">${agentInputEntityName}: </span>
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

  errorTemplate(imageFilePath, imageFileNames, entityDisplayName) {
    let template = `<div class="order-number-info">${entityDisplayName} : 
      <span style="color:red">Value unidentified</span>
  </div>
  <div>
      <img src="${imageFilePath}${imageFileNames['WARNING']}" style="padding-right: 8px;">
      <span style="font-size: 12px; line-height: 18px; color: #202124;">Incorrect input format<span>
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

}
