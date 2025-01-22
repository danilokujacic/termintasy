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
import { PlayerStatisticsComponent } from './pages/player-statistics.component';
import { PlayerComponent } from './pages/player.component';
import { AdminPageComponent } from './pages/admin-page.component';
import { AdminCreateGameComponent } from './admin-create-game/admin-create-game.component';
import AdminGuard from './guards/admin.guard';
import { AdminGameUpdateComponent } from './pages/admin-game-update.component';

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
    path: 'admin',

    children: [
      {
        path: '',
        component: AdminPageComponent,
        canActivate: [AuthGuard, TeamGuard, AdminGuard],
      },
      {
        path: 'create-game',
        component: AdminCreateGameComponent,
        canActivate: [AuthGuard, TeamGuard, AdminGuard],
      },
      {
        path: 'update-game',
        component: AdminGameUpdateComponent,
        canActivate: [AuthGuard, TeamGuard, AdminGuard],
      },
    ],
  },

  {
    path: 'games',
    component: GamesComponent,
    canActivate: [AuthGuard, TeamGuard],
  },
  {
    path: 'players',
    component: PlayerStatisticsComponent,
    canActivate: [AuthGuard, TeamGuard],
  },
  {
    path: 'players/:id',
    component: PlayerComponent,
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
