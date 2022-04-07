import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kr-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input('totalsize') totalsize: number;
  @Input('pageSize') pageSize: number = 10;
  @Input('page') page: number = 1;
  @Input('maxSize') maxSize: number = 3;
  @Output() pageChangedCb = new EventEmitter;


  constructor() { }

  pageChanged(page){
    // console.log("test page", page);
    let skip : number = 1;
    if(page != 0){
      skip = this.pageSize * (page - 1);
    }
    else{
      skip = 0;
    }
    this.pageChangedCb.emit({"page" : page, "skip" : skip});
  }

  ngOnInit() {
  }

}
