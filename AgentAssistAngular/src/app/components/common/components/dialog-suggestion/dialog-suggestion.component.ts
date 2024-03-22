import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { RandomUuidPipe } from 'src/app/pipes/random-uuid.pipe';
import { ProjConstants } from 'src/app/proj.const';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-dialog-suggestion',
  templateUrl: './dialog-suggestion.component.html',
  styleUrls: ['./dialog-suggestion.component.scss']
})
export class DialogSuggestionComponent implements OnInit, OnDestroy{

  @Input() searchResponse : any;
  @Input() suggestionData : any = {};
  @Output() updateMenuResponseLoader = new EventEmitter();

  subs = new SubSink();
  menuResponse: any = {};
  projConstants: any = ProjConstants;
  searchedDialogList : any[] = [];
  suggestionCount : number = 0;
  viewCount = 2;
  moreClick = false;


  constructor(private websocketService : WebSocketService, private handleSubjectService : HandleSubjectService,
    private rootService : RootService, private randomUUIDPipe : RandomUuidPipe){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnChanges(changes : SimpleChange){
    if(changes['searchResponse']?.currentValue){
      this.handleSearchResponse(this.searchResponse);
    }
  }

  subscribeEvents(){
    this.subs.sink = this.websocketService.agentMenuResponse$.subscribe((menuResponse: any) => {
      if (menuResponse && menuResponse.usecases) {
        this.menuResponse = this.formatMenuResponse(menuResponse.usecases);
        this.suggestionCount = this.menuResponse.length || 0;
        this.updateMenuResponseLoader.emit(false);
      }
    });
  }

  handleSearchResponse(searchResponse){
    this.searchedDialogList = [];
      if(searchResponse && searchResponse.dialogs){
        this.searchedDialogList = searchResponse.dialogs;
        this.suggestionCount = this.searchedDialogList.length || 0;
        this.viewLessClick();
      }
  }

  formatMenuResponse(menuResponse){
    let formattedMenuResponse = {};
    for(let dialogue of menuResponse){
      let dialogueDetails : any = {};
      dialogueDetails.name = dialogue.name|| dialogue.usecaseName;
      dialogueDetails.type = dialogue.usecaseType;
      dialogueDetails.agentRunButton = false;
      dialogueDetails["childBotId"] = dialogue["childBotId"] || "";
      dialogueDetails["childBotName"] = dialogue["childBotName"] || "";
      dialogueDetails.sourceMsgId = 'fromLibrary';
      dialogueDetails.dialogId = dialogue.dialogId;
      dialogueDetails.taskRefId = dialogue.taskRefId;
      formattedMenuResponse[dialogue.dialogId] = dialogueDetails;
    }    
    return formattedMenuResponse;
  }

  dialogueRunClick(dialog, searchType) {
    this.rootService.setActiveTab(searchType);
    dialog.positionId = this.randomUUIDPipe.transform('positionId');
    dialog.intentName = dialog.name;
    dialog.userInput = dialog.name;
    dialog.agentRunButton = (searchType == this.projConstants.MYBOT) ? true : false;
    dialog.traits = this.suggestionData?.traits || [];    
    if(!dialog.dialogId){
      dialog = this.matchDialogIdfromMenuResponse(dialog)
    }
    dialog.suggestionFrom = this.suggestionData.suggestionFrom || ProjConstants.MYBOT;
    // let runDialogueObject = Object.assign({}, this.searchConentObject);
    // Object.assign(runDialogueObject, dialog);
    this.handleSubjectService.setRunButtonClickEvent(dialog);
    // this.handleSendCopyEvent(dialog, searchType);
  }

  matchDialogIdfromMenuResponse(dialog){    
    let taskRefId = dialog.taskRefId;
    if(taskRefId && this.menuResponse && Object.keys(this.menuResponse)?.length > 0){
      let response : any = Object.values(this.menuResponse)?.find((obj : any) => obj.taskRefId === taskRefId);
      if(response && response.dialogId){
        dialog.dialogId = response.dialogId;
      }
    }
    return dialog;
  }

  // handleSendCopyEvent(dialog, searchType){
  //   let data: any = {
  //     botId: this.rootService.connectionDetails.botId,
  //     conversationId: this.rootService.connectionDetails.conversationId,
  //     experience: 'chat',
  //     source: this.rootService.connectionDetails.source,
  //     type: 'dialog',
  //     input : this.searchedResultData?.userInput,
  //     title: dialog.intentName,
  //     sessionId: searchType == this.projConstants.ASSIST ? this.rootService.assistTabSessionId : this.rootService.myBotTabSessionId,
  //     intentName: dialog.intentName

  //   };
  //   this.websocketService.emitEvents(EVENTS.agent_send_or_copy, data);
  // }

  // AgentAssist_agent_run_click(dialog){
  //   dialog.value = dialog.name;
  //   this.emitSearchRequest(dialog, false);
  // }

  viewMoreClick(){
    this.moreClick = true;
    this.viewCount = this.searchedDialogList?.length;
  }

  viewLessClick(){
    this.moreClick = false;
    this.viewCount = (this.searchedDialogList && this.searchedDialogList?.length <= 2) ? this.searchedDialogList?.length : 2;
  }


  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
