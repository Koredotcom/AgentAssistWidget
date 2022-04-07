import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-slider-component',
  templateUrl: './slider-component.component.html',
  styleUrls: ['./slider-component.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'app-slider'
})
export class SliderComponentComponent implements OnInit {
  rightClass: any;
  constructor() { }


  ngOnInit() {

  }

  openSlider(parentSelector, width) {
    this.rightClass = width;
    let modalEle = "#sliderComponent";
    let sliderEle = $(modalEle);
    if (parentSelector) {
      sliderEle = $(parentSelector).find(modalEle);
    }
    sliderEle.addClass("open");
    setTimeout(() => {
      sliderEle.find(".sliderDialogComponent").animate({ right: '0' });
      $("body").addClass("bt-modal-open");
      sliderEle.show();
    }, 200);
  }

  closeSlider(parentSelector) {
    let modalEle = "#sliderComponent";
    var sliderEle = $(modalEle);
    if (parentSelector) {
      sliderEle = $(parentSelector).find(modalEle);
    }
    sliderEle.removeClass("open");
    sliderEle.find(".sliderDialogComponent").animate({ right: '-' + sliderEle.find(".sliderDialogComponent").width() + 'px' });
    setTimeout(() => {
      sliderEle.hide();
      if (!$(".modal-backdrop.in").is(":visible")) {
        $("body").removeClass("bt-modal-open");
      }
    }, 200);
  }
}
