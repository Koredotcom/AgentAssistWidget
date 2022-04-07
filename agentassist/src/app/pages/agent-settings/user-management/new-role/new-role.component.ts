import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Permission, Role } from '../user-management.model';
import { UserManagementService } from '../user-management.service';
import { workflowService } from '@kore.services/workflow.service';
import { NotificationService } from '@kore.services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit, OnChanges {

  permissions: Permission[] = [];
  addedPermissions: any = {};
    
  @Output() close = new EventEmitter();
  @Input() mode: 'new' | 'edit';
  @Input() role: Role;

  @ViewChild('roleName', { static: true }) roleName: ElementRef;
  @ViewChild('roleField', { static: true }) roleField: ElementRef;

  constructor(private userManagementService: UserManagementService,
    private translate: TranslateService,
    public workflowService: workflowService,
    private notificationService: NotificationService) { }

  ngOnChanges(changes: SimpleChanges) {
    if(this.mode == 'edit') {
      this.addedPermissions = {...changes.role.currentValue.permissions};
    } else if(this.mode == 'new'){
      this.addedPermissions = {};
      this.role = null;
    }
  }

  ngOnInit(): void {
    this.userManagementService.getPermissions().subscribe(
      (permits: Permission[]) => {
        this.permissions = permits;
      },
      err => {
        this.workflowService.showError(err, '');
      }
    );
    setTimeout(() => {
      this.roleField.nativeElement.focus();
    }, 500);
  }

  checkActiveType(permit, access) {
    return this.addedPermissions[permit.id]?.[0] == access;
  }

  onSubmit(form: NgForm) {
    const payload = {
      ...form.value,
      "permissions": this.addedPermissions
    }
    if(this.mode == 'new') {
      this.userManagementService.addRoles(payload).subscribe(
        () => {
          this.notificationService.notify(this.translate.instant("NOTIFY.NEW_ROLE_ADDED_SUCCESS"), 'success');
          this.closeSlider();
        },
        err => this.workflowService.showError(err, this.translate.instant('NOTIFY.FAILED_TOADD_NEWROLE'))
      );
    } else if(this.mode == 'edit') {
      this.userManagementService.editRoles(payload, this.role.id).subscribe(
        () => {
          this.notificationService.notify(this.translate.instant("NOTIFY.SUCCESSFULLY_EDITED_NEW_ROLE"), 'success');
          this.closeSlider();
        },
        err => this.workflowService.showError(err, this.translate.instant('NOTIFY.FAILED_TO_EDIT_ROLE'))
      )
    }
  }

  permissionsAdded(permit: Permission, access: string) {
    this.addedPermissions[permit.id] = [access];
  }

  closeSlider() {
    this.close.emit();
  }

}
