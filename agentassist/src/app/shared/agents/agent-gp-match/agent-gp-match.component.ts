import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import * as _ from 'underscore';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-agent-gp-match',
  templateUrl: './agent-gp-match.component.html',
  styleUrls: ['./agent-gp-match.component.scss']
})
export class AgentGpMatchComponent implements OnInit {

  @Input('sag') selectedAgentGroups: any;
  @Input('ag') agentGroups: any;

  filteredAgentGroups: any = [];
  itemCtrl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA]; 

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.filteredAgentGroups = [];
    var self = this;
    if(this.selectedAgentGroups?.length){
      this.filteredAgentGroups = this.agentGroups.filter(function(itm){
        return self.selectedAgentGroups.indexOf(itm)==-1;
      });
    }else{
      this.filteredAgentGroups = this.agentGroups;
    }
  }

  add(event: MatChipInputEvent): void {
    var self = this;
    const input = event.input;
    const value = event.value;

    if((value || '').trim()) {
      let arr: any = [];
      _.each(this.agentGroups, item=>{
        if((item.name.toLowerCase()).includes(value.toLowerCase())){
          arr.push(item)
        }
      })
      if(arr && arr.length == 1){
        let id = this.selectedAgentGroups.find(gp => gp.id == arr[0].id);
        if(!id){
          this.selectedAgentGroups.push(arr[0]);
          this.filteredAgentGroups = this.agentGroups.filter(function(itm){
            return self.selectedAgentGroups.indexOf(itm)==-1;
          });
        } 
      }
    }
   
    if (input) {
      input.value = '';
    }
  }
  
  selected(event: MatAutocompleteSelectedEvent, elem: HTMLElement): void {
    var self = this;
    let item = this.selectedAgentGroups.find(gp => gp.id == event.option.value.id);
    if(!item) {
      this.selectedAgentGroups.push(event.option.value);
      this.filteredAgentGroups = this.agentGroups.filter(function(itm){
        return self.selectedAgentGroups.indexOf(itm)==-1;
      });
      setTimeout(() => {
        elem.blur();
      });
    }
  }

  remove(agentGp): void {
    var self = this;
    const index = this.selectedAgentGroups.indexOf(agentGp);
    if (index >= 0) {
      this.selectedAgentGroups.splice(index, 1);
      this.filteredAgentGroups = this.agentGroups.filter(function(itm){
        return self.selectedAgentGroups.indexOf(itm)==-1;
      });
    }
  }

}
