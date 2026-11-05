import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Board, Mark } from '../../../core/models/tournament';
import { CellHighlight } from '../../../shared/directives/cell-highlight';

@Component({
  selector: 'app-game-board',
  imports: [CellHighlight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="board" role="group" aria-label="Tic Tac Toe board" [attr.data-turn]="currentTurn()">
      @for (cell of board(); track $index) {
        <button
          type="button"
          class="cell"
          [class.cell--x]="cell === 'X'"
          [class.cell--o]="cell === 'O'"
          [appCellHighlight]="winningLine().includes($index)"
          [disabled]="disabled() || cell !== null"
          [attr.aria-label]="'Cell ' + ($index + 1) + ': ' + (cell ?? 'empty')"
          (click)="cellSelected.emit($index)"
        >
          @switch (cell) {
            @case ('X') {
              <svg class="mark" viewBox="0 0 100 100" aria-hidden="true">
                <path d="M22 22 78 78" pathLength="100" />
                <path d="M78 22 22 78" pathLength="100" class="mark__second" />
              </svg>
            }
            @case ('O') {
              <svg class="mark" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="30" pathLength="100" />
              </svg>
            }
          }
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .board {
      display: grid;
      grid-template: repeat(3, minmax(0, 1fr)) / repeat(3, minmax(0, 1fr));
      gap: 0.6rem;
      aspect-ratio: 1;
      padding: 0.6rem;
      border-radius: 1.5rem;
      background: var(--surface);
      border: 1px solid var(--border);
      backdrop-filter: blur(16px);
      box-shadow: var(--shadow);

      &[data-turn='X'] .cell:not(:disabled):hover::after {
        content: 'X';
        color: var(--x);
      }

      &[data-turn='O'] .cell:not(:disabled):hover::after {
        content: 'O';
        color: var(--o);
      }
    }

    .cell {
      position: relative;
      display: grid;
      place-items: center;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 1rem;
      background: rgb(255 255 255 / 0.03);
      color: var(--muted);
      font: inherit;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s, border-color 0.2s;

      &:disabled {
        cursor: default;
      }

      &:not(:disabled) {
        &:hover {
          background: rgb(255 255 255 / 0.08);
          transform: translateY(-2px);
        }

        &:hover::after {
          font-size: clamp(2rem, 7vmin, 4rem);
          font-weight: 800;
          opacity: 0.25;
        }
      }

      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      &--x {
        color: var(--x);
      }

      &--o {
        color: var(--o);
      }

      &.is-winning {
        background: color-mix(in srgb, currentColor 16%, transparent);
        border-color: currentColor;
      }
    }

    .mark {
      width: 62%;
      height: 62%;
      overflow: visible;
      filter: drop-shadow(0 0 0.6rem currentColor);

      path,
      circle {
        fill: none;
        stroke: currentColor;
        stroke-width: 11;
        stroke-linecap: round;
        stroke-dasharray: 100;
        stroke-dashoffset: 100;
        animation: draw 0.3s ease-out forwards;
      }

      .mark__second {
        animation-delay: 0.15s;
      }
    }

    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
  `,
})
export class GameBoard {
  readonly board = input.required<Board>();
  readonly currentTurn = input.required<Mark>();
  readonly winningLine = input<readonly number[]>([]);
  readonly disabled = input(false);

  readonly cellSelected = output<number>();
}
