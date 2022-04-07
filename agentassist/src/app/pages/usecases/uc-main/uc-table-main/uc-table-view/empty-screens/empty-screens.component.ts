import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-screens',
  templateUrl: './empty-screens.component.html',
  styleUrls: ['./empty-screens.component.scss']
})
export class EmptyScreensComponent implements OnInit {

  @Input() isSearch: boolean;
  @Input() isExperienceFlow: boolean;
  
  constructor() { }

  ngOnInit(): void {
  }

}
