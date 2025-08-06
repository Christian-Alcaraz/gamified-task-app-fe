import { Directive, inject } from '@angular/core';
import { BaseDialogPosition } from './base-dialog.class';
import { BASE_DIALOG_TOKEN } from './dialog.provider';

const SPACE = ' ';
@Directive({
  selector: '[appDialogContent]',
  standalone: true,
  host: {
    '[class]': 'class',
  },
})
export class DialogContentDirective {
  private readonly _baseDialog = inject(BASE_DIALOG_TOKEN, { optional: true });

  class!: string;

  constructor() {
    const position = this._baseDialog?.position;
    let css =
      'text-card-foreground text-sm flex flex-col relative w-full flex-1 px-6 py-2' +
      SPACE;

    switch (position) {
      case BaseDialogPosition.Center:
        css += 'mb-4';
        break;
    }

    this.class = css;
  }
}
