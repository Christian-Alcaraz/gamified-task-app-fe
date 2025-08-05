import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, computed, effect, input, signal } from '@angular/core';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';

export type BadgeType = 'badge' | 'notification';

export interface BadgeProps {
  bgTailwindCss?: string;
  type?: BadgeType;
}

const BADGE_DEFAULT_CONFIG = {
  Active: 'bg-emerald-500',
  Deleted: 'bg-rose-500',
  Cancelled: 'bg-rose-500',
  Paused: 'bg-amber-500',
};

const BADGE_CLASS =
  'block px-2 py-1 text-xs rounded-sm w-fit shadow-sm text-foreground';

const BADGE_NOTIFICATION_BG = 'bg-secondary/75 border';
const BADGE_BG = 'bg-card border';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent extends ThemeAwareComponent {
  badgeValue = input.required<string | number>();
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  badgeClassificationConfig = input<any>();
  badgeProps = input<BadgeProps>();
  badgeType = input<BadgeType>();

  resolvedType = computed(
    () => this.badgeType() || this.badgeProps()?.type || 'badge',
  );
  resolvedConfig = computed(() => {
    if (this.resolvedType() === 'notification') {
      return null;
    }
    return this.badgeClassificationConfig() ?? BADGE_DEFAULT_CONFIG;
  });

  resolvedValue = computed(() => {
    if (this.resolvedType() === 'badge') return String(this.badgeValue());
    const number = coerceNumberProperty(this.badgeValue());
    if (number >= 100) return `99+`;
    return number;
  });

  assignedCss = signal<string>('');

  constructor() {
    super();
    effect(() => {
      this._assignBadgeCss();
    });
  }

  private _assignBadgeCss() {
    if (this.resolvedType() === 'notification') {
      const notifClass = `${BADGE_CLASS} ${this.badgeProps()?.bgTailwindCss || BADGE_NOTIFICATION_BG}`;
      this.assignedCss.set(notifClass);
      return;
    }
    /* eslint-disable */
    const badgeConfig = this.resolvedConfig() as any;
    const badgeValue = this.resolvedValue() as any;
    const css = badgeConfig[badgeValue] ?? `${BADGE_CLASS} ${BADGE_BG}`;
    this.assignedCss.set(css);
    /* eslint-enable */
  }
}
