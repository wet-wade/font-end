import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  hasDevices: boolean = true;

  constructor(private router: Router, public authService: AuthService) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  ngOnInit(): void {}
}
