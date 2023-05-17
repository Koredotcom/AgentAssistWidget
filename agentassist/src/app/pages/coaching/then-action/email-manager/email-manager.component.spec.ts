import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailManagerComponent } from './email-manager.component';

describe('EmailManagerComponent', () => {
  let component: EmailManagerComponent;
  let fixture: ComponentFixture<EmailManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
