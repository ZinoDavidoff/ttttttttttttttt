import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { TournamentStatus } from '../core/models/tournament';
import { TournamentSandbox } from '../core/sandbox/tournament';

/** Lets the navigation through only when the tournament is in the expected status; otherwise back to setup. */
const requireStatus =
  (expected: TournamentStatus): CanActivateFn =>
  () => {
    const router = inject(Router);
    return inject(TournamentSandbox).status$.pipe(
      take(1),
      map((status) => status === expected || router.createUrlTree(['/setup'])),
    );
  };

export const tournamentInProgressGuard: CanActivateFn = requireStatus('playing');
export const tournamentFinishedGuard: CanActivateFn = requireStatus('finished');
