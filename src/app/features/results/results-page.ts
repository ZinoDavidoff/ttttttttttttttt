import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlayerSymbolPipe } from '../../shared/pipes/player-symbol';
import { TournamentSandbox } from '../../core/sandbox/tournament';
import { GameHistory } from './components/game-history';

@Component({
  selector: 'app-results-page',
  imports: [AsyncPipe, PlayerSymbolPipe, GameHistory],
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsPage {
  readonly sandbox = inject(TournamentSandbox);
}
