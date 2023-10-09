import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from '@kore.services/app.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SubSink } from 'subsink';
import { OnboardingDialogComponent } from './onboarding-dialog/onboarding-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AccWarningDialogComponent } from 'src/app/helpers/components/acc-warning-dialog/acc-warning-dialog.component';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AuthService } from '@kore.services/auth.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  instance: any;
  public WINDOW = window;
  constructor(
    private dialog: MatDialog,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appService: AppService,
    private router: Router,
    private translate: TranslateService,
    public localstore: LocalStoreService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if(this.appService.selectedInstanceApp$.value) {
        if(this.authService.agentAssistAutomationBots.length > 0) {
          this.router.navigate(['/config/usecases']);
        } else {
          this.initDialog();
        }
      // this.showWarningMessage();
    }
    /* if (this.appService.instanceApps.length && !this.appService.isMigrated) {
      this.router.navigate(['home']);
    } */
    else {
      this.initDialog();
    }
  }

  marketURL(){
    return  this.WINDOW.location.protocol+"//"+this.WINDOW.location.host+"/accounts"
  }

  completeAppPath(){
    return this.WINDOW.location.href;
  }

  showWarningMessage() {
    let dialogRef = this.dialog.open(AccWarningDialogComponent, {
      width: '1050px',
      panelClass: "warning-account-popup",
      disableClose: true,
      data: {
        title: this.translate.instant("Account_Error"),
        text: this.translate.instant("Account_Error_MSG"),
        buttons: [{ key: 'login', label: this.translate.instant("LOGIN_BTN") }, { key: 'create', label: this.translate.instant("CREATE_ACCOUNT_BTN") }]
      }
    });

    dialogRef.componentInstance.onSelect.subscribe(result => {
      console.log('sandeep: ', result);
      if (result === 'login') {
        // redirect to login page
        dialogRef.close();
      } else if (result === 'create') {
        // redirect to sign up page
        let userInfo:any = this.authService.getAuthInfo()?.currentAccount?.userInfo || {};
        let redirectedUrl = this.completeAppPath();
        dialogRef.close();
        // window.location.href =  this.marketURL()+'/?email=' + userInfo?.emailId + '&return_to=' + redirectedUrl + '&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isAgentAssistApp#login';
        window.location.href =  this.marketURL()+'/?return_to='+redirectedUrl+'&showLogin=true&hideSSOButtons=true&hideResourcesPageLink=true&comingFromKey=isAgentAssistApp'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      // logic for redirecting
    })
  }

  initDialog() {
    let dialogRef = this.dialog.open(OnboardingDialogComponent, {
      width: '710px',
      maxHeight: '610px',
      height: '90%',
      panelClass: "onboardiong-selection-popup",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      //
    });
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }



}
