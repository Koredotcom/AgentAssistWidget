import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { IdReferenceConst, ProjConstants } from '../constants/proj.cnts';

@Injectable({
  providedIn: 'root'
})
export class DesignAlterService {

  constructor() { }
  // display customer feels
  displayCustomerFeels(data, convId, botId, sourceType) {
    let custTone;
    if(sourceType !== ProjConstants.SMARTASSIST_SOURCE) {
      if (data.sentimentTone) {
          custTone = data;
      }
      let userTabtoneId = document.getElementById('userTab-custSentimentAnalysis');
      let agentTabtoneId = document.getElementById('agentTab-custSentimentAnalysis');
      if (custTone?.sentimentTone) {
          // if (cusTone?.sentiment.strength > 0 && cusTone?.sentiment.strength <= 33) {

          // } else if (cusTone?.sentiment.strength > 33 && cusTone?.sentiment.strength <= 66) {

          // } else if (cusTone?.sentiment.strength > 66 && cusTone?.sentiment.strength <= 100) {

          // }
          let toneinnerHTML = `
          <div id="custEmoji" class="emojis">${custTone?.sentimentTone?.emoji}</div>
          <div id="strengthDisplay"></div>
              <div [ngStyle]="{'background-color' : (custTone?.strength > 0 && custTone?.strength <=33) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-sm"></div>
              <div [ngStyle]="{'background-color' : (custTone?.strength > 33 && custTone?.strength <=66) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-md"></div>
              <div [ngStyle]="{'background-color' : (custTone?.strength > 66 && custTone?.strength <=100) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-lg"></div>
          </div>
          <span id="customerTone">Customer is feeling <b>${custTone?.sentimentTone?.sentiment}</b></span>
          `
          userTabtoneId.innerHTML = toneinnerHTML;
          agentTabtoneId.innerHTML = toneinnerHTML;
      }
      $(document).ready(() => {
          if (!custTone?.sentimentTone) {
              let staticToneData = {
                  emoji: "&#128512;",
                  sentiment: "Happy",
                  strength: 3
              }
              let staticToneInnerHtml = `
              <div id="custEmoji" class="emojis">${staticToneData.emoji}</div>
                  <div [ngStyle]="{'background-color' : (staticToneData?.strength > 0 && staticToneData?.strength <=33) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-sm"></div>
                  <div [ngStyle]="{'background-color' : (staticToneData?.strength > 33 && staticToneData?.strength <=66) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-md"></div>
                  <div [ngStyle]="{'background-color' : (staticToneData?.strength > 66 && staticToneData?.strength <=100) ? '#28A745' : '#E5E8EC'}" class="strength-bar strength-bar-lg"></div>
              </div>
              <span id="customerTone">Customer is feeling <b>${staticToneData.sentiment}</b></span>
              `
              userTabtoneId.innerHTML = staticToneInnerHtml;
              agentTabtoneId.innerHTML = staticToneInnerHtml;
          }
      });
    }
  }

