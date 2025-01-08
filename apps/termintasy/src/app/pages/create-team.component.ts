import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';
import { PlayersService } from '../create-team/players.service';
import { PlayersWrapperComponent } from '../create-team/players-wrapper.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-team',
  imports: [
    CommonModule,
    LayoutComponent,
    PlayersWrapperComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.css',
})
export class CreateTeamComponent {
  playersDrawer = signal<boolean | string>(false);
  players = signal<any>({
    gk: null,
    def1: null,
    def2: null,
    mid: null,
    atk1: null,
    atk2: null,
  });

  teamName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(255),
  ]);
  constructor(private playersService: PlayersService, private router: Router) {}

  queryPlayers(
    position: 'GK' | 'ATK' | 'MID' | 'DEF',
    mapPosition: 'gk' | 'def1' | 'def2' | 'mid' | 'atk1' | 'atk2'
  ) {
    this.playersService.getPlayers(position).subscribe((data) => {
      this.playersService.playerState.set({ loading: false, data });
      this.playersDrawer.set(mapPosition);
    });
  }

  onSelect({ player, position }: any) {
    this.playersDrawer.set(false);
    this.players.update((prevState) => ({ ...prevState, [position]: player }));
  }

  confirm() {
    const players = Object.values(this.players()).map(
      (player: any) => player.id
    );
    const teamName = this.teamName.value;

    this.playersService.createTeam(players, teamName || '').subscribe(() => {
      this.router.navigate(['']);
    });
  }

  get playersValues(): any {
    return Object.values(this.players())
      .filter((player) => !!player)
      .map((player: any) => player.name);
  }

  get canConfirm() {
    console.log(
      Object.values(this.players()),
      Object.values(this.players()).findIndex((el) => !el),
      this.teamName.valid
    );
    return (
      Object.values(this.players()).findIndex((el) => !el) === -1 &&
      this.teamName.valid
    );
  }
}
