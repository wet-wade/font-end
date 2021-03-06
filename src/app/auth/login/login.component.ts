import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ModalFactory } from 'src/app/shared/modal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  formGroup: FormGroup;
  usernameControl: FormControl;
  passwordControl: FormControl;

  async login() {
    const username = this.usernameControl.value;
    const password = this.passwordControl.value;
    await this.authService.login(username, password);
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    this.usernameControl = new FormControl('', [Validators.required]);
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]);
    this.formGroup = new FormGroup({
      username: this.usernameControl,
      password: this.passwordControl,
    });
  }
}
