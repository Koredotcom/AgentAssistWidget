import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvesationSummaryComponent } from './convesation-summary.component';

describe('ConvesationSummaryComponent', () => {
  let component: ConvesationSummaryComponent;
  let fixture: ComponentFixture<ConvesationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvesationSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvesationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
