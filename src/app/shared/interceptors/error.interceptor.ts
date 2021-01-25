import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {
  delay,
  mergeMap,
  materialize,
  dematerialize,
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
              if (e.error) {
                this.modalFactory.createConfirmationModal({
                  content: e.error.message,
                });
              }
            }
          )
        )
    );

    function handleRoute() {
      return next.handle(request);
    }

    // helper functions

    function ok(resBody?: any) {
      return of(new HttpResponse({ status: 200, body: resBody }));
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}
