import { Component, Input, OnInit } from '@angular/core';
import { ProjConstants } from '../proj.const';

@Component({
  selector: 'app-ask-customer',
  templateUrl: './ask-customer.component.html',
  styleUrls: ['./ask-customer.component.scss']
})
export class AskCustomerComponent implements OnInit{

    @Input() automation : any;
    @Input() isWelcomeMsg;

    projConstants : any = ProjConstants;

    constructor(){

    }

    ngOnInit(): void {
      console.log(this.automation, "automation");
      
    }
}
