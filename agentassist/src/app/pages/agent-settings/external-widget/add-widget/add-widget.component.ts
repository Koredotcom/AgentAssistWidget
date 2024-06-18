import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { UcDeleteConfirmComponent } from '../../../../helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { FileUpload, ParamsWidget, Widget, WidgetVariables } from '../../agent-settings.model';
import { AgentSettingsService } from '../../agent-settings.service';

@Component({
  selector: 'app-add-widget',
  templateUrl: './add-widget.component.html',
  styleUrls: ['./add-widget.component.scss']
})
export class AddWidgetComponent implements OnInit, AfterViewInit {
  showVisitParameters: boolean = false;
  formWidget: UntypedFormGroup;
  reg = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
  uploadedFileId: string;
  widgetImg: any;
  wdgtVariables: WidgetVariables[];
  hashVariableN2M: any = {};
  hashVariableM2N: any = {};
  selectParameter = "Select Parameter";
  tempParamsList: ParamsWidget[] = [];

  @Input() data: Widget;
  @Input() isEdit = false;
  @Output() closed = new EventEmitter();
  @ViewChild('widgetTitle', { static: true }) widgetTitle: ElementRef;

  constructor(private fb: UntypedFormBuilder,
    private agentService: AgentSettingsService,
    public translate: TranslateService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setFormWidgetForm();
    if (!this.isEdit) {
      this.addInfoParam();
    }
    this.agentService.getWidgetsVariables().subscribe(
      (variables: WidgetVariables[]) => {
        this.wdgtVariables = variables;
        this.wdgtVariables.forEach(val => {
          this.hashVariableN2M[val.name] = val.mapping;
          this.hashVariableM2N[val.mapping] = val.name;
        })
      }
    )
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.widgetTitle.nativeElement.focus();
    }, 500)
  }

  get paramsList() {
    return (<UntypedFormArray>this.formWidget.get('metaInfo.params')).controls;
  }

  setFormWidgetForm() {
    this.formWidget = this.fb.group({
      title: [this.data.title, [Validators.required, Validators.minLength(3)]],
      url: [this.data.url, [Validators.required, Validators.pattern(this.reg)]],
      alternativeUrl: [this.data.alternativeUrl, [Validators.required, Validators.pattern(this.reg)]],
      metaInfo: this.fb.group({
        params: this.fb.array([])
      })
    });

    for (let i = 0; i < this.data.metaInfo.params.length; i++) {
      const paramsCtrl = this.fb.group({
        key: [this.data.metaInfo.params[i].key],
        path: [this.data.metaInfo.params[i].path]
      });
      (<UntypedFormArray>this.formWidget.get('metaInfo.params')).push(paramsCtrl);
    }

    this.widgetImg = this.data.label;

    this.tempParamsList = this._clone(this.data.metaInfo.params);

    if (!this.tempParamsList?.length) {
      this.addInfoParam();
    }

  }

  uploadImg(file: File) {
    if (!file) {
      return;
    }
    var _ext = file.name.substring(file.name.lastIndexOf('.'));
    const self = this;
    if (_ext.toLowerCase() !== '.png') {
      this.notificationService.notify(this.translate.instant("ONBOARDING.UPLOAD_ONLY_PNG"), 'error');
      return;
    }
    this.agentService.uploadImage(file).subscribe(
      (response: FileUpload) => {
        this.uploadedFileId = response.fileId;
        let reader = new FileReader();
        reader.onload = function (loadEvent) {
          self.widgetImg = loadEvent.target.result;
        };
        reader.readAsDataURL(file);
      }
    )
  }

  addInfoParam() {
    const paramsCtrl = this.fb.group({
      key: [""],
      path: [this.selectParameter]
    });
    (<UntypedFormArray>this.formWidget.get('metaInfo.params')).push(paramsCtrl);
  }

  selectVar(index, variable) {
    (<UntypedFormArray>this.formWidget.get('metaInfo.params')).at(index).patchValue({
      path: variable.name
    });
  }

  deleteParam(index) {
    (<UntypedFormArray>this.formWidget.get('metaInfo.params')).removeAt(index);
  }

  deleteWidget() {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '530px',
      panelClass: "delete-skill",
      data: {
        title: `${this.translate.instant('EXT_WIDGET.R_U_SURE')} '${this.data.title}'`,
        text: `${this.translate.instant('EXT_WIDGET.R_U_SURE_DESC')}`,
        buttons: [{ key: 'yes', label: this.translate.instant('EXT_WIDGET.DELETE'), type: 'danger' }, { key: 'no', label: this.translate.instant('EXT_WIDGET.NO_I_DONT') }]
      }
    });

    dialogRef.componentInstance.onSelect.subscribe(result => {
      if (result === 'yes') {
        this.agentService.deleteWidget(this.data.id).subscribe();
        dialogRef.close();
        this.close();
      } else if (result === 'no') {
        dialogRef.close();
      }
    });
  }

  getInitials(name: string) {
    if (!name) return '';
    return name.split(' ').map(val => val[0]).join('').toUpperCase().slice(0, 2);
  }

  validateParams() {
    let list = this.formWidget.get('metaInfo.params').value;
    for (let i = 0; i < list.length; i++) {
      if (list[i].key == '') {
        this.notificationService.notify(this.translate.instant('EXT_WIDGET.PARAM_NAME_CANNOT'), 'warning');
        return;
      }
      if (list[i].path == this.selectParameter) {
        this.notificationService.notify(this.translate.instant('EXT_WIDGET.PLEASE_SELECT_PARAM'), 'warning');
        return;
      }
    }

    this.tempParamsList = list;
    this.showVisitParameters = false;
  }

  saveParameter() {
    this.validateParams();
  }

  addWidget() {
    let payload = this.formWidget.value;
    payload = { ...payload, type: 'custom' }
    payload.metaInfo.params = this.tempParamsList;
    payload.metaInfo.params.forEach(val => val.path = this.hashVariableN2M[val.path]);
    if (this.uploadedFileId) {
      payload = { ...payload, label: this.uploadedFileId }
    }
    this.agentService.createWidget(payload).subscribe(
      () => {
        this.notificationService.notify(this.translate.instant('EXT_WIDGET.WIDGET_CREATED_SUCCESSFULLY'), 'success');
        this.close();
      },err =>{
        this.notificationService.showError(err);
      }
    );
  }

  editWidget() {
    let payload = this.formWidget.value;
    payload = { ...payload, type: 'custom' }
    payload.metaInfo.params.forEach(val => {
      if (this.hashVariableN2M[val.path]) {
        val.path = this.hashVariableN2M[val.path]
      }
    });
    if (this.uploadedFileId) {
      payload = { ...payload, label: this.uploadedFileId }
    }
    this.agentService.editWidget(this.data.id, payload).subscribe(
      () => {
        this.notificationService.notify(this.translate.instant('EXT_WIDGET.WIDGET_EDIT_SUCCESS'), 'success');
        this.close();
      }
    );
  }


  close() {
    this.closed.emit();
  }

  addVisitParameters() {
    this.showVisitParameters = true;
  }

  cancel() {
    // (<FormArray>this.formWidget.get('metaInfo.params')).clear();

    const formArray = (<UntypedFormArray>this.formWidget.get('metaInfo.params'));
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }


    for (let i = 0; i <  this.tempParamsList.length; i++) {
      const paramsCtrl = this.fb.group({
        key: [ this.tempParamsList[i].key],
        path: [ this.tempParamsList[i].path]
      });
      (<UntypedFormArray>this.formWidget.get('metaInfo.params')).push(paramsCtrl);
    }

    if (this.tempParamsList.length == 0) {
      this.addInfoParam();
    }
    this.showVisitParameters = false;
  }

  _clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj))
    } catch (err) {
      return null;
    }
  }

}
