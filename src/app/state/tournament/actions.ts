import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TournamentSettings } from '../../core/models/tournament';

export const TournamentActions = createActionGroup({
  source: 'Tournament',
  events: {
    'Tournament Started': props<{ settings: TournamentSettings }>(),
    'Cell Played': props<{ index: number }>(),
    'Next Game Requested': emptyProps(),
    'Results Requested': emptyProps(),
    'Tournament Reset': emptyProps(),
  },
});
