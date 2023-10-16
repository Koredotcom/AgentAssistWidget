import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterruptionComponent } from './interruption.component';

describe('InterruptionComponent', () => {
  let component: InterruptionComponent;
  let fixture: ComponentFixture<InterruptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterruptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterruptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
