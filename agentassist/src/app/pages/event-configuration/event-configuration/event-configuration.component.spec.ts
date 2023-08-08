import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventConfigurationComponent } from './event-configuration.component';

describe('EventConfigurationComponent', () => {
  let component: EventConfigurationComponent;
  let fixture: ComponentFixture<EventConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
