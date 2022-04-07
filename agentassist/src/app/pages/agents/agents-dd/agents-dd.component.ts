import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { AuthService } from '@kore.services/auth.service';
import { NotificationService } from '@kore.services/notification.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';

declare const $: any;

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'app-agents-dd',
  templateUrl: './agents-dd.component.html',
  styleUrls: ['./agents-dd.component.scss']
})
export class AgentsDdComponent implements OnInit, OnDestroy, OnChanges {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  agentCtrl = new FormControl();
  filteredAgents: Observable<string[]>;

  subs = new SubSink();
  isAdded: boolean;
  loaded: boolean;

  agentsList: any[] = [];
  @Input() selectedAgents: any[] = [];
  @Input() disabled: boolean;

  @Output() change = new EventEmitter();

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private service: ServiceInvokerService
  ) {
    this.getAgents();
    this.filteredAgents = this.agentCtrl.valueChanges.pipe(
      startWith(null),
      map((searchTerm: string | null) => (searchTerm ? this._filter(searchTerm) : this.agentsList.slice())),
    );
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
   }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    if (this.isAdded) {
      this.isAdded = false;
      return;
    }
    if (!event.value || !event.value.trim()) return;
    if (input) input.value = '';
    this.agentCtrl.setValue(null);
    this.notificationService.notify(this.translate.instant('PLS_SELECT_FROM_THE_LIST'), 'warning');
  }

  remove(agent: any): void {
    const index = this.selectedAgents.findIndex(f => f.id === agent.id);

    if (index >= 0) {
      this.selectedAgents.splice(index, 1);
      this.change.emit(this.selectedAgents);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAgents.push(event.option.value);
    this.change.emit(this.selectedAgents);
    this.searchInput.nativeElement.value = '';
    this.agentCtrl.setValue(null);

    this.isAdded = true;
    setTimeout(() => {
      this.searchInput.nativeElement.blur();
    });
    console.log("selectedAgents::", this.selectedAgents)
  }

  getAgents() {
    const _parmas = {
      orgId: this.authService.getOrgId(),
      limit: -1
    }

    const _payload = { fields: ['firstName', 'lastName', 'agentGroups'] }
    this.subs.sink = this.service.invoke('get.skillsAgents', _parmas, _payload)
      .subscribe(res => {

        const agentGroups = [];

        (res.results || []).forEach(a => {
          (a.agentGroups || []).forEach(ag => {
            if (agentGroups.findIndex(f => f.id === ag.groupId) === -1) {
              agentGroups.push({
                type: 'AGENTGROUP',
                id: ag.groupId,
                name: ag.groupName,
                profImage: a.profImage
              });
            }
          })
        });

        const agents = res.results.map(a => {
          return {
            type: 'AGENT',
            id: a.userId,
            name: a.firstName + " " + a.lastName,
            profImage: a.profImage,
            emailId: a.emailId,
            onlineStatus: a.onlineStatus.toLowerCase()
          }
        });

        this.agentsList = [...agents, ...agentGroups];
        // this.agentGroupsList = agentGroups;

        if (this.selectedAgents.length) {
          this.agentsList.map(e => {
            e.selected = this.selectedAgents.find(f => f.id === e.id)?.selected;
          })
        }
        // this.selectedAgents = Utils.clone(this.agentsList);

        this.agentCtrl.setValue(this.agentCtrl.value);
        this.loaded = true;
      }, err => {
        this.notificationService.showError(err, '');
      })
  }

  checkIfAdded(agent) {
    return this.selectedAgents.find(f => f.id === agent.id);
  }


  private _filter(searchTerm: any): any[] {
    let filterValue;
    if (typeof searchTerm === 'object') {
      filterValue = searchTerm.name.toLowerCase();
    } else {
      filterValue = (searchTerm || '').toLowerCase();
    }

    return this.agentsList.filter(f => f.name.toLowerCase().includes(filterValue));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
