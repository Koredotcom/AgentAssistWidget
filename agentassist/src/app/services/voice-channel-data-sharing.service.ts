import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppService } from './app.service';
import { NotificationService } from './notification.service';
import { ServiceInvokerService } from './service-invoker.service';

@Injectable({
  providedIn: 'root'
})
export class VoiceChannelDataSharingService {

  instanceAppDetails;

  constructor(private service: ServiceInvokerService,
              private notificationService: NotificationService,
              private appService: AppService) { }

  instantAppData() {
    this.appService.selectedInstanceApp$.subscribe(data => {
     this.instanceAppDetails = data;
    });
    return this.instanceAppDetails;
  }

}
