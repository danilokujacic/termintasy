import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs';

@Component({
  selector: 'app-replace-player-drawer',
  imports: [CommonModule],
  templateUrl: './replace-player-drawer.component.html',
  styleUrl: './replace-player-drawer.component.css',
})
export class ReplacePlayerDrawerComponent {
  playersList: any = [];
  @Output() playerSelect = new EventEmitter();
  @Output() closeDrawer = new EventEmitter();
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
  @Input() set selectedPlayers(value: any[]) {
    this.http
      .get(environment.apiUrl + '/player/all')
      .pipe(
        map((players: any) =>
          players.filter(
            (player: any) =>
              value.findIndex((el: any) => el.id === player.id) === -1
          )
        )
      )
      .subscribe((data) => {
        this.playersList = data;
      });
  }

  constructor(private http: HttpClient) {}

  onPlayerSelect(player: any) {
    this.playerSelect.emit(player);
    this.closeDrawer.emit();
  }
  onClose(player?: any) {
    this.closeDrawer.emit(player);
  }
}
