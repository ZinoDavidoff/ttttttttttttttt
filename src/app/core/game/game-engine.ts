import { Board, Cell, GameOutcome, GameRecord, Mark, MoveMapCell, Score } from '../models/tournament';

export const BOARD_SIZE = 9;

export const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard(): Board {
  return Array<Cell>(BOARD_SIZE).fill(null);
}

export function oppositeMark(mark: Mark): Mark {
  return mark === 'X' ? 'O' : 'X';
}

/** X opens odd games, O opens even games, so the first move alternates every game. */
export function startingMarkForGame(gameNumber: number): Mark {
  return gameNumber % 2 === 1 ? 'X' : 'O';
}

/** Returns the outcome of the board, or `null` while the game is still in progress. */
export function evaluateBoard(board: Board): GameOutcome | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { kind: 'win', winner: mark, line };
    }
  }
  return board.every((cell) => cell !== null) ? { kind: 'draw' } : null;
}

export function isValidMove(board: Board, index: number): boolean {
  return (
    Number.isInteger(index) &&
    index >= 0 &&
    index < BOARD_SIZE &&
    board[index] === null &&
    evaluateBoard(board) === null
  );
}

/** Returns a new board with the move applied, or the same board reference if the move is invalid. */
export function applyMove(board: Board, index: number, mark: Mark): Board {
  if (!isValidMove(board, index)) {
    return board;
  }
  return board.map((cell, i) => (i === index ? mark : cell));
}

/** Rebuilds a finished game cell by cell: which mark sits where, when it was played, and whether it is on the winning line. */
export function buildMoveMap({ moves, startingMark, outcome }: GameRecord): readonly MoveMapCell[] {
  const winningLine = outcome.kind === 'win' ? outcome.line : [];
  return Array.from({ length: BOARD_SIZE }, (_, cell): MoveMapCell => {
    const turn = moves.indexOf(cell);
    if (turn < 0) {
      return { mark: null, order: null, isWinning: false };
    }
    return {
      mark: turn % 2 === 0 ? startingMark : oppositeMark(startingMark),
      order: turn + 1,
      isWinning: winningLine.includes(cell),
    };
  });
}

export function tallyScore(history: readonly GameRecord[]): Score {
  return history.reduce<Score>(
    (score, { outcome }) =>
      outcome.kind === 'draw'
        ? { ...score, draws: score.draws + 1 }
        : { ...score, wins: { ...score.wins, [outcome.winner]: score.wins[outcome.winner] + 1 } },
    { wins: { X: 0, O: 0 }, draws: 0 },
  );
}

/** The mark with more wins takes the tournament; equal wins means a tie (`null`). */
export function decideTournamentWinner(score: Score): Mark | null {
  if (score.wins.X === score.wins.O) {
    return null;
  }
  return score.wins.X > score.wins.O ? 'X' : 'O';
}
