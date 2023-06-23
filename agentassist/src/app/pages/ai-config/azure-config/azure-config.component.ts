import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-azure-config',
  templateUrl: './azure-config.component.html',
  styleUrls: ['./azure-config.component.scss']
})
export class AzureConfigComponent implements OnInit {
  @Output() closeEvent = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
