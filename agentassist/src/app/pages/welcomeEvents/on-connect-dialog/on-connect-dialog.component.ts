import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { SubSink } from 'subsink';
import { WelcomeEventsService } from '../welcome-events.service';

@Component({
  selector: 'app-on-connect-dialog',
  templateUrl: './on-connect-dialog.component.html',
  styleUrls: ['./on-connect-dialog.component.scss']
})
export class OnConnectDialogComponent implements OnInit {

  @Input() currentBt: any;
  @Input() linkedBots: any;
  @Output() saveOnconnectEvent = new EventEmitter();
  welcomeTaskData: any = {};
  welcomeTaskPreviousData: any = {};

  subs = new SubSink();

  onConnectDialogForm: FormGroup;
  onConnectActiveTab: string = 'chat';

  conversations: any[] = [];
  automationBots: any[] = [];
  selectedUseCase: any;
  selectedBot: any;
  taskEnable: boolean;
  universalBot: string = 'universalbot';
  noFormchange : boolean = true;
  onConnectStr =  'AA_ON_CONNECT_EVENT';

  constructor(private service: ServiceInvokerService, private cdRef: ChangeDetectorRef,
    private welcomeEventService: WelcomeEventsService) { }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.subs.sink = this.welcomeEventService.welcomeEventData$.subscribe((data) => {
      if (data) {
        this.welcomeTaskData = data;
        this.welcomeTaskPreviousData = JSON.parse(JSON.stringify(this.welcomeEventService.formatWelcomeTaskData(this.welcomeTaskData)));
        this.updateUseCaseData();
        this.initOnConnectDialogForm(this.welcomeTaskData);
      }else{
        this.noFormchange = false;
      }
    });
  }

  initOnConnectDialogForm(welcomeTaskData) {
    this.onConnectDialogForm = new FormGroup({
      'name': new FormControl(this.onConnectStr, Validators.required),
      'enabled': new FormControl(welcomeTaskData[this.onConnectStr]?.enabled || false, Validators.required),
      [this.onConnectActiveTab]: new FormGroup(this.getOnConnectActiveTabFormGroup(welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]))
    });
    
    if(!(welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]?.enabled)){
      this.selectedUseCase = 'none';
      this.updateOnConnectValidators();
    }
    
   this.onConnectDialogForm.valueChanges.subscribe((data)=> {
    this.noFormchange = false;
   }); 
  }

  getUseCaseData(botId, update = true) {
    const params: any = {
      streamId: botId,
      search: '',
      filterby: '',
      status: '',
      usecaseType: 'dialog',
      offset: 0,
      parentBotId: (this.currentBt.type == this.universalBot) ? this.currentBt._id : null
    }
    this.subs.sink = this.service.invoke('get.LinkedBotUsecase', params, {})
      .subscribe((res) => {
        this.conversations = res.usecases;
        if (update) {
          this.updateTaskDetails(this.welcomeTaskData)
        }
      }, err => {
        this.conversations = [];
      });
  }

  // updating the welcome task and use case data after api call
  updateUseCaseData() {
    let botId = this.currentBt._id;
    if (this.currentBt.type == this.universalBot && this.welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]?.linkedBotId) {
      this.getUseCaseData(this.welcomeTaskData?.[this.onConnectStr][this.onConnectActiveTab]?.linkedBotId);
    } else if (this.currentBt.type == this.universalBot && !this.welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]?.linkedBotId) {
      this.updateTaskDetails(this.welcomeTaskData);
    } else if (this.currentBt.type != this.universalBot) {
      this.getUseCaseData(botId);
    }
  }
  updateWelcomeTaskData(data) {
    this.welcomeTaskData = data;
    this.updateTaskDetails(data);
  }

  // updating ngmodels in UI based on data from backend.
  updateTaskDetails(data, tabChange = false) {
    let welcomeTaskData = Object.assign({}, data);
    this.selectedBot = this.welcomeEventService.filterBotfromAutomationBotList(welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]?.linkedBotId, this.linkedBots, this.currentBt);
    if (this.currentBt.type == this.universalBot && tabChange && this.selectedBot?._id) {
      this.getUseCaseData(this.selectedBot._id);
    }
    if((welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]?.enabled)){
      this.selectedUseCase = this.welcomeEventService.filterUseCaseFromUseCaseList(welcomeTaskData?.[this.onConnectStr]?.[this.onConnectActiveTab]?.taskRefId, this.conversations, this.currentBt, this.selectedBot);
    }
  }


  // dropdown on change activities
  changeUseCase(conv, none = false) {
    this.selectedUseCase = none ? 'none' : Object.assign({}, conv);
    this.updateUsecaseFormData();
    this.updateOnConnectValidators();
    this.cdRef.detectChanges();
  }

  changeBot(bot) {
    if (this.selectedBot?._id != bot._id) {
      this.selectedUseCase = null;
      this.selectedBot = bot;
      this.getUseCaseData(bot._id, false);
      this.noFormchange = false;
      this.cdRef.detectChanges();
    }
  }

  changeOnConnectActiveTab(tab) {
    this.onConnectActiveTab = tab;
    this.selectedBot = null;
    this.selectedUseCase = null;
    this.updateTaskDetails(this.welcomeTaskData, true);
    this.initOnConnectDialogForm(this.welcomeTaskPreviousData)
  }

  updateUsecaseFormData() {
    let innerObject: any = this.welcomeEventService.formatOnconnectFormObject(this.selectedUseCase, this.selectedBot);
    this.onConnectDialogForm.patchValue({
      [this.onConnectActiveTab]: innerObject
    });
  }

  updateOnConnectValidators() {
    for (let key in (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls) {
      if (this.onConnectDialogForm.get('enabled').value && this.selectedUseCase != 'none') {
        let validatorList: any = [Validators.required];
        (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls[key].setValidators(validatorList);
      } else {
        (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls[key].clearValidators();
      }
      (this.onConnectDialogForm.controls[this.onConnectActiveTab] as FormGroup)?.controls[key].updateValueAndValidity();
    }
  }

  getOnConnectActiveTabFormGroup(data) {
    let activeTabGroup: any = this.welcomeEventService.getOnConnectActiveTabFormGroup(data);
    return activeTabGroup;
  }

  toggleOnConnectDialog(event) {
    this.onConnectDialogForm.patchValue({ enabled: event.target.checked });
    this.welcomeTaskData[this.onConnectStr].enabled = event.target.checked;
    this.updateOnConnectValidators();
  }

  toggleExtractIntents(event) {    
    this.onConnectDialogForm.get(this.onConnectActiveTab)?.get('extractIntents').patchValue(event.target.checked);    
  }

  cancelDialogTask() {
    this.updateTaskDetails(this.welcomeTaskPreviousData);
    this.initOnConnectDialogForm(this.welcomeTaskPreviousData);
    this.noFormchange = true;
  }

  saveDialogTask() {
    let payLoad = {
      events: [this.onConnectDialogForm.value]
    }
    this.noFormchange = true;
    this.saveOnconnectEvent.emit(payLoad);
  }

}
