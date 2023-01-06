import { Injectable } from "@angular/core";
import { CommonService } from "./common.service";
declare const $: any;
@Injectable()
export class TypeAHeadService {
    typeaheadArray = [];
    states = [];
    constructor(private commonService: CommonService){
        $(function() {
            var substringMatcher = function(strs) {
                return function findMatches(q, cb) {
                var matches, substringRegex;
      
                // an array that will be populated with substring matches
                matches = [];
      
                // regex used to determine if a string contains the substring `q`
                let substrRegex = new RegExp(q, 'i');
      
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                strs  = [...this.typeaheadArray];
                $.each(strs, function(i, str) {
                  if (substrRegex.test(str)) {
                    matches.push(str);
                  }
                });
      
                cb(matches);
              };
            };
            $(`.typeahead`).typeahead({
                hint: true,
                highlight: true,
                minLength: 1
              },
              {
                name: 'states',
                source: substringMatcher(this.states)
              });
          });
    }
    typeAHead = this.typeAHeadDeBounce((val, falg, connectionDetails)=>this.getAutoSearchApiResult(val, falg, connectionDetails));
    
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
          $('#overLayAutoSearchDiv').addClass('hide').removeAttr('style');
          $('#overLayAutoSearch').find('.search-results-text')?.remove();
          $('.search-block').find('.search-results-text-in-lib')?.remove();
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
            $('#overLaySearch').html('');
                          $('.overlay-suggestions').addClass('hide').removeAttr('style');
                          this.addAutoSuggestionApi([], value);             
              $.ajax({
                  url: `${connectionDetails.agentassisturl}/agentassist/api/v1/searchaccounts/autosearch?botId=${connectionDetails.botId}`,
                  type: 'post',
                  headers: headersVal,
                  data: payload,
                  dataType: 'json',
                  success: function (data) {
                      if (!isLibraryTab && data.typeAheads.length>0) {
                          this.typeaheadArray = data.typeAheads;
                          $('#overLaySearch').html('');
                          $('.overlay-suggestions').addClass('hide').removeAttr('style');
                          this.addAutoSuggestionApi(data, value);
                      } else {
                          if(data.typeAheads.length>0){
                              this.typeaheadArray = data.typeAheads;
                              this.addAutoSuggestionTolibrary(data, value);
                          }
                      }
                  },
                  error: function (err) {
                      console.error("auto search api failed");
                  }
              });
          }
      }
      
       addAutoSuggestionTolibrary(data, val){
          let autoDiv = $('.search-block');
          ['book','book ticket', 'book flight']?.forEach((ele) => {
              autoDiv.append(`<div class="search-results-text-in-lib" id="autoResultLib-${ele}">${ele}</div>`)
          });
      }
      
       addAutoSuggestionApi(data, e){
          $('#overLayAutoSearch').find('.search-results-text')?.remove();
          $('#overLayAutoSearchDiv').removeClass('hide').attr('style', 'bottom:0; display:block');
          let autoDiv = $('#overLayAutoSearch');
          ['book','book ticket', 'book flight']?.forEach((ele) => {
              autoDiv.append(`<div class="search-results-text" style="cursor: pointer;" id="autoResult-${ele}">${ele}</div>`)
          });
      }
}