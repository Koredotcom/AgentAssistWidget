import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "@kore.services/auth.service";
import { Permissions } from "src/app/data/permissions.model";
@Directive({ selector: '[hasPermission]' })
export class HasPermissionDirective implements OnInit {

    requiredPermissions: any[] = []; // 'OR' Condition: Any one of said permissions.
    constructor(
        private templateRef: TemplateRef<any>,
        private authService: AuthService,
        private viewContainer: ViewContainerRef
    ) { }

    @Input()
    set hasPermission(roles: Permissions[]) {
        if (!roles || !roles.length) {
            throw new Error('Roles value is empty or missed');
        }

        this.requiredPermissions = roles;
    }

    ngOnInit() {
        let hasAccess = false;
        let permissions: any[] = this.authService.getSelectedAccount()?.permissions;
        const isDeveloper = this.authService.getSelectedAccount()?.isDeveloper;

        if (this.requiredPermissions.some(role => (role === 'admin'))) {
            hasAccess = isDeveloper || this.authService.getSelectedAccount()?.roles?.some(r => (r === 'admin' || r === 'SmartAssist Agent Admin'))
        } else {
            hasAccess = this.requiredPermissions.find(r => permissions.find(p => p === r));
        }

        if (hasAccess) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}
