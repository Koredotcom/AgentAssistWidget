import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit{

  assistMaxButtonClick : boolean = false;
  checkListMaxButtonClick : boolean = false;

  constructor(){

  }

  ngOnInit(): void {
    
  }

  checkListMaxButtonClickEvent(event){
    this.checkListMaxButtonClick = !this.checkListMaxButtonClick;
    if(this.assistMaxButtonClick && this.checkListMaxButtonClick){
      this.assistMaxButtonClick = false;
      this.checkListMaxButtonClick = false; 
    }
  }

  assistMaxButtonClickEvent(event){
    this.assistMaxButtonClick = !this.assistMaxButtonClick;
    if(this.assistMaxButtonClick && this.checkListMaxButtonClick){
      this.assistMaxButtonClick = false;
      this.checkListMaxButtonClick = false; 
    }
    console.log(this.assistMaxButtonClick, this.checkListMaxButtonClick, 'assist and checklist');
    
  }

}
