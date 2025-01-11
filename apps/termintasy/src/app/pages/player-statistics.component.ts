import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { FooterComponent } from '../layout/footer.component';

@Component({
  selector: 'app-player-statistics',
  imports: [CommonModule, FooterComponent],
  templateUrl: './player-statistics.component.html',
  styleUrl: './player-statistics.component.css',
})
export class PlayerStatisticsComponent implements OnInit {
  players = signal<any>([]);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http
      .get(environment.apiUrl + '/player/all?withPickrate=true')
      .subscribe((players) => {
        this.players.set(players);
      });
  }

  goToPlayer(player: any) {
    this.router.navigate(['players/' + player.id]);
  }
}
