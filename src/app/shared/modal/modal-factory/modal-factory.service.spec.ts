import { TestBed, inject } from '@angular/core/testing';

import { ModalFactory } from './modal-factory.service';

describe('ModalFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalFactory],
    });
  });

  it('should be created', inject(
    [ModalFactory],
    (service: ModalFactory) => {
      expect(service).toBeTruthy();
    }
  ));
});
