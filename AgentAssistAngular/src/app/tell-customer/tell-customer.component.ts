import { Component, Input } from '@angular/core';
import { ProjConstants } from '../proj.const';

@Component({
  selector: 'app-tell-customer',
  templateUrl: './tell-customer.component.html',
  styleUrls: ['./tell-customer.component.scss']
})
export class TellCustomerComponent {
  @Input() automation : any;
  
  projConstants : any = ProjConstants;

}
