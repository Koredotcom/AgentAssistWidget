import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants, ImageFilePath, ImageFileNames, ConnectionDetails, IdReferenceConst } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RawHtmlPipe } from 'src/common/pipes/raw-html.pipe';
import { RemoveSpecialCharPipe } from 'src/common/pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from 'src/common/pipes/replace-quot-string-with-double-quot.pipe';
import { SanitizeHtmlPipe } from 'src/common/pipes/sanitize-html.pipe';
import { CommonService } from 'src/common/services/common.service';
import { DesignAlterService } from 'src/common/services/design-alter.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { TemplateRenderClassService } from 'src/common/services/template-render-class.service';
import { WebSocketService } from 'src/common/services/web-socket.service';
import * as $ from 'jquery';
import { KoreGenerateuuidPipe } from 'src/common/pipes/kore-generateuuid.pipe';
import { AssistService } from 'src/assist-tab/services/assist.service';
import { HtmlEntityPipe } from 'src/common/pipes/html-entity.pipe';
import { EVENTS } from 'src/common/helper/events';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss'],
  providers: [RandomUUIDPipe]
})
export class AssistComponent implements OnInit {

  @Output() scrollToBottomEvent = new EventEmitter();
  @ViewChild('dynamicBlockRef') dynamicBlockRef: ElementRef;
  @Output() handleTerminatePopup = new EventEmitter();

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;
  isOverRideMode: boolean = false;
  agentAssistResponse: any = {};
  dropdownHeaderUuids: any;
  dialogPositionId: string;
  scrollAtEnd: boolean = true;
  connectionDetails: any;
  isInitialDialogOnGoing: boolean = false
  interruptDialog: any = {};
  answerPlaceableIDs: any = [];
  entitiestValueArray: any = [];
  previousEntitiesValue: string;
  numberOfNewMessages: number = 0;
  newlyAddedMessagesUUIDlist = [];
  newlyAddedIdList = [];
  lastElementBeforeNewMessage: any;
  removedIdListOnScroll: any = [];
  welcomeMsgResponse: any;
  waitingTimeForUUID: number = 100;

  constructor(private templateRenderClassService: TemplateRenderClassService, public handleSubjectService: HandleSubjectService, public randomUUIDPipe: RandomUUIDPipe,
    public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe,
    public commonService: CommonService, public websocketService: WebSocketService,
    public designAlterService: DesignAlterService, public rawHtmlPipe: RawHtmlPipe,
    public koreGenerateuuidPipe: KoreGenerateuuidPipe, public assisttabService: AssistService,
    public htmlEntityPipe: HtmlEntityPipe) {

  }

