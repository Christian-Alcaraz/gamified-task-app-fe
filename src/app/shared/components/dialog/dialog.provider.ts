import { forwardRef, InjectionToken, Provider, Type } from '@angular/core';
import { BaseDialog } from './base-dialog.class';

export const BASE_DIALOG_TOKEN = new InjectionToken<BaseDialog>(
  'BASE_DIALOG_TOKEN',
);
export function provideBaseDialogToken<T>(component: Type<T>): Provider {
  return [
    {
      provide: BASE_DIALOG_TOKEN,
      useExisting: forwardRef(() => component),
    },
  ];
}
