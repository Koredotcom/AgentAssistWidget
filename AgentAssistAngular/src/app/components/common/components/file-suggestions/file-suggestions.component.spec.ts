import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSuggestionsComponent } from './file-suggestions.component';

describe('FileSuggestionsComponent', () => {
  let component: FileSuggestionsComponent;
  let fixture: ComponentFixture<FileSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileSuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
