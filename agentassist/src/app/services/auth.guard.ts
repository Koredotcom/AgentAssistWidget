import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '@kore.services/auth.service';
import {AppUrlsService} from '@kore.services/app.urls.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private appUrlsService:AppUrlsService,
    private route: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    if(!this.authService.isAuthenticated() && !this.authService.hasToken) {
      this.appUrlsService.redirectToLogin();
      return false;
    }
    // if(!this.authService.smartAssistBots?.length){
    //   this.route.navigate(['/onboarding']);
    // }
    return true;

  }
}
