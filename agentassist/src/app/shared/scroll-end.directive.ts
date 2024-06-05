import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appScrollEnd]'
})
export class ScrollEndDirective {
  @Output() scrollEnd = new EventEmitter<any>();

  constructor(private el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      this.scrollEnd.emit(event);
    }
  }
}