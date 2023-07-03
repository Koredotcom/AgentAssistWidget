import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiConfigComponent } from './ai-config.component';

describe('AiConfigComponent', () => {
  let component: AiConfigComponent;
  let fixture: ComponentFixture<AiConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
