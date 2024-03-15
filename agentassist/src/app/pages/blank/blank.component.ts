import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { workflowService } from '@kore.services/workflow.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent implements OnInit {

  constructor(private workflowService : workflowService, private router : Router) { }

  ngOnInit(): void {
    if(this.workflowService.rolePermissions.isTaskEnabled){
      this.router.navigate(['/config/usecases']);
    }else if(this.workflowService.rolePermissions.isDashboardEnabled){
      this.router.navigate(['/config/conversationalLogs']);
    }
  }

}
