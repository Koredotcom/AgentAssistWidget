import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from '@kore.services/notification.service';
import { Observable } from 'rxjs';
import { workflowService } from '@kore.services/workflow.service';
import { finalize, map, startWith } from 'rxjs/operators';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';

import * as _ from 'underscore';
import { SkillRsp, SkillsLite } from '../../../data/skills.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-skills-dd',
  templateUrl: './skills-dd.component.html',
  styleUrls: ['./skills-dd.component.scss']
})
export class SkillsDdComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new UntypedFormControl();
  filteredSkills: Observable<string[]>;
  addedSkills: { color: string, name: string }[] = [];
  addedSkillsId: string[] = [];
  allSkills: any[] = [];
  isAdded = false;

  @Input('skillsList') skillsList: SkillsLite[];
  @Input('addedSk') added: string[];
  @Input('type') type: string;
  @Output() change = new EventEmitter();

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private service: ServiceInvokerService,
    private translate: TranslateService,
    public workflowService: workflowService,
    private notificationService: NotificationService) {
    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) => skill ? this._filter(skill) : this.allSkills.slice()));
  }

  ngOnInit(): void {
    this.allSkills = this.skillsList;
    this.addedSkillsId = this.added? this.added : [];
    this.addSkills();
  }

  addSkills() {
    if (!this.addedSkillsId || !this.addedSkillsId.length) {
      return;
    }
    _.each(this.addedSkillsId, (val) => {
      let skillDetails = _.findWhere(this.allSkills, { id: val });
      if(skillDetails) {
        this.addedSkills.push({
          name: skillDetails.name,
          color: skillDetails.color
        });
      }
    });
  }

  add(event: MatChipInputEvent): void {
    if (this.isAdded) {
      this.isAdded = false;
      return;
    }
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
    this.notificationService.notify(this.translate.instant('NOTIFY.PLS_SELECT_FROM_THE_SKILL_LIST'), 'warning');
  }

  remove(sk: string): void {
    const index = _.findIndex(this.addedSkills, { name: sk });
    //this.addedSkills.indexOf(sk);

    if (index >= 0) {
      this.addedSkills.splice(index, 1);
      this.addedSkillsId.splice(index, 1);
      this.skillCtrl.updateValueAndValidity();
      this.change.emit(this.addedSkillsId);
    }
  }

  onOptSelect(event: MatAutocompleteSelectedEvent) {
    const ind = _.findIndex(this.skillsList, { id: event.option.value });
    this.selected(this.skillsList[ind]);
    this.isAdded = true;
    setTimeout(() => {
      this.skillInput.nativeElement.blur();
    });
  }

  selected(sk: SkillsLite) {
    if (sk.type == 'skillGp') {
      const params = {
        skillGpId: sk.id,
        skillName: "",
        limit: -1,
        skip: 0,
        minPoints: 0
      }
      this.service.invoke('get.skills', params)
        .pipe(
          finalize(() => {
            this.skillInput.nativeElement.value = '';
            this.skillCtrl.setValue(null);
          })
        )
        .subscribe(
          (res: SkillRsp) => {
            let showWarn = false;
            res.results.forEach(val => {
              if (_.findIndex(this.addedSkills, { name: val.name }) > -1) {
                showWarn = true;
                return;
              }
              else {
                this.addedSkills.push({
                  name: val.name,
                  color: sk.color
                });
                this.addedSkillsId.push(val.id);
                this.change.emit(this.addedSkillsId);
              }
            });
            if (showWarn) { this.notificationService.notify(this.translate.instant('NOTIFY.SKILL_ALREADY_ADDED'), 'warning'); }
          }, err => { this.workflowService.showError(err, ''); }
        )
      return;
    } else {
      if (_.findIndex(this.addedSkills, { name: sk.name }) > -1) {
        this.notificationService.notify(this.translate.instant('NOTIFY.SKILL_ALREADY_ADDED'), 'warning');
        this.skillInput.nativeElement.value = '';
        this.skillCtrl.setValue(null);
        return;
      }
      this.addedSkills.push({
        name: sk.name,
        color: sk.color
      });
      this.addedSkillsId.push(sk.id);
      this.skillInput.nativeElement.value = '';
      this.skillCtrl.setValue(null);
      this.change.emit(this.addedSkillsId);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter(sk => sk.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
