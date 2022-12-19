import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { workflowService } from '@kore.services/workflow.service'
import { SideBarService } from '@kore.services/header.service';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import * as moment from 'moment';
import { debounceTime, distinctUntilChanged, finalize, map, pluck, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { Logs, ResponseLogs } from '../../data/conversational-logs.model';
import { NotificationService } from '@kore.services/notification.service';
import { MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import { MatTabGroup }  from '@angular/material/tabs';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

declare const $: any;
import * as _ from 'underscore';
import { DockStatusService } from '../../services/dockstatusService/dock-status.service';
import { fromEvent } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Moment } from 'moment';
import { TemplatesChatHistoryComponent } from '../templates-chat-history/templates-chat-history.component';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from '@kore.services/localstore.service';
import { AuthService } from '@kore.services/auth.service';
import { B } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-conversational-logs',
  templateUrl: './conversational-logs.component.html',
  styleUrls: ['./conversational-logs.component.scss']
})
export class ConversationalLogsComponent implements OnInit {
  public userSearch: string;
  @ViewChild('slider', { static: true }) slider: SliderComponentComponent;
  isLoadingData =  false;
  showSlider = true;
  filter = {
    startDate: moment().subtract({ days: 7 }),
    endDate: moment(),
    limit: 20,
    sort: { "date": "desc" }
  };
  isMoreAvailable: boolean = false;
  isLoading: boolean = false;
  convs=[
    {id:1,
    name:'b',
    value:1234,
    friute:'apple',
    petname:'dog',
    parent:'no'},
    {id:2,
      name:'c',
      value:1234,
      friute:'bannana',
      petname:'cat',
      parent:'no'},
    {id:3,
      name:'d',
      value:12345,
      friute:'orange',
      petname:'cow',
      parent:'yes'},
      {id:4,
        name:'d',
        value:12345,
        friute:'orange',
        petname:'cow',
        parent:'yes'},
        {id:5,
          name:'d',
          value:12345,
          friute:'orange',
          petname:'cow',
          parent:'yes'},
          {id:6,
            name:'d',
            value:12345,
            friute:'orange',
            petname:'cow',
            parent:'yes'},
            {id:7,
              name:'d',
              value:12345,
              friute:'orange',
              petname:'cow',
              parent:'yes'},
              {id:8,
                name:'d',
                value:12345,
                friute:'orange',
                petname:'cow',
                parent:'yes'},
                {id:9,
                  name:'d',
                  value:12345,
                  friute:'orange',
                  petname:'cow',
                  parent:'yes'},
                  {id:10,
                    name:'d',
                    value:12345,
                    friute:'orange',
                    petname:'cow',
                    parent:'yes'}
  ];
  realconvs=[];
  isSearching = true;
  userSearchUpdate = new Subject<string>();

  constructor(
    private service: ServiceInvokerService,
    private localStoreService: LocalStoreService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.userSearchUpdate.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        console.log('xxxxxxxxxxxxxxxxx', value)
        this.getfilteredConversation(value)
      });
      this.slider.openSlider("#slider", "width500");
  }

  
  getfilteredConversation(e) {
    this.isLoadingData = true;
    this.isSearching = true;
    console.log('xxxxxxxxxxxxxxxxx', e)
    let payload = {
      start: this.filter.startDate,
      end: this.filter.endDate,
      limit: this.filter.limit,
      skip: 0,
      sort: this.filter.sort,
      conversationId: e
    }
    // let headers = {
    //   selectedAccount: this.localStoreService.getSelectedAccount()?.accountId || this.authService.getSelectedAccount()?.accountId
    // }
    if(e.length>0){
      this.realconvs = this.convs.filter((ele)=>ele.id==e);
      this.service.invoke('conversation.logs', {}, payload).subscribe(res=>{
        console.log(res);
      })
    }else{
      this.realconvs = [...this.convs];
    }
    
  }
  onReachEnd(pagination = false){
    if(this.isLoadingData || this.isSearching){
      this.isSearching = false;
      return;
    }
    let payload = {
      start: this.filter.startDate,
      end: this.filter.endDate,
      limit: this.filter.limit,
      skip: 0,
      sort: this.filter.sort,
      conversationId: ''
    }
    let arr = [
      {id:11,
        name:'d',
        value:12345,
        friute:'orange',
        petname:'cow',
        parent:'yes'},
        {id:12,
          name:'d',
          value:12345,
          friute:'orange',
          petname:'cow',
          parent:'yes'},
          {id:13,
            name:'d',
            value:12345,
            friute:'orange',
            petname:'cow',
            parent:'yes'},
            {id:14,
              name:'d',
              value:12345,
              friute:'orange',
              petname:'cow',
              parent:'yes'},
              {id:15,
                name:'d',
                value:12345,
                friute:'orange',
                petname:'cow',
                parent:'yes'}
    ]
    if (pagination) {
      this.realconvs = [...this.convs, ...arr];
    } else {
      this.realconvs = this.convs;
    }
    this.service.invoke('conversation.logs', {}, payload).subscribe(res=>{
      console.log(res);
    })
    
  }

 
}
