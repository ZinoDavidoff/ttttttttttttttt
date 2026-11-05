import { Board, GameRecord } from '../models/tournament';
import {
  applyMove,
  buildMoveMap,
  createEmptyBoard,
  decideTournamentWinner,
  evaluateBoard,
  isValidMove,
  oppositeMark,
  startingMarkForGame,
  tallyScore,
} from './game-engine';

const board = (layout: string): Board =>
  [...layout].map((c) => (c === 'X' || c === 'O' ? c : null));

describe('game engine', () => {
  it('creates an empty 3x3 board', () => {
    expect(createEmptyBoard()).toEqual(Array(9).fill(null));
  });

  it('flips marks and alternates the starting mark per game', () => {
    expect(oppositeMark('X')).toBe('O');
    expect(oppositeMark('O')).toBe('X');
    expect([1, 2, 3, 4].map(startingMarkForGame)).toEqual(['X', 'O', 'X', 'O']);
  });

  describe('evaluateBoard', () => {
    it.each([
      ['XXX......', [0, 1, 2]],
      ['...OOO...', [3, 4, 5]],
      ['X..X..X..', [0, 3, 6]],
      ['..O..O..O', [2, 5, 8]],
      ['X...X...X', [0, 4, 8]],
      ['..O.O.O..', [2, 4, 6]],
    ])('detects a win on %s', (layout, line) => {
      const outcome = evaluateBoard(board(layout));
      expect(outcome).toEqual({ kind: 'win', winner: layout.replace(/\./g, '')[0], line });
    });

    it('detects a draw on a full board without a winner', () => {
      expect(evaluateBoard(board('XOXXOOOXX'))).toEqual({ kind: 'draw' });
    });

    it('returns null while the game is in progress', () => {
      expect(evaluateBoard(board('XO.......'))).toBeNull();
    });
  });

  describe('moves', () => {
    it('applies a valid move immutably', () => {
      const empty = createEmptyBoard();
      const next = applyMove(empty, 4, 'X');
      expect(next[4]).toBe('X');
      expect(empty[4]).toBeNull();
    });

    it('rejects occupied cells, out-of-range indexes and moves after the game is over', () => {
      expect(isValidMove(board('X........'), 0)).toBe(false);
      expect(isValidMove(createEmptyBoard(), 9)).toBe(false);
      const finished = board('XXX......');
      expect(applyMove(finished, 5, 'O')).toBe(finished);
    });
  });

  describe('scoring', () => {
    const history: GameRecord[] = [
      { gameNumber: 1, startingMark: 'X', moves: [0, 3, 1, 4, 2], outcome: { kind: 'win', winner: 'X', line: [0, 1, 2] } },
      { gameNumber: 2, startingMark: 'O', moves: [0, 1, 2, 4, 3, 5, 7, 6, 8], outcome: { kind: 'draw' } },
      { gameNumber: 3, startingMark: 'X', moves: [0, 1, 4, 2, 8], outcome: { kind: 'win', winner: 'X', line: [0, 4, 8] } },
    ];

    it('tallies wins and draws', () => {
      expect(tallyScore(history)).toEqual({ wins: { X: 2, O: 0 }, draws: 1 });
    });

    it('replays a game into a move map with order, marks and the winning line', () => {
      const map = buildMoveMap({
        gameNumber: 2,
        startingMark: 'O',
        moves: [4, 0, 2, 8, 6],
        outcome: { kind: 'win', winner: 'O', line: [2, 4, 6] },
      });
      expect(map[4]).toEqual({ mark: 'O', order: 1, isWinning: true });
      expect(map[0]).toEqual({ mark: 'X', order: 2, isWinning: false });
      expect(map[6]).toEqual({ mark: 'O', order: 5, isWinning: true });
      expect(map[1]).toEqual({ mark: null, order: null, isWinning: false });
    });

    it('decides the tournament winner or a tie', () => {
      expect(decideTournamentWinner({ wins: { X: 2, O: 1 }, draws: 0 })).toBe('X');
      expect(decideTournamentWinner({ wins: { X: 0, O: 1 }, draws: 2 })).toBe('O');
      expect(decideTournamentWinner({ wins: { X: 1, O: 1 }, draws: 1 })).toBeNull();
    });
  });
});
