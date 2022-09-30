import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjConstants, ImageFilePath, ImageFileNames } from 'src/common/constants/proj.cnts';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';

@Component({
  selector: 'app-mybot',
  templateUrl: './mybot.component.html',
  styleUrls: ['./mybot.component.scss']
})
export class MybotComponent implements OnInit {

  subscriptionsList: Subscription[] = [];

  projConstants: any = ProjConstants;
  imageFilePath: string = ImageFilePath;
  imageFileNames: any = ImageFileNames;

  constructor(public handleSubjectService : HandleSubjectService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.subscriptionsList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  subscribeEvents(){
    let subscription = this.handleSubjectService.runButtonClickEventSubject.subscribe((runEventObj : any) => {
      console.log(runEventObj, "run event obj");
      
    });
    this.subscriptionsList.push(subscription);
  }

}
