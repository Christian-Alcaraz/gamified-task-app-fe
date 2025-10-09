import { CommonModule, KeyValuePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Item as ItemConst } from '@core/constants';
import { BaseInputProps } from '@core/interfaces/base-input.interface';
import { NgIcon } from '@ng-icons/core';
import { BaseInput, InputErrorComponent } from '@shared/components/inputs';
import { NumberInputDirective } from '@shared/components/inputs/text-field/number-input.directive';
import { ThemeService } from '@shared/services/theme/theme.service';
import { UtilService } from '@shared/services/util/util.service';
import {
  NgpCombobox,
  NgpComboboxButton,
  NgpComboboxDropdown,
  NgpComboboxInput,
  NgpComboboxOption,
  NgpComboboxPortal,
} from 'ng-primitives/combobox';
import { startWith, Subject, takeUntil } from 'rxjs';

const BASE_STATS = ItemConst.BaseStats;
const BASE_STATS_MAX_VALUE = 999;

@Component({
  selector: 'app-base-stats-field',
  imports: [
    CommonModule,
    NgpCombobox,
    NgpComboboxDropdown,
    NgpComboboxOption,
    NgpComboboxInput,
    NgpComboboxPortal,
    NgpComboboxButton,
    NgIcon,
    NumberInputDirective,
    ReactiveFormsModule,
    InputErrorComponent,
    TitleCasePipe,
    KeyValuePipe,
  ],
  templateUrl: './base-stats-field.component.html',
  styleUrl: './base-stats-field.component.scss',
  host: {
    '[class]': `hostCss`,
  },
})
export class BaseStatsFieldComponent
  extends BaseInput
  implements OnInit, OnDestroy
{
  /* eslint-disable */

  // ** Services
  private readonly util = inject(UtilService);
  private readonly formBuilder = inject(FormBuilder);
  readonly theme = inject(ThemeService).theme();
  readonly hostCss = `flex flex-col w-full gap-1.5 ${this.theme === 'dark' ? 'dark ' : ''}`;

  // ** Inputs
  fcName = input<string>();
  props = input<BaseInputProps>();
  baseStatsValue = input<Record<string, number>[]>([]);
  disabled = input<boolean>(false);

  // ** Viewchilds
  readonly comboboxRef = viewChild.required<NgpCombobox>('ngpComboboxRef');
  readonly comboboxHost = viewChild<ElementRef<HTMLDivElement>>('comboboxHost');

  // * States
  private readonly destroyed$ = new Subject<void>();
  readonly selectedStats = signal<any[]>([]);
  readonly filter = signal<string>('');

  readonly filteredOptions = computed(() => {
    const nonSelectedStats = BASE_STATS.filter(
      (option) => !this.selectedStats().includes(option),
    );

    if (!this.filter()) return nonSelectedStats;

    return nonSelectedStats.filter((option) => option.includes(this.filter()));
  });

  get isOptionEmpty(): boolean {
    return this.filteredOptions().length === 0;
  }

  override get hideErrorProps(): boolean {
    return !!this.props()?.hideError;
  }
  override get hintProps(): boolean {
    return !!this.props()?.hint;
  }

  ngOnInit(): void {
    let fcName: string;
    try {
      fcName = (this.fcName() ?? this.props()?.fcName) as string;
    } catch (error) {
      console.error(error);
      throw new Error('fcName is missing!');
    }

    this.initFormControl(fcName, this.props()?.validators);

    const getStatFilters = [];
    if (this.baseStatsValue()) {
      for (const stat of this.baseStatsValue()) {
        const statName = Object.keys(stat)[0] as string;
        const formGroup = this.setupStatFormGroup(stat);
        this.fControlAsFA?.push(formGroup);
        getStatFilters.push(statName);
      }

      if (getStatFilters.length > 0) {
        this.selectedStats.set(getStatFilters);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  isSelected(option: any): boolean {
    return this.selectedStats().includes(option);
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.set(input.value);
  }

  onStatOptionSelect(event: MouseEvent) {
    if (!event || !event.target || !this.fControlAsFA) return;

    const button = event.target as HTMLButtonElement;
    const statName = button.textContent?.trim().toLowerCase() as string;
    const statObj = { [statName]: null } as unknown as Record<string, number>;
    const formGroup = this.setupStatFormGroup(statObj);

    this.fControlAsFA.push(formGroup, { emitEvent: false });
    this.fControlAsFA.updateValueAndValidity({ emitEvent: false });

    // this.baseStatsfControlAsFA.push(formGroup, { emitEvent: false });
    // this.baseStatsfControlAsFA.updateValueAndValidity({ emitEvent: false });
  }

  removeStatFormGroupAt(controlIndex: number): void {
    if (!this.fControlAsFA) return;

    // const statObj = this.baseStatsfControlAsFA.at(controlIndex).getRawValue();
    const statObj = this.fControlAsFA.at(controlIndex).getRawValue();
    const statName = Object.keys(statObj)[0];
    this.selectedStats.set(
      this.selectedStats().filter((option) => option !== statName),
    );

    this.fControlAsFA.removeAt(controlIndex);
    // this.baseStatsfControlAsFA.removeAt(controlIndex);
  }

  protected closeDropdown(): void {
    const combobox = this.comboboxRef();
    combobox.closeDropdown();
    this.filter.set('');
  }

  protected resetOnClose(open: boolean): void {
    if (open) {
      return;
    }
    this.filter.set('');
  }

  protected onInputFocus(): void {
    const combobox = this.comboboxRef();
    if (combobox.open()) return;
    combobox.openDropdown();
  }

  private setupStatFormGroup(statObj: Record<string, number>): FormGroup {
    const [statName, value] = Object.entries(statObj)[0];

    const formGroup = this.formBuilder.group({
      [statName as unknown as string]: [
        value,
        [Validators.required, Validators.min(1)],
      ],
    }) as FormGroup;

    const statControl = formGroup.get(statName) as FormControl;

    statControl?.valueChanges
      .pipe(startWith(value), takeUntil(this.destroyed$))
      .subscribe((statValue) => {
        if (statValue === '') {
          statControl.setValue(null, { emitEvent: false });
        } else if (!isNaN(statValue)) {
          //Todo: Maybe fetch from configApi for the base stat max value
          const evaluatedValue =
            Number(statValue) > BASE_STATS_MAX_VALUE
              ? BASE_STATS_MAX_VALUE
              : Number(statValue);

          statControl.setValue(Number(evaluatedValue), { emitEvent: false });
        }
      });
    return formGroup;
  }

  /* eslint-enable */
}
