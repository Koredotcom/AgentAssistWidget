import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileUpload, Widget, WidgetVariables } from './agent-settings.model';
import { Role } from './user-management/user-management.model';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { AuthService } from '@kore.services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AgentSettingsService {
  hoursOperation: any[] = [];
  status: any[] = [];
  languages: any[] = [];

  // editRoleSlider$ = new Subject<Role>();
  widgetsChanged$ = new Subject<Widget[]>();

  private _widgetVariables: WidgetVariables[] = [];
  private _widgets: Widget[] = [];

  constructor(private service: ServiceInvokerService,
    private authService: AuthService) { }

  getHoursOfOperaions() {
    return this.hoursOperation;
  }

  setHoursOfOperaions(hoursOperation: any[]) {
    this.hoursOperation = hoursOperation;
  }

  appendHoursOfOperation(data) {
    const index = this.hoursOperation.findIndex(f => f.id === data.id);
    if (index === -1) {
      this.hoursOperation.push(data);
    } else {
      this.hoursOperation.splice(index, 1, data);
    }
  }

  deleteHoursOfOperation(id: string) {
    this.hoursOperation = this.hoursOperation.filter(val => val.id !== id);
  }

  setAgentStatus(status: any[]) {
    this.status = status;
  }

  getAgentStatus() {
    return this.status;
  }

  setAgentLanguages(languages: any[]) {
    this.languages = languages;
  }

  getAgentLanguages() {
    return this.languages;
  }

  getWidgetsVariables(): Observable<WidgetVariables[]> {
    if (this._widgetVariables.length) {
      return new Observable(observer => observer.next([...this._widgetVariables]));
    } else {
      return this.service.invoke('get.widgetsVariables')
    }
  }

  getWidgets(): Observable<Widget[]> {
    if (this._widgets.length) {
      return new Observable(observer => observer.next([...this._widgets]));
    } else {
      return this.service.invoke('get.widgets').pipe(
        tap((response: Widget[]) => this._widgets = response)
      );
    }
  }

  createWidget(payload) {
    return this.service.invoke('post.widgets', null, payload).pipe(
      tap((response: Widget) => {
        this._widgets.push(response);
        this.widgetsChanged$.next([...this._widgets]);
      })
    );
  }

  editWidget(id, payload) {
    const params = {
      widgetId: id
    };
    return this.service.invoke('put.widgets', params, payload).pipe(
      tap((response: Widget) => {
        this._widgets = this._widgets.map(widget => {
          return widget.id == response.id?response:widget;
        });
        this.widgetsChanged$.next([...this._widgets]);
      })
    )
  }

  deleteWidget(id) {
    const params = {
      widgetId: id
    };
    return this.service.invoke('delete.widgets', params).pipe(
      tap(() => {
        this._widgets = this._widgets.filter(widget => widget.id !== id)
        this.widgetsChanged$.next([...this._widgets]);
      })
    )
  }

  uploadImage(file: File): Observable<FileUpload> {
    const params = {
      userId: this.authService.getUserId()
    };
    var data = new FormData();
    data.append('file', file);
    data.append('fileContext', 'marketplace');
    data.append('fileExtension', 'png');

    return this.service.invoke('post.uploadfaqfile', params, data);
  }
}
