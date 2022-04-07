import { Injectable } from "@angular/core";
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { workflowService } from "@kore.services/workflow.service";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { WaitExperiences, WaitExpRsp } from "./wait-experiences.model";

@Injectable({ providedIn: 'root' })

export class WaitExpService {

    constructor(private service: ServiceInvokerService,
        private workflowService: workflowService) { }


    getWaitExperiences(desc: string): Observable<WaitExperiences[]> {
        return this.service.invoke('get.waitExp', { description: desc }).pipe(
            map((waitExp: WaitExpRsp) => waitExp.results)
        );
    }

    getWaitExpDetails(id: string) {
        const params = {
            id: id
        };
        return this.service.invoke('get.waitExp.single', params).pipe(
            tap(waitExp => waitExp),
            catchError(error => {
                this.workflowService.showError(error, '');
                return throwError(error);
            })
        )
    }

}