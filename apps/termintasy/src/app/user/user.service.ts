import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = signal<any>(null);
  http = inject(HttpClient);

  me() {
    return this.http.get(environment.apiUrl + '/auth/me').pipe(
      tap((data) => {
        this.user.set(data);
      }),
      map((data) => data)
    );
  }
}
