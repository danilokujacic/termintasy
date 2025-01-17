import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from './players.service';

@Component({
  selector: 'app-players-wrapper',
  imports: [CommonModule],
  templateUrl: './players-wrapper.component.html',
  styleUrl: './players-wrapper.component.css',
})
export class PlayersWrapperComponent {
  players: any;
  @Output() closeChanges = new EventEmitter();
  @Input() selectedPlayers: Array<string | null>;
  @Output() closeDrawer = new EventEmitter();
  _position: string | null = null;
  @Input() set mapPosition(value: string | null) {
    this._position = value;
  }
  @Input() set position(value: string | null) {
    if (!value) return;

    this.playersService.getPlayers(value as any).subscribe((data) => {
      this.players = data;
    });
  }
  @Input() set open(value: boolean | string) {
    const drawer = document.getElementById('drawer-example');

    if (drawer) {
      if (value) {
        drawer.classList.remove('-translate-x-full');
      } else {
        drawer.classList.add('-translate-x-full');
      }
    }
  }
  @Input() playerPosition!: string | boolean;
  constructor(private playersService: PlayersService) {}

  onClose(player: any) {
    this.closeChanges.emit({ player, position: this._position });
  }

  closeDrawerEmit() {
    this.closeDrawer.emit();
  }

  isSelected(player: any) {
    return this.selectedPlayers.find((el) => el === player.name);
  }
}
