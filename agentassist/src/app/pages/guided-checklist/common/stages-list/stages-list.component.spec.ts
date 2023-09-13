import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistCreateComponent } from './stages-list.component';

describe('ChecklistCreateComponent', () => {
  let component: ChecklistCreateComponent;
  let fixture: ComponentFixture<ChecklistCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
