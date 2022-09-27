import { Component, OnInit } from '@angular/core';
import { ImageFilePath, ImageFileNames } from 'src/common/constants/proj.cnts';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';

@Component({
  selector: 'app-overlaysearch',
  templateUrl: './overlaysearch.component.html',
  styleUrls: ['./overlaysearch.component.scss']
})
export class OverlaysearchComponent implements OnInit {

  imageFilePath : string = ImageFilePath;
  imageFileNames : any = ImageFileNames;
  
  constructor(public handleSubjectService : HandleSubjectService) { }

  ngOnInit(): void {
    console.log("over lay search ng on it");
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.handleSubjectService.searchTextSubject.subscribe((searchObj) => {
      console.log(searchObj, "search Obj");
      
    })
  }

}
