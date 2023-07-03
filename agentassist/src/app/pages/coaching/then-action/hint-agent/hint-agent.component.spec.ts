import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintAgentComponent } from './hint-agent.component';

describe('HintAgentComponent', () => {
  let component: HintAgentComponent;
  let fixture: ComponentFixture<HintAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HintAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HintAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
