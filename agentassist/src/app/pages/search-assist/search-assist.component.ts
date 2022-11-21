import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalStoreService } from '@kore.services/localstore.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Component({
  selector: 'app-search-assist',
  templateUrl: './search-assist.component.html',
  styleUrls: ['./search-assist.component.scss']
})
export class SearchAssistComponent implements OnInit {

  @ViewChild("searchForm", { static: true }) searchForm: NgForm


  userInfo: any;
  accountId: string;
  formDirty: boolean = false;
  editClick: boolean = false;
  disableSearchForm: boolean = false;
  actualConfigDetailsObj: any = {};
  searchAssistConfigDetailsObj: any = {};
  searchAssistKeys: any = ['searchAssistbotId', 'domain', 'clientId', 'clientSecret'];
  createForm: boolean = false;
  searchConv: any = {};

  constructor(private localstorage: LocalStoreService, private service: ServiceInvokerService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAccountId();
  }

  ngAfterViewChecked() {
    this.searchFormChangeMode();
  }

  getAccountId() {
    this.accountId = this.localstorage.getSelectedAccount()?.accountId
    this.getSearchAssistConfigInfo();
  }

  getSearchAssistConfigInfo() {
    const params = {
      'accountId': this.accountId
    };
    this.actualConfigDetailsObj = {};
    this.searchAssistConfigDetailsObj = {};
    this.service.invoke('get.searchaccounts', params).subscribe(data => {
      if (data) {
        this.updateSearchConfDetailsFromDb(data);
        this.getFormValueStatus();
        this.createForm = false;
        this.searchConv.isEnabled = data.isEnabled;
      } else {
        this.createSearchFormActivity();
      }
    }, (error) => {
      this.createSearchFormActivity();
    });
  }

  createSearchFormActivity() {
    this.disableSearchForm = false;
    this.searchFormChangeMode();
    this.getFormValueStatus();
    this.createForm = true;
    this.searchConv.isEnabled = true;
  }

  updateSearchConfDetailsFromDb(data) {
    if (data && data.searchAssistbotId) {
      this.actualConfigDetailsObj = Object.assign({}, data);
      for (let key of this.searchAssistKeys) {
        this.searchAssistConfigDetailsObj[key] = this.actualConfigDetailsObj[key];
      }
      this.disableSearchForm = true;
      this.searchFormChangeMode();
    } else if (data === "OK") {
      let acutalConfigDetails = Object.assign({}, this.actualConfigDetailsObj);
      for (let key in this.searchAssistConfigDetailsObj) {
        acutalConfigDetails[key] = this.searchAssistConfigDetailsObj[key];
      }
      this.actualConfigDetailsObj = Object.assign({}, acutalConfigDetails);
      this.disableSearchForm = true;
      this.searchFormChangeMode();
    }
  }

  updateSearchConfDetails(type) {
    let payLoad: any = Object.assign({}, this.searchAssistConfigDetailsObj);
    payLoad.isEnabled = this.searchConv.isEnabled;
    if (type == 'save') {
      this.disableSearchForm = true;
      this.searchFormChangeMode();
      let methodType = this.createForm ? 'post.searchaccounts' : 'put.searchaccounts';
      this.service.invoke(methodType, { accountId: this.accountId }, payLoad, {}, { responseType: 'text' }).subscribe((data) => {
        this.updateSearchConfDetailsFromDb(data);
      }, (error) => {
        console.log(error, "error");
      });
    } else {
      this.disableSearchForm = false;
      this.searchFormChangeMode();
    }
  }

  getFormValueStatus() {
    this.searchForm.form.valueChanges.subscribe(formObject => {
      this.formDirty = false;
      for (let key in formObject) {
        if (formObject[key] != this.actualConfigDetailsObj[key] && this.actualConfigDetailsObj[key] && formObject[key]) {
          this.formDirty = true;
          return
        }
      }
    });
  }

  disableButtonCondition() {
    let keyArray: any = this.searchAssistKeys;
    for (let key of keyArray) {
      if (!this.searchAssistConfigDetailsObj[key]) {
        return true;
      }
    }
    return false;
  }

  searchFormChangeMode() {
    if (this.disableSearchForm) {
      this.searchForm.form.disable();
    } else {
      this.searchForm.form.enable();
    }
    this.cdr.detectChanges();
  }

}
