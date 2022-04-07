import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
