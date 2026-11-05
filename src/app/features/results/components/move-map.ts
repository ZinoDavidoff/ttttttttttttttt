import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MoveMapCell } from '../../../core/models/tournament';

/**
 * Miniature 3x3 map of a finished game:
 * each mark with its move number, winning line lit up.
 */
@Component({
  selector: 'app-move-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map" role="img" [attr.aria-label]="description()" [attr.title]="description()">
      @for (cell of cells(); track $index) {
        <span
          class="map__cell"
          [class]="cell.mark ? 'mark-' + cell.mark.toLowerCase() : ''"
          [class.is-winning-cell]="cell.isWinning"
        >
          @if (cell.mark) {
            {{ cell.mark }}
          }
        </span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .map {
      display: grid;
      grid-template: repeat(3, 1fr) / repeat(3, 1fr);
      gap: 2px;
      width: 2.6rem;
      aspect-ratio: 1;

      &__cell {
        display: grid;
        place-items: center;
        grid-auto-flow: column;
        border-radius: 3px;
        background: rgb(255 255 255 / 0.05);
        font-size: 0.65rem;
        font-weight: 800;
        line-height: 1;

        &.is-winning-cell {
          background: color-mix(in srgb, currentColor 25%, transparent);
          box-shadow: inset 0 0 0 1px currentColor;
        }
      }
    }
  `,
})
export class MoveMap {
  readonly cells = input.required<readonly MoveMapCell[]>();

  /**
   * Screen-reader description and tooltip, e.g.
   * "Move 1: X in cell 5, Move 2: O in cell 1".
   */
  protected readonly description = computed(() =>
    this.cells()
      .map((cell, index) => ({ ...cell, index }))
      .filter((cell) => cell.order !== null)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((cell) => `Move ${cell.order}: ${cell.mark} in cell ${cell.index + 1}`)
      .join('\n'),
  );
}