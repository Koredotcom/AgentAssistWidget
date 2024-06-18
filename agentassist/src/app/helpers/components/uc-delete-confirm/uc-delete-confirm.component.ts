import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-uc-delete-confirm',
  templateUrl: './uc-delete-confirm.component.html',
  styleUrls: ['./uc-delete-confirm.component.scss']
})
export class UcDeleteConfirmComponent implements OnInit {
  
  onSelect = new EventEmitter();
  isSelected: boolean;
  showLearnMore: boolean;
  isDelU: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<UcDeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onClose(item) {
    this.isSelected = item.key === 'save';
    if(this.data?.isFrom == 'installTemplates') {
      this.onSelect.emit('no');
      return;
    }
    this.onSelect.emit(item.key);
  }

  onClickOption(item) {
    this.isSelected = item.key === 'save';
    this.onSelect.emit(item.key);
  }

  onClickLearnMore() {
    this.onSelect.emit("learnMore");
  }
}
