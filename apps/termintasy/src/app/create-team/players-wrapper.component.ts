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
  @Input() playerPosition!: string | boolean;
  constructor(private playersService: PlayersService) {
    this.players = playersService.playerState();
  }

  onClose(player: any) {
    this.closeChanges.emit({ player, position: this.playerPosition });
  }

  isSelected(player: any) {
    return this.selectedPlayers.find((el) => el === player.name);
  }
}
