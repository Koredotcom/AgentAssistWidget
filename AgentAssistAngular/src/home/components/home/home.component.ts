import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandleSubjectService } from 'src/common/services/handle-subject.service';
import {ImageFileNames, ImageFilePath, ProjConstants} from '../../../common/constants/proj.cnts'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imageFilePath : string = ImageFilePath;
  imageFileNames : any = ImageFileNames;
  projConstants : any = ProjConstants;
  searchText : string = '';
  showSearchSuggestions : boolean = false;
  subscriptionsList: Subscription[] = [];
  activeTab : string; // call conversation make transcript as active tab.

  constructor(public handleSubjectService : HandleSubjectService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(){
    this.subscriptionsList.forEach((subscription)=>{
      subscription.unsubscribe();
    })
  }

  subscribeEvents(){
    let subscribtion = this.handleSubjectService.activeTabSubject.subscribe(tab => {
      this.activeTab = tab; 
    });
    this.subscriptionsList.push(subscribtion);
  }

  isChecked(){
    
  }

  changeActiveTab(tab){
    this.handleSubjectService.setActiveTab(tab);
  }

  getSearchResults(){
    this.showSearchSuggestions = true;
    this.handleSubjectService.setSearchText({searchFrom:this.projConstants.ASSIST, value : this.searchText});
  }

  emptySearchTextCheck(){
    if(this.searchText == ''){
      this.showSearchSuggestions = false;
    }
  }

}
