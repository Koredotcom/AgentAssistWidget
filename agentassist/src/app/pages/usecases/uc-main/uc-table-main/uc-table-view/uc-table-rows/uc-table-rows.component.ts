import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UsecasesMainService } from '../../../uc-main.service';
import { Category, UsecaseOb } from '../../uc-table-main.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { UsecasesTableMainService } from '../../uc-table-main.service';
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { UcDeleteConfirmComponent } from '../../../../../../helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

declare const $: any;
import * as _ from 'underscore';
import { PALETTES } from '../../../uc-header/uc-header.model';
import { MixPanelWrapper } from 'src/app/helpers/mixpanel';

@Component({
  selector: 'app-uc--table-rows',
  templateUrl: './uc-table-rows.component.html',
  styleUrls: ['./uc-table-rows.component.scss']
})
export class UcTableRowsComponent implements OnInit {

  streamId: string;
  moreAvail = false;
  categoryList: string[] = [];
  allCategories: Category[];
  selectedCategory: string;
  selectedPallete: string;
  ques = {
    ques: ''
  };
  isNewlyCreated = false;
  
  
  @ViewChild('menuTriggerTooltip') triggerTooltip: MatMenuTrigger;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('dropdownCat') dropdownToggler: ElementRef;
  @Input() usecase: UsecaseOb;
  @Input() i: number;
  @ViewChild('autoCompleteInput') autoComplete: MatAutocompleteTrigger;
  @ViewChild('aComp') autoC: ElementRef; 
  @ViewChild(MatMenuTrigger) editQues: MatMenuTrigger;
  @ViewChild('quesInp') quesInp: ElementRef;

  constructor(private ucTableService: UsecasesTableMainService,
              public usecaseService: UsecasesMainService,
              public workflowService:workflowService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private translate: TranslateService,
              private service:ServiceInvokerService,
              private mixPanel: MixPanelWrapper
          ) { }

  ngOnInit(): void {
    this.streamId = this.workflowService.getCurrentBt()._id;
    this.allCategories = this.ucTableService.categories;
  }

  showError(err: any, msg: string) {
    try {
      this.notificationService.notify(err.error.errors[0].msg, 'error');
    } catch(e) {
      this.notificationService.notify(msg, 'error');
    }
  }

  onMenuOpen(s: string) {
    this.ques.ques = s;
    this.quesInp.nativeElement.focus();
  }

