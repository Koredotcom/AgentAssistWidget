import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category, UsecaseOb } from '../../uc-table-main.model';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '../../../../../../services/notification.service';

import * as _ from 'underscore';
import { UsecasesTableMainService } from '../../uc-table-main.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
@Component({
  selector: 'app-uc-table-edit-name',
  templateUrl: './uc-table-edit-name.component.html',
  styleUrls: ['./uc-table-edit-name.component.scss']
})
export class UsecasesTableEditNameComponent implements OnInit, AfterViewInit {

  categoryList: string[] = [];
  // selectedCategory: string = "Choose an option";
  streamId: string;
  @ViewChild('dropdownCategory') dropdownToggler: ElementRef;
  @ViewChild('f') ucForm: NgForm;
  @ViewChild('inp') inp: ElementRef;
  @Input() ucEdit: UsecaseOb;
  @Output() closeMenu = new EventEmitter();

  constructor(private service:ServiceInvokerService,
              private translate: TranslateService,
              public workflowService:workflowService,
              private notificationService: NotificationService,
              private ucTMService: UsecasesTableMainService
          ) { }

  ngOnInit() {
    this.streamId = this.workflowService.getCurrentBt()._id;
    // if(this.ucTMService.categories.length > 0) {
    //   this.categoryList =  _.pluck(this.ucTMService.categories, 'category');
    // } else {
    //   this.service.invoke('get.categories', {streamId: this.streamId})
    //   .subscribe(res=> { 
    //       res = _.reject(res, (c: Category) => c.category.toLowerCase() == "no category");
    //       this.categoryList = _.pluck(res, 'category');
    //       this.ucTMService.categories = res;
    //   }, err=> { 
    //       this.showError(err, "Failed to fetch categories");
    //   });
    // }
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      this.ucForm.setValue({
        usecaseName: this.ucEdit.usecaseName
      });
      this.inp.nativeElement.focus();
      // this.selectedCategory = this.ucEdit.category;
    });
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  onUpdate(form: NgForm) {
    this.ucEdit.usecaseName = form.value.usecaseName;
    // this.ucEdit.category = this.selectedCategory;
    const params = {
      streamId: this.streamId,
      usecaseId: this.ucEdit.taskRefId
    }
    this.service.invoke('post.editUsecase', params, this.ucEdit).subscribe(res=>{
      this.ucTMService.ucUpdated$.next(res);
      this.notificationService.notify(this.translate.instant('NOTIFY.USECASE_UPDATED_SUCCESS'), "success");
      this.closeMenu.emit();
    }, err=>{
      this.showError(err, "Failed to update the usecase")
    })
  } 

  // onSelectCategory(category: string) {
  //   this.selectedCategory = category;
  //   $(this.dropdownToggler.nativeElement).toggle();
  // }

  // dropdownToggle(e) {
  //   e.preventDefault();
  //   $(this.dropdownToggler.nativeElement).toggle();
  // }

  closeMatMenu() {
    this.closeMenu.emit();
  }
}
