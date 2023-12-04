import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Inject, INJECTOR, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appWidgetDrag]'
})
export class WidgetDragDirective {
  oldY = 0;

  @Output() isGrabbingChange = new EventEmitter<boolean>();
  // @Output() heightChange = new EventEmitter<number>();

  // @Input() height: number;
  @Input() isGrabbing: boolean;

  @Input() topele;
  @Input() bottomele;
  @Input() mainele;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isGrabbing) {
      return;
    }

    let containerOffsetTop = this.mainele.offsetTop;
    // let containerOffsetBottom = this.mainele.offsetTop - this.mainele.offsetHeight;    
    let pointerRelativeXpos = event.clientY - containerOffsetTop;
    let pointerRelativeXpos2 = this.mainele.offsetHeight - pointerRelativeXpos;

    
    if(pointerRelativeXpos > 55 && pointerRelativeXpos2 > 85){
      this.topele.style.minHeight = pointerRelativeXpos + 'px';
      this.bottomele.style.minHeight = pointerRelativeXpos2 + 'px';
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isGrabbing = false;
    this.isGrabbingChange.emit(this.isGrabbing);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isGrabbing = true;
    this.oldY = event.clientY;
    this.isGrabbingChange.emit(this.isGrabbing);
  }
}