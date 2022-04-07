import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AccountsDataService {
  private accountsData: Object = {};

  constructor() {
  }

  public setAccountsData(data: Object): any {
    this.accountsData = data;
  }

  public getAccountsData(): any {
    return this.accountsData || {};
  }
  public init() {
    
  }

}
