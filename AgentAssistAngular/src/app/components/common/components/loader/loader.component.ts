import { Component, Input } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() type : string;

  projConstants: any = ProjConstants;
}
