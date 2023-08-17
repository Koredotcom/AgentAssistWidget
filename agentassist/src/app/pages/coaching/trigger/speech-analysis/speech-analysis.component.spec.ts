import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechAnalysisComponent } from './speech-analysis.component';

describe('SpeechAnalysisComponent', () => {
  let component: SpeechAnalysisComponent;
  let fixture: ComponentFixture<SpeechAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeechAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
