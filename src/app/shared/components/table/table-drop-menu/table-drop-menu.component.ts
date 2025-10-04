import { Component, HostBinding, inject, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import { NgpMenu, NgpMenuItem } from 'ng-primitives/menu';

@Component({
  selector: 'app-table-drop-menu',
  hostDirectives: [NgpMenu],
  imports: [NgpMenuItem, NgIcon],
  template: ` <main class="flex flex-col bg-card rounded-md gap-1.5">
    <section
      class="border-b px-4 py-2 text-sm font-medium text-foreground select-none"
    >
      Toggle Columns
    </section>

    @for (item of menuItems(); track $index) {
      <button
        ngpMenuItem
        class="relative flex items-center gap-2 mx-1 py-1.5 pr-2 pl-8 text-sm rounded-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 capitalize text-card-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
        [class.mb-1]="$last"
        (click)="selectMenu.emit(item.column)"
      >
        <span
          class="pointer-events-none absolute left-2 flex size-5 items-center justify-center"
        >
          @if (item.column.getIsVisible()) {
            <ng-icon name="heroCheck"></ng-icon>
          }
        </span>
        <p class="inline-block">{{ item.label }}</p>
      </button>
    }
  </main>`,
  styles: `
    :host {
      animation: menu-show 150ms var(--burst-in-slow-out);
    }

    :host[data-exit] {
      animation: menu-hide 75ms ease-out;
    }

    @keyframes menu-show {
      0% {
        opacity: 0;
        transform: scale(0.9) translateY(-50px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY;
      }
    }

    @keyframes menu-hide {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0.9);
      }
    }
  `,
})
export class TableDropMenuComponent {
  readonly theme = inject(ThemeService).theme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectMenu = output<any>();
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems = input.required<any>();
  @HostBinding('class')
  readonly class = this.getCss();

  getCss() {
    const theme = this.theme === 'dark' ? ' dark' : '';

    return `fixed flex flex-col w-max bg-card border shadow rounded-md z-[9999999] ${theme}`;
  }
}
