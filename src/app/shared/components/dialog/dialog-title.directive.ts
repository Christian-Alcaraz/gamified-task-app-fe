import { Directive } from '@angular/core';

@Directive({
  selector: '[appDialogTitle]',
  standalone: true,
  host: {
    '[class]': 'class',
  },
})
export class DialogTitleDirective {
  class =
    'app-dialog-title order-first flex flex-col relative w-full px-6 pt-6 pb-3';
}
