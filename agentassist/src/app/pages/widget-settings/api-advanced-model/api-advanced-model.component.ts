import { Component, Inject, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@kore.services/notification.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as ace from "ace-builds";
@Component({
  selector: 'app-api-advanced-model',
  templateUrl: './api-advanced-model.component.html',
  styleUrls: ['./api-advanced-model.component.scss']
})
export class ApiAdvancedModelComponent implements OnInit {
  @ViewChild('editor') editor;

  @Input() data : any;
  @Output() emitScriptService = new EventEmitter();
  
  apiScript: string = "";

  editorOptions = {
    fontSize: 14,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    };

  constructor(
    private activeModal : NgbActiveModal,
    private notificationService: NotificationService
    
  ) { }

  ngOnInit(): void {
    if(this.data != '') {
      this.apiScript = this.data;
    }
    
  }

  ngAfterViewInit() {
    // this.editor.setTheme("eclipse");
  }
  

  save() {
    try {
      let script;
        script = JSON.parse(this.apiScript)
        if(typeof script === 'object') {
         script = this.apiScript;
         this.emitScriptService.next(script);
         this.activeModal.close(script);
        } else{
          throw('Please provide a valid JSON format.')
        }
     
    } catch (err) {
      this.notificationService.showError(err, 'Please provide a valid JSON format.');
    }
  } 
    

  cancel() {
    this.activeModal.close(this.data);
  }

}
