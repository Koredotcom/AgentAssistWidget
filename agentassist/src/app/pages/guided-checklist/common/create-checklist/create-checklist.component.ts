import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.scss']
})
export class StageCreateComponent implements OnInit {

  constructor() { }
  isBasic = true;
  ngOnInit(): void {
  }
  remove(e){

  }

  selectedOption(a, b){
    
  }
}
