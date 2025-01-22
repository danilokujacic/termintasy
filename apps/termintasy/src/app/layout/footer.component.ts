import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  user = signal<any>(null);
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.me().subscribe((user) => {
      this.user.set(user);
    });
  }

  get admin() {
    return this.userService.user().admin;
  }
  isRouteActive(route: string) {
    return this.router.url === route;
  }
  goTo(route: string) {
    return this.router.navigate([route]);
  }
  extractTeamId(url: string): string {
    // Extract the :id from the /team/:id route, assuming the format is /team/{id}
    const parts = url.split('/');
    return parts[parts.length - 1]; // Get the last part after `/team/`
  }
  isUserTeamRoute() {
    return (
      this.router.url.startsWith('/team/') &&
      this.extractTeamId(this.router.url) === this.user()?.userTeam?.id
    );
  }
}
