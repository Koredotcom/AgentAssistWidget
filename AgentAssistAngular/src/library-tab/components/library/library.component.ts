import { Component, OnInit } from '@angular/core';
import { ImageFilePath, ImageFileNames } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  imageFilePath : string = ImageFilePath;
  imageFileNames : any = ImageFileNames;

  constructor() { }

  ngOnInit(): void {
  }

}
