import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "@environment/environment";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    authenticationApi: string = environment.api + "users";

    constructor(private http: HttpClient) { }

    login(obj: any) {
        const preparedObject = JSON.stringify(obj);
        return this.http
            .post<any>(this.authenticationApi + "/do-login", preparedObject, {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                }),
            })
            .pipe(
                map((userToken) => {
                    if (userToken) {
                        localStorage.setItem("user-active-by", userToken.access_token);
                        return { success: true };
                    } else {
                        return null;
                    }
                })
            );
    }

    logout() {
        localStorage.removeItem("user-active-by");
    }
}
