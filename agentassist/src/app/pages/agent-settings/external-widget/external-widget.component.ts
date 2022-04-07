import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { EMPTY_WIDGET } from '../agent-settings.mock';
import { Widget } from '../agent-settings.model';
import { AgentSettingsService } from '../agent-settings.service';

@Component({
  selector: 'app-external-widget',
  templateUrl: './external-widget.component.html',
  styleUrls: ['./external-widget.component.scss']
})
export class ExternalWidgetComponent implements OnInit {
  showSlider: boolean = false;
  allWidgets: Widget[] = [];
  selectedWidget: Widget;
  isEdit = false; 

  @ViewChild('slider', { static: true }) slider: SliderComponentComponent;

  @Output() closed = new EventEmitter();

  constructor(private agentService: AgentSettingsService) { }

  ngOnInit(): void {
    this.agentService.getWidgets().subscribe(
      (response: Widget[]) => {
        this.allWidgets = response;
      }
    )
    this.agentService.widgetsChanged$.subscribe(
      widgets => {
        this.allWidgets = widgets;
      }
    )
  }

  addExternalWidget(w: Widget | null) {
    this.isEdit = !!w;
    this.selectedWidget = !w?EMPTY_WIDGET:w;
    this.slider.openSlider("#slider", "width500");
    this.showSlider = true;
  }

  getInitials(name: string) {
    if(!name) return '';
    return name.split(' ').map(val => val[0]).join('').toUpperCase();
  }

  closeSlider() {
    this.showSlider = false;
    this.slider.closeSlider("#slider");
  }


  close() {
    this.closed.emit();
  }

}
