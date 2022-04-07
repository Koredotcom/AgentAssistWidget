import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { MENU, Role, User } from './user-management.model';
import { UserManagementService } from './user-management.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {

  menuList = MENU;
  selectedMenu: 'user' | 'role' = 'role';
  users: User[] = [];
  roles: Role[] = [];
  roleSub: Subscription;
  userSub: Subscription;
  editRoleSub: Subscription;
  search = {
    text: ''
  };
  roleMode: 'new' | 'edit' = 'new';
  showNewRoleSlider = false;
  showNewUserSlider = false;
  _editRole: Role;

  @ViewChild('slider4', { static: true }) slider4: SliderComponentComponent;
  @ViewChild('slider5', { static: true }) slider5: SliderComponentComponent;
  @Output() openNewRoleSlider = new EventEmitter();
  @Output() openNewUserSlider = new EventEmitter();

  constructor(private userManagementService: UserManagementService,
    public workflowService: workflowService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userManagementService.getRoles().subscribe(roles => {
      this.roles = roles;
    }, error => {
      this.workflowService.showError(error, 'Failed to fetch roles');
    });

    // this.userManagementService.getUsers().subscribe(users => {
    //   this.users = users;
    // }, error => {
    //   this.workflowService.showError(error, 'Failed to fetch users');
    // });

    this.roleSub = this.userManagementService.roleChange$.subscribe(
      roles => {
        this.roles = roles;
      }
    );
    this.userSub = this.userManagementService.userChange$.subscribe(
      users => {
        this.users = users;
      }
    );
    
    this.editRoleSub = this.userManagementService.editRoleSlider$.subscribe(role => {
      this._editRole = role;
      this.openNewRole('edit')
    })
  }

  openNewRole(mode: 'new' | 'edit') {
    // this.openNewRoleSlider.emit();
    this.slider4.openSlider("#slider4", "width940");
    this.roleMode = mode;
    this.showNewRoleSlider = true;
  }

  closeSlider4() {
    this.showNewRoleSlider = false;
    this.slider4.closeSlider("#slider4");
    // this.getLanguages();
  }

  openNewUser() {
    // this.openNewUserSlider.emit();
    this.slider5.openSlider("#slider5", "width940");
    this.showNewUserSlider = true;
  }

  closeSlider5() {
    this.showNewUserSlider = false;
    this.slider5.closeSlider("#slider5");
    // this.getLanguages();
  }

  onDelete(_id: string) {
    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '446px',
      panelClass: "delete-uc",
      data: {
        title: "Delete Role",
        text: "Are you sure you want to delete?",
        buttons: [{ key: 'yes', label: this.translate.instant("USECASES.YES"), type: 'danger' }, { key: 'no', label: this.translate.instant("USECASES.NO") }]
      }
    });

    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          this.userManagementService.deleteRoles(_id).subscribe(
            () => this.notificationService.notify(this.translate.instant("NOTIFY.ROLE_DELETED_SUCCESSFULLY"), 'success'),
            (err) => this.notificationService.showError(err)
          );
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  ngOnDestroy() {
    this.roleSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
