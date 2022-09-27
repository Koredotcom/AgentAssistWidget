import { Component, OnInit } from '@angular/core';
import { ImageFilePath, ImageFileNames, ProjConstants } from 'src/common/constants/proj.cnts';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  searchText : string = '';
  showSearchSuggestions : boolean = false;
  projConstants : any = ProjConstants;
  imageFilePath : string = ImageFilePath;
  imageFileNames : any = ImageFileNames;

  constructor(public handleSubjectService: HandleSubjectService) { }

  ngOnInit(): void {
  }

  getSearchResults(){
    console.log(this.searchText, "searched text");
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({searchFrom:this.projConstants.ASSIST, value : this.searchText});
  }

  emptySearchTextCheck(){
    console.log("empty", this.showSearchSuggestions);
    
    if(this.searchText == ''){
      this.showSearchSuggestions = false;
    }
  }

}