  ucDelete(usecase: UsecaseOb) {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '446px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant("USECASES.DEL_UC"),
        text: this.translate.instant("USECASES.R_U_SURE_DEL") + " \"" + usecase.usecaseName + " " +this.translate.instant("USECASES.USECASE") + "\" ?",
        buttons: [{ key: 'yes', label: this.translate.instant("USECASES.YES"), type: 'danger' }, { key: 'no', label: this.translate.instant("USECASES.NO") }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          const params = {
            streamId: this.streamId,
            usecaseId: usecase.taskRefId
          };
          const payload = {
            type: usecase.usecaseType,
            state: usecase.state
          };
          this.service.invoke('post.deleteUsecase', params, payload).subscribe((res: any)=>{
            if(_.isArray(res)) {
              this.ucTableService.ucDeleted$.next({uc: res[0], isDeleted: true});
            } else {
              this.ucTableService.ucDeleted$.next({uc: res, isDeleted: res.hasOwnProperty('isDeleted')});
            }
            this.notificationService.notify(usecase.usecaseName + this.translate.instant("USECASES.HAS_DELETED"), 'success');
            this.mixPanel.usecaseDeleted(usecase);
          }, err => {
            this.showError(err, this.translate.instant("USECASES.FAILED_UC"));
          });
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  closeDD() {
    this.editQues.closeMenu();
  }

  updateQues(str: string, uc: UsecaseOb) {
    if(!str) {
      this.notificationService.notify(this.translate.instant("USECASES.PLS_ENTER"), 'error');
      return;
    } else {
      const oPrimary = uc.utterances.primary;
      uc.utterances.primary.text = str;
      uc.usecaseName = str;
      const params = {
        streamId: this.streamId,
        usecaseId: uc.taskRefId
      }
      this.service.invoke('post.editUsecase', params, uc).subscribe(res=>{
        this.ucTableService.ucUpdated$.next(res);
        this.notificationService.notify(this.translate.instant("USECASES.UC_SUCCESS"), "success");
        this.closeDD();
      }, err=>{
        this.showError(err, this.translate.instant("USECASES.FAILED_UPDATE_UC"));
      });
    }
  }

  updateCategory(uc: UsecaseOb) {
    const self = this;
    const categoryVal = this.autoC.nativeElement.value.trim();
    function update() {
      let temp = JSON.parse(JSON.stringify(uc));
      temp.category = categoryVal;
      temp.categoryColor = _.findWhere(self.ucTableService.categories, {category: categoryVal}).colorCode;
      const params = {
        streamId: self.streamId,
        usecaseId: uc.taskRefId
      }
      self.service.invoke('post.editUsecase', params, temp).subscribe(res=>{
        self.ucTableService.ucUpdated$.next(res);
        self.notificationService.notify(this.translate.instant("USECASES.UC_SUCCESS"), "success");
        self.usecase.category = temp.category;
        self.usecase.categoryColor = temp.categoryColor;
        if(self.ucTableService.isGrouped) {
          self.ucTableService.ucCategoriesUpdate$.next();
        }
      }, err=>{
        self.showError(err, this.translate.instant("USECASES.FAILED_UPDATE_UC"));
      })
    }
    if(_.where(this.ucTableService.categories, {category: this.autoC.nativeElement.value}).length > 0) {
      update();
    } else {
      let params = {
        streamId: this.streamId
      };
      let payload = <Category>this.getCPayload();
      this.ucTableService.categoryCreate(params, payload).subscribe(
        res=>{
          this.notificationService.notify('"'+payload.category+'"' + this.translate.instant("USECASES.CAT_CREATED_SUCCESSFULLY"), 'success');
          this.selectedPallete = payload.colorCode;
          this.ucTableService.categories = res.categories;
          this.allCategories = this.ucTableService.categories;
          // this.allCategories.push({...payload, faqCount: 0, dialogCount: 0});
          // this.ucTableService.categories.push(payload);
          update();
        }, err =>{
          this.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
  }

  onCategory(selectedCategory: string) {
    if(selectedCategory) {
      this.selectedPallete = _.findWhere(this.allCategories, {category: selectedCategory}).colorCode;
    }	
  }

  getCPayload() {
    let payload = {
      category: this.autoC.nativeElement.value.trim(),
      colorCode: ''
    }
    if(this.allCategories.length > 23) {
      payload.colorCode = this.usecaseService.getRandomColor();
    } else {
      payload.colorCode = PALETTES[this.allCategories.length];
    }
    return payload;
  }

  createCategory(event: any) {
    if(event.which == '13') {
      if(!this.autoC.nativeElement.value) {
        return;
      }
      this.autoComplete.closePanel();
      if(_.where(this.allCategories, {category: this.autoC.nativeElement.value.trim()}).length > 0) {
        this.onCategory(this.autoC.nativeElement.value.trim());
        return;
      }
      let params = {
        streamId: this.streamId
      };
      let payload = <Category>this.getCPayload();
      this.ucTableService.categoryCreate(params, payload).subscribe(
        res=>{
          this.notificationService.notify('"'+payload.category+' "' + this.translate.instant("USECASES.CAT_CREATED_SUCCESSFULLY"), 'success');
          this.selectedPallete = payload.colorCode;
          this.allCategories = this.ucTableService.categories;
          // this.allCategories.push(payload);
          // this.ucTableService.categories.push(payload);
        }, err =>{
          this.showError(err, this.translate.instant("USECASES.FAILED_CREATE_CATE"));
        });
    }
  }

  close() {
    this.trigger.closeMenu();
  }

  openUcRowEdit(usecase: UsecaseOb, tabActive: string) {
    if(usecase.usecaseType == 'dialog') {
      this.usecaseService.openCC$.next({usecase: usecase, tabActive: tabActive});
    } else if(usecase.usecaseType == 'faq') {
      this.usecaseService.openFC$.next({usecase: usecase, tabActive: tabActive});
    }
  }

  openUserUtterance(usecase: UsecaseOb) {
    this.close();
    this.usecaseService.openUU$.next(usecase);
  }
}
