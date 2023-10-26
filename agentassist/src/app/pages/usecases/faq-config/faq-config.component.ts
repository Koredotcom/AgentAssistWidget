import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdEditorOption } from 'src/app/helpers/lib/md-editor.types';
import { UsecaseOb } from '../uc-main/uc-table-main/uc-table-main.model';
import { workflowService } from '@kore.services/workflow.service';
import { MatDialog } from '@angular/material/dialog';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
@Component({
  selector: 'app-faq-config',
  templateUrl: './faq-config.component.html',
  styleUrls: ['./faq-config.component.scss']
})
export class FaqConfigComponent implements OnInit {

  viewType: 'edit' | 'preview' = 'preview';

  responseMode: 'standard' | 'advanced' = 'standard';
  options: MdEditorOption = {
    showPreviewPanel: false,
    hideIcons: ['TogglePreview'],
    shiftEnter: true
  }

  responses: { answer: string, viewType: string }[] = [];
  chatResponses: { answer: string, viewType: string }[] = [];

  activeResponse = "";

  saveInProgress: boolean = false;

  isEditable: boolean = true;

  tempData: UsecaseOb;
  initialData: UsecaseOb;

  @Input() inputData: UsecaseOb;
  @Input() tabActive: string = 'call';
  @Output() closed = new EventEmitter();
  constructor(
    private fb: UntypedFormBuilder,
    public workflowService: workflowService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.inputData = JSON.parse(JSON.stringify(this.inputData));
    this.inputData.callExperience.responses = this.inputData.callExperience.responses || [];
    this.inputData.chatExperience.responses = this.inputData.chatExperience.responses || [];
    this.inputData.callExperience.responses.map(res => {
      res.answer = decodeURIComponent(res.answer);
      res.viewType = 'preview';
      res.truncate = true;
      return res;
    });
    this.inputData.chatExperience.responses.map(res => {
      res.answer = decodeURIComponent(res.answer);
      res.viewType = 'preview';
      res.truncate = true;
      return res;
    });

    setTimeout(() => {
      if (this.tabActive === 'chat') {
        $("[href='#chat']").click();
      }
    });
    this.initialData = JSON.parse(JSON.stringify(this.inputData));
    this.tempData = JSON.parse(JSON.stringify(this.inputData));
    this.isEditable = this.workflowService.appState === 'configured';
  }

  addAnotherResponse(type?: string) {
    if (type === 'phone') {
      this.inputData.callExperience.responses.push({ answer: "", viewType: 'edit' });
    } else {
      this.inputData.chatExperience.responses.push({ answer: "", viewType: 'edit' });
    }
  }

  removeAnotherResponse(index, type?: string) {
    if (type === 'phone') {
      this.inputData.callExperience.responses.splice(index, 1);
    } else {
      this.inputData.chatExperience.responses.splice(index, 1);
    }
  }

  closeAnotherResponse(responseObj, index, type?: string) {
    responseObj.viewType = "preview";
    responseObj.truncate = true;
    if (type === 'phone') {
      if (this.tempData.callExperience.responses[index]) {
        this.inputData.callExperience.responses[index] = this.tempData.callExperience.responses[index];
      } else {
        this.inputData.callExperience.responses.splice(index, 1);
      }

    } else {
      if (this.tempData.chatExperience.responses[index]) {
        this.inputData.chatExperience.responses[index] = this.tempData.chatExperience.responses[index];
      } else {
        this.inputData.chatExperience.responses.splice(index, 1);
      }
    }
  }


  onClickDone(responseObj, index, type?: string) {
    responseObj.viewType = 'preview';
    responseObj.truncate = true;
    this.tempData = JSON.parse(JSON.stringify(this.inputData));
  }

  hideAddBtn(type?: string) {
    if (type === 'phone') {
      return this.inputData.callExperience.responses.some(f => f.viewType === 'edit');
    } else {
      return this.inputData.chatExperience.responses.some(f => f.viewType === 'edit');
    }
  }

  showCopyBtn(responseObj, i, type?: string) {
    const isEmpty = responseObj.answer === '' || responseObj.answer === 'Response not yet provided';

    if (!isEmpty) return false;

    let otherText;
    if (type === 'phone') {
      otherText = this.inputData.chatExperience.responses[i]
    } else {
      otherText = this.inputData.callExperience.responses[i]
    }

    return otherText && otherText.answer.trim() && otherText.answer !== 'Response not yet provided';
  }

  copyFormCall(responseObj, i, $event) {
    $event.stopPropagation();
    const obj = this.inputData.callExperience.responses[i];
    if (obj) {
      responseObj.answer = obj.answer;
    }
  }
  copyFormChat(responseObj, i, $event) {
    $event.stopPropagation();
    const obj = this.inputData.chatExperience.responses[i];
    if (obj) {
      responseObj.answer = obj.answer;
    }
  }

  chatOnEnterKey(responseObj, i) {
    setTimeout(() => this.onClickDone(responseObj, i));
  }

  isDirty() {
    let dirty = false;

    if (this.inputData.callExperience.responses.length !== this.initialData.callExperience.responses.length) {
      this.inputData.callExperience.isConfigured = true;
      dirty = true;
    } else {
      const flag = this.inputData.callExperience.responses.some((r, i) => {
        if (r.msgTempId) {
          return this.initialData.callExperience.responses.find(f => f.msgTempId === r.msgTempId).answer !== r.answer;
        } else {
          return this.initialData.callExperience.responses[i]?.answer !== r.answer;
        }
      });

      if (flag) { this.inputData.callExperience.isConfigured = true; dirty = true; }
    }

    if (this.inputData.chatExperience.responses.length !== this.initialData.chatExperience.responses.length) {
      this.inputData.chatExperience.isConfigured = true;
      dirty = true;
    } else {
      const flag = this.inputData.chatExperience.responses.some((r, i) => {
        if (r.msgTempId) {
          return this.initialData.chatExperience.responses.find(f => f.msgTempId === r.msgTempId).answer !== r.answer;
        } else {
          return this.initialData.chatExperience.responses[i]?.answer !== r.answer;
        }
      })
      if (flag) { this.inputData.chatExperience.isConfigured = true; dirty = true; }
    }

    return dirty;
  }

  save() {
    this.isDirty();
    this.close(true);
  }

  close(saveOnClose?: boolean) {
    if (this.saveInProgress) return;
    this.saveInProgress = true;

    const _obj = {
      data: this.inputData,
      type: 'faq',
      cb: (flag) => {
        this.saveInProgress = flag;
      },
      saveOnClose: saveOnClose
    }
    this.closed.emit(_obj);
  }

  handleMoreText(responseObj) {
    responseObj.truncate = !responseObj.truncate
  }



  showConfirmation() {
    if (!this.isDirty()) { this.close(); return; }
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '446px',
      height: '210px',
      panelClass: "delete-uc",
      data: {
        title: this.translate.instant('COMMON.DISCARD_CHANGES'),
        text: this.translate.instant('COMMON.UNSAVED_CHANGES'),
        buttons: [{ key: 'yes', label: this.translate.instant('BUTTONS.DISCARD'), type: 'danger' }, { key: 'no', label: this.translate.instant('BUTTONS.GO_BACK') }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          dialogRef.close();
          this.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }
}
