export type Mark = 'X' | 'O';
export const MARKS: readonly Mark[] = ['X', 'O'];

export type Cell = Mark | null;
export type Board = readonly Cell[];

export type GameCount = 1 | 3 | 5;
export const GAME_COUNT_OPTIONS: readonly GameCount[] = [1, 3, 5];

export type TournamentStatus = 'setup' | 'playing' | 'finished';

export interface Player {
  readonly name: string;
  readonly mark: Mark;
}

export type GameOutcome =
  | { readonly kind: 'win'; readonly winner: Mark; readonly line: readonly number[] }
  | { readonly kind: 'draw' };

export interface GameRecord {
  readonly gameNumber: number;
  readonly startingMark: Mark;
  readonly outcome: GameOutcome;
  /** Cell indexes in the order they were played; marks alternate starting with `startingMark`. */
  readonly moves: readonly number[];
}

export interface Score {
  readonly wins: Readonly<Record<Mark, number>>;
  readonly draws: number;
}

export interface TournamentSettings {
  readonly players: readonly [Player, Player];
  readonly totalGames: GameCount;
}

/* ---------- View models (shapes consumed by presentational components) ---------- */

export interface Standing {
  readonly player: Player;
  readonly wins: number;
}

export interface ScoreboardEntry extends Standing {
  readonly isActive: boolean;
}

/** Result of each game slot in the tournament: who won it, a draw, or not played yet. */
export type RoundMarker = Mark | 'draw' | 'pending';

export interface ScoreboardVm {
  readonly entries: readonly ScoreboardEntry[];
  readonly draws: number;
  readonly currentGame: number;
  readonly totalGames: number;
  readonly rounds: readonly RoundMarker[];
}

/** One cell of a finished game's miniature map. */
export interface MoveMapCell {
  readonly mark: Mark | null;
  /** 1-based move number, or `null` if the cell was never played. */
  readonly order: number | null;
  readonly isWinning: boolean;
}

export interface GameSummary {
  readonly gameNumber: number;
  readonly starter: Player;
  readonly winner: Player | null;
  readonly moveCount: number;
  readonly moveMap: readonly MoveMapCell[];
}
