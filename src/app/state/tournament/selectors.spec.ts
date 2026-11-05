
import { Board } from '../../core/models/tournament';
import * as TournamentSelectors from './selectors';
import { initialTournamentState, TournamentState } from './state';

const board = (layout: string): Board =>
  [...layout].map((cell) =>
    cell === 'X' || cell === 'O' ? cell : null,
  );

const state = (
  overrides: Partial<TournamentState> = {},
): TournamentState => ({
  ...initialTournamentState,
  status: 'playing',
  playerNames: { X: 'Bob', O: 'Alice' },
  totalGames: 3,
  ...overrides,
});

const midTournament = state({
  currentGame: 3,
  currentTurn: 'X',
  board: board('X.O......'),
  history: [
    {
      gameNumber: 1,
      startingMark: 'X',
      moves: [3, 0, 4, 1, 6, 2],
      outcome: {
        kind: 'win',
        winner: 'O',
        line: [0, 1, 2],
      },
    },
    {
      gameNumber: 2,
      startingMark: 'O',
      moves: [0, 1, 2, 4, 3, 5, 7, 6, 8],
      outcome: { kind: 'draw' },
    },
  ],
});

const rootState = (tournament: TournamentState) => ({ tournament });

describe('tournament selectors', () => {
  describe('base selectors', () => {
    it('selects tournament state properties', () => {
      const root = rootState(midTournament);
      expect(TournamentSelectors.getStatus(root)).toBe('playing');
      expect(TournamentSelectors.getPlayerNames(root)).toEqual({
        X: 'Bob',
        O: 'Alice',
      });
      expect(TournamentSelectors.getTotalGames(root)).toBe(3);
      expect(TournamentSelectors.getCurrentGame(root)).toBe(3);
      expect(TournamentSelectors.getBoard(root)).toEqual(midTournament.board);
      expect(TournamentSelectors.getCurrentTurn(root)).toBe('X');
      expect(TournamentSelectors.getHistory(root)).toEqual(midTournament.history);
    });
  });

  describe('derived selectors', () => {
    it('derives the players and current player', () => {
      expect(
        TournamentSelectors.getPlayers.projector({
          X: 'Bob',
          O: 'Alice',
        }),
      ).toEqual([
        { mark: 'X', name: 'Bob' },
        { mark: 'O', name: 'Alice' },
      ]);

      expect(
        TournamentSelectors.getCurrentPlayer.projector(
          { X: 'Bob', O: 'Alice' },
          'O',
        ),
      ).toEqual({
        name: 'Alice',
        mark: 'O',
      });
    });

    it('derives the current round state', () => {
      expect(
        TournamentSelectors.getRoundOutcome.projector(
          board('X.O......'),
        ),
      ).toBeNull();

      expect(
        TournamentSelectors.getIsRoundOver.projector(null),
      ).toBe(false);

      expect(
        TournamentSelectors.getIsRoundOver.projector({
          kind: 'draw',
        }),
      ).toBe(true);
    });

    it('exposes the winning line and round winner', () => {
      const outcome = {
        kind: 'win',
        winner: 'X',
        line: [2, 4, 6],
      } as const;

      expect(
        TournamentSelectors.getWinningLine.projector(outcome),
      ).toEqual([2, 4, 6]);

      expect(
        TournamentSelectors.getRoundWinner.projector(
          outcome,
          { X: 'Bob', O: 'Alice' },
        ),
      ).toEqual({
        name: 'Bob',
        mark: 'X',
      });

      expect(
        TournamentSelectors.getWinningLine.projector({
          kind: 'draw',
        }),
      ).toEqual([]);
    });

    it('knows when the last game is on the board', () => {
      expect(
        TournamentSelectors.getIsLastGame.projector(3, 3),
      ).toBe(true);

      expect(
        TournamentSelectors.getIsLastGame.projector(1, 3),
      ).toBe(false);
    });

    it('derives the score and standings', () => {
      const score = TournamentSelectors.getScore.projector(
        midTournament.history,
      );

      expect(score.draws).toBe(1);
      expect(score.wins).toEqual({
        X: 0,
        O: 1,
      });

      expect(
        TournamentSelectors.getStandings.projector(
          [
            { mark: 'X', name: 'Bob' },
            { mark: 'O', name: 'Alice' },
          ],
          score,
        ),
      ).toEqual([
        {
          player: { mark: 'X', name: 'Bob' },
          wins: 0,
        },
        {
          player: { mark: 'O', name: 'Alice' },
          wins: 1,
        },
      ]);
    });
  });

  describe('composed selectors', () => {
    it('builds the scoreboard view model', () => {
      expect(
        TournamentSelectors.getScoreboard(
          rootState(midTournament),
        ),
      ).toEqual({
        entries: [
          {
            player: { mark: 'X', name: 'Bob' },
            wins: 0,
            isActive: true,
          },
          {
            player: { mark: 'O', name: 'Alice' },
            wins: 1,
            isActive: false,
          },
        ],
        draws: 1,
        currentGame: 3,
        totalGames: 3,
        rounds: ['O', 'draw', 'pending'],
      });
    });

    it('declares the tournament winner or a tie', () => {
      expect(
        TournamentSelectors.getTournamentWinner(
          rootState(midTournament),
        ),
      ).toEqual({
        name: 'Alice',
        mark: 'O',
      });

      expect(
        TournamentSelectors.getTournamentWinner(
          rootState(state()),
        ),
      ).toBeNull();
    });

    it('summarises game history with starters, winners and a move map', () => {
      const [first, second] =
        TournamentSelectors.getGameHistory(
          rootState(midTournament),
        );

      expect(first).toMatchObject({
        gameNumber: 1,
        moveCount: 6,
        starter: { mark: 'X', name: 'Bob' },
        winner: { mark: 'O', name: 'Alice' },
      });

      expect(first.moveMap[0]).toEqual({
        mark: 'O',
        order: 2,
        isWinning: true,
      });

      expect(second).toMatchObject({
        gameNumber: 2,
        moveCount: 9,
        starter: { mark: 'O', name: 'Alice' },
        winner: null,
      });

      expect(
        second.moveMap.every(
          (cell) => cell.mark !== null && !cell.isWinning,
        ),
      ).toBe(true);
    });
  });
});
