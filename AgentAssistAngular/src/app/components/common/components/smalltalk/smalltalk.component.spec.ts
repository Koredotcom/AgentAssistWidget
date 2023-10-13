import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmalltalkComponent } from './smalltalk.component';

describe('SmalltalkComponent', () => {
  let component: SmalltalkComponent;
  let fixture: ComponentFixture<SmalltalkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmalltalkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmalltalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
