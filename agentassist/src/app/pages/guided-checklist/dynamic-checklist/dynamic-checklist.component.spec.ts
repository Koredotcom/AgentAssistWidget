import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicChecklistComponent } from './dynamic-checklist.component';

describe('DynamicChecklistComponent', () => {
  let component: DynamicChecklistComponent;
  let fixture: ComponentFixture<DynamicChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
