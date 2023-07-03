import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertManagerComponent } from './alert-manager.component';

describe('AlertManagerComponent', () => {
  let component: AlertManagerComponent;
  let fixture: ComponentFixture<AlertManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
