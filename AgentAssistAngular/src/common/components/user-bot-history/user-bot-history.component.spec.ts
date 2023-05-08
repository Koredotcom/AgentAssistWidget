import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBotHistoryComponent } from './user-bot-history.component';

describe('UserBotHistoryComponent', () => {
  let component: UserBotHistoryComponent;
  let fixture: ComponentFixture<UserBotHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBotHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBotHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
