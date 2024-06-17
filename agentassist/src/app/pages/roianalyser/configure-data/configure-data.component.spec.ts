import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureDataComponent } from './configure-data.component';

describe('ConfigureDataComponent', () => {
  let component: ConfigureDataComponent;
  let fixture: ComponentFixture<ConfigureDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
