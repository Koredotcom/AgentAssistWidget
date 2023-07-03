import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingRuleCreateComponent } from './coaching-rule-create.component';

describe('CoachingRuleCreateComponent', () => {
  let component: CoachingRuleCreateComponent;
  let fixture: ComponentFixture<CoachingRuleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachingRuleCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachingRuleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
