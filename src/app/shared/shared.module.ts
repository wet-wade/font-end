import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionButtonComponent } from './action-button/action-button.component';
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
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NavbarComponent,
    ActionButtonComponent,
  ],
  providers: [],
})
export class SharedModule {}
