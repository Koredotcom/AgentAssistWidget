import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSettingsComponent } from './feedback-settings.component';

describe('FeedbackSettingsComponent', () => {
  let component: FeedbackSettingsComponent;
  let fixture: ComponentFixture<FeedbackSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
