import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usecase, UsecaseOb } from '../uc-main/uc-table-main/uc-table-main.model';
import { workflowService } from '@kore.services/workflow.service';

import * as _ from 'underscore';

declare const $: any;
@Component({
  selector: 'app-user-utterances',
  templateUrl: './user-utterances.component.html',
  styleUrls: ['./user-utterances.component.scss']
})
export class UserUtterancesComponent implements OnInit {

  usecase: string;
  utterancesForm: FormGroup;
  altUtterances: FormArray;
  utterances: { usecase: string, primaryUtterance: any, altUtterances: string[] };

  saveInProgress: boolean = false;

  stats = {
    failed: 0,
    success: 0,
    total: 0
  }

  @Input() inputData: UsecaseOb;
  @Input() usecaseType: 'faq' | 'dialog' = "faq";
  @Output() closed = new EventEmitter();
  constructor(private fb: FormBuilder, public workflowService: workflowService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.inputData = JSON.parse(JSON.stringify(this.inputData));
    this.utterances = {
      usecase: this.inputData.usecaseName,
      primaryUtterance: (this.inputData.utterances?.primary?.text) || 'No Utteranace',
      altUtterances: this.inputData.utterances.alternates
    };

    this.usecase = this.inputData.usecaseName;
    this.usecaseType = this.inputData.usecaseType;

    if (this.usecaseType === 'faq') {
      this.utterancesForm = this.fb.group({
        primaryUtterance: [this.utterances.primaryUtterance, Validators.required],
        altUtterances: this.fb.array([])
      });
    } else {
      this.utterancesForm = this.fb.group({
        altUtterances: this.fb.array([])
      });
    }

    this.altUtterances = ((this.utterancesForm.get('altUtterances')) as FormArray);
    (this.utterances.altUtterances || []).forEach(utterance => this.addAltUtterance(utterance));
    if (this.altUtterances.length === 0) { this.addAltUtterance('') }
  }

  addAltUtterance(utterance: any, isNew?: boolean, $event?) {
    if ($event && ($event.keyCode || $event.which) !== 13) return;
    if (isNew) {
      this.altUtterances.insert(0, this.fb.group({
        id: utterance.id,
        text: [utterance.text, Validators.required]
      }));
      setTimeout(() => $('.alt-utterances input')[0].focus());
    } else {

      const formGroup : any = this.fb.group({
        id: utterance.id,
        text: [utterance.text, Validators.required]
      });

      if (utterance.status === 'failed') {
        formGroup.addControl('reason', new FormControl(utterance.reason));
      }
      this.altUtterances.push(formGroup);
    }

  }

  removeAltUtterance(index) {
    this.altUtterances.removeAt(index);
  }

  isNoSearchResultFound(value) {
    return this.altUtterances.controls.filter(altUtterance => (altUtterance.get('text').value || '').toLowerCase().includes(value)).length === 0;
  }

  onSave() {
    if (this.usecaseType === 'faq') {
      this.inputData.utterances.primary.text = this.utterancesForm.value.primaryUtterance;
    }

    const utterances: any[] = this.utterancesForm.value.altUtterances.map(e => {
      if (e.id) {
        const text = this.inputData.utterances.alternates.find(f => f.id === e.id).text;
        if (text !== e.text) { e['oldText'] = text; }
        return e;
      } else {
        return { text: e.text }
      }
    });

    // Deleted utterances
    if (this.inputData.usecaseType === 'dialog') {
      this.inputData.utterances.alternates.forEach(e => {
        if (!utterances.find(f => f.id === e.id)) {
          utterances.push({ id: e.id, text: '', 'oldText': e.text });
        }
      })
    }

    this.inputData.utterances.alternates = utterances;

    this.close(true);
  }

  close(saveOnClose?: boolean) {
    if (this.saveInProgress) return;
    this.saveInProgress = true;

    const _obj = {
      data: this.inputData,
      type: 'utterances',
      cb: (data: UsecaseOb) => {
        this.saveInProgress = false;
        this.inputData = data;

        if (typeof data === 'object') {
          this.stats.total = data.utterances.alternates.length;
          this.stats.failed = data.utterances.alternates.filter(e => e.status === 'failed').length;
          this.stats.success = this.stats.total - this.stats.failed;
          this.init();
        }
      },
      saveOnClose: saveOnClose
    }
    this.closed.emit(_obj);
  }

}
