import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSuggestionsComponent } from './article-suggestions.component';

describe('ArticleSuggestionsComponent', () => {
  let component: ArticleSuggestionsComponent;
  let fixture: ComponentFixture<ArticleSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleSuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
