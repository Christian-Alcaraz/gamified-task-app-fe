import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DIALOG_DATA, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '@shared/services/theme/theme.service';

export const BaseDialogPosition = {
  Center: 'center',
  Left: 'left',
  Right: 'right',
} as const;

type DialogPositionType =
  (typeof BaseDialogPosition)[keyof typeof BaseDialogPosition];

export interface BaseDialogData extends DialogConfig {
  class?: string;
  position?: DialogPositionType; // 'center' | 'left' | 'right';
  disableBackdropClose?: boolean;
}

const DIALOG_DEFAULT_CSS =
  'bg-card w-full shadow-lg duration-100 sm:max-w-lg min-w-full max-w-[calc(100%-2rem)]';
const DIALOG_CENTER_CSS = 'relative grid justify-self-end rounded-lg border';
const DIALOG_LEFT_CSS = 'absolute top-0 left-0 flex flex-col h-full border-r';
const DIALOG_RIGHT_CSS = 'absolute top-0 right-0 flex flex-col h-full border-l';

@Directive({
  host: {
    '[class]': 'hostCss()',
  },
})
export abstract class BaseDialog<T extends BaseDialogData>
  implements AfterViewInit, OnDestroy
{
  protected readonly dialogRef = inject(DialogRef);
  protected readonly data = inject<T>(DIALOG_DATA);
  protected readonly theme = inject(ThemeService).theme();
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly elementRef = inject(ElementRef);
  private focusTrap!: FocusTrap;

  protected isClosing = signal(false);
  protected hostCss = computed(() => {
    let css = `${this.theme === 'dark' ? 'dark ' : ''} ${DIALOG_DEFAULT_CSS} `;
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

  ngAfterViewInit(): void {
    this.focusTrap = this.focusTrapFactory.create(
      this.elementRef.nativeElement,
    );
    this.focusTrap.focusInitialElement();
  }

  get position() {
    //eslint-disable-next-line
    return (this.data as any)?.position ?? 'center';
  }

  //eslint-disable-next-line
  protected closeDialog(data?: any) {
    this.isClosing.set(true);
    setTimeout(() => this.dialogRef.close(data ?? false), 200);
  }

  ngOnDestroy(): void {
    this.focusTrap.destroy();
  }
}
