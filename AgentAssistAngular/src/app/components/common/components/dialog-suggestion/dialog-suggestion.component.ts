import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

  subs = new SubSink();
  menuResponse: any = {};
  projConstants: any = ProjConstants;
  searchedDialogList : any = [];
  suggestionCount : number = 0;


  constructor(private websocketService : WebSocketService, private handleSubjectService : HandleSubjectService,
    private rootService : RootService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.websocketService.agentMenuResponse$.subscribe((menuResponse: any) => {
      if (menuResponse && menuResponse.usecases) {
        this.menuResponse = this.formatMenuResponse(menuResponse.usecases);
        console.log(this.menuResponse, 'menu response********');
        this.suggestionCount = this.menuResponse.length || 0;
      }
    });

    this.subs.sink = this.handleSubjectService.searchResponse$.subscribe((searchResponse)=> {
      console.log(searchResponse, 'searchResponse');
      this.searchedDialogList = [];
      if(searchResponse && searchResponse.dialogs){
        this.searchedDialogList = searchResponse.dialogs;
        this.suggestionCount = this.searchedDialogList.length || 0;
      }
    });
  }

  formatMenuResponse(menuResponse){
    let formattedMenuResponse = {};
    for(let dialogue of menuResponse){
      let dialogueDetails : any = {};
      dialogueDetails.intentName = dialogue.name|| dialogue.usecaseName ;
      dialogueDetails.type = dialogue.usecaseType;
      dialogueDetails.agentRunButton = false;
      dialogueDetails["childBotId"] = dialogue["childBotId"] || "";
      dialogueDetails["childBotName"] = dialogue["childBotName"] || "";
      formattedMenuResponse[dialogue.dialogId] = dialogueDetails;
    }
    return formattedMenuResponse;
  }

  dialogueRunClick(dialog, clickType) {
    console.log(dialog, "dialog******");

    this.rootService.setActiveTab('assist');
    
    // dialog.value.positionId = this.randomUUIDPipe.transform(IdReferenceConst.positionId);
    // let runDialogueObject = Object.assign({}, dialog.value);
    // runDialogueObject.searchFrom = this.projConstants.LIBRARY;
    // runDialogueObject.name = dialog.value.intentName;
    // runDialogueObject.agentRunButton = dialog.value.agentRunButton;
    // console.log("🚀 ~ file: library.component.ts:184 ~ LibraryComponent ~ dialogueRunClick ~:")
    // if (clickType == this.projConstants.ASSIST) {
    //   this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
    // } else {
    //   this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
    //   this.agent_run_click(runDialogueObject, false)
    // }
    // this.handleSubjectService.setRunButtonClickEvent(runDialogueObject);
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

}
