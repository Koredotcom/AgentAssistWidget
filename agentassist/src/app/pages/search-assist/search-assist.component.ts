import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { SaDeleteConfirmComponent } from 'src/app/helpers/components/sa-delete-confirm/sa-delete-confirm.component';

@Component({
  selector: 'app-search-assist',
  templateUrl: './search-assist.component.html',
  styleUrls: ['./search-assist.component.scss']
})
export class SearchAssistComponent implements OnInit {

  @ViewChild("searchForm", { static: true }) searchForm: NgForm


  userInfo: any;
  accountId: string;
  searchConv: any = {};
  formDirty: boolean = false;
  editClick: boolean = false;
  createForm: boolean = true;
  saveStatus : boolean = true;
  actualConfigDetailsObj: any = {};
  showOpenEyeIcon : boolean = true;
  disableSearchForm: boolean = false;
  searchAssistConfigDetailsObj: any = {};
  createFormStatus : boolean = undefined;
  searchAssistUrl : string = "https://searchassist-pilot.kore.ai/";
  searchAssistKeys: any = ['searchAssistbotId', 'domain', 'clientId', 'clientSecret'];

  constructor(private localstorage: LocalStoreService, private service: ServiceInvokerService,
    private cdr: ChangeDetectorRef, private dialog: MatDialog,
    private translate: TranslateService, private notificationService: NotificationService,

    ) { }

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
        this.createFormStatus = this.searchConv.isEnabled ? true : undefined;
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
      this.createForm = false;
      this.actualConfigDetailsObj = Object.assign({}, data);
      for (let key of this.searchAssistKeys) {
        this.searchAssistConfigDetailsObj[key] = this.actualConfigDetailsObj[key];
      }
      this.disableSearchForm = true;
      this.showOpenEyeIcon = true;
      this.searchFormChangeMode();
    }
  }

  handleSaveFailureCase(){
    this.saveStatus = true;
    this.createFormStatus = this.searchConv.isEnabled ? false : undefined;
    this.createForm = true;
    this.disableSearchForm = false;
    this.actualConfigDetailsObj = Object.assign({},this.searchAssistConfigDetailsObj);
    this.searchFormChangeMode();
  }

  updateSearchConfDetails(type) {
    let payLoad: any = Object.assign({}, this.searchAssistConfigDetailsObj);
    payLoad.isEnabled = this.searchConv.isEnabled;
    this.createFormStatus = undefined;
    if (type == 'save') {
      this.saveStatus = false;
      this.disableSearchForm = true;
      this.searchFormChangeMode();
      let methodType = this.createForm ? 'post.searchaccounts' : 'put.searchaccounts';
      let notificationSuccessCase = this.createForm ? "SEARCHASSIST.HAS_SAVED" : "SEARCHASSIST.HAS_UPDATED";
      // let notificationFailureCase = this.createForm ? "SEARCHASSIST.FAILED_SAVE" : "SEARCHASSIST.FAILED_UPDATE";
      this.service.invoke(methodType, { accountId: this.accountId }, payLoad).subscribe((data) => {
        if(data && data.statusCode == 401){
          this.handleSaveFailureCase();
        }else if(data){
          this.createFormStatus = this.searchConv.isEnabled ? true : undefined;
          this.updateSearchConfDetailsFromDb(data);
          // this.notificationService.notify(this.translate.instant(notificationSuccessCase), 'success');
          this.saveStatus = true;
        }
      }, (error) => {
        console.log(error, "error");
        this.handleSaveFailureCase();
      });
      
    } else if(type == 'edit') {
      this.disableSearchForm = false;
      this.searchFormChangeMode();
    } else{
      this.updateSearchConfDetailsFromDb(this.actualConfigDetailsObj);
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

  deleteConfig(){

    const dialogRef = this.dialog.open(SaDeleteConfirmComponent, {
      width: '446px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant("SEARCHASSIST.DEL_CONF"),
        text: this.translate.instant("SEARCHASSIST.R_U_SURE_DEL") + "?",
        buttons: [{ key: 'yes', label: this.translate.instant("SEARCHASSIST.YES"), type: 'danger' }, { key: 'no', label: this.translate.instant("SEARCHASSIST.NO") }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const params = {
            'accountId': this.accountId
          };
          this.service.invoke('delete.searchaccounts', params).subscribe((data) => {
            if(data && data.isOperational){
              this.createForm = true;
              this.showOpenEyeIcon = true;
              this.createFormStatus = undefined;
              this.getSearchAssistConfigInfo();
              this.searchForm.reset();
              this.notificationService.notify(this.translate.instant("SEARCHASSIST.HAS_DELETED"), 'success');
            }else{
              this.notificationService.showError(this.translate.instant("SEARCHASSIST.FAILED_SA"));
            }
            dialogRef.close();
          }, (error) => {
            this.notificationService.showError(this.translate.instant("SEARCHASSIST.FAILED_SA"));
            console.log(error, "error");
          });
        }
    });
  }

  searchConfToggleChange(){
    if(!this.disableButtonCondition()){
      this.updateSearchConfDetails('save') 
    }
  }

  goToSearchAssistUrl(): void {
    window.open(this.searchAssistUrl, "_blank");
  }

  copyInputMessage(inputElement){
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = inputElement;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.notificationService.notify("copied successfully", "success");
  }

}
