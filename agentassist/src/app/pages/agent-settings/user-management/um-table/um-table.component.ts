import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user-management.model';

@Component({
  selector: 'app-um-table',
  templateUrl: './um-table.component.html',
  styleUrls: ['./um-table.component.scss']
})
export class UmTableComponent implements OnInit {

  @Input('u') users: User[];

  constructor() { }

  ngOnInit(): void {
  }

}
