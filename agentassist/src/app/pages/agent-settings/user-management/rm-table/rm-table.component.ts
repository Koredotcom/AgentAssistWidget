import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service';
import { AgentSettingsService } from '../../agent-settings.service';
import { Role } from '../user-management.model';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-rm-table',
  templateUrl: './rm-table.component.html',
  styleUrls: ['./rm-table.component.scss']
})
export class RmTableComponent implements OnInit {

  @Input('r') roles: Role[];
  @Input('search') search: string;
  @Output('deleteRole') onDelete = new EventEmitter<string>();

  constructor(private agentSettingsService: AgentSettingsService, private userManagementService: UserManagementService,
              private workflowService: workflowService) { }

  ngOnInit(): void {
    this.roles.forEach(role => {
      role.isChecked = false;
    });
  }

  openRoleSlider(role: Role) {
    this.userManagementService.editRoleSlider$.next(role);
  }

  deleteRole(event: Event, _id: string) {
    event.stopPropagation();
    this.onDelete.emit(_id);
  }


}
