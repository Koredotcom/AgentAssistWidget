import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MybotComponent } from './mybot.component';

describe('MybotComponent', () => {
  let component: MybotComponent;
  let fixture: ComponentFixture<MybotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MybotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MybotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
