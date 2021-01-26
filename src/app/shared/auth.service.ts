import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModalFactory } from './modal';
import { User } from './models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private modalFactory: ModalFactory
  ) {}

  user: BehaviorSubject<User> = new BehaviorSubject(null);

  async login(username: string, password: string) {
    const url = `${environment.apiUrl}/auth/login`;
    const body = {
      username,
      password,
    };

    const { user, token } = (await this.http.post(url, body).toPromise()) as {
      user: User;
      token: string;
    };
    this.cookieService.set('wet-token', token);
    this.user.next(user);
  }

  async register(
    name: string,
    username: string,
    phone: string,
    password: string
  ) {
    const url = `${environment.apiUrl}/auth/register`;
    const body = { name, username, phone, password };
    const { user, token } = (await this.http.post(url, body).toPromise()) as {
      user: User;
      token: string;
    };
    this.cookieService.set('wet-token', token);
    this.user.next(user);
  }

  get isAuthenticated() {
    return !!this.user.value;
  }

  async logout() {
    this.cookieService.delete('wet-token');
    this.user.next(null);
  }
}
