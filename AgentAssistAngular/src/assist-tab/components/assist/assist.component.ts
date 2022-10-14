import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants, ImageFilePath, ImageFileNames, IdReferenceConst, storageConst } from 'src/common/constants/proj.cnts';
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
import { LocalStorageService } from 'src/common/services/local-storage.service';
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
  idReferenceConst : any = IdReferenceConst;
  agentAssistResponse: any = {};
  dropdownHeaderUuids: any;
  dialogPositionId: string;
  connectionDetails: any;
  interruptDialog: any = {};
  answerPlaceableIDs: any = [];
  entitiestValueArray: any = [];
  previousEntitiesValue: string;
  welcomeMsgResponse: any;
  waitingTimeForUUID: number = 1000;

  constructor(private templateRenderClassService: TemplateRenderClassService, public handleSubjectService: HandleSubjectService, public randomUUIDPipe: RandomUUIDPipe,
    public removeSpecialCharPipe: RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe: ReplaceQuotStringWithDoubleQuotPipe,
    public sanitizeHtmlPipe: SanitizeHtmlPipe,
    public commonService: CommonService, public websocketService: WebSocketService,
    public designAlterService: DesignAlterService, public rawHtmlPipe: RawHtmlPipe,
    public koreGenerateuuidPipe: KoreGenerateuuidPipe, public assisttabService: AssistService,
    public htmlEntityPipe: HtmlEntityPipe, private localStorageService : LocalStorageService) {

  }

  ngOnInit(): void {
    this.subscribeEvents();
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents() {

    let subscription1 = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj: any) => {
      if (Object.keys(runEventObj).length > 0) {
        if (runEventObj && !runEventObj?.agentRunButton && !this.commonService.isAutomationOnGoing) {
          this.runDialogForAssistTab(runEventObj);
        } else if (runEventObj && !runEventObj?.agentRunButton && this.commonService.isAutomationOnGoing) {
          this.interruptDialog = runEventObj;
          this.handleTerminatePopup.emit({ status: true, type: this.projConstants.INTERRUPT });
        }
      }
    });

    let subscription2 = this.websocketService.agentAssistResponse$.subscribe((response: any) => {
      if (response && Object.keys(response).length > 0) {
        this.updateAgentAssistResponse(response, this.connectionDetails.botId, this.connectionDetails.conversationId);
      }

    });

    let subscription3 = this.websocketService.endOfTaskResponse$.subscribe((endoftaskresponse: any) => {
      if (endoftaskresponse && (this.dialogPositionId == endoftaskresponse.positionId || (endoftaskresponse.author && endoftaskresponse.author.type == 'USER'))) {
        this.dialogTerminatedOrIntruppted();
      }
    })

    let subscription4 = this.handleSubjectService.terminateClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.ASSIST) {
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntruppted();
      }
    });

    let subscription5 = this.handleSubjectService.interruptClickEventSubject.subscribe((response: any) => {
      if (response && response?.activeTab == this.projConstants.ASSIST) {
        this.AgentAssist_run_click({ intentName: this.projConstants.DISCARD_ALL }, this.dialogPositionId)
        this.dialogTerminatedOrIntruppted();
        this.runDialogForAssistTab(this.interruptDialog);
      }

    });

    let subscription6 = this.websocketService.agentAssistUserMessageResponse$.subscribe((response: any) => {
      if (response && response.botId) {
        this.updateNumberOfMessages();
        this.processUserMessages(response, response.conversationId, response.botId);
        // removingSendCopyBtnForCall();
      }
    });

    let subscription7 = this.handleSubjectService.connectDetailsSubject.subscribe((response: any) => {
      if (response) {
        this.connectionDetails = response;
      }
    });

    let subscription8 = this.websocketService.userMessageResponse$.subscribe((userMsgResponse: any) => {
      console.log("user message response");

    });

    let subscription9 = this.handleSubjectService.activeTabSubject.subscribe((response) => {
      console.log(response, 'response');
      if(response && response == this.projConstants.ASSIST){
        this.assisttabService.updateSeeMoreOnAssistTabActive()
      } 
    })
    this.subscriptionsList.push(subscription1);
    this.subscriptionsList.push(subscription2);
    this.subscriptionsList.push(subscription3);
    this.subscriptionsList.push(subscription4);
    this.subscriptionsList.push(subscription5);
    this.subscriptionsList.push(subscription6);
    this.subscriptionsList.push(subscription7);
    this.subscriptionsList.push(subscription8);
    this.subscriptionsList.push(subscription9);
  }

  terminateButtonClick(uuid) {
    document.getElementById(IdReferenceConst.ASSISTTERMINATE + '-' + uuid).addEventListener('click', (event) => {
      this.handleTerminatePopup.emit({ status: true, type: this.projConstants.TERMINATE });
    });
  }

  handleOverridBtnClick(uuid, dialogId) {
    document.getElementById(IdReferenceConst.OVERRIDE_BTN + '-' + uuid).addEventListener('click', (event) => {
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
          }
        });
      }
      $(`#overRideBtn-${uuid}`).addClass('hide');
      $(`#cancelOverRideBtn-${uuid}`).removeClass('hide');
      this.commonService.OverRideMode = true;
      this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
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
      this.commonService.OverRideMode = false;
      this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
      this.scrollToBottom();
    })
  }

  handleRunButtonClick(uuid, data) {
    document.getElementById(IdReferenceConst.ASSIST_RUN_BUTTON + '-' + uuid).addEventListener('click', (event) => {
      let runEventObj: any = {
        agentRunButton: false,
        intentName: data.name
      }
      this.handleSubjectService.setRunButtonClickEvent(runEventObj);
    });
  }

  // handleSendCopyButtonClickEvent(uuid, data, eventName){
  //   if(eventName == IdReferenceConst.SENDMSG){
  //     document.getElementById(IdReferenceConst.SENDMSG + '-' + uuid).addEventListener('click', (evt : any) => {
  //       console.log(evt.target.dataset.msgData, "msg data ************8");
        
  //      this.preparePostMessageForSendAndCopy(evt, uuid, data, eventName);
  //     });
  //   }else if(eventName == IdReferenceConst.COPYMSG){
  //     document.getElementById(IdReferenceConst.COPYMSG + '-' + uuid).addEventListener('click', (evt) => {
  //       console.log("click event inside copy button");
        
  //       this.preparePostMessageForSendAndCopy(evt, uuid, data, eventName);
  //      });
  //   }
  // }

  

  clickEvents(eventName, uuid?, dialogId?, data?) {
    if (eventName == IdReferenceConst.ASSISTTERMINATE) {
      this.terminateButtonClick(uuid)
    } else if (eventName == IdReferenceConst.OVERRIDE_BTN) {
      this.handleOverridBtnClick(uuid, dialogId);
    } else if (eventName == IdReferenceConst.CANCEL_OVERRIDE_BTN) {
      this.handleCancelOverrideBtnClick(uuid, dialogId);
    } else if (eventName == IdReferenceConst.DROPDOWN_HEADER) {
      this.designAlterService.handleDropdownToggle(uuid);
    } else if (eventName == IdReferenceConst.ASSIST_RUN_BUTTON) {
      this.handleRunButtonClick(uuid, data);
    } else if(eventName == IdReferenceConst.SENDMSG || eventName == IdReferenceConst.COPYMSG){
      // this.handleSendCopyButtonClickEvent(uuid, data, eventName);
    }
  }

  runDialogForAssistTab(data, idTarget?, runInitent?) {
    let uuids = this.koreGenerateuuidPipe.transform();
    this.dropdownHeaderUuids = uuids;
    this.commonService.isAutomationOnGoing = true;
    let storageObject : any = {
      [storageConst.AUTOMATION_GOING_ON] : this.commonService.isAutomationOnGoing,
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH] : this.commonService.isAutomationOnGoing
    }
    this.localStorageService.setLocalStorageItem(storageObject);
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
      this.scrollToBottom();
    }, 1000);
  }

  AgentAssist_run_click(dialog, dialogPositionId, intent?) {
    let connectionDetails: any = Object.assign({}, this.connectionDetails);
    connectionDetails.value = dialog.intentName;
    if (dialog.intentName && intent) {
      connectionDetails.intentName = dialog.intentName;
    }
    connectionDetails.positionId = dialogPositionId;
    let assistRequestParams = this.commonService.prepareAgentAssistRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_request, assistRequestParams);
  }

  processUserMessages(data, conversationId, botId) {
    let _id = this.randomUUIDPipe.transform();
    let resultMsgResponse = this.templateRenderClassService.getMessageResponseForUserMessages(data, botId)
    let titleText = '';
    let userQueryHtml = '';
    if (this.commonService.OverRideMode) {
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
    console.log(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, "process user messages");

    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      this.scrollToBottom();
    }
    let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(resultMsgResponse)[0].innerHTML;
    // let a = document.getElementById(IdReferenceConst.DROPDOWNDATA + `-${this.dropdownHeaderUuids}`);
    // if (a) {
    //   a.innerHTML = a.innerHTML + html;
    // }
  }


  updateAgentAssistResponse(data, botId, conversationId) {
    let shouldProcessResponse = false;
    let appState = this.localStorageService.getLocalStorageState();
    if (appState[this.connectionDetails.conversationId]) {
      // if incoming data belongs to welcome message do nothing
      if (!data.suggestions && data.buttons?.length > 1) {
        if (appState[this.connectionDetails.conversationId][storageConst.IS_WELCOMEMSG_PROCESSED] && !appState[this.connectionDetails.conversationId][storageConst.AUTOMATION_GOING_ON] && document.getElementsByClassName('.welcome-msg').length > 0) {
          return;
        }
      }
      shouldProcessResponse = true;
    } else {
      shouldProcessResponse = true;
    }
    if (!shouldProcessResponse) {
      return;
    }
    if (!(this.commonService.isAutomationOnGoing && data.suggestions)) {
      this.updateNumberOfMessages();
    }

    let overRideObj = {
      "agentId": "",
      "botId": botId,
      "conversationId": conversationId,
      "query": "",
      'experience': this.commonService.isCallConversation === true ? 'voice' : 'chat',
      "enable_override_userinput": false
    }
    if (this.commonService.OverRideMode) {
      this.websocketService.emitEvents(EVENTS.enable_override_userinput, overRideObj)
    }
    this.commonService.OverRideMode = false;
    this.designAlterService.displayCustomerFeels(data, conversationId, botId);

    this.commonService.updateAgentAssistState(conversationId, this.projConstants.ASSIST, data);
    this.processAgentAssistResponse(data, botId);
  }

  processAgentAssistResponse(data, botId) {
    let automationSuggestions = $('#dynamicBlock .dialog-task-accordiaon-info');
    let uuids = this.koreGenerateuuidPipe.transform();
    let responseId = uuids;
    console.log(this.commonService.isAutomationOnGoing,this.dropdownHeaderUuids,data.suggestions);

   
    

    if (!this.commonService.isAutomationOnGoing && data.intentName && !data.suggestions && !this.commonService.isInitialDialogOnGoing) {
      let isInitialTaskRanORNot;
      let appState = this.localStorageService.getLocalStorageState();
      if (appState[this.connectionDetails.conversationId]) {
        isInitialTaskRanORNot = appState[this.connectionDetails.conversationId][storageConst.INITIALTASK_GOING_ON]
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
                let storageObject : any = {
                  [storageConst.AUTOMATION_NOTRAN_ARRAY] : this.commonService.automationNotRanArray 
                }
                this.localStorageService.setLocalStorageItem(storageObject,this.projConstants.ASSIST);
               }
            
            }
          })
        })
      }
      this.commonService.userIntentInput = data.userInput;
      let htmls = this.assisttabService.agentUttInfoTemplate(data, responseId, this.imageFilePath, this.imageFileNames)

      dynamicBlock.innerHTML = dynamicBlock.innerHTML + htmls;

      if (data.type === 'intent' || data.type === 'text') {
        let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
        automationSuggestions.classList.remove('hide');
      }

      if (data.suggestions) {

        if (data.suggestions.dialogs?.length > 0) {

          let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
          let dialogAreaHtml = this.assisttabService.getDialogAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames);
          automationSuggestions.innerHTML += dialogAreaHtml;
        }

        if (data.suggestions.faqs?.length > 0) {
          let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
          let faqAreaHtml = this.assisttabService.getFaqAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames);
          automationSuggestions.innerHTML += faqAreaHtml;
        }

        if (data?.suggestions?.searchassist && Object.keys(data.suggestions.searchassist).length > 0) {
          data.suggestions = this.commonService.formatSearchResponse(data.suggestions);
          if (data.suggestions.articles?.length > 0) {
            let automationSuggestions = document.getElementById(`automationSuggestions-${responseId}`);
            let articleAreaHtml = this.assisttabService.getArticleAreaTemplate(responseId, data, this.imageFilePath, this.imageFileNames);
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
          this.clickEvents(IdReferenceConst.ASSIST_RUN_BUTTON, uuids, this.dialogPositionId, ele);
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
            <button class="send-run-btn" id="sendMsg" data-msg-data="${ele.answer}">Send</button>
            <div class="copy-btn" data-msg-data="${ele.answer}">
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
          this.clickEvents(IdReferenceConst.SENDMSG, uuids+index, this.dialogPositionId, ele);
          this.clickEvents(IdReferenceConst.COPYMSG, uuids+index, this.dialogPositionId, ele);
        });
        this.handleSeeMoreButton(responseId,data.suggestions.faqs, this.projConstants.FAQ);
        this.handleSeeMoreButton(responseId,data.suggestions.articles, this.projConstants.ARTICLE);
        
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
          let faqAnswerSendMsg = $(`#dynamicBlock #faqDiv-${splitedanswerPlaceableID.join('-')}`).find("[id*='sendMsg']");
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
          setTimeout(() => {
              this.assisttabService.updateSeeMoreButtonForAssist(splitedanswerPlaceableID.join('-'), this.projConstants.FAQ);
          }, 1000);
        });

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

    let result = this.templateRenderClassService.getResponseUsingTemplate(data);
    console.log(result, "result");  

    console.log(this.commonService.isAutomationOnGoing, "is Automation on going");
    

    if (this.commonService.isAutomationOnGoing && this.dropdownHeaderUuids && data.buttons && !data.value.includes('Customer has waited') && (this.dialogPositionId && !data.positionId || (data.positionId == this.dialogPositionId))) {
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
        console.log("inside tell customer");
        
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
      if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages == 1) {
        this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages = 0;
      }
    }

    if (!this.commonService.isAutomationOnGoing && !this.dropdownHeaderUuids && !data.suggestions) {
      console.log("inside small talk", data.buttons.length);
      
      $('#dynamicBlock .empty-data-no-agents').addClass('hide');
      let dynamicBlockDiv = $('#dynamicBlock');
      if (data.buttons?.length > 1) {
        this.welcomeMsgResponse = data;
      } else {
        let botResHtml = this.assisttabService.smallTalkTemplate(data.buttons[0], uuids);
        console.log(botResHtml, "small template");
        
        dynamicBlockDiv.append(botResHtml);
      }
      setTimeout(() => {
        this.updateNewMessageUUIDList(uuids);
      }, this.waitingTimeForUUID);
    }
    
    let renderedMessage = this.dropdownHeaderUuids ? this.templateRenderClassService.AgentChatInitialize.renderMessage(result) : '';
    if (renderedMessage && renderedMessage[0]) {
      let html = this.templateRenderClassService.AgentChatInitialize.renderMessage(result)[0].innerHTML;
      let a = document.getElementById(IdReferenceConst.displayData + `-${uuids}`);
      if (a) {
        a.innerHTML = a.innerHTML + html;
      }
    }

    console.log(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, "process agentassist response");

    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      this.scrollToBottom();
    }
    this.designAlterService.addWhiteBackgroundClassToNewMessage(this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd, IdReferenceConst.DYNAMICBLOCK);
  }

  handleSeeMoreButton(responseId,array, type) {
    console.log(array, type, responseId, "array");
    if(array && responseId && type){
      let index = 0;
      for (let item of array) {
        let id = responseId+index;
        this.assisttabService.updateSeeMoreButtonForAssist(id, type);
        index++;
        this.handleSeeMoreLessClickEvents(id, type);
      }
    }
  }

  handleSeeMoreLessClickEvents(id, type){
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let seeLessElement = document.getElementById('seeLess-' + id);
    let titleElement = document.getElementById("title-" + id);
    let descElement = document.getElementById("desc-" + id);
    if(type == this.projConstants.ARTICLE){
      seeMoreElement = document.getElementById('articleseeMore-' + id);
      seeLessElement = document.getElementById('articleseeLess-' + id);
      titleElement = document.getElementById("articletitle-" + id);
      descElement = document.getElementById("articledesc-" + id);
    }
    seeMoreElement.addEventListener('click', (event : any) => {
      event.target.classList.add('hide');
      seeLessElement.classList.remove('hide');
      titleElement.classList.add('no-text-truncate');
      descElement.classList.add('no-text-truncate');                       
    });
    seeLessElement.addEventListener('click',(event : any) => {
      event.target.classList.add('hide');
      seeMoreElement.classList.remove('hide');
      titleElement.classList.remove('no-text-truncate');
      descElement.classList.remove('no-text-truncate'); 
    });
  }

  updateNewMessageUUIDList(responseId) {
    console.log(this.commonService.scrollContent[ProjConstants.ASSIST], "inside update new message uuid list");

    if (!this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages) {
        if (this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedMessagesUUIDlist.indexOf(responseId) == -1) {
          this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedMessagesUUIDlist.push(responseId);
          this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList = this.getActualRenderedIdList();
        } else {
          this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList = this.getActualRenderedIdList()
        }
      }
      this.addUnreadMessageHtml();
    }
  }

  getActualRenderedIdList() {
    let normalIdsList = ['addRemoveDropDown', 'automationSuggestions', 'smallTalk'];
    let actualRenderedIdList = [];
    for (let uuid of this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedMessagesUUIDlist) {
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
    console.log("unread msg html");

    if (!this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd && this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages) {
      $('.unread-msg').remove();
      let unreadHtml = ` <div class="unread-msg last-msg-white-bg">
        <div class="text-dialog-task-end">Unread Messages</div>     
                   </div>`;
      this.designAlterService.UnCollapseDropdownForLastElement(this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage);

      console.log(this.commonService.scrollContent[ProjConstants.ASSIST], this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList, "newly added id list");

      for (let i = 0; i < this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList.length; i++) {
        if (document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i])) {
          let elements: any = document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i]);
          if (elements.className == 'content-dialog-task-type' && (elements.id.includes('dialogSuggestions') || elements.id.includes('faqsSuggestions') || elements.id.includes('articleSuggestions'))) {
            let agentUttInfoId = this.commonService.scrollContent[ProjConstants.ASSIST].newlyAddedIdList[i].split('-');
            agentUttInfoId.shift();
            agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
            if (document.getElementById(agentUttInfoId)) {
              elements = document.getElementById(agentUttInfoId);
            }
            elements?.insertAdjacentHTML('beforeBegin', unreadHtml);
          } else if (elements.id.includes('stepsrundata') && this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage.id.includes('stepsrundata')) {
            console.log("steprund data");

            elements = document.getElementById(this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage.id);
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
        if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(dialogueSuggestionId) == -1) {
          childIdList.push(dialogueSuggestionId);
        }
        if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(faqSuggestionId) == -1) {
          childIdList.push(faqSuggestionId);
        }
        if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(articleSuggestionId) == -1) {
          childIdList.push(articleSuggestionId);
        }
      } else {
        if (dynamicBlockElement.className == 'dialog-task-accordiaon-info') {
          let stepsrunList: any = dynamicBlockElement.querySelectorAll('.steps-run-data');
          for (let node of stepsrunList) {
            if (node.id) {
              if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(node.id) == -1) {
                childIdList.push(node.id);
              }
            }
          }
          if (childIdList.indexOf(this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage.id) != -1) {
            childIdList.splice(0, childIdList.indexOf(this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage.id) + 1);
          }
        } else {
          let actualParentId = name + '-' + uuid;
          if (this.commonService.scrollContent[ProjConstants.ASSIST].removedIdListOnScroll.indexOf(actualParentId) == -1) {
            childIdList.push(actualParentId);
          }
        }
      }
    }
    return childIdList;
  }



  collapseOldDialoguesInAssist() {
    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
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

  dialogTerminatedOrIntruppted() {
    this.commonService.isAutomationOnGoing = false;
    this.commonService.isInitialDialogOnGoing = true;
    this.commonService.OverRideMode = false;
    let storageObject : any = {
      [storageConst.AUTOMATION_GOING_ON] : this.commonService.isAutomationOnGoing,
      [storageConst.INITIALTASK_GOING_ON] : this.commonService.isInitialDialogOnGoing,
      [storageConst.AUTOMATION_GOING_ON_AFTER_REFRESH] : this.commonService.isAutomationOnGoing
    }
    this.dropdownHeaderUuids = null;
    this.localStorageService.setLocalStorageItem(storageObject);
    this.commonService.addFeedbackHtmlToDom(this.dropdownHeaderUuids, this.commonService.scrollContent[ProjConstants.ASSIST].lastElementBeforeNewMessage);
    if (this.commonService.scrollContent[ProjConstants.ASSIST].scrollAtEnd) {
      this.scrollToBottom();
    }
  }

  updateNumberOfMessages() {
    this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages += 1;
    $(".scroll-bottom-btn").addClass("new-messages");
    $(".scroll-bottom-btn span").text(this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages + ' new');
    if (this.commonService.scrollContent[ProjConstants.ASSIST].numberOfNewMessages == 1) {
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
    this.scrollToBottomEvent.emit(true);
  }

}
