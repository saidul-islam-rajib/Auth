import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private tost: NgToastService,
    private router: Router

  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = this.auth.getToken();
    if (userToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((err: any) => {
        if(err instanceof HttpErrorResponse){
          if(err.status == 401){
            this.tost.warning('Warning', 'Token Expired, please log again', 3000);
            this.router.navigate(['/login'])
          }
        }
        return throwError(() => new Error("Something went wrong!"))
      })
    );
  }
}
