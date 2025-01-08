import { Route } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { HomeComponent } from './pages/home.component';
import { GmailComponent } from './pages/openid/gmail.component';
import AuthGuard from './guards/auth.guard';
import TeamGuard from './guards/team.guard';
import { CreateTeamComponent } from './pages/create-team.component';
import { TeamComponent } from './pages/team.component';
import { GamesComponent } from './pages/games.component';
import { GameComponent } from './pages/game.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'oauth/gmail/redirect',
    component: GmailComponent,
  },
  {
    path: 'create-team',
    component: CreateTeamComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'team/:id',
    component: TeamComponent,
    canActivate: [AuthGuard, TeamGuard],
  },
  {
    path: 'games',
    component: GamesComponent,
    canActivate: [AuthGuard, TeamGuard],
  },
  {
    path: 'games/:id',
    component: GameComponent,
    canActivate: [AuthGuard, TeamGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard, TeamGuard],
  },
];
