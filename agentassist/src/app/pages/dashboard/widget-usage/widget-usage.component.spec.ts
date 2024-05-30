import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetUsageComponent } from './widget-usage.component';

describe('WidgetUsageComponent', () => {
  let component: WidgetUsageComponent;
  let fixture: ComponentFixture<WidgetUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
