import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScoreboardVm } from '../../../core/models/tournament';

@Component({
  selector: 'app-scoreboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let scoreboard = vm();
    <section class="scoreboard" aria-label="Scoreboard">
      @for (entry of scoreboard.entries; track entry.player.mark; let first = $first) {
        <article
          class="player card"
          [class]="'mark-' + entry.player.mark.toLowerCase()"
          [class.is-active]="entry.isActive"
          [class.player--right]="!first"
        >
          <span class="player__mark">{{ entry.player.mark }}</span>
          <span class="player__info">
            <span class="player__name">{{ entry.player.name }}</span>
            <span class="eyebrow">{{ entry.isActive ? 'Your turn' : 'Wins' }}</span>
          </span>
          <span class="player__wins">{{ entry.wins }}</span>
        </article>

        @if (first) {
          <div class="center">
            <p class="center__progress">Game {{ scoreboard.currentGame }} of {{ scoreboard.totalGames }}</p>
            <ol class="rounds" aria-label="Rounds">
              @for (round of scoreboard.rounds; track $index) {
                <li
                  class="rounds__dot"
                  [class]="'rounds__dot--' + round.toLowerCase()"
                  [class.is-current]="$index + 1 === scoreboard.currentGame"
                  [attr.aria-label]="'Game ' + ($index + 1) + ': ' + round"
                ></li>
              }
            </ol>
            <p class="eyebrow">Draws {{ scoreboard.draws }}</p>
          </div>
        }
      }
    </section>
  `,
  styles: `
    .scoreboard {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1.25rem);
    }

    .player {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: var(--text);
      transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;

      &--right {
        flex-direction: row-reverse;
        text-align: right;
      }

      &.is-active {
        border-color: currentColor;
        box-shadow: 0 0 0 1px currentColor, 0 0 2rem -0.5rem currentColor;
        transform: translateY(-2px);
      }

      &__mark {
        font-size: 1.75rem;
        font-weight: 800;
        text-shadow: 0 0 1rem currentColor;
      }

      &__info {
        display: grid;
        flex: 1;
        min-width: 0;
      }

      &__name {
        overflow: hidden;
        color: var(--text);
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &__wins {
        font-size: 2rem;
        font-weight: 800;
        color: var(--text);
        font-variant-numeric: tabular-nums;
      }
    }

    .mark-x {
      color: var(--x);
    }

    .mark-o {
      color: var(--o);
    }

    .center {
      display: grid;
      justify-items: center;
      gap: 0.35rem;
      text-align: center;

      p {
        margin: 0;
      }

      &__progress {
        font-weight: 700;
        white-space: nowrap;
      }
    }

    .rounds {
      display: flex;
      gap: 0.35rem;
      margin: 0;
      padding: 0;
      list-style: none;

      &__dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: var(--border);

        &.is-current {
          outline: 2px solid var(--muted);
          outline-offset: 2px;
        }

        &--x {
          background: var(--x);
        }

        &--o {
          background: var(--o);
        }

        &--draw {
          background: var(--muted);
        }
      }
    }

    @media (max-width: 560px) {
      .player {
        padding: 0.5rem 0.65rem;
        gap: 0.4rem;

        &__mark {
          font-size: 1.25rem;
        }

        &__wins {
          font-size: 1.5rem;
        }

        .eyebrow {
          display: none;
        }
      }
    }
  `,
})
export class Scoreboard {
  readonly vm = input.required<ScoreboardVm>();
}
