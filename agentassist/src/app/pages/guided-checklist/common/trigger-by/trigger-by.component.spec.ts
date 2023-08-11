import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerByComponent } from './trigger-by.component';

describe('TriggerByComponent', () => {
  let component: TriggerByComponent;
  let fixture: ComponentFixture<TriggerByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriggerByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
