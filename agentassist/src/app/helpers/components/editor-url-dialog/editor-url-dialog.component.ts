import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-editor-url-dialog',
  templateUrl: './editor-url-dialog.component.html',
  styleUrls: ['./editor-url-dialog.component.scss']
})
export class EditorUrlDialogComponent implements OnInit {

  urlForm: any;
  constructor(
    public dialogRef: MatDialogRef<EditorUrlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.urlForm = {
      url: "",
      altText: ""
    }
  }

  onSubmit(value){
    this.dialogRef.close(value);
  }

}
