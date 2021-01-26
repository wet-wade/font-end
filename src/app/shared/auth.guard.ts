import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthCanActivateGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  async canActivate() {
    await this.authService.authToken();
    if (this.authService.isAuthenticated) {
      return true;
    }
    this.router.navigate(['auth']);
    return false;
  }
}
