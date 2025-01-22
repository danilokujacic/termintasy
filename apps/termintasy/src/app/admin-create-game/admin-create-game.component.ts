import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-create-game',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-create-game.component.html',
  styleUrl: './admin-create-game.component.css',
})
export class AdminCreateGameComponent implements OnInit {
  players: any = [];
  selectedPlayers: any = [];
  gameDate = new FormControl('', [Validators.required]);
  minDate = new Date().toISOString().slice(0, 16);
  teamOnePlayers: any = [];
  teamTwoPlayers: any = [];
  step: 'SELECT_PLAYERS' | 'ORDER_PLAYERS' | 'SELECT_MATCH_DATE' =
    'SELECT_PLAYERS';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get(environment.apiUrl + '/player/all').subscribe((data) => {
      this.players = data;
    });

    this.http
      .get(environment.apiUrl + '/game/upcomming-game')
      .subscribe((data) => {
        if (data) {
          this.router.navigate(['admin/update-game']);
        }
      });
  }

  switchTeam(player: any, team: string) {
    if (team === 'teamOne') {
      this.teamTwoPlayers = this.teamTwoPlayers.filter(
        (el: any) => el.id !== player.id
      );
      this.teamOnePlayers = [...this.teamOnePlayers, player];
    }
    if (team === 'teamTwo') {
      this.teamOnePlayers = this.teamOnePlayers.filter(
        (el: any) => el.id !== player.id
      );
      this.teamTwoPlayers = [...this.teamTwoPlayers, player];
    }
  }

  isPlayerSelected(player: any) {
    return (
      this.selectedPlayers.findIndex((el: any) => el.id === player.id) !== -1
    );
  }

  submitGame() {
    this.http
      .post(environment.apiUrl + '/game', {
        gameDate: new Date(this.gameDate.value || '').toISOString(),
        homeTeam: {
          players: this.teamOnePlayers.map((player: any) => player.id),
        },
        awayTeam: {
          players: this.teamTwoPlayers.map((player: any) => player.id),
        },
      })
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

  confirmOrderPlayers() {
    this.step = 'SELECT_MATCH_DATE';
  }

  confirmSelectPlayers() {
    this.teamOnePlayers = this.selectedPlayers.slice(0, 6);
    this.teamTwoPlayers = this.selectedPlayers.slice(6, 12);
    this.step = 'ORDER_PLAYERS';
  }
  togglePlayer(player: any) {
    if (
      this.selectedPlayers.findIndex((el: any) => el.id === player.id) !== -1
    ) {
      this.selectedPlayers = this.selectedPlayers.filter(
        (el: any) => el.id !== player.id
      );
    } else {
      if (this.selectedPlayers.length === 12) return;
      this.selectedPlayers = [...this.selectedPlayers, player];
    }
  }
}
