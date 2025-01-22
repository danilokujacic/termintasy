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
import { PlayerCardComponent } from '../player-card.component';
import { PlayerViewDrawerComponent } from '../player-view-drawer/player-view-drawer.component';

@Component({
  selector: 'app-team',
  imports: [
    CommonModule,
    LayoutComponent,
    PlayerCardComponent,
    PlayerViewDrawerComponent,
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
  initalPlayers = signal<any>({
    gk: null,
    def1: null,
    def2: null,
    mid: null,
    atk1: null,
    atk2: null,
  });
  teamCaptain = signal<number | null>(null);
  teamCaptainTemp = signal<number | null>(null);
  playerViewDrawer = signal(false);
  perks = signal<{
    tripleCaptain: number;
    wildcard: number;
    freehit: number;
  } | null>(null);
  playersDrawer = signal<boolean | string>(false);
  teamId = signal<string>('');
  teamPlayers = signal<any[]>([]);
  tripleCaptainActive = signal(false);
  freeHitActive = signal(false);
  wildCardActive = signal(false);
  captainMode = signal(false);
  activeGame = signal(true);
  transferComponent = signal(false);
  playerPosition = signal<null | string>(null);
  currentTeamPlayer = signal<number | null>(null);
  playersToTransfer = signal<[number, number][]>([]);
  teamPlayersToSend = signal<number[]>([]);
  previewPlayer = signal<any>(null);
  selectedPlayers = signal<string[]>([]);
  transfers = signal<number | null>(null);
  isOwner = signal(false);
  mapPosition = signal<string | null>(null);
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
  isNotTeamPlayer = computed(() => {
    return (
      !!this.teamPlayers()?.length &&
      this.teamPlayers().findIndex(
        (el) => el.id === this.previewPlayer()?.id
      ) !== -1
    );
  });
  teamName = signal('');
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private playersService: PlayersService
  ) {}

  onTransfer({ player, mapPos }: any) {
    this.closePlayerPreview();

    return this.queryPlayers(player.position, mapPos, player);
  }

  closePlayerPreview() {
    this.playerViewDrawer.set(false);
    this.previewPlayer.set(null);
  }
  closeDrawer() {
    this.playerPosition.set(null);
    this.playersDrawer.set(false);
  }

  toggleCaptain() {
    this.captainMode.set(true);
  }

  openPlayerPreview({ player, mapPos }: any) {
    this.previewPlayer.set({ id: player.id, mapPos });
    this.playerViewDrawer.set(true);
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
            this.activeGame.set(!!data?.game);
          });

        this.teamId.set(data.id);
        this.teamCaptain.set(data.captain.id);
        this.teamCaptainTemp.set(data.captain.id);
        this.tripleCaptainActive.set(data.tripleCaptainActive);
        this.perks.set({
          tripleCaptain: data.tripleCaptain,
          wildcard: data.wildCard,
          freehit: data.freeHit,
        });
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
        this.initalPlayers.set(players);
        this.teamName.set(data.name);
      });
  }

  setCaptain(id: number) {
    this.teamCaptainTemp.set(id);
  }

  toggleFreeHit() {
    this.freeHitActive.update((prevValue) => !prevValue);
  }
  toggleWildCard() {
    this.wildCardActive.update((prevValue) => !prevValue);
  }

  activateTripleCaptain() {
    return this.http
      .put(
        environment.apiUrl +
          '/user-team/' +
          this.teamId() +
          '/activate-triple-captain',
        null
      )
      .subscribe(() => {
        window.location.reload();
      });
  }
  deactivateTripleCaptain() {
    return this.http
      .put(
        environment.apiUrl +
          '/user-team/' +
          this.teamId() +
          '/deactivate-triple-captain',
        null
      )
      .subscribe(() => {
        window.location.reload();
      });
  }

  newCaptain(playerId: number) {
    return this.http
      .post(
        environment.apiUrl +
          '/user-team/' +
          this.teamId() +
          '/set-captain/' +
          playerId,
        null
      )
      .subscribe(() => {
        this.closePlayerPreview();
        this.teamCaptainTemp.set(playerId);
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
    this.playersDrawer.set(true);

    this.playerPosition.set(position);
    this.mapPosition.set(mapPosition);
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

    this.currentTeamPlayer.set(this.initalPlayers()[mapPosition]?.id);
  }

  makeTransfer() {
    const query = [
      ['wildCard', this.wildCardActive()],
      ['freeHit', this.freeHitActive()],
    ].filter(([_, queryParam]) => !!queryParam)[0];
    this.http
      .post(
        environment.apiUrl +
          '/user-team/' +
          this.teamId() +
          '/transfer-players' +
          (query ? `?${query[0]}=${query[1]}` : ''),
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
    this.mapPosition.set(null);

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
