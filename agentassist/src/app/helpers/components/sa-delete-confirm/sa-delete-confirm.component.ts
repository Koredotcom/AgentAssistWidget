import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sa-delete-confirm',
  templateUrl: './sa-delete-confirm.component.html',
  styleUrls: ['./sa-delete-confirm.component.scss']
})
export class SaDeleteConfirmComponent implements OnInit {

  onSelect = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SaDeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
  }

  onClickOption(item) {
    if(item.key == "no"){
      this.dialogRef.close();
    }else{
      this.onSelect.emit(item.key);
    }
  }

}
