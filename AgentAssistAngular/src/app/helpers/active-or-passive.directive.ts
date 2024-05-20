import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { RootService } from '../services/root.service';

@Directive({
  selector: '[appActiveOrPassive]'
})
export class ActiveOrPassiveDirective implements OnInit, OnDestroy {

  private toggleSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private rootService: RootService
  ) {}

  ngOnInit(): void {
    this.toggleSubscription = this.rootService.disableTheWidget.subscribe(isActive => {
      if (!isActive) {
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'auto');
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
        this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
      }
    });
  }

  ngOnDestroy(): void {
    this.toggleSubscription.unsubscribe();
  }
}
