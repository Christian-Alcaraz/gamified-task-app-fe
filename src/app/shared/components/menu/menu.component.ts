import { Component, HostBinding, inject, input, output } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import { NgpMenu, NgpMenuItem } from 'ng-primitives/menu';

export interface MenuItem {
  label: string;
  action: string;
  icon?: string;
  iconPlacement?: 'prefix' | 'suffix';
}

@Component({
  selector: 'app-menu',
  hostDirectives: [NgpMenu],
  template: `
    <main class="flex flex-col bg-card gap-1.5 px-1.5 py-1">
      @for (item of menuItems(); track $index) {
        <button
          ngpMenuItem
          class="inline-flex px-2 py-1 text-sm rounded-sm transition-colors duration-75 ease-in-out items-center cursor-pointer justify-start text-card-foreground hover:bg-accent hover:text-accent-foreground"
          (click)="selectMenu.emit(item.action)"
        >
          {{ item.label }}
        </button>
      }
    </main>
  `,
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
  imports: [NgpMenuItem],
})
export class MenuComponent {
  readonly theme = inject(ThemeService).theme();
  menuItems = input.required<MenuItem[]>();
  selectMenu = output<string>();

  @HostBinding('class')
  readonly class = this.getCss();

  getCss() {
    const theme = this.theme === 'dark' ? ' dark' : '';

    return `fixed flex flex-col w-max bg-card border shadow rounded-md p-1${theme}`;
  }
}
