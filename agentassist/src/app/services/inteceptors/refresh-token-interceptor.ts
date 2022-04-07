import {throwError as observableThrowError,  Observable ,  BehaviorSubject } from 'rxjs';

import {take, filter, switchMap, finalize} from 'rxjs/operators';
import {catchError} from 'rxjs/operators';


import { Injectable, Injector } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from '@angular/common/http';

import {AuthService} from "@kore.services/auth.service";
import { AppUrlsService } from '@kore.services/app.urls.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private injector: Injector, private authService: AuthService, private appUrls: AppUrlsService) {}

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        // tslint:disable-next-line:max-line-length
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token, 'X-Timezone-Offset': new Date().getTimezoneOffset().toString()}});
    }

    // tslint:disable-next-line:max-line-length
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        const authService = this.injector.get(AuthService);

        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((error as HttpErrorResponse).status) {
                        case 401:
                            const errorRes = error.error;
                            // tslint:disable-next-line:max-line-length
                            if (errorRes && errorRes.errors && (errorRes.errors[0].code === 'TOKEN_EXPIRED' || errorRes.errors[0].msg === 'token expired')) {
                                return this.handle401TokenExpiredError(req, next);
                            // tslint:disable-next-line:max-line-length
                            } else if(errorRes && errorRes.errors && ((errorRes.errors[0].code === 41) || (errorRes.errors[0].code === '41'))){
                                // this.authService.refreshTokenExpired();
                                return observableThrowError(error);
                            } else {
                                return observableThrowError(error);
                            }
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            })) as any;
    }

    handle401TokenExpiredError(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            const authService = this.authService; // #raj this.injector.get(AuthService);

            return authService.refreshToken().pipe(
                switchMap((refreshData: any) => {

                    if (refreshData) {
                        // authService.updateAuthInfoWithRefreshTokenResponse(refreshData);
                        const newToken = refreshData.authorization.accessToken;
                        this.tokenSubject.next(newToken);
                        return next.handle(this.addToken(req, newToken));
                    }

                    // If we don't get a new token, we are in trouble so logout.
                    return this.logoutUser();
                }),
                catchError(error => {
                    // If there is an exception calling 'refreshToken', bad news so logout.
                    return this.logoutUser();
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }), );
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(req, token));
                }), );
        }
    }

    logoutUser() {
        // Route to the login page (implementation up to you)
        this.authService.handleInvalidToken();
        return observableThrowError('');
    }
}
