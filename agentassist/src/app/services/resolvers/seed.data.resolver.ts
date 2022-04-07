import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "@kore.services/auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SeedDataResolver implements Resolve<any> {
    constructor(private authService: AuthService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {    

        return new Observable(observer => {
            var promise = this.authService.getApplictionControlsFromServer();
            promise.subscribe(res=>{
                observer.next();
                this.authService.deflectSeedData();
                observer.complete();
            })
        })
    }
}