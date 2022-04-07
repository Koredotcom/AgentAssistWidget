import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class AgentAssistService {
  standardRespGroupList: any[] = [];

  usecases$ = new BehaviorSubject<any[]>(null);
  categories$ = new BehaviorSubject(<any[]>null);
  moreUCAvailable: boolean = false;
  isUCGrouped: boolean = false;

  constructor() { }

  setStandardRespGroup(list: any[]) {
    this.standardRespGroupList = list;
  }

  getStandardRespGroup() {
    return this.standardRespGroupList;
  }

  appendStandardResponseGroup(responseGroup) {
    this.standardRespGroupList.push(responseGroup);
  }

  updateStandardResponseGroup(responseGroup) {
    let index = _.findIndex(this.standardRespGroupList, { "id": responseGroup.id });
    if (index >= 0) {
      this.standardRespGroupList.splice(index, 1, responseGroup);
    }
  }

  appendStandardResponse(response) {
    let index = _.findIndex(this.standardRespGroupList, { "id": response.standardResponseGroupId });
    if (index >= 0) {
      this.standardRespGroupList[index]['responsesList'].push(response);
      this.standardRespGroupList[index]['totalStandardResponses'] = this.standardRespGroupList[index]['totalStandardResponses'] + 1;
    }
  }

  updateStandardResponse(response) {
    let index = _.findIndex(this.standardRespGroupList, { "id": response.standardResponseGroupId });
    if (index >= 0) {
      let index1 = _.findIndex(this.standardRespGroupList[index]['responsesList'], { "id": response.id });
      if (index1 >= 0) {
        this.standardRespGroupList[index]['responsesList'].splice(index1, 1, response);
      }
    }
  }

  deleteResponseGroup(id: string) {
    this.standardRespGroupList = this.standardRespGroupList.filter(val => val.id !== id);
  }

  deleteResponse(groupId, id) {
    let index = _.findIndex(this.standardRespGroupList, { "id": groupId });
    if (index >= 0) {
      let index1 = _.findIndex(this.standardRespGroupList[index]['responsesList'], { "id": id });
      if (index1 >= 0) {
        this.standardRespGroupList[index]['responsesList'] = this.standardRespGroupList[index]['responsesList'].filter(val => val.id !== id);
        console.log(this.standardRespGroupList, "?????");
        this.standardRespGroupList[index]['totalStandardResponses'] = this.standardRespGroupList[index]['totalStandardResponses'] - 1;

      }
    }
  }

  addUsecase(usecase) {
    const usecases = (this.usecases$.value || []);
    usecases.unshift(usecase);
    this.usecases$.next(usecases);

    if (this.isUCGrouped) this.categories$.next(null);
  }

  updateUsecase(usecase) {

    const usecases = this.usecases$.value || [];
    const index = usecases.findIndex(f => f['taskRefId'] === usecase.taskRefId);

    if (index !== -1) {
      usecases.splice(index, 1, usecase);
      this.usecases$.next(usecases);
    }

    if (this.isUCGrouped) this.categories$.next(null);

  }

  removeUsecase(usecase) {
    const usecases = this.usecases$.value || [];
    const updatedUCs = usecases.filter(f => f['taskRefId'] !== usecase.taskRefId);
    this.usecases$.next(updatedUCs);

    if (this.isUCGrouped) this.categories$.next(null);
  }
}
