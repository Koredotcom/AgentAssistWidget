import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsecasesMainService } from '../uc-main.service';

@Component({
  selector: 'app-uc-table-main',
  templateUrl: './uc-table-main.component.html',
  styleUrls: ['./uc-table-main.component.scss']
})
export class UsecasesTableMainComponent implements OnInit, OnDestroy {

  isTableSelection = true;
  sT: Subscription;

  constructor(public usecaseService: UsecasesMainService) { }

  ngOnInit(): void {
    this.sT = this.usecaseService.switchTabs$.subscribe(()=>{
      this.isTableSelection = false;
      setTimeout(()=>{
        this.isTableSelection = true;
      });
    })
  }

  ngOnDestroy() {
    this.sT.unsubscribe();
  }

}
