import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-conversation-history',
  templateUrl: './conversation-history.component.html',
  styleUrls: ['./conversation-history.component.scss']
})
export class ConversationHistoryComponent implements OnInit {
  @Output() closed = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  close() {
    this.closed.emit();
  }

}
