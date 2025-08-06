import { Directive } from '@angular/core';

@Directive({
  selector: '[appDialogActions]',
  standalone: true,
  host: {
    '[class]': 'class',
  },
})
export class DialogActionsDirective {
  class = 'order-last relative px-6 pt-3 pb-4';
}
