import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../core/models/tournament';

/** Formats a player as "Name (X)". Pure: recomputed only when the player reference changes. */
@Pipe({ name: 'playerSymbol' })
export class PlayerSymbolPipe implements PipeTransform {
  transform(player: Player | null | undefined): string {
    return player ? `${player.name} (${player.mark})` : '';
  }
}
