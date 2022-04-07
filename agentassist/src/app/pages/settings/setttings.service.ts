import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { NotificationService } from '@kore.services/notification.service';
@Injectable({ providedIn: 'root' })

export class SettingsService {
    countriesList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    incomingSetupConfigured$: Subject<boolean> = new Subject<boolean>();
    outgoingSetupConfigured$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    enableVoicePreview$: Subject<boolean> = new Subject<boolean>();


    readonly availableCountryFlags: string[] = ["dz", "ar", "au", "at", "bb", "be", "ba", "bw", "br", "bg", "ca", "ky", "cl", "co", "cy", "cz", "dk", "ec", "ee", "fi", "fr", "de", "gr", "hk", "hu", "is", "id", "il", "jm", "jp", "lt", "ml", "mx", "nz", "pa", "pe", "ph", "pl", "pt", "pr", "ro", "rs", "sg", "sk", "si", "ch", "th", "tn", "gb", "us", "vn"];
    constructor(private notificationService: NotificationService) { }

    openChannel$ = new Subject<any>();
    closeChannel$ = new Subject<any>();
    updateOutGo$ = new Subject<any>();

    private outAgents: {
        voiceAgent: any,
        chatAgent: any
    };

    set outgoingAgents(details) {
        this.outAgents = details
    }

    get outgoingAgents() {
        return this.outAgents;
    }

    showError(err, msg) {
        try {
            this.notificationService.notify(err.error.errors[0].msg, 'error');
        } catch (e) {
            this.notificationService.notify(msg, 'error');
        }
    }

}