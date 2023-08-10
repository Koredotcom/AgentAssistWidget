import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoneIntentComponent } from './none-intent.component';

describe('NoneIntentComponent', () => {
  let component: NoneIntentComponent;
  let fixture: ComponentFixture<NoneIntentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoneIntentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoneIntentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
