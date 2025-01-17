import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../create-team/players.service';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-player-view-drawer',
  imports: [CommonModule, CountUpModule],
  templateUrl: './player-view-drawer.component.html',
  styleUrl: './player-view-drawer.component.css',
})
export class PlayerViewDrawerComponent {
  @Output() closeDrawer = new EventEmitter();
  @Output() makeCaptain = new EventEmitter();
  @Output() openTransfers = new EventEmitter();
  @Input() disableTransfer = false;
  @Input() enableTeamPlayer = false;
  @Input() teamCaptainId: number | null = null;
  player: any = {};
  loading = false;
  goals = 0;
  assists = 0;
  cleanSheets = 0;
  saves = 0;

  @Input() set open(value: boolean | string) {
    const drawer = document.getElementById('player-drawer-example');

    if (drawer) {
      if (value) {
        drawer.classList.remove('-translate-x-full');
      } else {
        drawer.classList.add('-translate-x-full');
      }
    }
  }
  _playerId: number | null = null;
  _mapPos: string | null = null;
  @Input() set selectedPlayer(value: { id: number; mapPos: string } | null) {
    if (!value) return;

    this.loading = true;
    this.playersService.getPlayer(value.id).subscribe((data: any) => {
      if (data.gameStats.length) {
        this.goals = data.gameStats.reduce(
          (acc: number, gs: any) => acc + gs.goal,
          0
        );
        this.assists = data.gameStats.reduce(
          (acc: number, gs: any) => acc + gs.assists,
          0
        );
        this.cleanSheets = data.gameStats.reduce(
          (acc: number, gs: any) => acc + gs.cleanSheet,
          0
        );
        this.saves = data.gameStats.reduce(
          (acc: number, gs: any) => acc + gs.saves,
          0
        );
      }
      this.loading = false;
      this.player = data;
    });

    this._playerId = value.id;
    this._mapPos = value.mapPos;
  }

  constructor(private playersService: PlayersService) {}

  onCaptainSelect() {
    this.makeCaptain.emit(this._playerId);
  }

  onTransfer() {
    this.openTransfers.emit({ player: this.player, mapPos: this._mapPos });
  }

  closeDrawerEmit() {
    this.closeDrawer.emit();
  }
}
