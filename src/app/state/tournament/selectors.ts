import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  buildMoveMap,
  decideTournamentWinner,
  evaluateBoard,
  tallyScore,
} from '../../core/game/game-engine';
import {
  GameSummary,
  Mark,
  MARKS,
  Player,
  RoundMarker,
  ScoreboardVm,
  Standing,
} from '../../core/models/tournament';
import { TournamentState } from './state';

export const selectTournamentState =
  createFeatureSelector<TournamentState>('tournament');

/* ---------- Base selectors (state projectors) ---------- */

export const getStatus = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.status,
);
export const getPlayerNames = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.playerNames,
);
export const getTotalGames = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.totalGames,
);
export const getCurrentGame = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.currentGame,
);
export const getBoard = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.board,
);
export const getCurrentTurn = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.currentTurn,
);
export const getHistory = createSelector(
  selectTournamentState,
  (state: TournamentState) => state.history,
);

/* ---------- Derived selectors ---------- */

const toPlayer = (names: Readonly<Record<Mark, string>>, mark: Mark): Player => ({
  mark,
  name: names[mark],
});

export const getPlayers = createSelector(getPlayerNames, (names): readonly Player[] =>
  MARKS.map((mark) => toPlayer(names, mark)),
);

export const getCurrentPlayer = createSelector(getPlayerNames, getCurrentTurn, toPlayer);

export const getRoundOutcome = createSelector(getBoard, evaluateBoard);

export const getIsRoundOver = createSelector(getRoundOutcome, (outcome) => outcome !== null);

export const getWinningLine = createSelector(getRoundOutcome, (outcome): readonly number[] =>
  outcome?.kind === 'win' ? outcome.line : [],
);

export const getRoundWinner = createSelector(
  getRoundOutcome,
  getPlayerNames,
  (outcome, names): Player | null =>
    outcome?.kind === 'win' ? toPlayer(names, outcome.winner) : null,
);

export const getIsLastGame = createSelector(
  getCurrentGame,
  getTotalGames,
  (current, total) => current >= total,
);

export const getScore = createSelector(getHistory, tallyScore);

export const getStandings = createSelector(
  getPlayers,
  getScore,
  (players, score): readonly Standing[] =>
    players.map((player) => ({ player, wins: score.wins[player.mark] })),
);

export const getTournamentWinner = createSelector(
  getScore,
  getPlayerNames,
  (score, names): Player | null => {
    const winner = decideTournamentWinner(score);
    return winner ? toPlayer(names, winner) : null;
  },
);

/* ---------- View-model selectors ---------- */

export const getScoreboard = createSelector(
  getStandings,
  getScore,
  getHistory,
  getCurrentGame,
  getTotalGames,
  getCurrentTurn,
  getIsRoundOver,
  getStatus,
  (
    standings,
    score,
    history,
    currentGame,
    totalGames,
    turn,
    isRoundOver,
    status,
  ): ScoreboardVm => ({
    entries: standings.map((standing) => ({
      ...standing,
      isActive: status === 'playing' && !isRoundOver && standing.player.mark === turn,
    })),
    draws: score.draws,
    currentGame,
    totalGames,
    rounds: Array.from({ length: totalGames }, (_, i): RoundMarker => {
      const outcome = history[i]?.outcome;
      if (!outcome) return 'pending';
      return outcome.kind === 'win' ? outcome.winner : 'draw';
    }),
  }),
);

export const getGameHistory = createSelector(
  getHistory,
  getPlayerNames,
  (history, names): readonly GameSummary[] =>
    history.map((record) => ({
      gameNumber: record.gameNumber,
      starter: toPlayer(names, record.startingMark),
      winner: record.outcome.kind === 'win' ? toPlayer(names, record.outcome.winner) : null,
      moveCount: record.moves.length,
      moveMap: buildMoveMap(record),
    })),
);
