import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UsecasesMainService } from '../uc-main.service';
import { NewUsecase } from './uc-header.model';
import { workflowService } from '@kore.services/workflow.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { InstallTemplatesComponent } from '../../popUps/install-templates/install-templates.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-uc-header',
  templateUrl: './uc-header.component.html',
  styleUrls: ['./uc-header.component.scss']
})
export class UsecasesHeaderComponent implements OnInit {
  @Input() isFlow;
  currentTab;
  newUseCases: NewUsecase[] = [
    {title: this.translate.instant("USECASES.NEW_QA"), desc: this.translate.instant("USECASES.NEW_QA_DESC"), imgSrc: 'assets/images/usecases/new_faq.png', id: 'faq'},
    {title: this.translate.instant("USECASES.NEW_CONV"), desc: this.translate.instant("USECASES.NEW_CONV_DESC"), imgSrc: 'assets/images/usecases/new_conv.png', id: 'dialog'},
    {title: this.translate.instant("USECASES.NEW_PRE_BOT"), desc: this.translate.instant("ONBOARDING.CREATE_TEMPLATES_DESC"), imgSrc: 'assets/images/usecases/new_template.png', id: 'new_template'}
  ];

  constructor(public usecaseService: UsecasesMainService,
              public workflowService:workflowService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private authService: AuthService
              ) { }

  ngOnInit(): void {
    if(this.workflowService.doOpenInstallTemps) {
      let ob = {
        id: this.authService.btStoreQp.streamId
      }
      this.openInstallTemplatesPopup(ob);
    }
    this.usecaseService.currentTab$.subscribe(tab => {
      this.currentTab = tab;
    })
  }

  ngOnChanges(){
    if(this.isFlow){
      setTimeout(() => {
        this.createNewFlow();        
      }, 500);
    }
  }

  createNewFlow() {
    this.usecaseService.createExpFlowBoolean(true);
  }

  addUsecase(usecase: NewUsecase) {
    if(usecase.id == "new_template") {
      this.workflowService.loadBotStore$.next();
      return;
    }
    this.usecaseService.closeNewUsecase();
    setTimeout(()=>{
      this.usecaseService.addNewUsecase(usecase);
    });
  }

  openInstallTemplatesPopup(data) {
    if(this.dialog.openDialogs.length > 0) {
      return;
    }
    const dialogRef = this.dialog.open(InstallTemplatesComponent, {
      width: '840px',
      height: '614px',
      panelClass: "install-template-popup",
      disableClose: true,
      data: {
        'data': data
      }
    });

    dialogRef.componentInstance.onSelect.subscribe(result => {
      dialogRef.close();
    });
    return;
  }

}

