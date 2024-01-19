import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, Inject } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import * as _ from 'underscore';

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.scss']
})
export class InviteDialogComponent implements OnInit {
  emailList: {email: string, invalid: boolean}[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isValidList = true;
  selectedRole = 'Bot Developer';
  rolesList = ['Master Admin', 'Bot Owner', 'Bot Developer', 'Bot Tester', 'Process Tester', 'Agent']

  constructor(public dialogRef: MatDialogRef<InviteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (this.validateEmail(value)) {
        this.emailList.push({email:value, invalid:false});
      } else{
        this.emailList.push({email:value, invalid:true}); 
      }
    }
    if (input) {
      input.value = '';
    }
    this.checkValidation();
  }
  
  remove(listElement: {email: string, invalid: boolean}) {
    const index = _.findIndex(this.emailList, {email: listElement.email});
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
    this.checkValidation();
  }
  
  checkValidation() {
    this.isValidList = _.where(this.emailList, {invalid: true}).length == 0;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }

  selectRole(roleType) {
    this.selectedRole = roleType;
  }


  onSubmit(){
    let data: any = {};
    data['emailList'] = this.emailList;
    data['role'] = this.selectRole;
    this.dialogRef.close(data);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
