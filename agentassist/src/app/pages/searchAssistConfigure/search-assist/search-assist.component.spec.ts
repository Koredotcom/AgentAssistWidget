import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssistComponent } from './search-assist.component';

describe('SearchAssistComponent', () => {
  let component: SearchAssistComponent;
  let fixture: ComponentFixture<SearchAssistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAssistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAssistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
