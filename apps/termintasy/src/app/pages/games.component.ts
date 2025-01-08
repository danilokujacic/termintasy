import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
})
export class GamesComponent implements OnInit {
  games = signal<
    Array<{
      id: string;
      homeScore: number;
      awayScore: number;
      matchDate: string;
    }>
  >([]);
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.http.get(environment.apiUrl + '/game/all').subscribe((data: any) => {
      this.games.set(data);
    });
  }

  backToTable() {
    this.router.navigate(['']);
  }
  goToGame(gameId: string) {
    this.router.navigate(['games/' + gameId]);
  }
}
