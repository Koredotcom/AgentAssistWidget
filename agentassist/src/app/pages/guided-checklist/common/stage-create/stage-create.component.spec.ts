import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCreateComponent } from './stage-create.component';

describe('StageCreateComponent', () => {
  let component: StageCreateComponent;
  let fixture: ComponentFixture<StageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
