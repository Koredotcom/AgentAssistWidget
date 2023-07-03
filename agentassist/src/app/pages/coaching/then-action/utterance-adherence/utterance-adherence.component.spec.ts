import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtteranceAdherenceComponent } from './utterance-adherence.component';

describe('UtteranceAdherenceComponent', () => {
  let component: UtteranceAdherenceComponent;
  let fixture: ComponentFixture<UtteranceAdherenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtteranceAdherenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtteranceAdherenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
