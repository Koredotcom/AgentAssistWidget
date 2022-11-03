import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-aspect',
  templateUrl: './customer-aspect.component.html',
  styleUrls: ['./customer-aspect.component.scss']
})
export class CustomerAspectComponent implements OnInit {

  @Input() viewType : string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
