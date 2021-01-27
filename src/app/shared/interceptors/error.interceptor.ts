import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  delay,
  dematerialize,
  materialize,
  mergeMap,
  tap,
} from 'rxjs/operators';
import { ModalFactory } from '../modal';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private modalFactory: ModalFactory) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return (
      of(null)
        .pipe(mergeMap(handleRoute))
        // call materialize and dematerialize to ensure delay
        //  (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize())
        .pipe(
          tap(
            () => {},
            (e) => {
              console.log(e);
              if (e.error) {
                this.modalFactory.createConfirmationModal({
                  content: e.error.error,
                });
              }
            }
          )
        )
    );

    function handleRoute() {
      return next.handle(request);
    }
  }
}
