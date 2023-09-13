import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  @Input() data : any;
  @Output() emitDeleteService = new EventEmitter();

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeDeleteRule(){
    this.activeModal.close();
  }

  deletGroupRule(){    
    this.emitDeleteService.next(true);
    this.activeModal.close(this.data._id);
  }

}
