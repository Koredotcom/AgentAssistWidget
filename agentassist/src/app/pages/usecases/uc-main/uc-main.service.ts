import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { NewUsecase } from "./uc-header/uc-header.model";
import { UsecaseOb } from "./uc-table-main/uc-table-main.model";

@Injectable({providedIn: "root"})

export class UsecasesMainService {
    isAddUsecase: boolean = false;
    thisisNewCreateFlowReq = false;
    flowCreateUpdate = false;
    selectedFlowData: any = {};
    
    formType: NewUsecase;
    tabActive: 'faq' | 'dialog' | 'exp' = 'exp';
    usecaseToggle = new EventEmitter<{show: boolean, usecase?: NewUsecase}>();

    public currentTab$ = new BehaviorSubject('exp');
    public isNewCreateFlowReq$ = new BehaviorSubject(false);
    public flowCreateUpdate$ = new BehaviorSubject(false);
    
    isInFlowComponent = false;
    usecaseAdd$ = new Subject<boolean>();
    switchTabs$ = new Subject<string>();
    ucAddSwitchTabs$ = new Subject<string>();
    openUU$ = new Subject<UsecaseOb>();
    openFC$ = new Subject<{usecase: UsecaseOb, tabActive: string}>();
    openCC$ = new Subject<{usecase: UsecaseOb, tabActive: string}>();
    
    addNewUsecase(usecase: NewUsecase) { 
        this.ucAddSwitchTabs$.next(usecase.id);
        this.usecaseToggle.emit({show: true, usecase}); 
    }

    closeNewUsecase() { 
        this.usecaseToggle.emit({show: false}); 
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    updatedTab(tabVal: string) {
        return this.currentTab$.next(tabVal);
    }

    createExpFlowBoolean(val: boolean) {
       return this.isNewCreateFlowReq$.next(val);
    }

    updateCallFlowTableBoolean(val: boolean) {
        return this.flowCreateUpdate$.next(val);
    }

}

