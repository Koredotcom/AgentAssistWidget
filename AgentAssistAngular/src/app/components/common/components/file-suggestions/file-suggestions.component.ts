import { Component, Input, SimpleChange } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';
import { CommonService } from 'src/app/services/common.service';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-file-suggestions',
  templateUrl: './file-suggestions.component.html',
  styleUrls: ['./file-suggestions.component.scss']
})
export class FileSuggestionsComponent {
  @Input() searchResponse : any;
  
  subs = new SubSink();
  projConstants: any = ProjConstants;
  filesList : any[] = [];
  viewCount = 2;
  moreClick = false;
  hideActionButtons : boolean = false;
  hideSendButton : boolean = false;

  constructor(private handleSubjectService : HandleSubjectService,
     private rootService : RootService, private commonService : CommonService){

  }

  ngOnInit(){
  
  }

  ngOnChanges(changes : SimpleChange){
    if(this.searchResponse){
      this.handleSearchResponse(this.searchResponse);
      this.hideSendAndCopy();
    }
  }

  hideSendAndCopy(){
    // Both send and copy
    this.hideActionButtons = (this.rootService.connectionDetails.isCallConversation) ? true : false;

    //send Button
    if(!this.rootService.settingsData?.isAgentResponseEnabled){
      this.hideSendButton = true;
    }
  }


  handleSearchResponse(searchResponse){
    this.filesList = [];
    console.log(searchResponse, "search respone*************");
    
    if(searchResponse && searchResponse.files){
      this.filesList = searchResponse.files;
      this.viewLessClick();
    }
  }

  handleSendCopyButton(actionType, fileObj, selectType){
    fileObj.send = true;
    this.commonService.handleSendCopyButton(actionType, fileObj, selectType)
  }

  toggleShowMoreLess(file){
    file.showMoreButton = !file.showMoreButton;
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  viewMoreClick(){
    this.moreClick = true;
    this.viewCount = this.filesList?.length;
  }

  viewLessClick(){
    this.moreClick = false;
    this.viewCount = (this.filesList && this.filesList?.length <= 2) ? this.filesList?.length : 2;
  }
}
