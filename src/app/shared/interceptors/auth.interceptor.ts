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
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../models/user';

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '0123456789',
    username: 'john.doe',
    password: 'parola',
  },
  {
    id: '2',
    name: 'Peter Doe',
    phone: '0123456789',
    username: 'peter.doe',
    password: 'parola',
  },
  {
    id: '3',
    name: 'Vasyl Doe',
    phone: '0123456789',
    username: 'vasyl.doe',
    password: 'parola',
  },
];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
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
    );

    function handleRoute() {
      switch (true) {
        case url.endsWith('/auth/login') && method === 'POST':
          return authenticate();
        case url.endsWith('/auth/register') && method === 'POST':
          return register();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user = MOCK_USERS.find(
        (x) => x.username === username && x.password === password
      );
      if (!user) {
        return error('Username or password is incorrect');
      }
      return ok({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
        },
        token: 'fake-jwt-token',
      });
    }

    function register() {
      const user = body;

      if (MOCK_USERS.find((x) => x.username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }

      user.id = String(
        MOCK_USERS.length
          ? Math.max(...MOCK_USERS.map((x) => parseInt(x.id, 0))) + 1
          : 1
      );
      MOCK_USERS.push(user);

      return ok({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
        },
        token: 'fake-jwt-token',
      });
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
