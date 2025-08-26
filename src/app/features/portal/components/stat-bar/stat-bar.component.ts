import { Component, inject, input } from '@angular/core';
import { UserStateService } from '@shared/services/state/user.state.service';

export interface StatBarProps {
  bgColorTailwindCss?: string;
  prefix?: string;
  heightPx?: string | number;
  showStatsNumber?: boolean;
  currentKey: string;
  totalKey: string;
}

@Component({
  selector: 'app-stat-bar',
  imports: [],
  templateUrl: './stat-bar.component.html',
  styleUrl: './stat-bar.component.scss',
})
export class StatBarComponent {
  props = input<StatBarProps>();

  /**
   * ? I don't know if it is good to encapsulate userState here?
   * ? Because how about the future task/monster that has indicators such (HP, Progression??)? if this is like progess bar, you have to set props for the display (2/100 or 20%)
   * ? Just refactor when it comes
   */

  //eslint-disable-next-line
  readonly userState = inject(UserStateService).userState as any;

  getFontRatio(heightPx: string | number) {
    const FONT_RATIO = 0.675;
    let height = 24;

    if (typeof heightPx === 'string') {
      height = parseInt(heightPx);
    } else if (typeof heightPx === 'number') {
      height = heightPx;
    } else {
      console.error('heightPx must be a string or number. returned 24');
    }

    return height * FONT_RATIO;
  }
}
