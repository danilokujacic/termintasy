import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  playerState = signal<{
    loading: boolean;
    data: any;
  }>({
    loading: false,
    data: [],
  });
  constructor(private http: HttpClient) {}

  getPlayers(position?: 'GK' | 'ATK' | 'MID' | 'DEF') {
    return this.http.get(
      `${environment.apiUrl}/player/all${
        position ? '?position=' + position : ''
      }`
    );
  }

  getPlayer(id: number) {
    return this.http.get(environment.apiUrl + '/player/' + id);
  }

  createTeam(player: number[], teamName: string) {
    return this.http.post(environment.apiUrl + '/user-team/create-team', {
      players: player,
      name: teamName,
    });
  }
}
