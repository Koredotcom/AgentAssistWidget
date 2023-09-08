import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccWarningDialogComponent } from './acc-warning-dialog.component';

describe('AccWarningDialogComponent', () => {
  let component: AccWarningDialogComponent;
  let fixture: ComponentFixture<AccWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccWarningDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
