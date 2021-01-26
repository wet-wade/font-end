import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ActionButtonComponent } from './action-button/action-button.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { GroupsInterceptor } from './interceptors/groups.interceptor';
import { MaterialModule } from './material.module';
import { ModalComponent } from './modal';
import { ModalContentDirective } from './modal/modal-content/modal-content.directive';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    ModalContentDirective,
    ModalComponent,
    NavbarComponent,
    ActionButtonComponent,
  ],
  entryComponents: [ModalComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NavbarComponent,
    ActionButtonComponent,
  ],
  providers: [
    CookieService,
    {
      // use fake backend in place of Http service for backend-less development
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      // use fake backend in place of Http service for backend-less development
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      // use fake backend in place of Http service for backend-less development
      provide: HTTP_INTERCEPTORS,
      useClass: GroupsInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
