import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';

export function tokenInterceptor(
  req: any,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  if (!token) {
    router.navigate(['login']);

    return next(req);
  }

  // Clone the request and set the Authorization header
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401 Unauthorized response
      if (error.status === 403) {
        // Remove token from session storage
        sessionStorage.removeItem('token');

        // Redirect to login page
        router.navigate(['login']);
      }
      // Rethrow the error so it can be handled elsewhere if needed
      throw error;
    })
  );
}
