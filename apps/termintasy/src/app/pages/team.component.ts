import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-team',
  imports: [CommonModule, LayoutComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnInit {
  players = signal<any>({
    gk: null,
    def1: null,
    def2: null,
    mid: null,
    atk1: null,
    atk2: null,
  });
  teamName = signal('');
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  playerPoints(player: any) {
    const gameStats = player.gameStats[0];

    return gameStats?.points || 0;
  }
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id) =>
          this.http.get(environment.apiUrl + '/user-team/' + id)
        )
      )
      .subscribe((data: any) => {
        const players: any = {
          gk: null,
          def1: null,
          def2: null,
          mid: null,
          atk1: null,
          atk2: null,
        };
        data.players.forEach((player: any) => {
          if (player.position === 'GK') {
            players.gk = player;
          }
          if (player.position === 'DEF') {
            if (players.def1) {
              players.def2 = player;
            } else {
              players.def1 = player;
            }
          }
          if (player.position === 'MID') players.mid = player;
          if (player.position === 'ATK') {
            if (players.atk1) {
              players.atk2 = player;
            } else {
              players.atk1 = player;
            }
          }
        });
        this.players.set(players);
        this.teamName.set(data.name);
      });
  }
}
