import { createReducer, on } from '@ngrx/store';
import {
  applyMove,
  createEmptyBoard,
  evaluateBoard,
  oppositeMark,
  startingMarkForGame,
} from '../../core/game/game-engine';
import { Mark, Player } from '../../core/models/tournament';
import { TournamentActions } from './actions';
import { initialTournamentState } from './state';

const toPlayerNames = (players: readonly Player[]): Record<Mark, string> =>
  Object.fromEntries(players.map(({ mark, name }) => [mark, name])) as Record<Mark, string>;

export const tournamentReducer = createReducer(
  initialTournamentState,

  on(TournamentActions.tournamentStarted, (_, { settings }) => ({
    ...initialTournamentState,
    status: 'playing' as const,
    playerNames: toPlayerNames(settings.players),
    totalGames: settings.totalGames,
  })),

  on(TournamentActions.cellPlayed, (state, { index }) => {
    if (state.status !== 'playing') return state;

    const board = applyMove(state.board, index, state.currentTurn);

    if (board === state.board) return state;

    const moveLog = [...state.moveLog, index];
    const outcome = evaluateBoard(board);

    if (!outcome) {
      return {
        ...state,
        board,
        moveLog,
        currentTurn: oppositeMark(state.currentTurn),
      };
    }

    return {
      ...state,
      board,
      moveLog,
      history: [
        ...state.history,
        {
          gameNumber: state.currentGame,
          startingMark: startingMarkForGame(state.currentGame),
          outcome,
          moves: moveLog,
        },
      ],
    };
  }),

  on(TournamentActions.nextGameRequested, (state) => {
    if (
      state.status !== 'playing' ||
      !evaluateBoard(state.board) ||
      state.currentGame >= state.totalGames
    ) {
      return state;
    }

    const currentGame = state.currentGame + 1;

    return {
      ...state,
      currentGame,
      board: createEmptyBoard(),
      moveLog: [],
      currentTurn: startingMarkForGame(currentGame),
    };
  }),

  on(TournamentActions.resultsRequested, (state) =>
    state.status === 'playing' &&
    evaluateBoard(state.board) &&
    state.currentGame >= state.totalGames
      ? { ...state, status: 'finished' as const }
      : state,
  ),

  on(TournamentActions.tournamentReset, () => initialTournamentState),
);
