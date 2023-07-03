import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingGroupCreateComponent } from './coaching-group-create.component';

describe('CoachingGroupCreateComponent', () => {
  let component: CoachingGroupCreateComponent;
  let fixture: ComponentFixture<CoachingGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachingGroupCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachingGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
