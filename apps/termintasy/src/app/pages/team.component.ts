import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LayoutComponent } from '../layout/layout.component';
import { UserService } from '../user/user.service';
import { PlayersWrapperComponent } from '../create-team/players-wrapper.component';
import { PlayersService } from '../create-team/players.service';
import { FooterComponent } from '../layout/footer.component';

@Component({
  selector: 'app-team',
  imports: [
    CommonModule,
    LayoutComponent,
    PlayersWrapperComponent,
    FooterComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
})
export class TeamComponent implements OnInit {
  players = signal<any>({
    gk: null,
    def1: null,
    def2: null,
    mid: null,
    atk1: null,
    atk2: null,
  });
  teamCaptain = signal<number | null>(null);
  teamCaptainTemp = signal<number | null>(null);
  playersDrawer = signal<boolean | string>(false);
  teamId = signal<string>('');
  teamPlayers = signal<any[]>([]);
  captainMode = signal(false);
  activeGame = signal(true);
  transferComponent = signal(false);
  currentTeamPlayer = signal<number | null>(null);
  playersToTransfer = signal<[number, number][]>([]);
  teamPlayersToSend = signal<number[]>([]);
  selectedPlayers = signal<string[]>([]);
  transfers = signal<number | null>(null);
  isOwner = signal(false);
  teamTransfers = computed(
    () =>
      (this.transfers() ?? 0) - this.playersToTransferTeamPlayersDif().length
  );
  playersToTransferTeamPlayersDif = computed(() =>
    this.playersToTransfer().filter(([_, transferPlayer]) => {
      return (
        this.teamPlayers().findIndex((el) => el.id === transferPlayer) === -1
      );
    })
  );
  teamName = signal('');
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private playersService: PlayersService
  ) {}

  toggleCaptain() {
    this.captainMode.set(true);
  }

  playerPoints(player: any) {
    const gameStats = player?.gameStats?.[0];

    return gameStats?.points || 0;
  }
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('id')),
        switchMap((id) =>
          this.http.get(environment.apiUrl + '/user-team/' + id)
        )
      )
      .subscribe((data: any) => {
        const players: any = {
          gk: null,
          def1: null,
          def2: null,
          mid: null,
          atk1: null,
          atk2: null,
        };

        this.userService.me().subscribe((user: any) => {
          this.isOwner.set(user.id === data.ownerId);
        });

        this.http
          .get(environment.apiUrl + '/game/active-game')
          .subscribe((data: any) => {
            this.activeGame.set(!!data.game);
          });

        this.teamId.set(data.id);
        this.teamCaptain.set(data.captain.id);
        this.teamCaptainTemp.set(data.captain.id);

        this.transfers.set(data.transfers);
        this.teamPlayers.set(data.players);
        data.players.forEach((player: any) => {
          if (player.position === 'GK') {
            players.gk = player;
          }
          if (player.position === 'DEF') {
            if (players.def1) {
              players.def2 = player;
            } else {
              players.def1 = player;
            }
          }
          if (player.position === 'MID') players.mid = player;
          if (player.position === 'ATK') {
            if (players.atk1) {
              players.atk2 = player;
            } else {
              players.atk1 = player;
            }
          }
        });
        this.players.set(players);
        this.teamName.set(data.name);
      });
  }

  setCaptain(id: number) {
    this.teamCaptainTemp.set(id);
  }

  newCaptain() {
    return this.http
      .post(
        environment.apiUrl +
          '/user-team/' +
          this.teamId() +
          '/set-captain/' +
          this.teamCaptainTemp(),
        null
      )
      .subscribe(() => {
        window.location.reload();
      });
  }

  queryPlayers(
    position: 'GK' | 'ATK' | 'MID' | 'DEF',
    mapPosition: 'gk' | 'def1' | 'def2' | 'mid' | 'atk1' | 'atk2',
    player: any
  ) {
    if (this.activeGame()) return;
    if (this.captainMode()) {
      return this.teamCaptainTemp.set(player.id);
    }
    if (!this.isOwner()) return;
    this.playersService.getPlayers(position).subscribe((data) => {
      this.playersService.playerState.set({ loading: false, data });
      this.playersDrawer.set(mapPosition);
    });

    this.playersToTransfer.update((prevState) =>
      prevState.filter(([_, transferPlayer]) => transferPlayer !== player.id)
    );

    const teamPlayers = Object.values(this.players());
    const playersDiff = this.playersToTransferTeamPlayersDif();
    const playersThatAreTransfered = this.teamPlayers().filter(
      (player) =>
        playersDiff.findIndex(
          ([teamPlayer, awayPlayer]) =>
            teamPlayer === player.id && awayPlayer === player.id
        ) !== -1
    );

    this.selectedPlayers.set([
      ...playersThatAreTransfered.map((player) => player.name),
      ...teamPlayers
        .filter((player) => !!player)
        .map((player: any) => player?.name),
      player.name,
    ]);

    this.currentTeamPlayer.set(player.id);
  }

  makeTransfer() {
    this.http
      .post(
        environment.apiUrl +
          '/user-team/' +
          this.teamId() +
          '/transfer-players',
        {
          players: this.playersToTransferTeamPlayersDif().map(
            ([teamPlayer]) => teamPlayer
          ),
          playersToReceive: this.playersToTransferTeamPlayersDif().map(
            ([_, transferPlayer]) => transferPlayer
          ),
        }
      )
      .subscribe(() => {
        window.location.reload();
      });
  }
  onSelect({ player, position }: any) {
    const currentPlayer = this.currentTeamPlayer()!;
    this.playersDrawer.set(false);

    this.playersToTransfer.update((prevState) => [
      ...prevState,
      [currentPlayer, player.id],
    ]);

    this.players.update((prevState) => ({
      ...prevState,
      [position]: { ...player },
    }));
  }
}
