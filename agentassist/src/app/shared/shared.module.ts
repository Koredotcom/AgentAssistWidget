import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SliderComponentComponent } from './slider-component/slider-component.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { PercentageDonutChartComponent } from './percentage-donut-chart/percentage-donut-chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplatesChatHistoryComponent } from '../pages/templates-chat-history/templates-chat-history.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgInitDirective } from '../helpers/directives/ng-init.directive';
import { PhoneNumberComponent } from '../pages/settings/in-setup/phone-number/phone-number.component';
import { IvrComponent } from '../pages/settings/in-setup/ivr/ivr.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../modules/material.module';
import { VoicePreferencesComponent } from '../pages/settings/adv-settings/voice-preferences/voice-preferences.component';
import { SipTransferComponent } from '../pages/settings/sip-transfer/sip-transfer.component';
import { ChannelsComponent } from '../pages/settings/channels/channels.component';

import { SkillsMapPipe } from '../helpers/filters/skills-map.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FindSkillPipe } from '../helpers/filters/find-skill.pipe';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ColorPickerModule } from 'ngx-color-picker';
import { FilterPipe } from '../helpers/filters/filter.pipe';

import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/languages/de.js';

import 'froala-editor/js/third_party/font_awesome.min';
import 'froala-editor/js/third_party/image_tui.min';
import 'froala-editor/js/third_party/spell_checker.min';
import 'froala-editor/js/third_party/embedly.min';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { DateFormatPipe } from '../helpers/filters/dateformat.pipe';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AgentGpMatchComponent } from './agents/agent-gp-match/agent-gp-match.component';
import { CustomMarkdownEditorComponent } from '../helpers/lib/md-editor.component';
import { DragDropDirective } from './drag-drop.directive';
import { EmptyScreensComponent } from '../pages/usecases/uc-main/uc-table-main/uc-table-view/empty-screens/empty-screens.component';
import { HasPermissionDirective } from '../helpers/directives/has-permission.directive';
import { SkillsDdComponent } from '../pages/usecases/skills-dd/skills-dd.component';
import { AgentsDdComponent } from '../pages/agents/agents-dd/agents-dd.component';
import { ChipListAutocompleteFixDirective } from '../helpers/directives/chip-list-autocomplete-fix.directive';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { WSelDialogComponent } from '../pages/w-sel-dialog/w-sel-dialog.component';
import { DigitOnlyDirective } from '../helpers/directives/digit-only.directive';
import { ArraySortPipe } from '../helpers/filters/sort.pipe';
import { ConversationConfigComponent } from '../pages/usecases/conversation-config/conversation-config.component';
import { StrictFilterPipe } from '../helpers/filters/strict-filter';
import { JsEditorComponent } from './js-editor/js-editor.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { PlaceHolderDirective } from '../helpers/directives/placeholder.directive';
import { LookupPipe } from '../helpers/filters/lookup.pipe';
import { UbEmptyScreensComponent } from '../pages/usecases/uc-main/uc-table-main/uc-table-view/ub-empty-screens/ub-empty-screens.component';

const COMPONENTS = [
  SliderComponentComponent,
  PercentageDonutChartComponent,
  PaginationComponent,
  TemplatesChatHistoryComponent,
  PhoneNumberComponent,
  IvrComponent,
  VoicePreferencesComponent,
  SipTransferComponent,
  ChannelsComponent
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
    DateFormatPipe,
    SkillsMapPipe,
    FindSkillPipe,
    DragDropDirective,
    CustomMarkdownEditorComponent,
    AgentGpMatchComponent,
    EmptyScreensComponent,
    UbEmptyScreensComponent,
    HasPermissionDirective,
    PlaceHolderDirective,
    SkillsDdComponent,
    AgentsDdComponent,
    ChipListAutocompleteFixDirective,
    WSelDialogComponent,
    DigitOnlyDirective,
    ArraySortPipe,
    DigitOnlyDirective,
    ConversationConfigComponent,
    StrictFilterPipe,
    JsEditorComponent
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
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
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
    SkillsMapPipe,
    TranslateModule,
    FindSkillPipe,
    DateFormatPipe,
    DragDropDirective,
    CustomMarkdownEditorComponent,
    FroalaEditorModule,
    FroalaViewModule,
    NgxDaterangepickerMd,
    AgentGpMatchComponent,
    EmptyScreensComponent,
    UbEmptyScreensComponent,
    TitleCasePipe,
    HasPermissionDirective,
    PlaceHolderDirective,
    SkillsDdComponent,
    AgentsDdComponent,
    ChipListAutocompleteFixDirective,
    WSelDialogComponent,
    DigitOnlyDirective,
    ArraySortPipe,
    DigitOnlyDirective,
    ConversationConfigComponent,
    StrictFilterPipe,
    AceEditorModule,
    JsEditorComponent
  ],
})
export class SharedModule { }
