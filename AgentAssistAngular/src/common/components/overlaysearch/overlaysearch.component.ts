import { Component, HostListener, OnInit } from '@angular/core';
import { ImageFilePath, ImageFileNames, ProjConstants } from 'src/common/constants/proj.cnts';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';

@Component({
  selector: 'app-overlaysearch',
  templateUrl: './overlaysearch.component.html',
  styleUrls: ['./overlaysearch.component.scss']
})
export class OverlaysearchComponent implements OnInit {

  projConstants : any = ProjConstants;
  imageFilePath : string = ImageFilePath;
  imageFileNames : any = ImageFileNames;
  searchResponse : any = {};
  
  constructor(public handleSubjectService : HandleSubjectService, public commonService : CommonService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.handleSubjectService.searchTextSubject.subscribe((searchObj) => {
      this.handleSearchResponse(searchObj);
    })
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    // hide Run with agent button on clicking outside of document.
    if(this.searchResponse?.dialogs && this.searchResponse?.dialogs.length > 0){
      this.searchResponse.dialogs.map(obj =>{
          obj.agentRunButton = !obj.agentRunButton
      })
      event.stopPropagation();
    }
  }

  handleRunAgent(dialoguename,event){
    if(this.searchResponse?.dialogs && this.searchResponse?.dialogs.length > 0){
      this.searchResponse.dialogs.map(obj =>{
        if(obj.name === dialoguename){
          obj.agentRunButton = !obj.agentRunButton
          event.stopPropagation()
        }
      })
    }
  }

  dialogueRunClick(clickType){
    if(clickType == this.projConstants.ASSIST){
        this.handleSubjectService.setActiveTab(this.projConstants.ASSIST);
    }else{
      this.handleSubjectService.setActiveTab(this.projConstants.MYBOT);
    }
  }

  handleSearchResponse(searchObj){
    this.searchResponse = {};
    this.commonService.getSampleSearchResponse().subscribe((response : any) =>{
      if(response && response[1] && response[1].suggestions){
        this.searchResponse = this.commonService.formatSearchResponse(response[1].suggestions);
        this.searchResponse.totalSearchResults = this.searchResponse.dialogs?.length + this.searchResponse.faqs?.length;
        console.log(this.searchResponse, "searchResponse");
        setTimeout(() => {
          this.handleSeeMoreButton(this.searchResponse.faqs);
        }, 10);
      }
    })
  }

  handleSendCopyButton(type,faq){
    console.log(type,faq, 'faq');
    let message = {};
    if(type == this.projConstants.SEND){
      message = {
        method: 'send',
        name: "agentAssist.SendMessage",
        // conversationId: _conversationId,
        payload: faq.answer
      };
      window.parent.postMessage(message, '*');
    }else {
      message = {
        method: 'copy',
        name: "agentAssist.CopyMessage",
        // conversationId: _conversationId,
        payload: faq.answer
      };
      parent.postMessage(message, '*');
    }
  }

  handleSeeMoreButton(faqs){
    let faqIndex = 0;
    for(let faq of faqs){
      this.updateSeeMoreButtonForAgent(faqIndex, faq);
      faqIndex++;
    }
  }

  toggleShowMoreLessButtons(faq, index){
    let titleElement = document.getElementById("titleLib-" + index);
    let descElement = document.getElementById("descLib-" + index);
    faq.showLessButton = !faq.showLessButton;
    faq.showMoreButton = !faq.showMoreButton;
    if(faq.showLessButton){
      titleElement.classList.add('faq-title-overflow');
      descElement.classList.add('faq-desc-overflow');
    }else if(faq.showMoreButton){
      titleElement.classList.remove('faq-title-overflow');
      descElement.classList.remove('faq-desc-overflow');
    }
  }


  updateSeeMoreButtonForAgent(id,faq,article?){
    console.log("update see more button");
    
    let faqSourceTypePixel = 5;
    let titleElement = document.getElementById("titleLib-" + id);
    let descElement = document.getElementById("descLib-" + id);
    let divElement = document.getElementById('faqDivLib-' + id);
    let seeMoreElement = document.getElementById('seeMore-' + id);
    let viewLinkElement;
    if(article){
        titleElement = document.getElementById("articletitleLib-" + id);
        descElement = document.getElementById("articledescLib-" + id);
        divElement = document.getElementById('articleDivLib-' + id);
        seeMoreElement = document.getElementById('articleseeMore-' + id);
        viewLinkElement = document.getElementById('articleViewLinkLib-' + id);
    }
    console.log(divElement, titleElement, descElement);
    
    if(titleElement && descElement && divElement){
        titleElement.classList.add('faq-title-overflow');
        descElement.classList.add('faq-desc-overflow');
        let divSectionHeight = descElement.clientHeight  || 0;
        console.log(divSectionHeight, "div section height");
        if(divSectionHeight > (24 + faqSourceTypePixel)){
            faq.showMoreButton = true;
        }else{
          faq.showMoreButton = false;
            if(article){
                viewLinkElement.classList.remove('hide');
            }
        }
        titleElement.classList.remove('faq-title-overflow');
        descElement.classList.remove('faq-desc-overflow');
    }
}
  

}
