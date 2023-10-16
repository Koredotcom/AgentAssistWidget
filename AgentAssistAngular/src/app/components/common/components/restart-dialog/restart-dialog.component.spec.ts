import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartDialogComponent } from './restart-dialog.component';

describe('RestartDialogComponent', () => {
  let component: RestartDialogComponent;
  let fixture: ComponentFixture<RestartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestartDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
