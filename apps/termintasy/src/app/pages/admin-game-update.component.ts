import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplacePlayerDrawerComponent } from '../replace-player-drawer/replace-player-drawer.component';

@Component({
  selector: 'app-admin-game-update',
  imports: [CommonModule, ReactiveFormsModule, ReplacePlayerDrawerComponent],
  templateUrl: './admin-game-update.component.html',
  styleUrl: './admin-game-update.component.css',
})
export class AdminGameUpdateComponent implements OnInit {
  activeGame: any = null;
  playersDrawer = false;
  temporaryPlayer: any = null;
  loadingGame = false;
  gameDate = new FormControl<any>('', [Validators.required]);
  teamOnePlayers: any = [];
  teamTwoPlayers: any = [];
  minDate = new Date().toISOString().slice(0, 16);
  selectedPlayers: any = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadingGame = true;
    this.http
      .get(environment.apiUrl + '/game/upcomming-game')
      .subscribe((data: any) => {
        if (!data) {
          this.router.navigate(['']);
        }
        this.loadingGame = false;
        this.gameDate.setValue(data.matchDate.slice(0, 16));
        this.activeGame = data;
        this.teamOnePlayers = data.homeTeam.players;
        this.teamTwoPlayers = data.awayTeam.players;
        this.selectedPlayers = [
          ...data.awayTeam.players,
          ...data.homeTeam.players,
        ];
      });
  }

  replacePlayer(player: any) {
    console.log(player, this.temporaryPlayer);
    this.selectedPlayers = [
      ...this.selectedPlayers.filter(
        (player: any) => player.id !== this.temporaryPlayer.id
      ),
      player,
    ];
    if (
      this.teamOnePlayers.findIndex(
        (el: any) => el.id === this.temporaryPlayer.id
      ) !== -1
    ) {
      this.teamOnePlayers = [
        ...this.teamOnePlayers.filter(
          (player: any) => player.id !== this.temporaryPlayer.id
        ),
        player,
      ];
    }

    if (
      this.teamTwoPlayers.findIndex(
        (el: any) => el.id === this.temporaryPlayer.id
      ) !== -1
    ) {
      this.teamTwoPlayers = [
        ...this.teamTwoPlayers.filter(
          (player: any) => player.id !== this.temporaryPlayer.id
        ),
        player,
      ];
    }

    this.temporaryPlayer = null;
    this.playersDrawer = false;
  }
  closeDrawer() {
    this.playersDrawer = false;
    this.temporaryPlayer = null;
  }

  selectPlayer(event: any, player: any) {
    event.stopPropagation();
    event.preventDefault();

    this.temporaryPlayer = player;
    this.playersDrawer = true;
  }

  updateGame() {
    this.http
      .put(environment.apiUrl + '/game/' + this.activeGame.id, {
        gameDate: new Date(this.gameDate.value || '').toISOString(),
        homeTeam: {
          players: this.teamOnePlayers.map((player: any) => player.id),
        },
        awayTeam: {
          players: this.teamTwoPlayers.map((player: any) => player.id),
        },
      })
      .subscribe();
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
}
