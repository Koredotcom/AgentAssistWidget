import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import * as _ from 'underscore';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map } from 'rxjs/operators';
@Component({
  selector: 'app-conversational-logs',
  templateUrl: './conversational-logs.component.html',
  styleUrls: ['./conversational-logs.component.scss']
})
export class ConversationalLogsComponent implements OnInit {
  @ViewChild('newConvSlider', { static: true }) newConvSlider: SliderComponentComponent;
  @ViewChild('pdfTable') pdfTable: ElementRef;
  showConversation: boolean;
  @ViewChild('searchTerm') searchTerm: ElementRef<HTMLElement>;
  isLoadingData =  false;
  showSlider = false;
  filter = {
    startDate: moment().subtract({ days: 7 }),
    endDate: moment(),
    limit: 20,
    sort: { "date": "desc" }
  };
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
                    parent:'yes'},
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
          
  ];
  realconvs=[];
  isSearching = false;
  erroMsg;
  readonly USECASES_LIMIT = 20;
  ucOffset = 0;
  isInitialLoadDone = false;
  conversationId;
  constructor(
    private service: ServiceInvokerService
  ) { }

  ngOnInit() {
    this.getUsecases();
      
  }
  ngAfterViewInit() {
    setTimeout(() => {
      fromEvent(this.searchTerm.nativeElement, 'input')
        .pipe(
          map((event: any) => event.target.value),
          debounceTime(1000),
          distinctUntilChanged())
        .subscribe((val) => {
          this.getUsecases(val);
        });
    }, 100);
  }


  onReachEnd(){
    if(this.isInitialLoadDone){
      this.getUsecases(null,true);
    }
  }
  openSlider(event) {
    this.showConversation = true;
    this.newConvSlider.openSlider("#convsLogSilder", "width940");
    this.conversationId = event.target.id;
  }

  closeConvsHistorySlider() {
    this.showConversation = false;
    this.newConvSlider.closeSlider('#convsLogSilder');
  }

  openConvsHistorySlider(event) {
    this.openSlider(event)
  }

 
  getUsecases(val?,pagination?: boolean) {
    this.ucOffset = pagination ? this.USECASES_LIMIT + this.USECASES_LIMIT : this.USECASES_LIMIT;
    let payload = {
      start: this.filter.startDate,
      end: this.filter.endDate,
      limit: this.ucOffset,
      skip: 0,
      sort: this.filter.sort,
      conversationId: val || ''
    }
    // if (!this.loaded) this.isLoading = true;
    if(val?.length>0){
      this.realconvs = this.convs.filter((ele)=>ele.id==val);
      if(this.realconvs.length == 0){
        this.erroMsg = `No conversation logs found.
        Modify filter parameters and try again.`;
      }
    }else{
      this.erroMsg = undefined;
      this.realconvs = [...this.convs]
    }
    this.service.invoke('conversation.logs',{}, payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          
        }))
      .subscribe((res) => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', res)
        if (pagination) {
          this.realconvs = [...this.realconvs, ...res.usecases];
        } else {
          this.realconvs = res.usecases;
        }
        
        this.isInitialLoadDone = true;
      }, err => {
        this.isInitialLoadDone = false;
      });
  }

}
