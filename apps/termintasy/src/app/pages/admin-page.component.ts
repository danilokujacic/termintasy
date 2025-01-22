import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PlayerStatItemComponent } from '../player-stat-item/player-stat-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  imports: [CommonModule, ReactiveFormsModule, PlayerStatItemComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent implements OnInit {
  activeGame: any = null;

  homeTeamScore = new FormControl(0, [Validators.min(0), Validators.max(255)]);
  awayTeamScore = new FormControl(0, [Validators.min(0), Validators.max(255)]);
  players: any = [];
  allPlayers: any = [];
  generating = false;

  promptControl = new FormControl('', [
    Validators.required,
    Validators.minLength(0),
    Validators.maxLength(255),
  ]);
  constructor(private http: HttpClient, private router: Router) {}

  generatePlayerContent() {
    this.generating = true;
    return this.http
      .post(environment.apiUrl + '/game/generate-player-stats', {
        prompt: this.promptControl.value || '',
      })
      .subscribe((data: any) => {
        this.generating = false;

        this.players = data.players.filter((player: any) => !!player.id);
      });
  }

  getAvailablePlayers() {
    return this.allPlayers.filter(
      (player: any) =>
        this.players.findIndex((el: any) => el.id === player.id) === -1
    );
  }
  removePlayer(id: number) {
    this.players = this.players.filter((player: any) => player.id !== id);
  }
  addNewPlayerStat() {
    this.players = [
      ...this.players,
      { id: null, goal: 0, assists: 0, played: true, saves: 0, cleanSheet: 0 },
    ];
  }

  sumarizeResults() {
    this.http
      .post(
        environment.apiUrl + '/game/' + this.activeGame.id + '/summarize',
        null
      )
      .subscribe((game) => {
        this.activeGame = game;
      });
  }
  endGame() {
    this.http
      .delete(environment.apiUrl + '/game/' + this.activeGame.id + '/end')
      .subscribe((game) => {
        this.activeGame = game;
      });
  }

  updateScore(team: 'homeScore' | 'awayScore', score: number) {
    if (!score) return;
    return this.http
      .put(
        environment.apiUrl + '/game/' + this.activeGame.id + '/update-score',
        {
          type: team,
          score,
        }
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.http.get(environment.apiUrl + '/player/all').subscribe((data) => {
      this.allPlayers = data;
    });
    this.homeTeamScore.valueChanges
      .pipe(debounceTime(300))
      .subscribe((data) => {
        this.updateScore('homeScore', data || 0);
      });
    this.awayTeamScore.valueChanges
      .pipe(debounceTime(300))
      .subscribe((data) => {
        this.updateScore('awayScore', data || 0);
      });

    this.http
      .get(environment.apiUrl + '/game/active-game')
      .subscribe((data: any) => {
        if (!data) {
          this.router.navigate(['/admin/create-game']);
        } else {
          this.activeGame = data;
          this.homeTeamScore.setValue(data.homeScore, { emitEvent: false });
          this.awayTeamScore.setValue(data.awayScore, { emitEvent: false });
        }
      });
  }
}
