import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-card',
  imports: [CommonModule],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  @Input() player: any;
  @Input() points?: number | null;
  @Input() captain: boolean;
  @Output() queryPlayers = new EventEmitter();

  onQueryPlayers() {
    this.queryPlayers.emit();
  }
}
