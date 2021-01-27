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
import { GroupMember, User } from '../models/user';
import { CookieService } from 'ngx-cookie-service';

export const MOCK_USERS: (GroupMember & { password: string; jwt: string })[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '0123456789',
    username: 'john.doe',
    password: 'parola',
    jwt: 'jwt-1',
  } as GroupMember & { password: string; jwt: string },
  {
    id: '2',
    name: 'Peter Doe',
    phone: '0123456789',
    username: 'peter.doe',
    password: 'parola',
    jwt: 'jwt-2',
  } as GroupMember & { password: string; jwt: string },
  {
    id: '3',
    name: 'Vasyl Doe',
    phone: '0123456789',
    username: 'vasyl.doe',
    password: 'parola',
    jwt: 'jwt-3',
  } as GroupMember & { password: string; jwt: string },
];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    const jwt = this.cookieService.get('wet-token');
    // wrap in delayed observable to simulate server api call
    return (
      of(null)
        .pipe(mergeMap(handleRoute.bind(this, jwt)))
        // call materialize and dematerialize to ensure delay
        //  (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize())
    );

    function handleRoute(token: string) {
      // pass through any requests not handled above
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `JWT ${token}`),
      });
      return next.handle(authReq);
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user: any = MOCK_USERS.find(
        (x) => (x as any).username === username && x.password === password
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
        token: user.jwt,
      });
    }

    function authToken() {
      const token = body.token;
      const user = MOCK_USERS.find((x) => x.jwt === token);
      return ok({ user });
    }

    function register() {
      const user = body;

      if (MOCK_USERS.find((x) => (x as any).username === user.username)) {
        return error('Username "' + user.username + '" is already taken');
      }

      user.id = String(
        MOCK_USERS.length
          ? Math.max(...MOCK_USERS.map((x) => parseInt(x.id, 0))) + 1
          : 1
      );
      user.jwt = 'jwt-' + user.id;
      MOCK_USERS.push(user);

      return ok({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          phone: user.phone,
        },
        token: user.jwt,
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
