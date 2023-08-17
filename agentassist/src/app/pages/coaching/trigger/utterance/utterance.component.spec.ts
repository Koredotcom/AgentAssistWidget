import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtteranceComponent } from './utterance.component';

describe('UtteranceComponent', () => {
  let component: UtteranceComponent;
  let fixture: ComponentFixture<UtteranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtteranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtteranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
