import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

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
    this.cookieService.set('wet-token', token, null, '/');
    this.user.next(user);
  }

  async authToken() {
    if (this.isAuthenticated) {
      console.log('is already authenticated');
      return;
    }
    const token = this.cookieService.get('wet-token');
    if (!token) {
      console.log('there is no token');
      return;
    }

    const url = `${environment.apiUrl}/auth/token`;
    const user = (await this.http.post(url, { token }).toPromise()) as {
      user: User;
    };

    console.log('new user', token, user);
    if (user) {
      this.user.next(user.user as User);
    }
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
    this.cookieService.set('wet-token', token, null, '/');
    this.user.next(user);
  }

  get isAuthenticated() {
    return !!this.user.value;
  }

  async logout() {
    this.cookieService.delete('wet-token', '/');
    this.user.next(null);
  }
}
