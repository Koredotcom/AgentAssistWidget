import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonService } from 'src/common/services/common.service';

@Component({
  selector: 'app-render-history',
  templateUrl: './render-history.component.html',
  styleUrls: ['./render-history.component.scss']
})
export class RenderHistoryComponent implements OnInit, OnChanges{

  constructor(
    private commonService: CommonService
  ){

  }
  @Input() response = [];
  @Input() imageFilePath;
  @Input() imageFileNames;
  resp = [];
  
  ngOnInit(): void {
/*     let historyFaqIDs = [];
    let previousId;
    let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
    this.resp = this.response.length > 0 ? this.response : undefined;
    this.resp = this.commonService.formatHistoryResponseForFAQ(this.resp); */
  }

  ngOnChanges(){
    let historyFaqIDs = [];
    let previousId;
    let previousTaskPositionId, currentTaskPositionId, currentTaskName, previousTaskName;
    this.resp = this.response.length > 0 ? this.response : undefined;
    this.resp = this.commonService.formatHistoryResponseForFAQ(this.resp);
  }

  
}
