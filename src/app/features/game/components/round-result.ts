import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Player } from '../../../core/models/tournament';
import { PlayerSymbolPipe } from '../../../shared/pipes/player-symbol';

@Component({
  selector: 'app-round-result',
  imports: [PlayerSymbolPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="result card" role="status">
      <div>
        <p class="eyebrow">Game {{ gameNumber() }} over</p>
        @if (winner(); as player) {
          <p class="result__title" [class]="'mark-' + player.mark.toLowerCase()">{{ player | playerSymbol }} wins!</p>
        } @else {
          <p class="result__title">It's a draw</p>
        }
      </div>
      <button type="button" class="btn btn--primary" (click)="next.emit()">
        {{ isLastGame() ? 'See results' : 'Next game' }}
      </button>
    </div>
  `,
  styles: `
    .result {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0.75rem 0.75rem 1.25rem;
      animation: rise 0.3s ease-out;

      &__title {
        margin: 0.1rem 0 0;
        font-size: 1.15rem;
        font-weight: 700;
      }
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(0.5rem);
      }
    }
  `,
})
export class RoundResult {
  readonly winner = input<Player | null>(null);
  readonly gameNumber = input.required<number>();
  readonly isLastGame = input(false);

  readonly next = output<void>();
}
