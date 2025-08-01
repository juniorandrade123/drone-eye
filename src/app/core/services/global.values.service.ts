import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalValuesService {
  private showMainMenuSource = new BehaviorSubject<boolean>(false);
  showMainMenu = this.showMainMenuSource.asObservable();

  private applicationPageLoadingSource = new BehaviorSubject<boolean>(false);
  applicationPageLoading = this.applicationPageLoadingSource.asObservable();
  loading = false;

  constructor() { }

  setLoading(loading: boolean) {
    this.loading = loading;
    this.applicationPageLoadingSource.next(loading);
  }

  getLoading() {
    return this.loading;
  }
}
