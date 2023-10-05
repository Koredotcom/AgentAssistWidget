import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XoMenuComponent } from './xo-menu.component';

describe('XoMenuComponent', () => {
  let component: XoMenuComponent;
  let fixture: ComponentFixture<XoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XoMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
