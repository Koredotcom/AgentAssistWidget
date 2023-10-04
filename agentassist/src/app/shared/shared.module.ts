import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SliderComponentComponent } from './slider-component/slider-component.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgInitDirective } from '../helpers/directives/ng-init.directive';
import { IvrComponent } from '../pages/settings/in-setup/ivr/ivr.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../modules/material.module';
import { VoicePreferencesComponent } from '../pages/settings/adv-settings/voice-preferences/voice-preferences.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { FilterPipe } from '../helpers/filters/filter.pipe';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CustomMarkdownEditorComponent } from '../helpers/lib/md-editor.component';
import { ChipListAutocompleteFixDirective } from '../helpers/directives/chip-list-autocomplete-fix.directive';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { WSelDialogComponent } from '../pages/w-sel-dialog/w-sel-dialog.component';
import { DigitOnlyDirective } from '../helpers/directives/digit-only.directive';
import { ArraySortPipe } from '../helpers/filters/sort.pipe';
import { StrictFilterPipe } from '../helpers/filters/strict-filter';
import { AceEditorModule } from 'ng2-ace-editor';
import { LookupPipe } from '../helpers/filters/lookup.pipe';
import { EmptyScreensComponent } from '../pages/usecases/uc-main/uc-table-main/uc-table-view/empty-screens/empty-screens.component';
import { UbEmptyScreensComponent } from '../pages/usecases/uc-main/uc-table-main/uc-table-view/ub-empty-screens/ub-empty-screens.component';

const COMPONENTS = [
  SliderComponentComponent,
  IvrComponent,
  VoicePreferencesComponent,
  EmptyScreensComponent,
  UbEmptyScreensComponent
];

const PIPES = [
  FilterPipe,
  LookupPipe
]

const DIRECTIVES = [
  NgInitDirective
]

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
    CustomMarkdownEditorComponent,
    ChipListAutocompleteFixDirective,
    WSelDialogComponent,
    DigitOnlyDirective,
    ArraySortPipe,
    DigitOnlyDirective,
    StrictFilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({ echarts }),
    NgxSliderModule,
    NgbModule,
    PerfectScrollbarModule,
    ColorPickerModule,
    NgxMaterialTimepickerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxDaterangepickerMd.forRoot(),
    AceEditorModule
  ],
  providers: [TitleCasePipe, FilterPipe],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxEchartsModule,
    PerfectScrollbarModule,
    MaterialModule,
    NgxSliderModule,
    NgxMaterialTimepickerModule,
    ColorPickerModule,
    CommonModule,
    TranslateModule,
    CustomMarkdownEditorComponent,
    NgxDaterangepickerMd,
    TitleCasePipe,
    ChipListAutocompleteFixDirective,
    WSelDialogComponent,
    DigitOnlyDirective,
    ArraySortPipe,
    DigitOnlyDirective,
    StrictFilterPipe,
    AceEditorModule,
  ],
})
export class SharedModule { }
