import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

/** Toggles the global `is-winning` class (pulse animation, see styles.scss) on its host element. */
@Directive({ selector: '[appCellHighlight]' })
export class CellHighlight {
  readonly appCellHighlight = input(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      this.appCellHighlight()
        ? this.renderer.addClass(this.host.nativeElement, 'is-winning')
        : this.renderer.removeClass(this.host.nativeElement, 'is-winning');
    });
  }
}
