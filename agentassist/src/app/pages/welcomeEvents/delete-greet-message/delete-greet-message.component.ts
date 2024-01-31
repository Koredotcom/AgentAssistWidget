import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-greet-message',
  templateUrl: './delete-greet-message.component.html',
  styleUrls: ['./delete-greet-message.component.scss']
})
export class DeleteGreetMessageComponent implements OnInit {

  @Input() data : any;

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeDeleteMessage(){
    this.activeModal.close();
  }

  deletGroupMessage(){    
    this.activeModal.close(true);
  }


}
