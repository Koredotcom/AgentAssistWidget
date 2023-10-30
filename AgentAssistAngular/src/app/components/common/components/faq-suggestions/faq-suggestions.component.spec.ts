import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqSuggestionsComponent } from './faq-suggestions.component';

describe('FaqSuggestionsComponent', () => {
  let component: FaqSuggestionsComponent;
  let fixture: ComponentFixture<FaqSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqSuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
