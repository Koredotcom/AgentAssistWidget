import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss']
})
export class AssistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("assist tab ng on it");
    
  }

}
