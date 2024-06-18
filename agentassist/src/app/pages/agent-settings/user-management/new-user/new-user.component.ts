import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  inviteForm: UntypedFormGroup;
  showBulk = false;

  @Output() close = new EventEmitter();

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.inviteForm = new UntypedFormGroup({
      email: new UntypedFormArray([])
    });
    let emailDetails = new UntypedFormControl(null, Validators.required);
    (<UntypedFormArray>this.inviteForm.get('email')).push(emailDetails);
    (<UntypedFormArray>this.inviteForm.get('email')).push(emailDetails);
  }

  get emails() {
    return (<UntypedFormArray>this.inviteForm.get('email')).controls;
  }

  toggleBulkInvite(event) {
    this.showBulk = event.target.checked;
  }

  closeSlider() {
    this.close.emit();
  }

}
