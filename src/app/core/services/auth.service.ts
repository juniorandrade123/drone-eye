import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

import { CookieService } from 'ngx-cookie-service'
import type { User } from '@/app/helper/fake-backend'
import { environment } from '@environment/environment'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null

  public readonly authSessionKey = '_AMC_AUTH_SESSION_KEY_'
  private cookieService = inject(CookieService);
  authenticationApi: string = environment.api + "users";

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>(this.authenticationApi + `/do-login`, { email, password }).pipe(
      map((user) => {
        if (user && user.access_token) {
          this.user = user
          this.saveSession(user.access_token);
        }
        return user;
      })
    )
  }

  logout(): void {
    this.removeSession()
    this.user = null
  }

  get session(): string {
    return this.cookieService.get(this.authSessionKey)
  }

  saveSession(token: string): void {
    this.cookieService.set(this.authSessionKey, token)
  }

  removeSession(): void {
    this.cookieService.delete(this.authSessionKey)
  }
}
