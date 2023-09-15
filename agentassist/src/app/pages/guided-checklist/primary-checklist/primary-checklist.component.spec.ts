import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryChecklistComponent } from './primary-checklist.component';

describe('PrimaryChecklistComponent', () => {
  let component: PrimaryChecklistComponent;
  let fixture: ComponentFixture<PrimaryChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
