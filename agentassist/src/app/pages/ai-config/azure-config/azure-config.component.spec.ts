import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureConfigComponent } from './azure-config.component';

describe('AzureConfigComponent', () => {
  let component: AzureConfigComponent;
  let fixture: ComponentFixture<AzureConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AzureConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AzureConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
