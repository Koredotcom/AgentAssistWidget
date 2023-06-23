import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiConfigComponent } from './openai-config.component';

describe('OpenaiConfigComponent', () => {
  let component: OpenaiConfigComponent;
  let fixture: ComponentFixture<OpenaiConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenaiConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenaiConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
