import { JsonPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { UserStateService } from '@shared/services/state/user-state.service';

export interface StatBarProps {
  bgColorTailwindCss?: string;
  prefix?: string;
}

@Component({
  selector: 'app-stat-bar',
  imports: [JsonPipe],
  templateUrl: './stat-bar.component.html',
  styleUrl: './stat-bar.component.scss',
})
export class StatBarComponent implements OnInit {
  @Input({ required: true }) statCursor = '';
  @Input() props!: StatBarProps;

  /**
   * ? I don't know if it is good to encapsulate userState here?
   * ? Because how about the future task/monster that has indicators such (HP, Progression??)? if this is like progess bar, you have to set props for the display (2/100 or 20%)
   * ? Just refactor when it comes
   */

  //eslint-disable-next-line
  readonly userState = inject(UserStateService).userState as any;

  currentStr!: string;
  totalStr!: string;

  ngOnInit(): void {
    this.currentStr = this.statCursor + 'Current';
    this.totalStr = this.statCursor + 'Total';
  }
}
