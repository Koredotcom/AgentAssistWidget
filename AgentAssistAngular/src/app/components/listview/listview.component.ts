import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjConstants } from 'src/app/proj.const';

@Component({
  selector: 'app-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListviewComponent{
  projConstants : any = ProjConstants;

  @Input() listView : boolean;
  @Input() restart : boolean;
  @Input() assistResponseArray : any;
  @Output() handlePopupEvent = new EventEmitter();

  entityList : any = [];

  ngOnChanges(){
    console.log(this.assistResponseArray, 'assist response array', this.listView);
    
    if(this.assistResponseArray.length){
      let automationResponse = this.assistResponseArray[this.assistResponseArray.length-1];
      for(let automation of automationResponse.automationsArray){
        let entityName = automation?.data?.entityDisplayName ? automation?.data?.entityDisplayName : automation.data.entityName;
        if(entityName){
          let obj : any = {
            entityName : entityName,
            entityValue : automation.entityValue
          }
          this.entityList.push(obj);
        }
      }
    }
  }

  
  closeListView(flag){
    this.handlePopupEvent.emit({ status: flag,  type: this.projConstants.LISTVIEW });
  }

}
