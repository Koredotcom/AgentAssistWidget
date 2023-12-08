import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/common/services/common.service';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
declare const $: any;
@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss']
})
export class TypeaheadComponent implements OnInit {
  dataSet = [];
  @Input() searchText: string;  
  @Input() maxLen: number;
  @Input() connectionData:any;
  @Input() isNotLibraryTab: boolean;
  @Output() typeahead: EventEmitter<any> = new EventEmitter();
  @Output() typeaheadEntered: EventEmitter<any> = new EventEmitter();

  showOverlay = false;
  filterSet: any;
  isVisible: boolean;
  isCursorOverFilterSet: boolean;
  isArryDataSet: boolean; 
  subscriptionsList: Subscription[] = [];
  aaSettings: any;

  constructor(public handleSubjectService: HandleSubjectService,private commonService: CommonService) {    
    this.dataSet = this.dataSet || [];
    this.searchText = this.searchText || '';
    this.maxLen = this.maxLen || 5;

    this.filterSet = [];
    this.isVisible = false;
    //this.isArryDataSet = Array.isArray(this.dataSet);
  }
  ngOnInit(){        
    this.subScriberEvent();
  }
  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }
  subScriberEvent(){
    let subscription1 = this.handleSubjectService.searchTextSubject.subscribe((searchObj : any) => {
      if(!searchObj?.value || searchObj?.value?.length == 0){
        this.searchText = '';
        this.showOverlay = false;
      }else if(this.isNotLibraryTab && searchObj.searchFrom == 'Library'){
        this.searchText =  '';
      }else {
        this.searchText = searchObj.value;
      }
      this.handleSubjectService.setLoader(false);
    })
    this.subscriptionsList.push(subscription1);

    let subscription2 = this.handleSubjectService.agentAssistSettingsSubject.subscribe((settings: any) => {
      this.aaSettings = settings;
    })
  }
  typeAHead = this.typeAHeadDeBounce((val, connectionDetails)=>this.getAutoSearchApiResult(val, connectionDetails));
  onSearch(event: any) {   
    if(this.searchText.length > 0 && this.aaSettings?.searchAssistConfig?.showAutoSuggestions) {
      this.typeAHead(this.searchText, this.connectionData);
    } else {
      this.filterSet = [];
      this.typeahead.emit('');
    }
    
  }

  

  typeAHeadDeBounce(func, timeout = 300){
      let delay;
      return function(...args){
        clearTimeout(delay);
        delay = setTimeout(()=>{
           func.apply(this, args);
        }, timeout)
      }
    }
  
     getAutoSearchApiResult(value, connectionDetails){
        console.log(arguments[1],"this","get in auto search api", value)
        let payload = {
            "query": value,
            "maxNumOfResults": 3,
            "lang": "en"
        }
        console.log("connectionDetailsconnectionDetailsconnectionDetails", connectionDetails)
        let headersVal = {};
        if(connectionDetails.fromSAT) {
            headersVal = {
                'Authorization': 'bearer' + ' ' + connectionDetails.token,
                'AccountId': connectionDetails.accountId,
                'eAD': false,
                'iid' : connectionDetails.botId ? connectionDetails.botId : ''
            }
        } else {
            headersVal = {
                'Authorization': this.commonService.grantResponseObj?.authorization?.token_type + ' ' + this.commonService.grantResponseObj?.authorization?.accessToken,
                "AccountId": this.commonService.grantResponseObj?.userInfo?.accountId,
                'eAD': true,
                'iid' : connectionDetails.botId ? connectionDetails.botId : ''
            }
       }
        if (value?.length > 0) {        
            $.ajax({
                url: `${connectionDetails.agentassisturl}/agentassist/api/v1/searchaccounts/autosearch?botId=${connectionDetails.botId}`,
                type: 'post',
                headers: headersVal,
                data: payload,
                dataType: 'json',
                success:  (data) => {
                    if (data.querySuggestions.length>0) {
                      this.showOverlay = true;
                      this.dataSet = data.querySuggestions;
                      this.showList();
                    }
                },
                error: function (err) {
                    console.error("auto search api failed");
                }
            });
        }
    }


  hideList() {
    if(this.isCursorOverFilterSet != true) {
      this.isVisible = false;
    }    
  }

  showList() {
    if(this.searchText.length > 0){
      this.isVisible = true;
    }
  }

  cursorOverSet() {
    this.showList();
    this.isCursorOverFilterSet = true;
  }

  setValue(value: any, isEntered  = false) {
    this.showOverlay = false;
    this.searchText = value;
    this.filterSet = [];    
    this.filterSet.push(value);
    this.isCursorOverFilterSet = false;
    this.hideList();
    if(isEntered){
      this.typeaheadEntered.emit(this.searchText)
    }else{
      this.typeahead.emit(this.searchText);
    }
    
  }
  getSearchResults(event){
    this.setValue(event.target.value, true)
  }
}
