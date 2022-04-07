import { Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }
  private windowElement: any;

  showSuccess(message) {
    this.toastr.success(message)
  }
  notify(notifyInfo, type) {
    this.windowElement = window;
    try {
      if (notifyInfo && this.windowElement && this.windowElement.parent && this.windowElement.parent.NotificationService) {
        this.windowElement.parent.NotificationService.notify(notifyInfo, type);
      } else {
        if (type === 'error') {
          this.toastr.error(notifyInfo);
        }
        if (type === 'success') {
          this.toastr.success(notifyInfo);
        }
        if (type === 'warning') {
          this.toastr.warning(notifyInfo);
        }
      }
    } catch (err) {
      if (type === 'error') {
        this.toastr.error(notifyInfo);
      }
      if (type === 'success') {
        this.toastr.success(notifyInfo);
      }
      if (type === 'warning') {
        this.toastr.warning(notifyInfo);
      }
    }

  }

  showError(err, fbMsg?: string) {
    const errMsg = (err?.error && err?.error?.message) || (err?.error?.errors && err.error.errors[0] && err.error.errors[0].msg);
    this.toastr.error(errMsg || fbMsg || this.translate.instant('COMMON.SOMETHING_WENT_WRONG'));
  }

}
