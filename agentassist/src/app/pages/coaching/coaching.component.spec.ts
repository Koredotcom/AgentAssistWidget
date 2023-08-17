import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingComponent } from './coaching.component';

describe('CoachingComponent', () => {
  let component: CoachingComponent;
  let fixture: ComponentFixture<CoachingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
