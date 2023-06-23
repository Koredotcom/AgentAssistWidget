import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-openai-config',
  templateUrl: './openai-config.component.html',
  styleUrls: ['./openai-config.component.scss']
})
export class OpenaiConfigComponent implements OnInit {
  @Output() closeEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
