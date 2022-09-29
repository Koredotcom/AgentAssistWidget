import { Component, HostListener, OnInit } from '@angular/core';
import { ImageFilePath, ImageFileNames, ProjConstants } from 'src/common/constants/proj.cnts';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import { LibraryService } from 'src/library-tab/services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  imageFilePath : string = ImageFilePath;
  imageFileNames : any = ImageFileNames;
  projConstants : any = ProjConstants;
  
  showSearchSuggestions : boolean = false;
  botDetails : any = {};
  menuResponse : any = {};
  searchText : string = '';

  constructor(public handleSubjectService: HandleSubjectService, public libraryService : LibraryService) { }

  ngOnInit(): void {
    this.getMenuResponse();
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    // hide Run with agent button on clicking outside of document.
    if(Object.keys(this.menuResponse).length > 0){
      for(let dialogue in this.menuResponse){
        this.menuResponse[dialogue].agentRunButton = false;
      }
      event.stopPropagation()
    }
  }

  handleRunAgent(dialogueId,event){
    this.menuResponse[dialogueId].agentRunButton = !this.menuResponse[dialogueId].agentRunButton;
    event.stopPropagation()
  }

  //changing the tab
  dialogueRunClick(clickType){
    if(clickType == this.projConstants.ASSIST){
        this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
    }else{
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
    }
  }

  getMenuResponse(){
    this.libraryService.getSampleMenuResponse().subscribe((menuResponse : any) =>{
      if(menuResponse && menuResponse[1] && menuResponse[1].usecases){
        this.botDetails = (({ botId, conversationId }) => ({ botId, conversationId }))(menuResponse);
        this.menuResponse = this.libraryService.formatMenuResponse(menuResponse[1].usecases);
      }
    });
  }

  getSearchResults(){
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({searchFrom:this.projConstants.ASSIST, value : this.searchText});
  }

  emptySearchTextCheck(){
    if(this.searchText == ''){
      this.showSearchSuggestions = false;
    }
  }

}
