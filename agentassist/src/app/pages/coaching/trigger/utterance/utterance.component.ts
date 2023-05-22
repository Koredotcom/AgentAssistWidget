import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-utterance',
  templateUrl: './utterance.component.html',
  styleUrls: ['./utterance.component.scss']
})
export class UtteranceComponent implements OnInit {

  constructor() { }
  @Input() form:any;
  selectedCond = 'And';
  users = ['Agent', 'Customer'];
  occurances = [1,2,3,4,5];
  selOcc = 1;
  timer = 30;
  selUser: '';

  ngOnInit(): void {
    console.log("form", this.form);
    this.form.controls.frequency.controls.every.setValue(this.timer+'s');
  }

  clickOnUser(user){
    this.selUser = user;
    this.form.controls.by.setValue(user);
  }

  clickOcc(occ){
    this.selOcc = occ;
    this.form.controls.frequency.controls.nOccurences.setValue(occ);
  }
}
