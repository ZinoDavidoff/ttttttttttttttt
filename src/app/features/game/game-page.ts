import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TournamentSandbox } from '../../core/sandbox/tournament';
import { GameBoard } from './components/board';
import { RoundResult } from './components/round-result';
import { Scoreboard } from './components/scoreboard';

@Component({
  selector: 'app-game-page',
  imports: [AsyncPipe, GameBoard, Scoreboard, RoundResult],
  templateUrl: './game-page.html',
  styleUrl: './game-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePage {
  readonly sandbox = inject(TournamentSandbox);
}
