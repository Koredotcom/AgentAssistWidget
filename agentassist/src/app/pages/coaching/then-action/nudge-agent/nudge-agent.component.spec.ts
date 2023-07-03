import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgeAgentComponent } from './nudge-agent.component';

describe('NudgeAgentComponent', () => {
  let component: NudgeAgentComponent;
  let fixture: ComponentFixture<NudgeAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NudgeAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NudgeAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
