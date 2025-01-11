import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface Game {
  awayTeamScore: number;
  homeTeamScore: number;
  awayTeamPlayers: { name: string; id: number }[];
  homeTeamPlayers: { name: string; id: number }[];
}

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  game = signal<Game | null>(null);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      this.http
        .get<any>(environment.apiUrl + '/game/' + id)
        .subscribe((data) => {
          this.game.set({
            awayTeamScore: data.awayScore,
            homeTeamScore: data.homeScore,
            awayTeamPlayers: data.awayTeam.players,
            homeTeamPlayers: data.homeTeam.players,
          });
        });
    });
  }

  goToPlayer(id: number) {
    this.router.navigate(['/players/' + id]);
  }
}
