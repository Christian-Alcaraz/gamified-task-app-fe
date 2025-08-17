import { Component, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-dialog-close-button',
  imports: [NgIcon],
  template: `
    <button
      class="group absolute top-2 right-2 rounded-full flex items-center justify-center h-[32px] w-[32px] cursor-pointer"
      (click)="willClose.emit()"
    >
      <ng-icon
        class="rotate-45 [&>*]:transition-all [&>*]:duration-100 [&>*]:ease-burst-in-slow-out group-focus:[&>*]:fill-foreground/55 group-hover:[&>*]:scale-[125%] [&>*]:fill-border/100 group-hover:[&>*]:fill-foreground"
        name="saxAddOutline"
      ></ng-icon>
    </button>
  `,
  styles: ``,
})
export class DialogCloseButtonComponent {
  willClose = output<void>();
}
