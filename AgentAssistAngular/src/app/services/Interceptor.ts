import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RootService } from "./root.service";

@Injectable()
export class I1 implements HttpInterceptor {

    constructor(private rootService : RootService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        const {botId, fromSAT, token, accountId} = this.rootService.getConnectionDetails(); 
        console.log(fromSAT, "from sat");
        
        let headerObj : any = {"content-type": 'application/json', 'iid' : botId ? botId : 'st-1c3a28c8-335d-5322-bd21-f5753dc7f1f9'};
        let headers : any = req.headers.keys();
        console.log(headers, "headers", headers.indexOf("historyAPiCall"));
        
        if(headers.indexOf("historyAPiCall") >= 0){
            if(fromSAT){
                headerObj.Authorization = 'bearer' + ' ' + token,
                headerObj.eAD = false,
                headerObj.accountId = accountId
            }else{
                headerObj.Authorization = this.rootService.grantResponseObj?.authorization?.token_type + ' ' + this.rootService.grantResponseObj?.authorization?.accessToken
            }
        }
        const modified = req.clone({setHeaders: headerObj});
        return next.handle(modified);
    }

    
}
