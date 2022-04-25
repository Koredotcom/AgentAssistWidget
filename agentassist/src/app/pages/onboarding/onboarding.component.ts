import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from '@kore.services/app.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SubSink } from 'subsink';
import { OnboardingDialogComponent } from './onboarding-dialog/onboarding-dialog.component';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  instance: any;
  constructor(
    private dialog: MatDialog,
    private service: ServiceInvokerService,
    private notificationService: NotificationService,
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.appService.instanceApps.length && !this.appService.isMigrated) {
      this.router.navigate(['home']);
    } else {
      this.initDialog();
    }
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
