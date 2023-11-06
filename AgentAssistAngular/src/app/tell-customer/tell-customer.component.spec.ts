import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellCustomerComponent } from './tell-customer.component';

describe('TellCustomerComponent', () => {
  let component: TellCustomerComponent;
  let fixture: ComponentFixture<TellCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TellCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TellCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
