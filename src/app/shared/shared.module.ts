import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal';
import { ModalContentDirective } from './modal/modal-content/modal-content.directive';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [ModalContentDirective, ModalComponent, NavbarComponent],
  entryComponents: [ModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent,
  ],
  providers: [],
})
export class SharedModule {}
