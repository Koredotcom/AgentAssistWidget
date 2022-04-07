import { Injectable, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Category, GroupBy, MOCK_USECASES_RESPONSE, Usecase, UsecaseOb, UsecaseParams, UsecaseRespStruct, USECASES_LIMIT } from "./uc-table-main.model";
import { workflowService } from '@kore.services/workflow.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { UsecasesMainService } from "../uc-main.service";
import { NotificationService } from '@kore.services/notification.service';
@Injectable({providedIn: "root"})

export class UsecasesTableMainService {
    public filterSel: string = '';
    public selStatus: '' | 'configured' | 'published' = '';
    public isGrouped: boolean = false;
    public defaultConfigs: any;
    public isSrchFocus: boolean = false;
    private catList: Category[] = [];
    public srch: string = '';
    public gpBy: GroupBy;
    

    ucSearch$ = new Subject<UsecaseRespStruct>();
    ucCreated$ = new Subject<UsecaseOb>();
    ucDeleted$ = new Subject<{uc: UsecaseOb, isDeleted: boolean}>();
    ucUpdated$ = new Subject<UsecaseOb>();
    ucCategoriesUpdate$ = new Subject<void>();

    ucFqModified$ = new Subject<UsecaseOb[]>();
    ucDgModified$ = new Subject<UsecaseOb[]>();
    
    constructor(private service:ServiceInvokerService,
            public workflowService:workflowService) {
            }


    public set categories(li: Category[]) {
        this.catList = li;
    }

    public get categories () {
        return this.catList;
    }

    categoryCreate(params: {streamId: string}, payload: Category): Observable<any> {
        return new Observable(observer => {
            this.service.invoke('post.createCategory', params, payload)
                .subscribe(res=>{
                    this.catList = res.categories;
                    observer.next(res);
                }, err=>{
                    observer.error(err);
                });
        })
    }
}