import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError, switchMap, mergeMap } from "rxjs/operators";
import { ServiceBase } from "./service.base";
import { throwError } from "rxjs";
import { environment } from "@environment/environment";

export abstract class ServiceCrudBase extends ServiceBase {
  public urlApi: string = "";
  public serviceInUse: string = '';

  constructor(public http: HttpClient) {
    super();
  }

  public setEndpoint(endpoint: string) {
    this.urlApi = `${environment.api}${endpoint}`;
    this.serviceInUse = endpoint;
  }

  public add(obj: any): any {
    const fullUri = this.urlApi + "/add";
    return this.http
      .post(fullUri, JSON.stringify(obj), this.getHeaderJson())
      .pipe(
        map((rawList) => {
          return rawList;
        }),
        catchError(this.serviceError)
      );
  }

  public update(obj: any, id: number): any {
    const fullUri = this.urlApi + `/update?id=${id}`;
    return this.http
      .patch(fullUri, JSON.stringify(obj), this.getHeaderJson())
      .pipe(
        map((rawList) => {
          return rawList;
        }),
        catchError(this.serviceError)
      );
  }

  public delete(id: number) {
    const url = `${this.urlApi}/delete?id=${id}`;
    return this.http.delete<any>(url).pipe(
      map((result) => {
        return result;
      }),
      catchError(this.serviceError)
    );
  }

  public activateDisable(id: number) {
    const url = `${this.urlApi}/activateDisable`;
    return this.http.patch<any>(url, { id: id }).pipe(
      map((result) => {
        return result;
      }),
      catchError(this.serviceError)
    );
  }

  public getById(id: number): any {
    const url = `${this.urlApi}/GetById?Id=${id}`;
    return this.http.get(url, this.getHeaderJson()).pipe(
      map((rawList) => {
        return rawList;
      }),
      catchError(this.serviceError)
    );
  }

  public getAll(filter: any): any {
    const fullUri = this.urlApi + "/GetAll";
    return this.http
      .post<any>(fullUri, JSON.stringify(filter), this.getHeaderJson())
      .pipe(
        mergeMap((result) => {
          return result;
        }),

        catchError(error => {
          throw error;
        })
      );
  }

  public exportExcel(id: number, nameFile: string = "Planilha") {
    const fullUri = this.urlApi + `/export-xls?audit_id=${id}`;
    return this.http
      .post(fullUri, {}, {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      })
      .pipe(
        map((response) => {
          return {
            data: response.body,
            filename: `${nameFile}.xlsx`,
          };
        }),
        catchError((err) => {
          console.log(err);
          return throwError(err);
        })
      );
  }

  public exportPdf(objFilter: any, nameFile: string = "Documento") {
    const fullUri = this.urlApi + "/Export2Pdf";
    const preparedObject = JSON.stringify(objFilter);
    return this.http
      .post(fullUri, preparedObject, {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
      })
      .pipe(
        map((response) => {
          return {
            data: response.body,
            filename: `${nameFile}.pdf`,
          };
        }),
        catchError((err) => {
          console.log(err);
          return throwError(err);
        })
      );
  }
}
