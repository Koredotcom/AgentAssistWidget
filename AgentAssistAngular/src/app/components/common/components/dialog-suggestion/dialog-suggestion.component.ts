import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

  subs = new SubSink();
  menuResponse: any = {};
  projConstants: any = ProjConstants;
  searchedDialogList : any = [];
  suggestionCount : number = 0;


  constructor(private websocketService : WebSocketService, private handleSubjectService : HandleSubjectService,
    private rootService : RootService, private randomUUIDPipe : RandomUuidPipe){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnChanges(){
    this.handleSearchResponse(this.searchResponse);
  }

  subscribeEvents(){
    this.subs.sink = this.websocketService.agentMenuResponse$.subscribe((menuResponse: any) => {
      if (menuResponse && menuResponse.usecases) {
        this.menuResponse = this.formatMenuResponse(menuResponse.usecases);
        this.suggestionCount = this.menuResponse.length || 0;
      }
    });
  }

  handleSearchResponse(searchResponse){
    this.searchedDialogList = [];
      if(searchResponse && searchResponse.dialogs){
        this.searchedDialogList = searchResponse.dialogs;
        this.suggestionCount = this.searchedDialogList.length || 0;
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
    // let runDialogueObject = Object.assign({}, this.searchConentObject);
    // Object.assign(runDialogueObject, dialog);
    this.handleSubjectService.setRunButtonClickEvent(dialog);
    // this.handleSendCopyEvent(dialog, searchType);
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

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
