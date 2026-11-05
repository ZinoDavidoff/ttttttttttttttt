import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GameSummary } from '../../../core/models/tournament';
import { PlayerSymbolPipe } from '../../../shared/pipes/player-symbol';
import { MoveMap } from './move-map';

@Component({
  selector: 'app-game-history',
  imports: [PlayerSymbolPipe, MoveMap],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="history">
      <caption class="eyebrow">Game by game</caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Opened by</th>
          <th scope="col">Result</th>
          <th scope="col">Moves</th>
          <th scope="col">Map</th>
        </tr>
      </thead>
      <tbody>
        @for (game of games(); track game.gameNumber) {
          <tr>
            <td>{{ game.gameNumber }}</td>
            <td>{{ game.starter | playerSymbol }}</td>
            <td>
              @if (game.winner; as winner) {
                <span [class]="'mark-' + winner.mark.toLowerCase()">{{ winner | playerSymbol }}</span> won
              } @else {
                <span class="draw">Draw</span>
              }
            </td>
            <td>{{ game.moveCount }}</td>
            <td><app-move-map [cells]="game.moveMap" /></td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .history {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;

      caption {
        margin-bottom: 0.5rem;
        text-align: left;
      }

      th,
      td {
        padding: 0.2rem 0.6rem;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid var(--border);
      }

      th {
        color: var(--muted);
        font-weight: 500;
        font-size: 0.8rem;
      }

      :is(th, td):is(:first-child, :nth-child(4)) {
        text-align: center;
        font-variant-numeric: tabular-nums;
      }

      td {
        &:last-child {
          width: 1%;
        }

        span {
          font-weight: 600;
        }
      }

      tbody tr:last-child td {
        border-bottom: 0;
      }
    }

    .draw {
      color: var(--muted);
    }
  `,
})
export class GameHistory {
  readonly games = input.required<readonly GameSummary[]>();
}