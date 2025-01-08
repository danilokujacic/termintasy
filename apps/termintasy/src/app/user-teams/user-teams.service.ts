import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserTeamsService {
  constructor(private http: HttpClient) {}

  getTeams() {
    return this.http.get(environment.apiUrl + '/user-team/all');
  }
}
