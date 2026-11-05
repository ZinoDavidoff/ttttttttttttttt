
import { TournamentSettings } from '../../core/models/tournament';
import { TournamentActions } from './actions';
import { tournamentReducer } from './reducer';
import { initialTournamentState, TournamentState } from './state';

const settings: TournamentSettings = {
  players: [
    { name: 'Alice', mark: 'O' },
    { name: 'Bob', mark: 'X' },
  ],
  totalGames: 3,
};

const play = (
  state: TournamentState,
  ...cells: number[]
): TournamentState =>
  cells.reduce(
    (current, index) =>
      tournamentReducer(current, TournamentActions.cellPlayed({ index })),
    state,
  );

const start = (): TournamentState =>
  tournamentReducer(
    initialTournamentState,
    TournamentActions.tournamentStarted({ settings }),
  );

describe('tournament reducer', () => {
  it('starts a tournament with players mapped by mark', () => {
    const state = start();

    expect(state.status).toBe('playing');
    expect(state.playerNames).toEqual({ X: 'Bob', O: 'Alice' });
    expect(state.totalGames).toBe(3);
    expect(state.currentTurn).toBe('X');
  });

  it('alternates turns and ignores moves on occupied cells', () => {
    let state = play(start(), 4);

    expect(state.board[4]).toBe('X');
    expect(state.currentTurn).toBe('O');

    state = play(state, 4);

    expect(state.currentTurn).toBe('O');
  });

  it('records a win in history and blocks further moves', () => {
    // X: 0, 1, 2 | O: 3, 4
    const state = play(start(), 0, 3, 1, 4, 2);

    expect(state.history).toEqual([
      {
        gameNumber: 1,
        startingMark: 'X',
        moves: [0, 3, 1, 4, 2],
        outcome: {
          kind: 'win',
          winner: 'X',
          line: [0, 1, 2],
        },
      },
    ]);

    expect(play(state, 8)).toBe(state);
  });

  it('records a draw', () => {
    // X O X
    // X O O
    // O X X
    const state = play(start(), 0, 1, 2, 4, 3, 5, 7, 6, 8);

    expect(state.history[0].outcome).toEqual({ kind: 'draw' });
  });

  it('ignores next game while the round is still running', () => {
    const state = play(start(), 0);

    expect(
      tournamentReducer(state, TournamentActions.nextGameRequested()),
    ).toBe(state);
  });

  it('resets the board and rotates the first player on the next game', () => {
    const won = play(start(), 0, 3, 1, 4, 2);

    const next = tournamentReducer(
      won,
      TournamentActions.nextGameRequested(),
    );

    expect(next.currentGame).toBe(2);
    expect(next.board.every((cell) => cell === null)).toBe(true);
    expect(next.moveLog).toEqual([]);
    expect(next.currentTurn).toBe('O');
  });

  it('finishes the tournament when results are requested after the last game', () => {
    const single = tournamentReducer(
      initialTournamentState,
      TournamentActions.tournamentStarted({
        settings: { ...settings, totalGames: 1 },
      }),
    );

    const won = play(single, 0, 3, 1, 4, 2);

    expect(tournamentReducer(won, TournamentActions.nextGameRequested())).toBe(won);
    expect(
      tournamentReducer(won, TournamentActions.resultsRequested()).status,
    ).toBe('finished');
  });

  it('ignores results requested before the last game is over', () => {
    const won = play(start(), 0, 3, 1, 4, 2);

    expect(tournamentReducer(won, TournamentActions.resultsRequested())).toBe(won);
  });

  it('resets to the initial state', () => {
    expect(
      tournamentReducer(start(), TournamentActions.tournamentReset()),
    ).toBe(initialTournamentState);
  });
});
