import { inject, Injectable } from '@angular/core';
import { UI_STATE } from '@core/constants';
import { NgpToastManager } from 'ng-primitives/toast';
import { NgpToastOptions } from 'node_modules/ng-primitives/toast/toast/toast-manager';
import { IToastContext, IToastType, ToastComponent } from './toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastManager = inject(NgpToastManager);
  private readonly defaults: Partial<NgpToastOptions> = {
    placement: 'top-end',
    duration: 4500, // * 4.5 seconds
  };

  showToast(
    header = '',
    message: string,
    type: IToastType = UI_STATE.Info,
    options?: NgpToastOptions,
  ) {
    const context: IToastContext = {
      header,
      description: message,
      type,
    };

    const toastOptions: NgpToastOptions = {
      placement: this.defaults.placement,
      duration: this.defaults.duration,
      context,
      ...(options ?? {}),
    };

    this.toastManager.show(ToastComponent, toastOptions);
  }
}
