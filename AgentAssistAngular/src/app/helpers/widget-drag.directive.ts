import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Inject, INJECTOR, Input, OnInit, Output } from '@angular/core';
import { RootService } from '../services/root.service';

@Directive({
  selector: '[appWidgetDrag]'
})
export class WidgetDragDirective {
  oldY = 0;

  @Output() isGrabbingChange = new EventEmitter<boolean>();
  @Output() resizeEvent = new EventEmitter();
  // @Output() heightChange = new EventEmitter<number>();

  // @Input() height: number;
  @Input() isGrabbing: boolean;

  @Input() topele;
  @Input() bottomele;
  @Input() mainele;

  constructor(private rootService : RootService){

  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isGrabbing) {
      return;
    }

    let pointerRelativeXpos2 = this.mainele.offsetHeight - event.y;
    let pointerRelativeXpos = this.mainele.offsetHeight - pointerRelativeXpos2 -23;    
    
    if(pointerRelativeXpos > 55 && pointerRelativeXpos2 > 85){
      this.topele.style.minHeight = pointerRelativeXpos + 'px';
      this.bottomele.style.minHeight = pointerRelativeXpos2 + 'px';
    }
    
    if(this.topele.classList.contains('minimized-card')){
      this.topele.classList.remove('minimized-card')
    }
    if(this.bottomele.classList.contains('minimized-card')){
      this.bottomele.classList.remove('minimized-card')
    }
    this.rootService.widgetMaxButtonClick = false;
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isGrabbing = false;
    this.isGrabbingChange.emit(this.isGrabbing);
    this.resizeEvent.emit(false);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isGrabbing = true;
    this.oldY = event.clientY;
    this.isGrabbingChange.emit(this.isGrabbing);
    this.resizeEvent.emit(true);
  }
}
