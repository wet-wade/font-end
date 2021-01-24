import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [LoginComponent],
  entryComponents: [],
  imports: [SharedModule, AuthRoutingModule],
  exports: [],
  providers: [],
})
export class AuthModule {}
