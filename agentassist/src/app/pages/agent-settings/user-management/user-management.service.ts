import { Injectable } from "@angular/core";
import { ServiceInvokerService } from "@kore.services/service-invoker.service";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Permission, Role, RoleAddEdit, RolesRsp, User } from "./user-management.model";

import * as _ from 'underscore';
@Injectable({ providedIn: 'root' })

export class UserManagementService {

    private _users: User[] = [];
    private _roles: Role[] = []; //ROLES_LIST;
    private _permissions: Permission[] = []; //PERMISSIONS_LIST;
    userChange$ = new Subject<User[]>();
    roleChange$ = new Subject<Role[]>();
    editRoleSlider$ = new Subject<Role>();

    constructor(private service: ServiceInvokerService) {
    }

    // ** USERS SERVICES START **
    getUsers(): Observable<User[]> {
        if (this._users.length) {
            return new Observable(observer => {
                observer.next([...this._users]);
            });
        } else {
            const params = {
                limit: 100
            };
            return this.service.invoke('get.um.users', params).pipe(map(userResponse => {
                return userResponse.results;
            }));
        }
    }

    // ** USER SERVICES END **

    // ** ROLES SERVICES START **

    getRoles(): Observable<Role[]> {
        if (this._roles.length) {
            return new Observable(observer => {
                observer.next([...this._roles])
            })
        } else {
            return this.service.invoke('get.rm.roles').pipe(
                map((rolesResponse: RolesRsp) => rolesResponse.results),
                tap((roles: Role[]) => this._roles = roles)
            )
        }
    }

    editRoles(role: RoleAddEdit, _id: string): Observable<void> {
        const params = {
            id: _id
        }
        return this.service.invoke('put.rm.roles', params, role).pipe(
            tap((role) => {
                this._roles.splice(_.findLastIndex(this._roles, { id: role.id }), 1, role);
                this.onRoleChange()
            })
        )
    }

    addRoles(role: RoleAddEdit): Observable<Role> {
        return this.service.invoke('post.rm.roles', null, role).pipe(
            tap((role: Role) => {
                this._roles.push(role);
                this.onRoleChange();
            })
        )
    }

    deleteRoles(_id: string): Observable<any> {
        return this.service.invoke('delete.rm.roles', { id: _id }).pipe(
            tap((role: Role) => {
                this._roles = this._roles.filter(role => role.id != _id);
                this.onRoleChange();
            })
        )
    }

    // ** ROLES SERVICES END **

    getPermissions(): Observable<Permission[]> {
        if (this._permissions.length) {
            return new Observable(observer => {
                observer.next([...this._permissions]);
            })
        } else {
            return this.service.invoke('get.permissions').pipe(
                tap(permissions => this._permissions = permissions)
            );
            // .pipe(
            //     map((permissionsList: Permission []) => permissionsList.results)
            // )
        }
    }

    onRoleChange() {
        this.roleChange$.next([...this._roles]);
    }

    onUserChange() {
        this.userChange$.next([...this._users]);
    }
}