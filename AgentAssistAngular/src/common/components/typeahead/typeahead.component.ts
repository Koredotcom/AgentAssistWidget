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

  constructor(public handleSubjectService: HandleSubjectService,private commonService: CommonService) {    
    this.dataSet = this.dataSet || [];
    this.searchText = this.searchText || '';
    this.maxLen = this.maxLen || 5;

    this.filterSet = [];
    this.isVisible = false;
    //this.isArryDataSet = Array.isArray(this.dataSet);
  }
  ngOnInit(){        
    console.log('this.connectionDetails', this.connectionData)
    this.subScriberEvent();
  }
  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }
  subScriberEvent(){
    let subscription1 = this.handleSubjectService.searchTextSubject.subscribe((searchObj : any) => {
      this.handleSubjectService.setLoader(true);
      if(!searchObj?.value || searchObj?.value?.length == 0){
        this.searchText = '';
        this.showOverlay = false;
      }else{
        this.searchText = searchObj.value;
      }
      this.handleSubjectService.setLoader(false);
    })
    this.subscriptionsList.push(subscription1);
  }
  typeAHead = this.typeAHeadDeBounce((val, falg, connectionDetails)=>this.getAutoSearchApiResult(val, falg, connectionDetails));
  onSearch(event: any) {   
    if(this.searchText.length > 0) {
      this.typeAHead(this.searchText, this.searchText== ''? true: false, this.connectionData);
    } else {
      this.filterSet = [];
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
  
     getAutoSearchApiResult(value, flag, connectionDetails){
        console.log(arguments[1],"this","get in auto search api", value)
        let payload = {
            "query": value,
            "maxNumOfResults": 3,
            "lang": "en"
        }
        let isLibraryTab = arguments[1];
        console.log("connectionDetailsconnectionDetailsconnectionDetails", connectionDetails)
        let headersVal = {};
        // if(connectionDetails.isSAT) {
        //     headersVal = {
        //         'Authorization': 'bearer' + ' ' + connectionDetails.tokenVal,
        //         'AccountId': connectionDetails.accountId,
        //         'eAD': false,
        //     }
        // } else {
            headersVal = {
                'Authorization': this.commonService.grantResponseObj.authorization.token_type + ' ' + this.commonService.grantResponseObj.authorization.accessToken,
                "AccountId": this.commonService.grantResponseObj.userInfo.accountId,
                'eAD': true,
            }
       // }
        if (value?.length > 0) {
          this.isNotLibraryTab?this.showOverlay = false:this.showOverlay = true;
          this.dataSet = ['book','book ticket']    
          this.showList();         
            $.ajax({
                url: `${connectionDetails.agentassisturl}/agentassist/api/v1/searchaccounts/autosearch?botId=${connectionDetails.botId}`,
                type: 'post',
                headers: headersVal,
                data: payload,
                dataType: 'json',
                success: function (data) {
                    if (!isLibraryTab && data.typeAheads.length>0 && this.isNotLibraryTab) {
                        this.dataSet = data.typeAheads;
                        this.showOverLay = true;
                        this.showList();
                    } else {
                        if(data.typeAheads.length>0 && !this.isNotLibraryTab){
                            this.dataSet = data.typeAheads;
                            this.showOverLay = true;
                            this.showList();
                        }
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
