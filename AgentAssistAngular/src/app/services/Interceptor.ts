import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { RootService } from "./root.service";

@Injectable()
export class I1 implements HttpInterceptor {

    constructor(private rootService : RootService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        const {fromSAT, token, accountId} = this.rootService.getConnectionDetails(); 
        let botId = req.headers.get('botId');        
        let headerObj : any = {"content-type": 'application/json', 'iid' : botId ? botId : 'st-1c3a28c8-335d-5322-bd21-f5753dc7f1f9'};
        let headers : any = req.headers.keys();  
        let headerToken = fromSAT ? 'bearer' + ' ' + token : this.rootService.grantResponseObj?.authorization?.token_type + ' ' + this.rootService.grantResponseObj?.authorization?.accessToken;
        let headerAccountId = fromSAT ? accountId : this.rootService.grantResponseObj?.userInfo?.accountId;
        if(headerToken && headerAccountId){
            if(fromSAT){
                headerObj.eAD = 'false';
                headerObj.accountId = headerAccountId;
            }else if(headers.indexOf('historyAPiCall') == -1 && headers.indexOf('userBotHistory') == -1){
                headerObj.accountId = headerAccountId;
            }
            headerObj.Authorization = headerToken;
        }
        const modified = req.clone({setHeaders: headerObj});        
        return next.handle(modified);
    }

    
}
