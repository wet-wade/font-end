import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  formGroup: FormGroup;
  nameControl: FormControl;
  usernameControl: FormControl;
  passwordControl: FormControl;
  phoneControl: FormControl;

  async register() {
    const username = this.usernameControl.value;
    const password = this.passwordControl.value;
    await this.authService.login(username, password);
    this.router.navigateByUrl('/');
  }

  ngOnInit(): void {
    this.nameControl = new FormControl('', [Validators.required]);
    this.phoneControl = new FormControl('', [Validators.required]);
    this.usernameControl = new FormControl('', [Validators.required]);
    this.passwordControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]);
    this.formGroup = new FormGroup({
      name: this.nameControl,
      phone: this.phoneControl,
      username: this.usernameControl,
      password: this.passwordControl,
    });
  }
}
