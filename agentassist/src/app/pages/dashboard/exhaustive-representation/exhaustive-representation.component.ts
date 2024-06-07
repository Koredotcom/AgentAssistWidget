import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { IDashboardFilter } from '../dashboard-filters/dateFilter.model';
import { COMPONENTVSSUBTITLE, COMPONENTVSTITLE, DASHBORADCOMPONENTTYPE, VIEWTYPE } from '../dashboard.cnst';
import { DashboardService } from '../dashboard.service';
import { assetUrl } from 'src/single-spa/asset-url';
import { workflowService } from '@kore.services/workflow.service';

@Component({
  selector: 'app-exhaustive-representation',
  templateUrl: './exhaustive-representation.component.html',
  styleUrls: ['./exhaustive-representation.component.scss']
})
export class ExhaustiveRepresentationComponent implements OnInit {

  subs = new SubSink();

  @Output() onClose = new EventEmitter();
  @Input() componentType: string = '';
  @Input() customerDropdownSelection : string;
  @Input() filters : IDashboardFilter;

  public DASHBORADCOMPONENTTYPE = DASHBORADCOMPONENTTYPE;
  public VIEWTYPE = VIEWTYPE;


  sliderStatus: boolean;
  componentTitle : string;
  componentSubTitle : string;
  compData : any;
  feedbackIntent : string;
  assetUrlProc = assetUrl;
  isUnifiedPlatform =false;
  unifiedPath = '';

  constructor(public dashboardService: DashboardService, private workflowService: workflowService) { }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService.isUnifiedPlatform();
    if(this.isUnifiedPlatform) {
      this.unifiedPath = window.location.origin + '/koreagentassist-xo-frame';

    }
    this.subscribeEvents();
  }

  subscribeEvents(){
    this.subs.sink = this.dashboardService.getExhaustiveRep().subscribe((response: any) => {      
      if (response && response.status) {
        this.sliderStatus = response.status;
        this.componentType = response.type;
        this.componentTitle = COMPONENTVSTITLE[response.type];
        this.componentSubTitle = COMPONENTVSSUBTITLE[response.type];
        this.compData = response.data;
      }
    });
    this.subs.sink = this.dashboardService.getFeedbackIntentPageSelection().subscribe((data : any) => {
      if(data){
        this.feedbackIntent = data.intentName;
      }
    });
  }

  goBackIntentPage(){
    this.dashboardService.setFeedbackIntentPageSelection({intentName : ''})
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


  close() {
    this.onClose.emit('closed');
  }

}
