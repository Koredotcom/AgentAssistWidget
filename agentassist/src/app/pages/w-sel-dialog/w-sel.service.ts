import { Injectable } from "@angular/core";
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import * as _ from 'underscore'

@Injectable({ providedIn: 'root' })

export class WSelectionService {
    private _existingBots = null;

    constructor(private service: ServiceInvokerService) { }

    getExistingBots(supportedLang): Observable<any> {
        if (this._existingBots) {
            return new Observable(observer => {
                observer.next([...this._existingBots])
            })
        } else {
            return this.service.invoke('get.existingbots').pipe(
                map(responseBots => {
                    this._existingBots = responseBots.filter(val => {
                        return _.findIndex(supportedLang, { value: val.defaultLanguage }) > -1;
                    });
                    return [...this._existingBots];
                })
            )
        }
    }
}