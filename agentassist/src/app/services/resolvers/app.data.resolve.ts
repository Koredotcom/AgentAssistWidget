import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '@kore.services/auth.service';
import { AppService } from '@kore.services/app.service';
//import {zip} from 'rxjs/operators';

@Injectable()

export class AppDataResolver implements Resolve<any> {

  unifiedXOConstant = 'xo.kore';

  // verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private authService: AuthService, private appService: AppService) { }
  // configNote = { duration: 600000, panelClass: ['background-logout'], verticalPosition: this.verticalPosition, data: { msg: "", action: "", stat: false } };

  resolve(route: ActivatedRouteSnapshot) {
    let instanceOb$;
    return Observable.create(observer => {
      var _promise1 = this.authService.getApplictionControlsFromServer();

      if(!window.location.href.includes(this.unifiedXOConstant) && this.authService.isAdminUser) {
        instanceOb$ = this.appService.getInstaceApps();
        instanceOb$.subscribe();
      }

      // if(this.authService.isAdminUser) {
      //   instanceOb$ = this.appService.getInstaceApps();
      // }
      
      //const versionOb$ = this.appService.getAppVersion();
      _promise1.subscribe((res)=>{
        observer.next(res);
        this.authService.deflectSeedData();
        this.authService.getDeflectApps();
        this.authService.getProfile();
        this.authService.getAgentDesktopPermissions();
        observer.complete();
        if(!window.location.href.includes(this.unifiedXOConstant) && this.authService.isAdminUser) {
          instanceOb$.subscribe();
        }
        
      },
      (errRes) => {
        observer.end();
      });
    });;
  }

}