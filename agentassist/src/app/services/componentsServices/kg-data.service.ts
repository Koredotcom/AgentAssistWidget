import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})

export class kgDataService {
    kgTaskId: string;
    importFileComplete = new Subject();
    importFaqs = new Subject();
    trainKG$ = new Subject();
    faqsCount$ = new Subject();
    kgTrainingInProgess$ = new Subject();

    setKgTaskId(id) {
        this.kgTaskId = id;
    }

    getKgTaskId() {
        return this.kgTaskId;
    }

    importComplete() {
        this.importFileComplete.next();
    }

}