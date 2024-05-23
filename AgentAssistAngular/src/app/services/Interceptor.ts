import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { RootService } from "./root.service";

@Injectable()
export class I1 implements HttpInterceptor {

    constructor(private rootService : RootService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  

        if(req.body?.isExternalWn){
            delete req.body['isExternalWn']
            return next.handle(req);
        }
        const {fromSAT, token, accountId} = this.rootService.getConnectionDetails(); 

        let modifiedReq = req.clone();

        let botId = modifiedReq.headers.get('botId');        
        let headerObj : any = { 'iid' : botId ? botId : 'st-1c3a28c8-335d-5322-bd21-f5753dc7f1f9'};
        let headerToken = fromSAT ? 'bearer' + ' ' + token : this.rootService.grantResponseObj?.authorization?.token_type + ' ' + this.rootService.grantResponseObj?.authorization?.accessToken;
        let headerAccountId = fromSAT ? accountId : this.rootService.grantResponseObj?.userInfo?.accountId;


        if(headerToken && headerAccountId){
            if(fromSAT){
                headerObj.eAD = 'false';
                headerObj.accountId = headerAccountId;
            }else if(!modifiedReq.headers.has('excludeAccountId')){
                headerObj.accountId = headerAccountId;
            }
            headerObj.Authorization = headerToken;

            if (modifiedReq.headers.has('excludeAccountId')) {
                // Delete the header
                modifiedReq = modifiedReq.clone({
                  headers: modifiedReq.headers.delete('excludeAccountId')
                });
            }

            if (modifiedReq.headers.has('botId')) {
                // Delete botId
                modifiedReq = modifiedReq.clone({
                  headers: modifiedReq.headers.delete('botId')
                });
            }
           
        }
        // if (req.body instanceof FormData) {
        //     headerObj.iid = '',
        //     headerObj.accountId = ''
        //     headerObj.contentType = 'multipart/form-data';
        // }
        if(req.url.includes('/attachment/file') || req.url.includes('/file') ) {
            if((req.body instanceof FormData || req.url.includes('/chunk')) && req.method === 'POST') {
                headerObj.contentType = 'multipart/form-data'
            }
            headerObj.iid = '',
            headerObj.accountId = ''
        }
        const modified = modifiedReq.clone({setHeaders: headerObj});        
        return next.handle(modified);
    }

    
}