  ngOnInit(): void {
    this.subscribeEvents();

  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      console.log(runEventObj, 'run event obj');
      if (Object.keys(runEventObj).length > 0) {
        if (runEventObj && !runEventObj?.agentRunButton && !this.commonService.isAutomationOnGoing) {
          console.log(runEventObj, "run event obj");
          this.runDialogForAssistTab(runEventObj);
          this.scrollToBottom();
        } else if (runEventObj && !runEventObj?.agentRunButton && this.commonService.isAutomationOnGoing) {
          this.interruptDialog = runEventObj;
          console.log(this.interruptDialog, "interrupt dialog");
          this.handleTerminatePopup.emit({ status: true, type: this.projConstants.INTERRUPT });
        }
      }
    });

    let subscription2 = this.websocketService.agentAssistResponse$.subscribe((response: any) => {
      if (response && Object.keys(response).length > 0) {
        this.processAgentAssistResponse(response, this.connectionDetails.botId);
      }

    });

    let subscription3 = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      console.log(endoftaskresponse, "end of task response");
      if (endoftaskresponse && this.dialogPositionId == endoftaskresponse.positionId) {
        this.dialogTerminatedOrIntrupptedInMyBot();
      }
    })

    let subscription4 = this.handleSubjectService.terminateClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.ASSIST) {
        console.log(response, "terminate click event");
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntrupptedInMyBot();
      }
    });

    let subscription5 = this.handleSubjectService.interruptClickEventSubject.subscribe((response: any) => {
      console.log(response, "interrupt click event");
      if (response && response?.activeTab == this.projConstants.ASSIST) {
        console.log(response, "inside interrupt mybot component");
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntrupptedInMyBot();
        this.runDialogForAssistTab(this.interruptDialog);
      }

    });

    let subscription6 = this.websocketService.agentAssistUserMessageResponse$.subscribe((response: any) => {
      console.log(response, "user message");
      if (response && response.botId) {
        this.updateNumberOfMessages();
        this.processUserMessages(response, response.conversationId, response.botId);
        // removingSendCopyBtnForCall();
      }
    });

    let subscription7 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
        console.log("connection details, 'inside assist tab");

      }
    });

    let subscription8 = this.websocketService.userMessageResponse$.subscribe((userMsgResponse : any) =>{
      console.log(userMsgResponse, "usermsg response in assist tab");
      
    })
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);
    this.subscriptionsList.push(subscription7);
    this.subscriptionsList.push(subscription8);
  }

  terminateButtonClick(uuid) {
    console.log("terminate button click", IdReferenceConst.ASSISTTERMINATE + '-' + uuid);
    document.getElementById(IdReferenceConst.ASSISTTERMINATE + '-' + uuid).addEventListener('click', (event) => {
      console.log("terminate click");
      this.handleTerminatePopup.emit({ status: true, type: this.projConstants.TERMINATE });
    });
  }

  handleOverridBtnClick(uuid, dialogId) {
    console.log("inside handle overridebtn click", IdReferenceConst.OVERRIDE_BTN + '-' + uuid);
    document.getElementById(IdReferenceConst.OVERRIDE_BTN + '-' + uuid).addEventListener('click', (event) => {
      console.log("override btn click event");

      let overRideObj: any = {
        "agentId": "",
        "botId": this.connectionDetails.botId,
        "conversationId": this.connectionDetails.conversationId,
        "query": "",
        "enable_override_userinput": true,
        'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
        "positionId": dialogId
      }
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
      let runInfoContent: any = document.getElementById(`dropDownData-${this.dropdownHeaderUuids}`);
      let agentInputId = this.randomUUIDPipe.transform();
      let agentInputEntityName = 'EnterDetails';
      if (this.agentAssistResponse.newEntityDisplayName || this.agentAssistResponse.newEntityName) {
        agentInputEntityName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
      } else if (this.agentAssistResponse.entityDisplayName || this.agentAssistResponse.entityName) {
        agentInputEntityName = this.agentAssistResponse.entityDisplayName ? this.agentAssistResponse.entityDisplayName : this.agentAssistResponse.entityName;
      }
      let agentInputToBotHtml = this.assisttabService.agentInputToBotTemplate(agentInputEntityName, agentInputId);
      $(runInfoContent).append(agentInputToBotHtml);
      if (document.getElementById('agentInput-' + agentInputId)) {
        document.getElementById('agentInput-' + agentInputId).focus();
        runInfoContent.querySelector(`#agentInput-${agentInputId}`).addEventListener('keypress', (e: any) => {
          let key = e.which || e.keyCode || 0;
          if (key === 13) {
            this.AgentAssist_run_click({ intentName: e.target.value }, this.dialogPositionId);
            console.log("enter clicked");
          }
        });
      }
      $(`#overRideBtn-${uuid}`).addClass('hide');
      $(`#cancelOverRideBtn-${uuid}`).removeClass('hide');
      this.isOverRideMode = true;
      this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
      this.scrollToBottom();
    });
  }

  handleCancelOverrideBtnClick(uuid, dialogId) {
    document.getElementById(IdReferenceConst.CANCEL_OVERRIDE_BTN + '-' + uuid).addEventListener('click', (event) => {
      let overRideObj: any = {
        "agentId": "",
        "botId": this.connectionDetails.botId,
        "conversationId": this.connectionDetails.conversationId,
        "query": "",
        "enable_override_userinput": false,
        'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
        "positionId": dialogId
      }
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj);
      $(`#overRideBtn-${uuid}`).removeClass('hide');
      $(`#cancelOverRideBtn-${uuid}`).addClass('hide');
      $('#inputFieldForAgent').remove();
      this.isOverRideMode = false;
      this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
      this.scrollToBottom();
    })
  }

  clickEvents(eventName, uuid?, dialogId?) {
    if (eventName == IdReferenceConst.ASSISTTERMINATE) {
      this.terminateButtonClick(uuid)
    } else if (eventName == IdReferenceConst.OVERRIDE_BTN) {
      this.handleOverridBtnClick(uuid, dialogId);
    } else if (eventName == IdReferenceConst.CANCEL_OVERRIDE_BTN) {
      this.handleCancelOverrideBtnClick(uuid, dialogId);
    } else if (eventName == IdReferenceConst.DROPDOWN_HEADER) {
      this.designAlterService.handleDropdownToggle(uuid);
    }
  }

  runDialogForAssistTab(data, idTarget?, runInitent?) {
    console.log("run dialog for assist tab");

    let uuids = this.koreGenerateuuidPipe.transform();
    this.dropdownHeaderUuids = uuids;
    this.commonService.isAutomationOnGoing = true;
    // let appStateStr = localStorage.getItem('agentAssistState') || '{}';
    // let appState = JSON.parse(appStateStr);
    // if (appState[this.connectionDetails.conversationId]) {
    //   appState[this.connectionDetails.conversationId].automationGoingOn = this.commonService.isAutomationOnGoing;
    //   appState[this.connectionDetails.conversationId]['automationGoingOnAfterRefresh'] = this.commonService.isAutomationOnGoing
    //   localStorage.setItem('agentAssistState', JSON.stringify(appState))
    // }
    let dialogId = this.randomUUIDPipe.transform(IdReferenceConst.positionId);
    this.dialogPositionId = dialogId;
    this.assisttabService._createRunTemplateContiner(uuids, data.intentName);
    if (idTarget) {
      let ids = idTarget.split('-');
      ids.shift();
      let joinedIds = ids.join('-');
      let dialogID = document.getElementById(`suggestionId-${joinedIds}`);
      if (dialogID) {
        dialogID.style.borderStyle = "solid";
      }
    }
    // $(`${!data.useCaseList}` ? '.dialog-task-run-sec' : '.content-dialog-task-type .type-info-run-send').each((i, ele) => {
    //   let id = ele.id?.split('-');
    //   id.shift();
    //   if (joinedIds.includes(id.join('-'))) {
    //     idsOfDropDown = ele.id;
    //   }
    // });

    let addRemoveDropDown = document.getElementById(`addRemoveDropDown-${uuids}`);
    addRemoveDropDown?.classList.remove('hide');
    $(`#endTaks-${uuids}`).removeClass('hide');
    if (!runInitent) {
      this.AgentAssist_run_click(data, this.dialogPositionId, this.projConstants.INTENT);
    }
    setTimeout(() => {
      this.clickEvents(IdReferenceConst.ASSISTTERMINATE, uuids);
      this.clickEvents(IdReferenceConst.DROPDOWN_HEADER, uuids);
    }, 1000);
  }

  AgentAssist_run_click(dialog, dialogPositionId, intent?) {
    let connectionDetails: any = Object.assign({}, ConnectionDetails);
    connectionDetails.value = dialog.intentName;
    if (dialog.intentName && intent) {
      connectionDetails.intentName = dialog.intentName;
    }
    connectionDetails.positionId = dialogPositionId;
    let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
    this.scrollToBottom();
  }

  processUserMessages(data, conversationId, botId) {
    let _id = this.randomUUIDPipe.transform();
    let resultMsgResponse = this.templateRenderClassService.getMessageResponseForUserMessages(data, botId)
    let titleText = '';
    let userQueryHtml = '';
    if (this.isOverRideMode) {
      titleText = "YouEntered -";
      userQueryHtml = this.assisttabService.userQueryTemplate(titleText, this.imageFilePath, this.imageFileNames, _id, data);
    } else {
      titleText = "Customer Said -"
      userQueryHtml = this.assisttabService.userQueryTemplate(titleText, this.imageFilePath, this.imageFileNames, _id, data);
    }
    let addUserQueryTodropdownData = document.getElementById(`dropDownData-${this.dropdownHeaderUuids}`);
    addUserQueryTodropdownData.innerHTML = addUserQueryTodropdownData.innerHTML + userQueryHtml;
    let entityHtml = $(`#dropDownData-${this.dropdownHeaderUuids}`).find(`#userInput-${_id}`);
    let entityDisplayName = this.agentAssistResponse.entityDisplayName ? this.agentAssistResponse.entityDisplayName : this.agentAssistResponse.entityName;
    if (this.agentAssistResponse.newEntityDisplayName || this.agentAssistResponse.newEntityName) {
      entityDisplayName = this.agentAssistResponse.newEntityDisplayName ? this.agentAssistResponse.newEntityDisplayName : this.agentAssistResponse.newEntityName;
    }
    if (data.entityValue && !data.isErrorPrompt && entityDisplayName) {
      entityHtml.append(`<div class="order-number-info">${entityDisplayName} : ${this.sanitizeHtmlPipe.transform(data.userInput)}</div>`);
    } else {
      if (data.isErrorPrompt && entityDisplayName) {
        let entityHtmls = this.assisttabService.errorTemplate(this.imageFilePath, this.imageFileNames, entityDisplayName);
        entityHtml.append(entityHtmls);
      }
    }
    let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(resultMsgResponse)[0].innerHTML;
    // let a = document.getElementById(IdReferenceConst.DROPDOWNDATA + `-${this.dropdownHeaderUuids}`);
    // if (a) {
    //   a.innerHTML = a.innerHTML + html;
    // }
  }


  processAgentAssistResponse(data, botId) {
    let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
    let uuids = this.koreGenerateuuidPipe.transform();
    let responseId = uuids;

    if (!this.commonService.isAutomationOnGoing && data.intentName && !data.suggestions && !this.isInitialDialogOnGoing) {
      let appStateStr = localStorage.getItem('agentAssistState') || '{}';
      let appState = JSON.parse(appStateStr);
      let isInitialTaskRanORNot;
      if (appState[this.connectionDetails.conversationId]) {
        isInitialTaskRanORNot = appState[this.connectionDetails.conversationId]['initialTaskGoingOn']
      }
      if (!isInitialTaskRanORNot) {
        this.runDialogForAssistTab(data, `onInitDialog-123456`, "onInitRun");
      }
    }
    if (this.commonService.isCallConversation === true && data.suggestions) {
      let buldHtml = `
        <div class="buld-count-utt" id="buldCount-${uuids}">
                    <i class="ast-bulb" id="buldCountAst-${uuids}"></i>
                    <span class="count-number" id="buldCountNumber-${uuids}">${(data.suggestions.dialogs?.length || 0) + (data.suggestions.faqs?.length || 0)}</span>
                </div>`;

      let attrs = $('#scriptContainer .other-user-bubble .bubble-data');
      $(attrs).last().attr('id', uuids)
      attrs.each((i, data) => {
        if (data.id === uuids) {
          $(`#${data.id}`).append(buldHtml);
        }
      });
    }
    if (!this.commonService.isAutomationOnGoing && data.suggestions && this.answerPlaceableIDs.length == 0) {
      // $('#welcomeMsg').addClass('hide');
      let dynamicBlock = document.getElementById('dynamicBlock');
      let suggestionsblock = $('#dynamicBlock .dialog-task-run-sec');
      if (suggestionsblock.length >= 0) {
        suggestionsblock.each((i, ele) => {
          $('#dynamicBlock .agent-utt-info').each((i, elem) => {
            let elemID = elem.id.split('-');
            elemID.shift();
            if (ele.id.includes(elemID.join('-'))) {
              let foundIndex = this.commonService.automationNotRanArray.findIndex((ele) => ele.id === elem.id);
              if (foundIndex == -1) {
                this.commonService.automationNotRanArray.push({ name: elem.innerText.trim(), id: elem.id });
                let appStateStr = localStorage.getItem('agentAssistState') || '{}';
                let appState = JSON.parse(appStateStr);
                let convState = appState[this.connectionDetails.conversationId] || {};
                if (!appState[this.connectionDetails.conversationId]) {
                  convState = appState[this.connectionDetails.conversationId] = {};
                } else {

                  if (!convState['assistTab']) {
                    convState['assistTab'] = {};
                  }
                  if (!convState['assistTab']['automationsNotRanArray']) {
                    convState['assistTab']['automationsNotRanArray'] = [];
                  }
                  convState['assistTab']['automationsNotRanArray'] = this.commonService.automationNotRanArray;
                  localStorage.setItem('agentAssistState', JSON.stringify(appState))
                }
              }
              // elem.remove();
            }
          })
          // ele.remove();
        })
      }
      this.commonService.userIntentInput = data.userInput;
      let htmls = `
<div class="agent-utt-info" id="agentUttInfo-${responseId}">
<div class="user-img">
    <img src="./images/userIcon.svg">
</div>
<div class="text-user" >${data.userInput}</div>
</div>
<div class="dialog-task-run-sec hide" id="automationSuggestions-${responseId}">
</div>`;

      dynamicBlock.innerHTML = dynamicBlock.innerHTML + htmls;

      if (data.type === 'intent' || data.type === 'text') {
        let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
        automationSuggestions.classList.remove('hide');
      }

      if (data.suggestions) {

        if (data.suggestions.dialogs?.length > 0) {

          let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
          let dialogAreaHtml = this.assisttabService.getDialogAreaTemplate(responseId, data);
          automationSuggestions.innerHTML += dialogAreaHtml;
        }

        if (data.suggestions.faqs?.length > 0) {
          let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
          let faqAreaHtml = this.assisttabService.getFaqAreaTemplate(responseId, data);
          automationSuggestions.innerHTML += faqAreaHtml;
        }

        if (data?.suggestions?.searchassist && Object.keys(data.suggestions.searchassist).length > 0) {
          data.suggestions = this.commonService.formatSearchResponse(data.suggestions);
          if (data.suggestions.articles?.length > 0) {
            let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
            let articleAreaHtml = this.assisttabService.getArticleAreaTemplate(responseId, data);
            automationSuggestions.innerHTML += articleAreaHtml;
          }

          data.suggestions.articles?.forEach((ele, index) => {
            let articleSuggestions = document.getElementById(`articleSuggestions-${responseId}`);

            let articleHtml = this.assisttabService.articleTypeInfoTemplate(uuids, index, ele);

            articleSuggestions.innerHTML += articleHtml;
            let articles = $(`.type-info-run-send #articleSection-${uuids + index}`);
            if (!ele.content) {
              let checkHtml = `
                        <i class="ast-carrotup" data-conv-id="${data.conversationId}"
                        data-bot-id="${botId}" data-intent-name="${ele.title}"
                        data-check="true" id="articlecheck-${uuids + index}"></i>`;
              articles.append(checkHtml);
            } else {
              let a = $(`#articleDiv-${uuids + index}`);
              let articleActionHtml = `<div class="action-links">
                            <button class="send-run-btn" id="articlesendMsg" data-msg-id="article-${uuids + index}" data-msg-data='${ele.content}'>Send</button>
                            <div class="copy-btn" data-msg-id="article-${uuids + index}" data-msg-data='${ele.content}'>
                                <i class="ast-copy" data-msg-id="article-${uuids + index}" data-msg-data='${ele.content}'></i>
                            </div>
                        </div>`;
              a.append(articleActionHtml);
              articles.append(`<div class="desc-text" id="articledesc-${uuids + index}">${ele.content}</div>`);
              if (ele.link) {
                let fullArticleLinkHtml = `<div class="link-view-full-article hide" id="articleViewLink-${uuids + index}"><a href="${ele.link}" target="_blank">View Full Article</a></div>`
                document.getElementById(`articledesc-${uuids + index}`).insertAdjacentHTML('beforeend', fullArticleLinkHtml);
              }

              let articlestypeInfo = $(`.type-info-run-send #articleSection-${uuids + index}`);
              let seeMoreButtonHtml = `
                    <button class="ghost-btn hide" style="font-style: italic;" id="articleseeMore-${uuids + index}" data-article-see-more="true">Show more</button>
                    <button class="ghost-btn hide" style="font-style: italic;" id="articleseeLess-${uuids + index}" data-article-see-less="true">Show less</button>
                    `;
              articlestypeInfo.append(seeMoreButtonHtml);
              // setTimeout(() => {
              //      this.assisttabService.updateSeeMoreButtonForAssist(uuids + index,'article');
              // }, 100);
            }
          })

        }

        data.suggestions.dialogs?.forEach((ele, index) => {
          ele.entities?.length > 0 ? (this.entitiestValueArray = ele.entities) : '';

          let dialogSuggestions = document.getElementById(`dialogSuggestions-${responseId}`);
          let dialogsHtml = this.assisttabService.dialogTypeInfoTemplate(uuids, ele);
          dialogSuggestions.innerHTML += dialogsHtml;
          if (ele.entities?.length > 0) {
            this.previousEntitiesValue = JSON.stringify(ele.entities);
            let entitesDiv = `<div class="entity-values-container" id="entitesDiv-${uuids}">
                    <fieldset class="fieldsets">
                        <legend>ENTITY VALUES</legend>
                        </fieldset>
                <div class="edit-values-btn" id="entityEdit-${uuids}">Edit Values</div>
                <div class="edit-values-btn restore hide" id="restorebtn-${uuids}">Restore Values</div>
            </div>`;
            dialogSuggestions.innerHTML += entitesDiv;
            let enentiesDomDiv = $(`#entitesDiv-${uuids}`).find('.fieldsets');
            ele.entities?.forEach((eleData, i) => {

              let eachEntitiesDiv = `
                     <div class="entity-row-data" id="enityNameAndValue-${i}">
                        <div class="label-data">${eleData.name}</div>
                        <div class="edited-status hide">
                            <i class="ast-edited"></i>
                            <span>edited</span>
                        </div>
                        <div class="entity-input-content-data">
                            <div class="entity-value" id="initialentityValue-${i}" >${eleData.value}</div>
                            <div class="entity-input">
                                <input type="text" id="entityValue-${i}"
                                 value='${eleData.value}'>
                            </div>
                        </div>
                    </div>`;
              enentiesDomDiv.append(eachEntitiesDiv);

            });
            let entiteSaveAndCancelDiv = `<div class="save-reset-cancel hide" id='saveAndCancel-${uuids}'>
                 <div class="save-reset-disabled" >
                     <i class="ast-check-right  disabled-color"></i>
                     <span id='savebtn-${uuids}'>Save</span>
                 </div>
                 <div class="cancel-btn" id="cancelBtn-${uuids}">Cancel</div>
             </div>`;
            enentiesDomDiv.append(entiteSaveAndCancelDiv);
          }
        });

        data.suggestions.faqs?.forEach((ele, index) => {
          let faqsSuggestions = document.getElementById(`faqsSuggestions-${responseId}`);

          let faqHtml = this.assisttabService.faqTypeInfoTemplate(uuids, index, ele)

          faqsSuggestions.innerHTML += faqHtml;
          let faqs = $(`.type-info-run-send #faqSection-${uuids + index}`);
          if (!ele.answer) {
            let positionID = 'dg-' + this.koreGenerateuuidPipe.transform();
            let checkHtml = `
        <i class="ast-carrotup" id="check-${uuids + index}"></i>`;
            $(`#faqDiv-${uuids + index}`).addClass('is-dropdown-show-default');
            document.getElementById(`title-${uuids + index}`).insertAdjacentHTML('beforeend', checkHtml);
          } else {
            let a = $(`#faqDiv-${uuids + index}`);
            let faqActionHtml = `<div class="action-links">
            <button class="send-run-btn" id="sendMsg">Send</button>
            <div class="copy-btn">
                <i class="ast-copy"></i>
            </div>
            </div>`;
            a.append(faqActionHtml);
            faqs.append(`<div class="desc-text" id="desc-${uuids + index}">${ele.answer}</div>`);

            let faqstypeInfo = $(`.type-info-run-send #faqSection-${uuids + index}`);
            let seeMoreButtonHtml = `
                <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${uuids + index}" data-see-more="true">Show more</button>
                <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${uuids + index}" data-see-less="true">Show less</button>
                `;
            faqstypeInfo.append(seeMoreButtonHtml);
            // setTimeout(() => {
            //     updateSeeMoreButtonForAssist(uuids + index);
            // }, waitingTimeForSeeMoreButton);
          }

          if (data.suggestions.faqs.length === 1 && !ele.answer) {
            document.getElementById(`check-${uuids + index}`).click();
            $(`#check-${uuids + index}`).addClass('hide');
            $(`#faqDiv-${uuids + index}`).removeClass('is-dropdown-show-default');
          }
        })
      }
      setTimeout(() => {
        this.updateNewMessageUUIDList(responseId);
      }, this.waitingTimeForUUID);
      this.collapseOldDialoguesInAssist();
    } else {
      if (data.type === 'text' && data.suggestions) {
        let faqAnswerIdsPlace;
        data.suggestions.faqs.forEach((ele) => {
          faqAnswerIdsPlace = this.answerPlaceableIDs.find(ele => ele.input == data.value);
          let splitedanswerPlaceableID = faqAnswerIdsPlace.id.split('-');
          splitedanswerPlaceableID.shift();
          let faqAnswerSendMsg = $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find("[id='sendMsg']");
          $(faqAnswerSendMsg).attr('data-msg-data', ele.answer)
          let faqAnswerCopyMsg = $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find(".copy-btn");
          $(faqAnswerCopyMsg).attr('data-msg-data', ele.answer)
          $(`#${faqAnswerIdsPlace.id}`).html(ele.answer);
          $(`#${faqAnswerIdsPlace.id}`).attr('data-answer-render', 'true');
          let faqs = $(`#dynamicBlock .type-info-run-send #faqSection-${splitedanswerPlaceableID.join('-')}`);
          let seeMoreButtonHtml = `
        <button class="ghost-btn hide" style="font-style: italic;" id="seeMore-${splitedanswerPlaceableID.join('-')}" data-see-more="true">Show more</button>
        <button class="ghost-btn hide" style="font-style: italic;" id="seeLess-${splitedanswerPlaceableID.join('-')}" data-see-less="true">Show less</button>
        `;
          faqs.append(seeMoreButtonHtml);
          // setTimeout(() => {
          //     updateSeeMoreButtonForAssist(splitedanswerPlaceableID.join('-'));
          // }, waitingTimeForSeeMoreButton);
        })
        if (faqAnswerIdsPlace) {
          let index = this.answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
          this.answerPlaceableIDs.splice(index, 1);
        }

      }
      if (data.suggestions) {
        automationSuggestions.length >= 1 ? (automationSuggestions[automationSuggestions.length - 1].classList.remove('hide')) : ''
        this.collapseOldDialoguesInAssist();
      }
    }

    if (this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || data.positionId == this.dialogPositionId)) {
      $(`#overRideBtn-${this.dropdownHeaderUuids}`).removeClass('hide');
      $(`#cancelOverRideBtn-${this.dropdownHeaderUuids}`).addClass('hide');
      $("#inputFieldForAgent").remove();
      let runInfoContent = $(`#dropDownData-${this.dropdownHeaderUuids}`);
      setTimeout(() => {
        if (data.entityName) {
          this.agentAssistResponse = {};
          this.agentAssistResponse = Object.assign({}, data);
        }
      }, 10);
      let askToUserHtml = this.assisttabService.askUserTemplate(uuids)

      let tellToUserHtml = this.assisttabService.tellToUserTemplate(uuids)
      if (data.isPrompt) {
        $(`.override-input-div`).removeClass('hide');
        $(`#dropDownData-${this.dropdownHeaderUuids}`).append(askToUserHtml);
        this.clickEvents(IdReferenceConst.OVERRIDE_BTN, this.dropdownHeaderUuids, this.dialogPositionId);
        this.clickEvents(IdReferenceConst.CANCEL_OVERRIDE_BTN, this.dropdownHeaderUuids, this.dialogPositionId);
      } else {
        $(`.override-input-div`).addClass('hide');
        $(runInfoContent).append(tellToUserHtml);
      }

      // if (!parsedPayload) {
      //   $(runInfoContent).find('.copy-btn').removeClass('hide');
      // }
      // if((!sourceType || sourceType !== 'smartassist-color-scheme') && parsedPayload){
      //     $(runInfoContent).find('.send-run-btn').addClass('hide');
      // }
      setTimeout(() => {
        this.updateNewMessageUUIDList(this.dropdownHeaderUuids);
      }, this.waitingTimeForUUID);
    }

    if (this.commonService.isAutomationOnGoing && !data.suggestions) {
      this.welcomeMsgResponse = data;
      if (this.numberOfNewMessages == 1) {
        this.numberOfNewMessages = 0;
        this.scrollToBottom();
      }
    }

    if (!this.commonService.isAutomationOnGoing && !this.dropdownHeaderUuids && !data.suggestions) {
      $('#dynamicBlock .empty-data-no-agents').addClass('hide');
      let dynamicBlockDiv = $('#dynamicBlock');
      if (data.buttons?.length > 1) {
        this.welcomeMsgResponse = data;
      } else {
        let botResHtml = this.assisttabService.smallTalkTemplate(data.buttons[0], uuids);
        dynamicBlockDiv.innerHTML += botResHtml;
      }
      setTimeout(() => {
        this.updateNewMessageUUIDList(uuids);
      }, this.waitingTimeForUUID);
    }

    let result = this.templateRenderClassService.getResponseUsingTemplate(data);
    console.log(data, "data inside assist response", result);

    let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(result)[0].innerHTML;
    let a = document.getElementById(IdReferenceConst.displayData + `-${uuids}`);
    if (a) {
      a.innerHTML = a.innerHTML + html;
    }
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
    if (this.scrollAtEnd) {
      this.scrollToBottom();
    }
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
  }

  handleSeeMoreButton(array, type) {
    let index = 0;
    for (let item of array) {
      this.assisttabService.updateSeeMoreButtonForAssist(index, item, type);
      index++;
    }
  }

  updateNewMessageUUIDList(responseId) {
    if (!this.scrollAtEnd) {
      if (this.numberOfNewMessages) {
        if (this.newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
          this.newlyAddedMessagesUUIDlist.push(responseId);
          this.newlyAddedIdList = this.getActualRenderedIdList();
        } else {
          this.newlyAddedIdList = this.getActualRenderedIdList()
        }
      }
      this.addUnreadMessageHtml();
    }
  }

  getActualRenderedIdList() {
    let normalIdsList = ['addRemoveDropDown', 'automationSuggestions', 'smallTalk'];
    let actualRenderedIdList = [];
    for (let uuid of this.newlyAddedMessagesUUIDlist) {
      for (let name of normalIdsList) {
        let childIdList = [];
        childIdList = this.getChildRenderedIdList(name + '-' + uuid, uuid, name);
        actualRenderedIdList = actualRenderedIdList.concat(childIdList);
      }
    }
    //removing duplicates
    actualRenderedIdList = actualRenderedIdList.filter((c, index) => {
      return actualRenderedIdList.indexOf(c) === index;
    });
    return actualRenderedIdList;
  }

  addUnreadMessageHtml() {
    if (!this.scrollAtEnd && this.numberOfNewMessages) {
      $('.unread-msg').remove();
      let unreadHtml = ` <div class="unread-msg last-msg-white-bg">
        <div class="text-dialog-task-end">Unread Messages</div>     
                   </div>`;
      this.UnCollapseDropdownForLastElement(this.lastElementBeforeNewMessage);

      for (let i = 0; i < this.newlyAddedIdList.length; i++) {
        if (document.getElementById(this.newlyAddedIdList[i])) {
          let elements: any = document.getElementById(this.newlyAddedIdList[i]);
          if (elements.className == 'content-dialog-task-type' && (elements.id.includes('dialogSuggestions') || elements.id.includes('faqsSuggestions') || elements.id.includes('articleSuggestions'))) {
            let agentUttInfoId = this.newlyAddedIdList[i].split('-');
            agentUttInfoId.shift();
            agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
            if (document.getElementById(agentUttInfoId)) {
              elements = document.getElementById(agentUttInfoId);
            }
            elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
          } else if (elements.id.includes('stepsrundata') && this.lastElementBeforeNewMessage.id.includes('stepsrundata')) {
            elements = document.getElementById(this.lastElementBeforeNewMessage.id);
            elements?.insertAdjacentHTML('afterend', unreadHtml);
          }
          break;
        }
      }
    }
  }

  getChildRenderedIdList(id, uuid, name) {
    let childIdList = [];
    let dynamicBlockElement = document.getElementById(id);
    if (dynamicBlockElement) {
      if (dynamicBlockElement.className == 'dialog-task-run-sec') {
        let dialogueSuggestionId = 'dialogSuggestions-' + uuid;
        let faqSuggestionId = 'faqsSuggestions-' + uuid;
        let articleSuggestionId = 'articleSuggestions-' + uuid;
        if (this.removedIdListOnScroll.indexOf(dialogueSuggestionId) == -1) {
          childIdList.push(dialogueSuggestionId);
        }
        if (this.removedIdListOnScroll.indexOf(faqSuggestionId) == -1) {
          childIdList.push(faqSuggestionId);
        }
        if (this.removedIdListOnScroll.indexOf(articleSuggestionId) == -1) {
          childIdList.push(articleSuggestionId);
        }
      } else {
        if (dynamicBlockElement.className == 'dialog-task-accordiaon-info') {
          let stepsrunList: any = dynamicBlockElement.querySelectorAll('.steps-run-data');
          for (let node of stepsrunList) {
            if (node.id) {
              if (this.removedIdListOnScroll.indexOf(node.id) == -1) {
                childIdList.push(node.id);
              }
            }
          }
          if (childIdList.indexOf(this.lastElementBeforeNewMessage.id) != -1) {
            childIdList.splice(0, childIdList.indexOf(this.lastElementBeforeNewMessage.id) + 1);
          }
        } else {
          let actualParentId = name + '-' + uuid;
          if (this.removedIdListOnScroll.indexOf(actualParentId) == -1) {
            childIdList.push(actualParentId);
          }
        }
      }
    }
    return childIdList;
  }

  UnCollapseDropdownForLastElement(lastElement) {
    if (lastElement.className.includes('steps-run-data')) {
      let lastElementId = this.getUUIDFromId(lastElement.id);
      lastElementId = lastElementId.split("*")[0];
      let collapseElement = document.getElementById('dropDownData-' + lastElementId);
      $(collapseElement).removeClass('hide');
    }
  }

  getUUIDFromId(id) {
    if (id) {
      let idArray = id.split('-');
      idArray.shift();
      return (idArray.join('-'));
    }
    return '-';
  }

  collapseOldDialoguesInAssist() {
    if (this.scrollAtEnd) {
      if ($(`#dynamicBlocksData .collapse-acc-data`).length > 0) {
        let listItems = $("#dynamicBlocksData .collapse-acc-data");
        listItems.each(function (idx, collapseElement) {
          if (!collapseElement.id.includes('smallTalk') && collapseElement.id.includes('dropDownData')) {
            collapseElement.classList.add('hide');
          }
        });
      }
    }
  }

  dialogTerminatedOrIntrupptedInMyBot() {
    let appStateStr: any = localStorage.getItem('agentAssistState') || '{}';
    let appState: any = JSON.parse(appStateStr);
    this.commonService.isAutomationOnGoing = false;
    if (appState[this.connectionDetails.conversationId]) {
      appState[this.connectionDetails.conversationId]['automationGoingOnAfterRefresh'] = this.commonService.isAutomationOnGoing;
      localStorage.setItem('agentAssistState', JSON.stringify(appState))
    }
    this.commonService.addFeedbackHtmlToDom(this.dropdownHeaderUuids);
    this.scrollToBottom();
  }

  updateNumberOfMessages() {
    this.numberOfNewMessages += 1;
    $(".scroll-bottom-btn").addClass("new-messages");
    $(".scroll-bottom-btn span").text(this.numberOfNewMessages + ' new');
    if (this.numberOfNewMessages == 1) {
      this.removeWhiteBackgroundToSeenMessages();
    }
  }

  removeWhiteBackgroundToSeenMessages() {
    let beforeLastElementArray: any = document.getElementById(IdReferenceConst.DYNAMICBLOCK).querySelectorAll('.last-msg-white-bg');
    for (let ele of beforeLastElementArray) {
      $(ele).removeClass("last-msg-white-bg");
    }
  }

  scrollToBottom() {
    console.log("scroll to bottom");
    setTimeout(() => {
      this.scrollToBottomEvent.emit(true);
    }, this.waitingTimeForUUID);

  }

}
