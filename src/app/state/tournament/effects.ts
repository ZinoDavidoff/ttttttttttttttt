import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { TournamentActions } from './actions';
import { getStatus } from './selectors';

/* Navigation side effects only: the reducer owns every state transition. */

export const navigateToGame = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(TournamentActions.tournamentStarted),
      tap(() => void router.navigate(['/game'])),
    ),
  { functional: true, dispatch: false },
);

export const navigateToResults = createEffect(
  (actions$ = inject(Actions), store = inject(Store), router = inject(Router)) =>
    actions$.pipe(
      ofType(TournamentActions.resultsRequested),
      concatLatestFrom(() => store.select(getStatus)),
      filter(([, status]) => status === 'finished'),
      tap(() => void router.navigate(['/results'])),
    ),
  { functional: true, dispatch: false },
);

export const navigateToSetup = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(TournamentActions.tournamentReset),
      tap(() => void router.navigate(['/setup'])),
    ),
  { functional: true, dispatch: false },
);
