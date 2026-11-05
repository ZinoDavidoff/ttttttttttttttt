import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TournamentSettings } from '../models/tournament';
import { TournamentActions, TournamentSelectors } from '../../state/tournament';

/**
 * Facade between the UI and the store. Pages inject only this class:
 * they read state through the `$` streams and change it through the methods.
 */
@Injectable()
export class TournamentSandbox {
  private readonly store = inject(Store);

  /* ---------- State streams ---------- */

  readonly status$ = this.store.select(TournamentSelectors.getStatus);
  readonly board$ = this.store.select(TournamentSelectors.getBoard);
  readonly currentPlayer$ = this.store.select(TournamentSelectors.getCurrentPlayer);
  readonly currentGame$ = this.store.select(TournamentSelectors.getCurrentGame);
  readonly winningLine$ = this.store.select(TournamentSelectors.getWinningLine);
  readonly isRoundOver$ = this.store.select(TournamentSelectors.getIsRoundOver);
  readonly roundWinner$ = this.store.select(TournamentSelectors.getRoundWinner);
  readonly isLastGame$ = this.store.select(TournamentSelectors.getIsLastGame);
  readonly score$ = this.store.select(TournamentSelectors.getScore);
  readonly standings$ = this.store.select(TournamentSelectors.getStandings);
  readonly scoreboard$ = this.store.select(TournamentSelectors.getScoreboard);
  readonly tournamentWinner$ = this.store.select(TournamentSelectors.getTournamentWinner);
  readonly gameHistory$ = this.store.select(TournamentSelectors.getGameHistory);

  /* ---------- Commands ---------- */

  startTournament(settings: TournamentSettings): void {
    this.store.dispatch(TournamentActions.tournamentStarted({ settings }));
  }

  playCell(index: number): void {
    this.store.dispatch(TournamentActions.cellPlayed({ index }));
  }

  nextGame(): void {
    this.store.dispatch(TournamentActions.nextGameRequested());
  }

  showResults(): void {
    this.store.dispatch(TournamentActions.resultsRequested());
  }

  playAgain(): void {
    this.store.dispatch(TournamentActions.tournamentReset());
  }
}
