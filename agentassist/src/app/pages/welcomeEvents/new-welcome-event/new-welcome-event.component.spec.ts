import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWelcomeEventComponent } from './new-welcome-event.component';

describe('NewWelcomeEventComponent', () => {
  let component: NewWelcomeEventComponent;
  let fixture: ComponentFixture<NewWelcomeEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewWelcomeEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWelcomeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
