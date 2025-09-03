import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { computed, Directive, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '@shared/services/theme/theme.service';

export const BaseDialogPosition = {
  Center: 'center',
  Left: 'left',
  Right: 'right',
} as const;

type DialogPositionType =
  (typeof BaseDialogPosition)[keyof typeof BaseDialogPosition];

export interface BaseDialogData {
  class?: string;
  position?: DialogPositionType; // 'center' | 'left' | 'right';
  disableBackdropClose?: boolean;
}

const DIALOG_DEFAULT_CSS = 'bg-card w-full shadow-lg duration-100 sm:max-w-lg';
const DIALOG_CENTER_CSS =
  'relative grid justify-self-end rounded-lg min-w-[calc(45vw-3rem)] max-w-[calc(100%-2rem)] border';
const DIALOG_LEFT_CSS =
  'absolute top-0 left-0 flex flex-col h-full max-w-[calc(100%-2rem)] border-r';
const DIALOG_RIGHT_CSS =
  'absolute top-0 right-0 flex flex-col h-full max-w-[calc(100%-2rem)] border-l';

@Directive({
  host: {
    '[class]': 'hostCss()',
  },
})
//eslint-disable-next-line
export abstract class BaseDialog<T = any | BaseDialogData> {
  protected readonly dialogRef = inject(DialogRef);
  protected readonly data = inject(DIALOG_DATA) as T;
  protected readonly theme = inject(ThemeService).theme();

  protected isClosing = signal(false);
  protected hostCss = computed(() => {
    let css = `${this.theme === 'dark' ? 'dark ' : ''}${DIALOG_DEFAULT_CSS} `;
    let openAnimationCss, closeAnimationCss;

    switch (this.position) {
      case BaseDialogPosition.Left:
        css += DIALOG_LEFT_CSS;
        openAnimationCss = 'animate-slide-in-left';
        closeAnimationCss = 'animate-slide-out-left';
        break;

      case BaseDialogPosition.Right:
        css += DIALOG_RIGHT_CSS;
        openAnimationCss = 'animate-slide-in-right';
        closeAnimationCss = 'animate-slide-out-right';
        break;

      case BaseDialogPosition.Center:
        css += DIALOG_CENTER_CSS;
        openAnimationCss = 'animate-scale-in';
        closeAnimationCss = 'animate-scale-out';
        break;
    }

    return this.isClosing()
      ? `${css} ${closeAnimationCss}`
      : `${css} ${openAnimationCss}`;
  });

  private readonly backdropClick = toSignal(this.dialogRef.backdropClick);

  constructor() {
    effect(() => {
      if (this.backdropClick()) {
        //eslint-disable-next-line
        const disableBackdropClose = !!(this.data as any)?.disableBackdropClose;
        if (disableBackdropClose) return;
        this.closeDialog();
      }
    });
  }

  get position() {
    //eslint-disable-next-line
    return (this.data as any)?.position ?? 'center';
  }

  //eslint-disable-next-line
  closeDialog(data?: any) {
    this.isClosing.set(true);
    setTimeout(() => this.dialogRef.close(data ?? false), 200);
  }
}
