import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentScoreComponent } from './sentiment-score.component';

describe('SentimentScoreComponent', () => {
  let component: SentimentScoreComponent;
  let fixture: ComponentFixture<SentimentScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentimentScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
