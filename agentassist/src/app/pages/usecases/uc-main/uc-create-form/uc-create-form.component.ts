import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModelGroup, Validators } from '@angular/forms';
import { NewUsecase, PALETTES } from '../uc-header/uc-header.model';
import { UsecasesMainService } from '../uc-main.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { workflowService } from '@kore.services/workflow.service';
import { Category, Usecase } from '../uc-table-main/uc-table-main.model';
import { UsecasesTableMainService } from '../uc-table-main/uc-table-main.service';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';

import * as _ from 'underscore';
import { MixPanelWrapper } from 'src/app/helpers/mixpanel';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-uc-create-form',
  templateUrl: './uc-create-form.component.html',
  styleUrls: ['./uc-create-form.component.scss']
})

export class UsecasesCreateFormComponent implements OnInit, OnDestroy, AfterViewInit  {
  categoryList: Category[] = [];
  streamId: string;
  filteredOptions: Observable<Category[]>;
  selectedPallete: string;
  ucForm: FormGroup;
  
  @ViewChild('autoCompleteInput') autoComplete: MatAutocompleteTrigger;
  @ViewChild('aComp') autoC: ElementRef; 
  @Input('usecaseType') currentType: NewUsecase;
  @ViewChild('ucName') ucName: ElementRef;

  constructor(public usecaseService: UsecasesMainService,
          public usecasesTableService: UsecasesTableMainService,
          private service:ServiceInvokerService,
          public workflowService:workflowService,
          private notificationService: NotificationService,
          private renderer: Renderer2,
          private mixPanel:MixPanelWrapper,
          private translate: TranslateService,
      ) { }

  ngOnInit(): void {
    this.ucForm = new FormGroup({
      'usecaseName': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required)
    });
    this.usecaseService.usecaseAdd$.next(true);
    this.streamId = this.workflowService.getCurrentBt()._id;
    const params = {
      streamId: this.streamId
    };
    this.service.invoke('get.categories', {streamId: this.streamId}, { isSmartAssistOnly: true })
      .subscribe(
        (res: Category[])=> {
          res = _.reject(res, (c: Category) => c.category.toLowerCase() == "no category");
          this.categoryList = res;
          this.filteredOptions = this.ucForm.get('category').valueChanges.pipe(
            startWith(''),
            map((name: string) => name ? this._filter(name) : this.categoryList.slice())
          );
        },
        err=> this.showError(err, this.translate.instant("USECASES.FAILED_FETCH_CATEGORIES")));
  }

  ngAfterViewInit() {
    fromEvent(this.autoC.nativeElement, 'blur')
      .pipe(
        distinctUntilChanged(),
        map((event: any) => event.target.value))
        .subscribe((value)=>{
          if(this.doesCatExists(value.trim())) {
            this.onCategory(value);
            return;
          }
        });
    this.ucName.nativeElement.focus();
  }

  doesCatExists(value: string) {
    return _.where(this.categoryList, {category: value}).length > 0
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  onSubmit(doClose: boolean) {
    if((/[`@#$%^<>*.()+\-=\[\]{};':"\\|,\/~]/.test(this.ucForm.value.usecaseName.trim())) || (/^[_ ]+/.test(this.ucForm.value.usecaseName.trim()))) {
      
      if (this.usecaseService.tabActive === 'faq') {
        this.notificationService.notify(this.translate.instant("ALPHANUMERIC_ONLY" , {fieldName: this.translate.instant('USECASES.PRIM_QUES')}) , 'error');
      } else {
        this.notificationService.notify(this.translate.instant("ALPHANUMERIC_ONLY" , {fieldName: this.translate.instant('USECASES.NAME')}) , 'error');
      }

      return;
    }

    let params = {streamId: this.streamId};
    const self = this;
    function create() {
      let ucPayload: Usecase = self.getUPayload();
      self.service.invoke('post.createUsecase', params, ucPayload).subscribe(res=>{
        self.notificationService.notify(self.translate.instant("USECASES.ADDED") + " " + ucPayload.usecaseName + self.translate.instant("USECASES.USECASE_SPACE") + " ", 'success');
        self.mixPanel.usecaseCreated(ucPayload.usecaseName);
        self.usecasesTableService.ucCreated$.next(res);
        if(doClose) { self.usecaseService.closeNewUsecase(); }
        else { self.rForm(); }
      }, err => {
        self.showError(err, self.translate.instant("USECASES.FAILED_CREATE_UC"));
      });
    }
    if(this.doesCatExists(this.autoC.nativeElement.value.trim())) {
      create();
    } else {
      let payload = <Category>this.getCPayload();
      this.usecasesTableService.categoryCreate(params, payload).subscribe(res=>{
        this.selectedPallete = payload.colorCode;
        this.categoryList.push(payload);
        create();
      }, err=>{
        this.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
      });
    }
  }

  onCategory(selectedCategory: string) {
    if(selectedCategory) {
      this.selectedPallete = _.findWhere(this.categoryList, {category: selectedCategory}).colorCode;
    }	
  }

  rForm() {
    this.ucForm.reset();
    this.selectedPallete = '';
  }

  getCPayload() {
    let payload = {
      category: this.ucForm.value.category.trim(),
      colorCode: ''
    }
    if(this.categoryList.length > 23) {
      payload.colorCode = this.usecaseService.getRandomColor();
    } else {
      payload.colorCode = PALETTES[this.categoryList.length];
    }
    return payload;
  }

  getUPayload(): Usecase{
    let ucPayload: Usecase = {
      usecaseType: this.usecaseService.tabActive,
      usecaseName: this.ucForm.value.usecaseName.trim(),
      category: this.autoC.nativeElement.value,
      categoryColor: this.selectedPallete
    }
    return ucPayload;
  }

  createCategory(event: any, prior?: boolean) {
    if(prior || event.which == '13') {
      if(!this.ucForm.value.category) {
        return;
      }
      this.autoComplete.closePanel();
      if(_.where(this.categoryList, {category: this.ucForm.value.category.trim()}).length > 0) {
        this.onCategory(this.ucForm.value.category.trim());
        return;
      }
      let params = {
        streamId: this.streamId
      };
      let payload = <Category>this.getCPayload();
      this.usecasesTableService.categoryCreate(params, payload).subscribe(
        res=>{
          this.notificationService.notify('"'+payload.category+'"' + this.translate.instant("USECASES.CAT_CREATED_SUCCESSFULLY"), 'success');
          this.selectedPallete = payload.colorCode;
          this.categoryList.push(payload);
        }, err =>{
          this.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
  }

  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();
    return this.categoryList.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy() {
    this.usecaseService.usecaseAdd$.next(false);
  }
}
