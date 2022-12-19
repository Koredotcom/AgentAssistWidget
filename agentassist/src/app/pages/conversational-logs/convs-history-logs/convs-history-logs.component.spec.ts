import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvsHistoryLogsComponent } from './convs-history-logs.component';

describe('ConvsHistoryLogsComponent', () => {
  let component: ConvsHistoryLogsComponent;
  let fixture: ComponentFixture<ConvsHistoryLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvsHistoryLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvsHistoryLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
