import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  inviteForm: FormGroup;
  showBulk = false;

  @Output() close = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inviteForm = new FormGroup({
      email: new FormArray([])
    });
    let emailDetails = new FormControl(null, Validators.required);
    (<FormArray>this.inviteForm.get('email')).push(emailDetails);
    (<FormArray>this.inviteForm.get('email')).push(emailDetails);
  }

  get emails() {
    return (<FormArray>this.inviteForm.get('email')).controls;
  }

  toggleBulkInvite(event) {
    this.showBulk = event.target.checked;
  }

  closeSlider() {
    this.close.emit();
  }

}