  // new message arrival code
  addWhiteBackgroundClassToNewMessage(scrollAtEnd, blockId) {
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

  getLastElement(id) {
    let lastElement: any = ''
    let dynamicBlockElements = document.getElementById(id);
    if (id.includes('smallTalk') && dynamicBlockElements) {
      lastElement = dynamicBlockElements;
    } else if ((id.includes(IdReferenceConst.SCRIPTCONTAINER) || id.includes(IdReferenceConst.HISTORY_CONTAINER)) && dynamicBlockElements){
      let className = id.includes(IdReferenceConst.SCRIPTCONTAINER) ? 'data-contnet' : 'history-content';
      let numOfdynamicBlockElements = dynamicBlockElements.getElementsByClassName(className);

      let childElements = numOfdynamicBlockElements[0]?.children;
      if (childElements) {
        for (let i = 0; i < childElements.length; i++) {
          lastElement = childElements[i];
        }
      }

    }else if (dynamicBlockElements) {
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

  UnCollapseDropdownForLastElement(lastElement) {
    if (lastElement && lastElement.className.includes('steps-run-data')) {
      let lastElementId = this.getUUIDFromId(lastElement.id);
      lastElementId = lastElementId.split("*")[0];
      let collapseElement = document.getElementById('dropDownData-' + lastElementId);
      $(`#dropDownHeader-${lastElementId}`).find('.ast-carrotup').addClass('rotate-carrot');
      $(collapseElement).removeClass('hide');
    }
  }

  //scroll related code
  isScrolledIntoView(elem) {
    if (elem) {
      let parentRec = document.getElementById(IdReferenceConst.HOMESCROLLBAR).getBoundingClientRect();
      let childRec = elem.getBoundingClientRect();
      if (childRec.top == 0 && $(elem).parent().attr('class')?.includes('hide')) {
        if ($(elem).parent().parent().length) {
          elem = $(elem).parent().parent()[0];
        }
      }
      let paddingTop = 0;
      childRec = elem.getBoundingClientRect();
      try {
        if (window.getComputedStyle(elem, null).getPropertyValue('padding-top')) {
          let paddingTopStr = window.getComputedStyle(elem, null).getPropertyValue('padding-top');
          if (paddingTopStr.length && paddingTopStr.length - 2) {
            paddingTopStr = paddingTopStr.substring(0, paddingTopStr.length - 2);
            paddingTop = parseInt(paddingTopStr) ? parseInt(paddingTopStr) : 0;
          }
        }
      } catch (e) {
      }
      return (childRec.top + paddingTop) > (parentRec.height + parentRec.top);
    }
  }

  getScrollElementHeight(id){
    let _scrollHeight = -1;
    let element = document.getElementById(id);
    var _PanelEle = $(element);
    if (_PanelEle) {
        var _container = _PanelEle.closest('.body-data-container');
        if (_container && _container.offset()) {
            _scrollHeight = _PanelEle.offset().top - _container.offset().top + _container.scrollTop();
        }
    }
    return _scrollHeight;
  }

  scrollToEle(id) {
    let element = document.getElementById(id);
    var _PanelEle = $(element);
    if(id.includes('automationSuggestions')){
        let agentUttInfoId = id.split('-');
        agentUttInfoId.shift();
        agentUttInfoId = 'agentUttInfo-' + agentUttInfoId.join('-');
        if(document.getElementById(agentUttInfoId)){
            _PanelEle = $('#' + agentUttInfoId);
        }
    }
    if (_PanelEle) {
        var _container = _PanelEle.closest('.body-data-container');
        if (_container && _container.offset()) {
            var _scrollHeight = _PanelEle.offset().top - _container.offset().top + _container.scrollTop();
            _container.animate({
            scrollTop: _scrollHeight
            }, 'slow');
        }
    }
}

  // toggle dropdown click events
  // handleDropdownToggle(uuid) {
  //   document.getElementById(IdReferenceConst.DROPDOWN_HEADER + '-' + uuid).addEventListener('click', (event) => {
  //     let dropdownDataElement = $(`#dropDownData-${uuid}`);
  //     if ($(dropdownDataElement).hasClass('hide')) {
  //       $(dropdownDataElement).removeClass('hide');
  //       $(`#dropDownHeader-${uuid}`).find('.ast-carrotup').addClass('rotate-carrot');
  //       $(`#endTaks-${uuid}`).removeClass('hide');
  //     } else {
  //       $(dropdownDataElement).addClass('hide')
  //       $(`#dropDownHeader-${uuid}`).find('.ast-carrotup').removeClass('rotate-carrot');
  //       $(`#endTaks-${uuid}`).removeClass('hide');
  //     }
  //   });
  // }

  //empty deep

  emptyDeep(mixedVar, emptyValues = [undefined, null, '']) {
    var key, i, len
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
            return true
        }
    }
    if (typeof mixedVar === 'object') {
        for (const item of Object.values(mixedVar)) {
            if (!this.emptyDeep(item, emptyValues)) {
                return false
            }
        }
        return true
    }
    return false
}

}
