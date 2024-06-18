import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-acc-warning-dialog',
  templateUrl: './acc-warning-dialog.component.html',
  styleUrls: ['./acc-warning-dialog.component.scss']
})
export class AccWarningDialogComponent implements OnInit {

  onSelect = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AccWarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onClickOption(item) {
    this.onSelect.emit(item.key);
  }

}
