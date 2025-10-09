import { forwardRef, InjectionToken, Provider, Type } from '@angular/core';
import { BaseDialog } from './base-dialog.class';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BASE_DIALOG_TOKEN = new InjectionToken<BaseDialog<any>>(
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
