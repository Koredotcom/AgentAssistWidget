import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@kore.services/auth.service';
import { LocalStoreService } from '@kore.services/localstore.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { SaDeleteConfirmComponent } from 'src/app/helpers/components/sa-delete-confirm/sa-delete-confirm.component';

@Component({
  selector: 'app-search-assist',
  templateUrl: './search-assist.component.html',
  styleUrls: ['./search-assist.component.scss']
})
export class SearchAssistComponent implements OnInit {

  @ViewChild("searchForm") searchForm: NgForm


  userInfo: any;
  accountId: string;
  searchConv: any = {};
  formDirty: boolean = false;
  editClick: boolean = false;
  createForm: boolean = true;
  saveStatus : boolean = true;
  editEnabled : boolean = false;
  actualConfigDetailsObj: any = {};
  showOpenEyeIcon : boolean = true;
  disableSearchForm: boolean = false;
  searchAssistConfigDetailsObj: any = {};
  createFormStatus : boolean = undefined;
  searchAssistUrl : string = "https://searchassist-pilot.kore.ai/";
  searchAssistKeys: any = ['searchAssistbotId', 'domain', 'clientId', 'clientSecret'];
  isSearchAssistEnabled: boolean = true;
  loading = false;
  constructor(private localstorage: LocalStoreService, private service: ServiceInvokerService,
    private cdr: ChangeDetectorRef, private dialog: MatDialog,
    private translate: TranslateService, private notificationService: NotificationService,
    public workflowService: workflowService,private authService: AuthService,
    private router: Router
    ) { }
  ngOnInit(): void {
    // this.loading = true;
  }
    

  ngAfterViewInit() {
    // this.getAgentAssistSettings();
    this.getAccountId();
    setTimeout(() => {
      this.searchFormChangeMode(); 
    });
  }

  getAgentAssistSettings() {
    this.loading = true;
    let botId = this.workflowService?.getCurrentBtSmt(true)._id
    let params = {
      orgId: this.authService?.getOrgId(),
    };
    let body = {
      botId
    }
    this.service.invoke("get.agentAssistSettings", params, body)
    .pipe(
      finalize(()=>{
        this.loading = false;
      })
    )
    .subscribe(
      (res) => {
        if (res) {
          this.isSearchAssistEnabled = res.agentAssistSettings.isSearchAssistEnabled;
          if(this.isSearchAssistEnabled){
            this.getAccountId();
            setTimeout(() => {
              this.searchFormChangeMode(); 
            });
          }
        }
      },
      (err) => {
        this.notificationService.showError(
          err,
          this.translate.instant("FALLBACK_ERROR_MSG")
        );
      }
    );
  }

  getAccountId() {
    this.accountId = this.localstorage.getSelectedAccount()?.accountId
    this.getSearchAssistConfigInfo();
  }

  redirectToAASettings() {
      this.router.navigate(['/config/widget-settings']);
  }

  getSearchAssistConfigInfo() {
    const params = {
      'accountId': this.accountId
    };
    this.actualConfigDetailsObj = {};
    this.searchAssistConfigDetailsObj = {};
    this.editEnabled = false; 
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
      let methodType = this.editEnabled ? 'put.searchaccounts' : 'post.searchaccounts';
      this.service.invoke(methodType, { accountId: this.accountId }, payLoad).subscribe((data) => {
        if(data && data.statusCode == 401){
          this.handleSaveFailureCase();
        }else if(data){
          this.editEnabled = false; 
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
      this.editEnabled = true;
      this.disableSearchForm = false;
      this.searchFormChangeMode();
    } else{
      this.editEnabled = false; 
      this.updateSearchConfDetailsFromDb(this.actualConfigDetailsObj);
    }
  }

  getFormValueStatus() {
    this.searchForm?.form?.valueChanges.subscribe(formObject => {
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
      this.searchForm?.form?.disable();
    } else {
      if(this.isSearchAssistEnabled){
        this.searchForm.form.enable();
      }
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
