import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";
import { ServiceCrudBase } from '@core/services/service.crud.base';

@Injectable({
  providedIn: 'root'
})
export class MapService extends ServiceCrudBase {

  constructor(public override http: HttpClient) {
    super(http);
    this.setEndpoint('images');
  }

  getRoads(): any {
    const fullUri = this.urlApi + "/roads";
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

  getPaletes(): any {
    const fullUri = this.urlApi + "/paletes";
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

  getImages(auditId: number): any {
    const fullUri = this.urlApi + "/list-by-audit/" + auditId;
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

  getImageById(imageId: number): any {
    const fullUri = this.urlApi + "/detail?id=" + imageId;
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

  upload(formData: FormData, auditId: number, road: string, palete: string): any {
    const fullUri = this.urlApi + `/add?audit_id=${auditId}&road=${road}&palete=${palete}`;
    return this.http.post<any>(fullUri, formData).pipe(
      map((result) => {
        return result;
      }),
      catchError((err) => {
        console.log(err);
        throw err;
      })
    );
  }

  getImagesWaitingConfirmation(auditId: number, road: string, palete: string): any {
    let fullUri = this.urlApi + "/list-waiting-confirmation/" + auditId;
    if (road || palete) {
      fullUri += `?`;

      if (road)
        fullUri += `road=${road}`;

      if (palete)
        fullUri += (road ? '&' : '') + `palete=${palete}`;
    }

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

  approvedImage(auditId: number, imageId: number): any {
    const fullUri = this.urlApi + `/approve-image?audit_id=${auditId}&image_id=${imageId}`;
    return this.http
      .patch<any>(fullUri, this.getHeaderJson())
      .pipe(
        map((result) => {
          return result;
        }),

        catchError(error => {
          throw error;
        })
      );
  }


  reprovedImage(imageId: number): any {
    const fullUri = this.urlApi + `/reprove-image?id=${imageId}`;
    return this.http
      .delete<any>(fullUri, this.getHeaderJson())
      .pipe(
        map((result) => {
          return result;
        }),

        catchError(error => {
          throw error;
        })
      );
  }

  manualCode(imageId: number, code: string): any {
    const fullUri = this.urlApi + `/manual-code?image_id=${imageId}&code=${code}`;
    return this.http
      .patch<any>(fullUri, this.getHeaderJson())
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
