import { createEmptyBoard, startingMarkForGame } from '../../core/game/game-engine';
import { Board, GameCount, GameRecord, Mark, TournamentStatus } from '../../core/models/tournament';

export interface TournamentState {
  readonly status: TournamentStatus;
  readonly playerNames: Readonly<Record<Mark, string>>;
  readonly totalGames: GameCount;
  /** 1-based number of the game currently on the board. */
  readonly currentGame: number;
  readonly board: Board;
  /** Cell indexes played in the current game, in order (feeds the move map on the results page). */
  readonly moveLog: readonly number[];
  readonly currentTurn: Mark;
  /** One record per completed game. Scores are derived from it, never stored twice. */
  readonly history: readonly GameRecord[];
}

export const initialTournamentState: TournamentState = {
  status: 'setup',
  playerNames: { X: '', O: '' },
  totalGames: 3,
  currentGame: 1,
  board: createEmptyBoard(),
  moveLog: [],
  currentTurn: startingMarkForGame(1),
  history: [],
};
