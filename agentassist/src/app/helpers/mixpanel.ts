
import mixpanel from 'mixpanel-browser';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '@kore.services/auth.service';
import { UsecaseOb } from '../pages/usecases/uc-main/uc-table-main/uc-table-main.model';
import { SettingsService } from '../pages/settings/setttings.service';

@Injectable({
    providedIn: 'root'
})
export class MixPanelWrapper {

    inSetUpFirstValue: boolean = true;
    outSetUpFirstValue: boolean = true;
    constructor(private injector: Injector, private settingsService: SettingsService) {
    }

    init(authService) {
        mixpanel.init("047a11cecb5356a4a4d5b3807d280766", { ignore_dnt: true });
        mixpanel.identify(authService.getAuthInfo()?.currentAccount?.userInfo.userId);
        mixpanel.register({
            $email: authService.getAuthInfo()?.currentAccount?.userInfo.emailId
        });
        mixpanel.track('Visited');
        this.onLoad();
    }

    optOutTracking() {
        mixpanel.opt_out_tracking();
    }

    onLoad() {
        // this.settingsService.incomingSetupConfigured$.subscribe(isConfigured => {
        //     if (!this.inSetUpFirstValue) {
        //         isConfigured ? mixpanel.track('Incoming Setup Configured') : mixpanel.track('Incoming Setup Removed')
        //     } else {
        //         this.inSetUpFirstValue = false;
        //     }
        // })
        this.settingsService.outgoingSetupConfigured$.subscribe(isConfigured => {
            if (!this.outSetUpFirstValue) {
                isConfigured ? mixpanel.track('Agent Setup Configured') : mixpanel.track('Agent Setup Removed');
            } else {
                this.outSetUpFirstValue = false;
            }
        })
    }

    usecaseCreated(usecaseName) {
        mixpanel.track('Usecase Created', { 'Usecase Name': usecaseName });
    }

    usecaseUpdated(usecase: UsecaseOb) {
        mixpanel.track('Usecase Updated', { 'Usecase Name': usecase.usecaseName })
    }

    usecaseDeleted(usecase: UsecaseOb) {
        mixpanel.track('Usecase Deleted', { 'Usecase Name': usecase.usecaseName })
    }

    configuredInSetup() {
        mixpanel.track('Incoming Setup Configured');
    }

    configuredOutSetUp() {
        mixpanel.track('Agent Setup Configured');
    }

    removedInSetUp() {
        mixpanel.track('Incoming Setup Removed');
    }

    removedOutSetUp() {
        mixpanel.track('Agent Setup Removed');
    }

    postEvent(eventName: string, eventProps?: any) {
        if (eventProps) {
            mixpanel.track(eventName, eventProps);
        } else {
            mixpanel.track(eventName)
        }
    }
}



