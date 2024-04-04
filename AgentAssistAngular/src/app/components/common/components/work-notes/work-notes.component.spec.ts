import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkNotesComponent } from './work-notes.component';

describe('WorkNotesComponent', () => {
  let component: WorkNotesComponent;
  let fixture: ComponentFixture<WorkNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
