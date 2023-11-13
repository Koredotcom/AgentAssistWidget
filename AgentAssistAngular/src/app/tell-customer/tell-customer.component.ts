import { Component, Input } from '@angular/core';
import { ProjConstants } from '../proj.const';
import { RootService } from '../services/root.service';

@Component({
  selector: 'app-tell-customer',
  templateUrl: './tell-customer.component.html',
  styleUrls: ['./tell-customer.component.scss']
})
export class TellCustomerComponent {
  @Input() automation : any;
  @Input() isWelcomeMsg;
  
  projConstants : any = ProjConstants;

  constructor(private rootService : RootService){
    
  }


  handleSendCopyButton(method,automation){
    let sendData = this.isWelcomeMsg ? automation.value : automation.sendData;
    this.rootService.handleSendCopyButtonForNodes(method,sendData);
  }

}
