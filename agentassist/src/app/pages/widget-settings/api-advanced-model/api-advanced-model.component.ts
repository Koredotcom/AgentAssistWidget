import { Component, Inject, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { NotificationService } from '@kore.services/notification.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  isFullscreen : boolean = false;
  modalHeight : string = '350px'

  editorOptions = {
    fontSize: 14,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false
    };

  constructor(
    private activeModal : NgbActiveModal,
    private notificationService: NotificationService
    
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    // Check if the pressed key is the escape key
    if (event.key === "Escape" && this.isFullscreen) {
      // Handle the escape event here, e.g., close a modal or cancel an action
      this.isFullscreen = false;
      this.modalHeight = this.isFullscreen ? 'calc(100vh - 170px)' : '350px';
    }
  }

  ngOnInit(): void {
    if(this.data?.value !== '') {
      if(this.data?.emitType === 'advancemode') {
        try {
          if(JSON.parse(this.data?.value)) {
            this.apiScript = this.data.value;
          }
        } catch (err) {
        }
      } else if(this.data?.emitType === 'advance'){
        this.apiScript = this.data.value
      }
    }
    
    
  }

  ngAfterViewInit() {
    // this.editor.setTheme("eclipse");
  }
  

  save() {
    // this.emitScriptService.next(this.apiScript);
    this.activeModal.close(this.apiScript);
  } 
    

  cancel() {
    this.activeModal.close(this.data?.value);
  }

  copyInputMessage(inputElement){
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = inputElement;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.notificationService.notify("copied successfully", "success");
  }

  expandModal() {
    this.isFullscreen = !this.isFullscreen
    this.modalHeight = this.isFullscreen ? 'calc(100vh - 170px)' : '350px';
  }
}
