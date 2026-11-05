import { Routes } from '@angular/router';
import { TournamentSandbox } from './core/sandbox/tournament';
import { tournamentFinishedGuard, tournamentInProgressGuard } from './guards/tournament';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { tournamentReducer } from './state/tournament/reducer';
import { tournamentEffects } from './state/tournament';

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideState('tournament', tournamentReducer),
      provideEffects(tournamentEffects),
      TournamentSandbox
    ],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'setup' },
      {
        path: 'setup',
        title: 'New tournament · Tic Tac Toe',
        loadComponent: () => import('./features/setup/setup-page').then((m) => m.SetupPage),
      },
      {
        path: 'game',
        title: 'Playing · Tic Tac Toe',
        canActivate: [tournamentInProgressGuard],
        loadComponent: () => import('./features/game/game-page').then((m) => m.GamePage),
      },
      {
        path: 'results',
        title: 'Results · Tic Tac Toe',
        canActivate: [tournamentFinishedGuard],
        loadComponent: () => import('./features/results/results-page').then((m) => m.ResultsPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
