import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-meta-tagss',
  templateUrl: './meta-tagss.component.html',
  styleUrls: ['./meta-tagss.component.scss']
})
export class MetaTagssComponent implements OnInit {

  @Output() closeSlid = new EventEmitter();
  @Input() metaTagsData;
  @Input() heading: string;

  constructor() { }

  ngOnInit() {
  }

  closeSlider() {  this.closeSlid.emit(); }
}
