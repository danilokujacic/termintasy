import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user/user.service';
import { UserTeamsService } from '../user-teams/user-teams.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../layout/footer.component';
import { FcmService } from '../fcm.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  teams = signal<any>([]);
  constructor(
    private userTeams: UserTeamsService,
    private fcm: FcmService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userTeams.getTeams().subscribe((data) => {
      this.teams.set(data);
    });
  }

  goToGames() {
    this.router.navigate(['games']);
  }
  goToPlayers() {
    this.router.navigate(['players']);
  }

  handleTeam(team: any) {
    this.router.navigate(['team/' + team.id]);
  }
}
