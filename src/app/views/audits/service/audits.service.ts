import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";
import { ServiceCrudBase } from '@core/services/service.crud.base';

@Injectable({
  providedIn: 'root'
})
export class AuditsService extends ServiceCrudBase {

  constructor(public override http: HttpClient) {
    super(http);
    this.setEndpoint('audits');
  }

  getAudits(limit: number, offset: number): any {
    const fullUri = this.urlApi + `/list?limit=${limit}&offset=${offset}`;
    return this.http
      .get<any>(fullUri, this.getHeaderJson())
      .pipe(
        map((result) => {
          return result;
        }),

        catchError(error => {
          throw error;
        })
      );
  }

  getAuditById(id: number): any {
    const fullUri = this.urlApi + `/detail?id=${id}`;
    return this.http
      .get<any>(fullUri, this.getHeaderJson())
      .pipe(
        map((result) => {
          return result;
        }),

        catchError(error => {
          throw error;
        })
      );
  }
}
