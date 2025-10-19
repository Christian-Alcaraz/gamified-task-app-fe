import { inject, Injectable } from '@angular/core';
import { NgpToastManager } from 'ng-primitives/toast';
import { NgpToastOptions } from 'node_modules/ng-primitives/toast/toast/toast-manager';
import { ToastComponent, ToastContext, ToastTyping } from './toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastManager = inject(NgpToastManager);
  private readonly defaults: Partial<NgpToastOptions> = {
    placement: 'top-end',
    duration: 3000,
  };

  showToast(
    header = '',
    message: string,
    type: ToastTyping = 'info',
    options?: NgpToastOptions,
  ) {
    const context: ToastContext = {
      header,
      description: message,
      type,
    };

    const toastOptions: NgpToastOptions = {
      placement: this.defaults.placement,
      duration: this.defaults.duration,
      context: context as ToastContext,
      ...(options ?? {}),
    };

    this.toastManager.show(ToastComponent, toastOptions);
  }
}
