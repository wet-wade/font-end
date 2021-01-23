import { Injectable, Inject } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig, ModalEventType, ModalResolution } from '../interfaces';
import { ModalBuilder } from '../modal-builder';
import { ModalComponent } from '../modal-component/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalFactory {
  constructor(private modalService: NgbModal) {}

  createModal<T extends ModalResolution = ModalEventType>(config: ModalConfig): Promise<T> {
    return new Promise<T>((resolve) => {
      const modalOptions: NgbModalOptions = {
        ...(config.size !== 'sm' ? { size: config.size } : {}),
        backdrop: config.dismissable,
        keyboard: config.dismissable,
        centered: true,
        windowClass: config.backgroundClass || '',
        beforeDismiss: () => {
          resolve(ModalEventType.DISMISS as T);
          return true;
        },
      };
      const modalRef = this.modalService.open(ModalComponent, modalOptions);
      modalRef.componentInstance.cfg = config;

      modalRef.componentInstance.onClose = (resolution: T) => {
        resolve(resolution);
      };
    });
  }

  createConfirmationModal({
    content,
    title,
    button,
    eventHandler,
  }: {
    content: string;
    title?: string;
    button?: string;
    eventHandler?: any;
  }) {
    const modalConfig = new ModalBuilder()
      .setNeutralButton(button || 'Ok')
      .setContent(content)
      .setTitle(title || '')
      .setEventHandler(eventHandler)
      .create();

    return this.createModal(modalConfig);
  }
}
