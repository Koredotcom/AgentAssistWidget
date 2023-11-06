import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskCustomerComponent } from './ask-customer.component';

describe('AskCustomerComponent', () => {
  let component: AskCustomerComponent;
  let fixture: ComponentFixture<AskCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
