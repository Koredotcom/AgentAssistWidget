import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedChecklistComponent } from './guided-checklist.component';

describe('GuidedChecklistComponent', () => {
  let component: GuidedChecklistComponent;
  let fixture: ComponentFixture<GuidedChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuidedChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
