import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <span class="logo" aria-hidden="true">
        <span class="mark-x">X</span>
        <span class="mark-o">O</span>
      </span>

      <span class="brand">
        Tic Tac Toe <span class="brand__accent">Tournament</span>
      </span>
    </header>

    <main class="main">
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100dvh;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem clamp(1rem, 4vw, 2.5rem);
    }

    .logo {
      display: inline-flex;
      gap: 0.1rem;
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: -0.04em;
    }

    .brand {
      font-weight: 600;
      letter-spacing: 0.02em;

      &__accent {
        color: var(--muted);
        font-weight: 400;
      }
    }

    .main {
      min-height: 0;
      overflow: auto;
      /* Safety net for very small screens; layouts are sized to fit 100dvh. */
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      place-items: center;
      padding: 1.25rem clamp(1rem, 4vw, 2.5rem);
    }

    /*
     * The outlet is an empty marker element.
     * Keep it out of the grid so the routed page owns the single row.
     */
    router-outlet {
      display: none;
    }
  `,
})
export class App {}