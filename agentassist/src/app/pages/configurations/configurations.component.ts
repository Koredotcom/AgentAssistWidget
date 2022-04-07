import { Component, OnInit } from '@angular/core';
import { AppService } from '@kore.services/app.service';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

}
