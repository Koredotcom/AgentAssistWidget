import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiAdvancedModelComponent } from './api-advanced-model.component';

describe('ApiAdvancedModelComponent', () => {
  let component: ApiAdvancedModelComponent;
  let fixture: ComponentFixture<ApiAdvancedModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiAdvancedModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiAdvancedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
