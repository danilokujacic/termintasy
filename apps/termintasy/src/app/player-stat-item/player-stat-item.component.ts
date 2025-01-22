import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-player-stat-item',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-stat-item.component.html',
  styleUrl: './player-stat-item.component.css',
})
export class PlayerStatItemComponent implements OnInit {
  playerName = '';
  playerId = 0;
  goal = new FormControl(0, [Validators.min(0), Validators.max(255)]);
  assists = new FormControl(0, [Validators.min(0), Validators.max(255)]);
  cleanSheets = new FormControl(0, [Validators.min(0), Validators.max(255)]);
  saves = new FormControl(0, [Validators.min(0), Validators.max(255)]);
  playerSelect = new FormControl<number | null>(null);
  @Input() playersList: any = [];
  disableSavePlayer = false;

  @Output() playerRemove = new EventEmitter<number>();

  data = new FormGroup({
    goal: this.goal,
    assists: this.assists,
    cleanSheets: this.cleanSheets,
    saves: this.saves,
  });

  constructor(private http: HttpClient) {}

  @Input() gameId = '';

  @Input() set player(value: any) {
    if (!value || typeof value === 'number') {
      this.playerSelect.setValue(this.playersList[0].id);
      this.playerSelect.addValidators([Validators.required]);
      return;
    }

    this.goal.setValue(value.goals, { emitEvent: false });
    this.assists.setValue(value.assists, { emitEvent: false });
    this.cleanSheets.setValue(value.cleanSheets, { emitEvent: false });
    this.saves.setValue(value.saves, { emitEvent: false });
    this.playerName = value.name;
    this.playerId = value.id;
  }

  ngOnInit() {
    this.data.valueChanges.subscribe(() => {
      this.disableSavePlayer = false;
    });
    this.playerSelect.valueChanges.subscribe((data) => {
      if (!data) return;
      console.log(data, this.playersList);
      const player = this.playersList.find((el: any) => el.id === +data);
      this.playerName = player.name;
      this.playerId = player.id;
    });
  }

  removePlayer() {
    this.playerRemove.emit(this.playerId);
  }

  savePlayer() {
    this.disableSavePlayer = true;
    return this.http
      .post(
        environment.apiUrl +
          '/game/' +
          this.gameId +
          '/game-stat/' +
          this.playerId,
        {
          goal: this.goal.value!,
          assists: this.assists.value!,
          cleanSheet: this.cleanSheets.value!,
          saves: this.saves.value!,
        }
      )
      .subscribe();
  }
}
