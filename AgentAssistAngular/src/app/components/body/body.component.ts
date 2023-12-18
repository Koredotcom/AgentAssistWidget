import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit{

  @ViewChild('top', { static: false }) private checklistDiv: ElementRef<HTMLDivElement>
  @ViewChild('bottom', { static: false }) private assistDiv: ElementRef<HTMLDivElement>

  assistMaxButtonClick : boolean = false;
  checkListMaxButtonClick : boolean = false;
  isLoader : boolean = false;
  isGrab : boolean = false;
  resized : boolean = false;

  subs = new SubSink();

  constructor(private handleSubjectService : HandleSubjectService, public rootService : RootService){

  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isGrab = false;
    this.resizeEvent(event);
  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  resizeEvent(event){
    this.resized = !this.resized;
  }


  subscribeEvents(){
    this.subs.sink = this.handleSubjectService.isLoaderSetSubject.subscribe((val)=>{
      this.isLoader = val;
    });
  }

  checkListMaxButtonClickEvent(event){
    if(this.assistMaxButtonClick && !this.checkListMaxButtonClick){
      this.assistMaxButtonClick = false;
      this.checkListMaxButtonClick = false; 
    }else{
      this.checkListMaxButtonClick = !this.checkListMaxButtonClick;
    }
    this.assistDiv.nativeElement.style.minHeight = 0 + 'px';
    this.checklistDiv.nativeElement.style.minHeight = 0 + 'px';
    this.rootService.widgetMaxButtonClick = true;
  }

  assistMaxButtonClickEvent(event){
    if(!this.assistMaxButtonClick && this.checkListMaxButtonClick){
      this.assistMaxButtonClick = false;
      this.checkListMaxButtonClick = false; 
    }else{
      this.assistMaxButtonClick = !this.assistMaxButtonClick;
    }
    this.checklistDiv.nativeElement.style.minHeight = 0 + 'px';
    this.assistDiv.nativeElement.style.minHeight = 0 + 'px';
    this.rootService.widgetMaxButtonClick = true;
  }

}
