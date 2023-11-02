import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetSuggestionsComponent } from './snippet-suggestions.component';

describe('SnippetSuggestionsComponent', () => {
  let component: SnippetSuggestionsComponent;
  let fixture: ComponentFixture<SnippetSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnippetSuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnippetSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
