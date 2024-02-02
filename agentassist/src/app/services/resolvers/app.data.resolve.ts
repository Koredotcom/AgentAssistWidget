import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '@kore.services/auth.service';
import { AppService } from '@kore.services/app.service';
//import {zip} from 'rxjs/operators';

@Injectable()

export class AppDataResolver implements Resolve<any> {

  unifiedObj: any = {
    'sit-xo.kore.ai': true,
    'dev-xo.kore.ai' : true,
  }

  // verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private authService: AuthService, private appService: AppService) { }
  // configNote = { duration: 600000, panelClass: ['background-logout'], verticalPosition: this.verticalPosition, data: { msg: "", action: "", stat: false } };

  resolve(route: ActivatedRouteSnapshot) {
    return Observable.create(observer => {
      var _promise1 = this.authService.getApplictionControlsFromServer();
      if(!this.unifiedObj[window.location.host]) {
        const instanceOb$ = this.appService.getInstaceApps();
        instanceOb$.subscribe();
      }
      
      //const versionOb$ = this.appService.getAppVersion();
      _promise1.subscribe((res)=>{
        observer.next(res);
        this.authService.deflectSeedData();
        this.authService.getDeflectApps();
        this.authService.getProfile();
        this.authService.getAgentDesktopPermissions();
        observer.complete();
        
      },
      (errRes) => {
        observer.end();
      });
    });;
  }

}