import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import {
  injectToastContext,
  NgpToast,
  NgpToastManager,
} from 'ng-primitives/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  hostDirectives: [NgpToast],
  host: {
    '[class]': 'hostCss()',
  },
  template: ` <p class="toast-title">{{ context.header }}</p>
    <p class="toast-description">{{ context.description }}</p>
    <button class="toast-dismiss" (click)="dismiss()">Dismiss</button>`,
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private readonly theme = inject(ThemeService).theme;
  private readonly toastManager = inject(NgpToastManager);
  private readonly toast = inject(NgpToast);
  protected readonly context = injectToastContext<ToastContext>();
  protected hostCss = computed(() => {
    const isDark = this.theme() === 'dark';
    return `${this.context.type}${isDark && ' dark'}`;
  });

  dismiss(): void {
    this.toastManager.dismiss(this.toast);
  }
}

export interface ToastContext {
  header: string;
  description: string;
  type: ToastTyping;
}

export type ToastTyping = 'info' | 'success' | 'warning' | 'error';
export const ToastType = {
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};
