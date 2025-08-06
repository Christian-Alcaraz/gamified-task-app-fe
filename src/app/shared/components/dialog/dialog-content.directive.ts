import { Directive } from '@angular/core';

@Directive({
  selector: '[appDialogContent]',
  standalone: true,
  host: {
    '[class]': 'class',
  },
})
export class DialogContentDirective {
  class =
    'text-card-foreground text-sm flex flex-col relative w-full flex-1 px-6 py-2';
}
