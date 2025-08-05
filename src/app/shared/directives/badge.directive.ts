import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

const BADGE_DEFAULT_CONFIG = {
  Active: 'bg-emerald-500',
  Deleted: 'bg-rose-500',
  Cancelled: 'bg-rose-500',
  Paused: 'bg-amber-500',
};

const BADGE_CLASS = 'block px-2 py-1 text-xs rounded-sm w-fit shadow-sm';
const BADGE_DEFAULT = 'border bg-card text-foreground';

@Directive({
  selector: '[appBadgeDisplay]',
})
export class BadgeDirective implements OnInit, OnChanges {
  private readonly _renderer = inject(Renderer2);
  private readonly _elRef = inject(ElementRef);

  @Input({ alias: 'appBadgeDisplay' }) badgeValue!: string | number;
  @Input() badgeConfig!: Record<string, string>;

  ngOnInit(): void {
    this.badgeValue = String(this.badgeValue);
    this.badgeConfig = this.badgeConfig ?? BADGE_DEFAULT_CONFIG;
  }

  ngOnChanges(): void {
    const host = this._elRef.nativeElement;
    const existingClasses = Array.from(host.classList);

    host.setAttribute('class', '');

    if (existingClasses.length) {
      existingClasses.forEach((cls) =>
        this._renderer.addClass(host, cls as string),
      );
    }

    this._getClassArray().forEach((clsStr) =>
      this._renderer.addClass(host, clsStr),
    );

    this._renderer.appendChild(
      host,
      this._renderer.createText(this.badgeValue as string),
    );
  }

  private _getClassArray() {
    const badgeConfig = this.badgeConfig
      ? this.badgeConfig[this.badgeValue]
      : `${BADGE_CLASS} ${BADGE_DEFAULT}`;
    return [...badgeConfig.split(' ')];
  }
}
