import { throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export abstract class ServiceBase {
  protected getHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  protected getHeaderJsonWithBody(body: any) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body,
    };
  }

  protected extractedData(response: any) {
    return response.dados || {};
  }

  protected serviceError(error: Response | any) {
    return throwError(error);
  }
}
