import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

@Injectable({providedIn: 'root'})

export class AgentChatService {
    agentData: any = null;
    scrollToMsg$ = new Subject();

    constructor(private service: ServiceInvokerService) {

    }
    getAgentChatData(params?: {botId: string}, token?: string) {
        return Observable.create(observer => {
            if(this.agentData) {
                return observer.next(JSON.parse(JSON.stringify(this.agentData)));
            }
            else  {
                this.service.invoke('get.agentChatHistory', params, '', {'Authorization': token}).subscribe(
                    res=>{ 
                        this.agentData = res;
                        observer.next(res); 
                    }, err => {  
                        observer.error(err);
                     });
            }
        });
    }

    scrollToElement(msgId: string) { this.scrollToMsg$.next(msgId); }
}