import { Component, computed, inject } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeftMini,
  heroChevronRightMini,
} from '@ng-icons/heroicons/mini';
import { ThemeService } from '@shared/services/theme/theme.service';
import {
  injectDatePickerState,
  NgpDatePicker,
  NgpDatePickerCell,
  NgpDatePickerCellRender,
  NgpDatePickerDateButton,
  NgpDatePickerGrid,
  NgpDatePickerLabel,
  NgpDatePickerNextMonth,
  NgpDatePickerPreviousMonth,
  NgpDatePickerRowRender,
} from 'ng-primitives/date-picker';
import { ChangeFn, provideValueAccessor, TouchedFn } from 'ng-primitives/utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'date-picker',
  hostDirectives: [
    {
      directive: NgpDatePicker,
      inputs: [
        'ngpDatePickerDate: date',
        'ngpDatePickerMin: min',
        'ngpDatePickerMax: max',
        'ngpDatePickerDisabled: disabled',
      ],
      outputs: ['ngpDatePickerDateChange: dateChange'],
    },
  ],
  imports: [
    NgIcon,
    NgpDatePickerLabel,
    NgpDatePickerNextMonth,
    NgpDatePickerPreviousMonth,
    NgpDatePickerGrid,
    NgpDatePickerCell,
    NgpDatePickerRowRender,
    NgpDatePickerCellRender,
    NgpDatePickerDateButton,
  ],
  providers: [
    provideIcons({ heroChevronRightMini, heroChevronLeftMini }),
    provideValueAccessor(DatePicker),
  ],
  template: `
    <div class="date-picker-header">
      <button ngpDatePickerPreviousMonth aria-label="previous month">
        <ng-icon name="heroChevronLeftMini" />
      </button>
      <h2 ngpDatePickerLabel>{{ label() }}</h2>
      <button ngpDatePickerNextMonth aria-label="next month">
        <ng-icon name="heroChevronRightMini" />
      </button>
    </div>
    <table ngpDatePickerGrid>
      <thead>
        <tr>
          <th scope="col" abbr="Sunday">S</th>
          <th scope="col" abbr="Monday">M</th>
          <th scope="col" abbr="Tuesday">T</th>
          <th scope="col" abbr="Wednesday">W</th>
          <th scope="col" abbr="Thursday">T</th>
          <th scope="col" abbr="Friday">F</th>
          <th scope="col" abbr="Saturday">S</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngpDatePickerRowRender>
          <td *ngpDatePickerCellRender="let date" ngpDatePickerCell>
            <button ngpDatePickerDateButton>
              {{ date.getDate() }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: `
    .date-picker-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      margin-bottom: 16px;
    }

    th {
      font-size: 16px;
      font-weight: 800;
      width: 40px;
      height: 40px;
      text-align: center;
      color: var(--secondary);
    }

    [ngpDatePickerLabel] {
      font-size: 14px;
      font-weight: 500;
      color: var(--foreground);
    }

    [ngpDatePickerPreviousMonth],
    [ngpDatePickerNextMonth] {
      all: unset;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 20px;
      border: 1px solid var(--border);
      cursor: pointer;
      color: var(--foreground);
    }

    [ngpDatePickerPreviousMonth][data-hover],
    [ngpDatePickerNextMonth][data-hover] {
      background-color: var(--muted);
    }

    [ngpDatePickerPreviousMonth][data-focus-visible],
    [ngpDatePickerNextMonth][data-focus-visible] {
      outline: 2px solid var(--ring);
    }

    [ngpDatePickerPreviousMonth][data-press],
    [ngpDatePickerNextMonth][data-press] {
      background-color: var(--statbar);
    }

    [ngpDatePickerPreviousMonth][data-disabled],
    [ngpDatePickerNextMonth][data-disabled] {
      cursor: not-allowed;
      color: var(--muted-foreground);
    }

    [ngpDatePickerDateButton] {
      all: unset;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      color: var(--foreground);
    }

    [ngpDatePickerDateButton][data-today] {
      color: var(--primary);
    }

    [ngpDatePickerDateButton][data-hover] {
      background-color: var(--accent);
      color: var(--accent-foreground) !important;
    }

    [ngpDatePickerDateButton][data-focus-visible] {
      outline: 2px solid var(--ring);
      outline-offset: 2px;
    }

    [ngpDatePickerDateButton][data-press] {
      background-color: var(--accent);
      filter: brightness(80%);
    }

    [ngpDatePickerDateButton][data-outside-month] {
      color: var(--muted);
    }

    [ngpDatePickerDateButton][data-selected] {
      background-color: var(--primary);
      color: var(--primary-foreground);
      font-weight: 600;
    }

    [ngpDatePickerDateButton][data-selected][data-outside-month] {
      background-color: var(--muted);
      filter: brightness(100%);
      color: var(--muted-foreground);
    }

    [ngpDatePickerDateButton][data-disabled] {
      cursor: not-allowed;
      color: var(--muted);
    }
  `,
  host: {
    '(focusout)': 'onTouched?.()',
    '[class]': 'hostCss',
  },
})
export class DatePicker implements ControlValueAccessor {
  readonly theme = inject(ThemeService).theme();
  readonly hostCss = `mt-1 inline-block bg-card rounded-md p-4 shadow-md border ${this.theme === 'dark' ? 'dark ' : ''}`;

  /** Access the date picker host directive */
  private readonly state = injectDatePickerState<Date>();

  /**
   * Get the current focused date in string format.
   * @returns The focused date in "February 2024" format.
   */
  readonly label = computed(
    () =>
      `${this.state().focusedDate().toLocaleString('default', { month: 'long' })} ${this.state().focusedDate().getFullYear()}`,
  );

  /**
   * The onChange callback function for the date picker.
   */
  protected onChange?: ChangeFn<Date | undefined>;

  /**
   * The onTouched callback function for the date picker.
   */
  protected onTouched?: TouchedFn;

  constructor() {
    // Whenever the user interacts with the date picker, call the onChange function with the new value.
    this.state().dateChange.subscribe((date) => this.onChange?.(date));
  }

  writeValue(date: Date): void {
    this.state().select(date);
  }

  registerOnChange(fn: ChangeFn<Date | undefined>): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: TouchedFn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.state().disabled.set(isDisabled);
  }
}
