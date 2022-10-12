import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { IdReferenceConst } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class DesignAlterService {

  constructor() { }

  addWhiteBackgroundClassToNewMessage(scrollAtEnd,blockId) {
    let dynamicBlockId = blockId;
    let beforeLastElementArray: any = document.getElementById(blockId).querySelectorAll('.last-msg-white-bg');
    for (let ele of beforeLastElementArray) {
      if (ele && scrollAtEnd) {
        $(ele).removeClass("last-msg-white-bg");
      }
    }
    let lastElement = this.getLastElement(dynamicBlockId);    
    if (lastElement && lastElement.className.includes('welcome-msg')) {
      $(lastElement).addClass('welcome-msg-last');
      return
    } else {
      $('.welcome-msg').removeClass('welcome-msg-last');
    }

    if (lastElement) {
      $(lastElement).addClass("last-msg-white-bg");
      $(lastElement).parent().css('opacity', 1);
      if (!scrollAtEnd) {
        if (lastElement.id.includes('automationSuggestions')) {
          let agentUttInfoId = lastElement.id.split('-');
          agentUttInfoId.shift();
          agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
          if (document.getElementById(agentUttInfoId)) {
            $('#' + agentUttInfoId).addClass("last-msg-white-bg");
          }
        }
      }
      let newElementsHeight = lastElement.clientHeight;
      // addBlurToOldMessage(newElementsHeight);
      if (lastElement.nextElementSibling && lastElement.nextElementSibling.className.includes('feedback-data')) {
        lastElement.nextElementSibling.classList.add("last-msg-white-bg");
      }
      let lastElementId = $(lastElement).parent().attr('id');
      if (lastElementId) {
        let uuid = lastElementId.split('-');
        uuid.shift();
        uuid = uuid.join('-');
        let endofTaskId = 'endTaks-' + uuid;
        if (document.getElementById(endofTaskId)) {
          document.getElementById(endofTaskId).classList.add('last-msg-white-bg');
        }
        let overridebtnId = 'overRideBtn-' + uuid;
        if (document.getElementById(overridebtnId)) {
          $('#' + overridebtnId).parent().addClass('last-msg-white-bg');
        }
      }
    }
    this.RemoveVerticalLineForLastResponse();
  }

  RemoveVerticalLineForLastResponse() {
    let accordionInfoList: any = document.querySelectorAll('.dialog-task-accordiaon-info');
    for (let info of accordionInfoList) {
      let stepsrunList = info.querySelectorAll('.steps-run-data');
      for (let node of stepsrunList) {
        $(node).removeClass('last-child-step-run');
      }
      let lastStepNode = stepsrunList[stepsrunList.length - 1];
      $(lastStepNode).addClass('last-child-step-run');
    }
  }

  isScrolledIntoView(elem) {
    if (elem) {
        let parentRec = document.getElementById(IdReferenceConst.HOMESCROLLBAR).getBoundingClientRect();
        let childRec = elem.getBoundingClientRect();        
        if(childRec.top == 0 && $(elem).parent().attr('class').includes('hide')){
            if($(elem).parent().parent().length){
                elem = $(elem).parent().parent()[0];
            }
        }
        let paddingTop = 0;
        childRec = elem.getBoundingClientRect();
        try{
            if (window.getComputedStyle(elem, null).getPropertyValue('padding-top')) {
                let paddingTopStr = window.getComputedStyle(elem, null).getPropertyValue('padding-top');
                if (paddingTopStr.length && paddingTopStr.length - 2) {
                    paddingTopStr = paddingTopStr.substring(0, paddingTopStr.length - 2);
                    paddingTop = parseInt(paddingTopStr) ? parseInt(paddingTopStr) : 0;
                }
            }
        }catch(e){
            console.log(e);
        }        
        return (childRec.top + paddingTop) > (parentRec.height + parentRec.top);
    }
}

  getLastElement(id) {
    let lastElement: any = ''
    let dynamicBlockElements = document.getElementById(id);
    if (id.includes('smallTalk') && dynamicBlockElements) {
      lastElement = dynamicBlockElements;
    } else if (dynamicBlockElements) {
      let numOfdynamicBlockElements = dynamicBlockElements.children;
      if (numOfdynamicBlockElements) {
        for (let i = 0; i < numOfdynamicBlockElements.length; i++) {
          lastElement = numOfdynamicBlockElements[i];
        }
        // if (lastElement.className == 'dialog-task-run-sec') {
        //     let numOfdynamicBlockElements = lastElement.children;
        //     for (let i = 0; i < numOfdynamicBlockElements.length; i++) {
        //         lastElement = numOfdynamicBlockElements[i];
        //         if ($(lastElement).attr("id") == 'dialoguesArea') {
        //             let typeInfoRunNodes = lastElement.querySelectorAll('.content-dialog-task-type');
        //             lastElement = typeInfoRunNodes[typeInfoRunNodes.length - 1];
        //         }
        //     }
        // } else        
        if (lastElement.className == 'dialog-task-accordiaon-info') {
          let listOfNodes = lastElement.querySelectorAll('.steps-run-data');
          let index = 0;
          for (let node of listOfNodes) {
            if (!($(node).attr('id'))) {
              $(node).attr('id', 'stepsrundata-' + this.getUUIDFromId(lastElement.id) + '*' + index);
            }
            index++;
          }
          lastElement = Array.from(listOfNodes).pop();
        }
      }
    }
    return lastElement;
  }

  getUUIDFromId(id) {
    if (id) {
      let idArray = id.split('-');
      idArray.shift();
      return (idArray.join('-'));
    }
    return '-';
  }

  handleDropdownToggle(uuid){
     document.getElementById(IdReferenceConst.DROPDOWN_HEADER + '-' + uuid).addEventListener('click', (event) => {
       let dropdownDataElement = $(`#dropDownData-${uuid}`);
       if($(dropdownDataElement).hasClass('hide')){
         $(dropdownDataElement).removeClass('hide')
       }else{
         $(dropdownDataElement).addClass('hide')
       }
     }); 
  }

  UnCollapseDropdownForLastElement(lastElement) {
    console.log(lastElement, "last element");
    
    if (lastElement && lastElement.className.includes('steps-run-data')) {
      let lastElementId = this.getUUIDFromId(lastElement.id);
      lastElementId = lastElementId.split("*")[0];
      let collapseElement = document.getElementById('dropDownData-' + lastElementId);
      $(collapseElement).removeClass('hide');
    }
  }


}
