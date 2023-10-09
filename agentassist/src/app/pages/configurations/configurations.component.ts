import { Component, OnInit } from '@angular/core';
import { AppService } from '@kore.services/app.service';
import { workflowService } from '@kore.services/workflow.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  isUnifiedPlatform

  constructor(public appService: AppService, private workflowService: workflowService) { }

  ngOnInit(): void {
    this.isUnifiedPlatform = this.workflowService.isUnifiedPlatform();
  }

}
