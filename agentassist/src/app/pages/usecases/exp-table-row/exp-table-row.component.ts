import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { INewExpeirence } from 'src/app/data/expeirences.mock';
import { UcDeleteConfirmComponent } from 'src/app/helpers/components/uc-delete-confirm/uc-delete-confirm.component';
import { SliderComponentComponent } from 'src/app/shared/slider-component/slider-component.component';
import { workflowService } from '@kore.services/workflow.service';
import { UsecasesMainService } from '../uc-main/uc-main.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-exp-table-row',
  templateUrl: './exp-table-row.component.html',
  styleUrls: ['./exp-table-row.component.scss']
})
export class ExpTableRowComponent implements OnInit {
  phoneNumbers: any[] = [];
  showFlowSlider: boolean;
  @Input() i;
  @Input() flowData: INewExpeirence;
  @ViewChild('flowSlider', { static: true }) flowSlider: SliderComponentComponent;
  @Output() onOpenFlowSlider = new EventEmitter;
  @Output() onOpenFlowEditorSlider = new EventEmitter;
  @Output() deleteSelectedExpFlow = new EventEmitter;
  constructor(
    public dialog: MatDialog,
    private translate: TranslateService,
    public workflowService:workflowService,
    private ucMainService: UsecasesMainService
  ) { }

  ngOnInit(): void {
    this.phoneNumbers = _.map(this.flowData?.source?.phoneNumbers, "phoneNumber")
  }

  openFlowSlider(flowDetails) {
    this.ucMainService.selectedFlowData = flowDetails;
    this.workflowService.selectedCallflow(flowDetails);
    this.onOpenFlowSlider.emit(flowDetails);
    this.ucMainService.createExpFlowBoolean(false);
    // this.flowSlider.openSlider("#flowSlider", "width940");
    // this.showFlowSlider = true;
  }

  deleteExp(flowDetails) {
    let id = flowDetails._id;

    const dialogRef = this.dialog.open(UcDeleteConfirmComponent, {
      width: '580px',
      panelClass: "delete-exp-flow",
      data: {
        title: this.translate.instant('EXPRIENCE_FLOW_DELETE_TITLE', { flowName: flowDetails?.name }),
        text: this.translate.instant("EXPRIENCE_FLOW_DELETE_CONFORMATION_NOTE"),
        buttons: [{ key: 'yes', label: this.translate.instant("BUTTONS.DELETE"), type: 'danger' }, { key: 'no', label: this.translate.instant("BUTTONS.NO_IDONT") }]
      }
    });
    dialogRef.componentInstance.onSelect
      .subscribe(result => {
        if (result === 'yes') {
          //TODO
          this.deleteSelectedExpFlow.emit(id);
          dialogRef.close();
        } else if (result === 'no') {
          dialogRef.close();
        }
      });
  }

  openFlowEditorSlider(event, flowDetails){
    this.workflowService.selectedCallflow(flowDetails);
    event.stopPropagation();
    this.onOpenFlowEditorSlider.emit();
  }

  close($event) {
    this.showFlowSlider = false;
    this.flowSlider.closeSlider("#flowSlider");
  }

}
