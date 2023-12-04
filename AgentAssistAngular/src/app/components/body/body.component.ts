import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit{

  assistMaxButtonClick : boolean = false;
  checkListMaxButtonClick : boolean = false;
  isLoader : boolean = false;

  subs = new SubSink();

  constructor(private handleSubjectService : HandleSubjectService){

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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
  }

  assistMaxButtonClickEvent(event){
    if(!this.assistMaxButtonClick && this.checkListMaxButtonClick){
      this.assistMaxButtonClick = false;
      this.checkListMaxButtonClick = false; 
    }else{
      this.assistMaxButtonClick = !this.assistMaxButtonClick;
    }
  }

}