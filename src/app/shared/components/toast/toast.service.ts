import { inject, Injectable } from '@angular/core';
import { NgpToastManager } from 'ng-primitives/toast';
import { NgpToastOptions } from 'node_modules/ng-primitives/toast/toast/toast-manager';
import { ToastComponent, ToastContext } from './toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastManager = inject(NgpToastManager);

  showToast(
    header = '',
    message: string,
    type: ToastTyping = 'info',
    options?: Partial<NgpToastOptions<ToastContext>>,
  ) {
    const context: ToastContext = {
      header,
      description: message,
    };

    const toastOptions: NgpToastOptions<ToastContext> = {
      placement: 'top-end',
      duration: 3000,
      context: context as ToastContext,
      ...(options ?? {}),
    };

    this.toastManager.show(ToastComponent, toastOptions);
  }
}

export type ToastTyping = 'success' | 'error' | 'warning' | 'info';
