import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MybotDataService } from 'src/bot-tab/services/mybot-data.service';
import { ProjConstants, ImageFilePath, ImageFileNames } from 'src/common/constants/proj.cnts';
import { RandomUUIDPipe } from 'src/common/pipes/random-uuid.pipe';
import { RemoveSpecialCharPipe } from 'src/common/pipes/remove-special-char.pipe';
import { ReplaceQuotStringWithDoubleQuotPipe } from 'src/common/pipes/replace-quot-string-with-double-quot.pipe';
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
  isMybotInputResponseClick : boolean = false;

  constructor(public handleSubjectService : HandleSubjectService, public randomUUIDPipe : RandomUUIDPipe,
    public mybotDataService : MybotDataService, public removeSpecialCharPipe : RemoveSpecialCharPipe,
    public replaceQuotStringWithDoubleQuotPipe : ReplaceQuotStringWithDoubleQuotPipe) { }

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

  processMybotDataResponse(data, convId, botId) {
    let myBotuuids = this.randomUUIDPipe.transform(); 
    let _msgsResponse = this.mybotDataService.getMybotMsgResponse(myBotuuids,botId);

    data.buttons?.forEach((elem) => {
       let msgBody = this.mybotDataService.prepareMybotMsgBody(elem)
      _msgsResponse.message.push(msgBody);
    });

  }

}
