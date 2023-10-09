import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { NotificationService } from "./notification.service";
import { ServiceInvokerService } from "./service-invoker.service";

@Injectable({
    providedIn: 'root'
})
export class AppService {

    instanceApps: any[] = [];
    selectedInstanceApp$ = new BehaviorSubject<any>({});

    hideHomePage$ = new BehaviorSubject<boolean>(false);
    showGuideLink$ = new BehaviorSubject<boolean>(false);

    isMigrated: boolean;

    constructor(
        private service: ServiceInvokerService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        try {
            this.isMigrated = JSON.parse(sessionStorage.getItem('isMigrated'))
        } catch (e) { }
    }

    getInstaceApps(): Observable<any> {
        return this.service.invoke('get.instances')
            .pipe(tap((res) => {
                this.instanceApps = res;  
                this.selectedInstanceApp$.next(res[0]);
                
            }, err => {
                this.notificationService.showError(err);
            }));
    }

    appendNewInstaceBot(instanceBot) {
        if (!instanceBot) return;
        this.instanceApps.unshift(instanceBot);
        this.selectedInstanceApp$.next(instanceBot);
    }

    getAppVersion() {
        return this.service.invoke('get.smartassist.version')
            .pipe(tap((res) => {
                if (!res.newUI) {
                    window.location.href = window.location.href.replace('/agentassist', '/agentassistv1');
                }
            }, err => {
                this.notificationService.showError(err);
            }));
    }

}