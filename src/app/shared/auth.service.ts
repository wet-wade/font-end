import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/user';

const MOCK_USER: User = {
  id: 'first-user',
  name: 'John Doe',
  phone: '0123456789',
  username: 'john.doe',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: BehaviorSubject<User> = new BehaviorSubject(null);

  async login(username: string, password: string) {
    // do authentication here

    this.user.next(MOCK_USER);
  }

  get isAuthenticated() {
    return !!this.user.value;
  }

  async logout() {
    this.user.next(null);
  }
}
