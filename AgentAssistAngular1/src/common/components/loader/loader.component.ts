import { Component, OnInit } from '@angular/core';
import { ImageFileNames, ImageFilePath } from 'src/common/constants/proj.cnts';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  imageFileNames: any = ImageFileNames;
  imageFilePath: string = ImageFilePath
  constructor() { }

  ngOnInit(): void {
  }

}
