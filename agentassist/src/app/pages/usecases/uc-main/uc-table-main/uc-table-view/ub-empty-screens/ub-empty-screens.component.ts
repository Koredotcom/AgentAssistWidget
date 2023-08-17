import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ub-empty-screens',
  templateUrl: './ub-empty-screens.component.html',
  styleUrls: ['./ub-empty-screens.component.scss']
})
export class UbEmptyScreensComponent implements OnInit {

  @Input() currentBt;

  constructor() { }

  ngOnInit(): void {
  }

}
