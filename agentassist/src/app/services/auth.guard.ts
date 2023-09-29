import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '@kore.services/auth.service';
import {AppUrlsService} from '@kore.services/app.urls.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private appUrlsService:AppUrlsService
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    if(!this.authService.isAuthenticated() && !this.authService.hasToken) {
      this.appUrlsService.redirectToLogin();
      return false;
    }else{
      return true;
    }
  }
}
