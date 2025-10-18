import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  AfterViewInit,
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
import { BaseInputProps } from '@core/interfaces/base-input.interface';
import { NgIcon } from '@ng-icons/core';
import { BaseInput } from '@shared/components/inputs/base-input.class';
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
import { InputErrorComponent } from '../input-error/input-error.component';

export interface ComboboxChipsProps extends BaseInputProps {
  labelLoc?: 'hide' | 'top';
  labelKey?: string;
}

@Component({
  selector: 'app-combobox-chips-field',
  imports: [
    CommonModule,
    NgpCombobox,
    NgpComboboxDropdown,
    NgpComboboxOption,
    NgpComboboxInput,
    NgpComboboxPortal,
    NgpComboboxButton,
    NgIcon,
    InputErrorComponent,
    TitleCasePipe,
  ],
  templateUrl: './combobox-chips-field.component.html',
  styleUrls: ['./combobox-chips-field.component.scss'],
})
export default class ComboboxChipsFieldComponent<
    T extends string | Record<string, unknown>,
  >
  extends BaseInput
  implements OnInit, AfterViewInit, OnDestroy
{
  // ** Services
  readonly theme = inject(ThemeService).theme();
  private readonly util = inject(UtilService);

  // ** Inputs
  fcName = input.required<string>();
  options = input.required<T[]>();
  props = input<ComboboxChipsProps>({});
  disabled = input<boolean>(false);

  // ** ViewChilds
  readonly comboboxRef = viewChild.required<NgpCombobox>('ngpComboboxRef');
  readonly inputElement =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');
  readonly comboboxHost =
    viewChild.required<ElementRef<HTMLDivElement>>('comboboxHost');

  // * States
  readonly value = signal<T[]>([]);
  readonly filter = signal<string>('');
  readonly focusedChipIndex = signal<number>(-1);
  readonly resolvedLabelKey = computed(() => {
    return this.props().labelKey ?? 'name';
  });

  // ** Utils
  private resizeObserver: ResizeObserver | undefined;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateTimer: any;
  protected readonly filteredOptions = computed(() => {
    if (this.options && this.options.length < 0) {
      return [];
    }

    if (!this.filter()) {
      return this.options();
    }

    return this.options().filter((option) => {
      let toSearch: string;

      if (this.isObject(option)) {
        toSearch = option[this.resolvedLabelKey()] as string;
      } else {
        toSearch = option;
      }
      return this.util.string.searchByKeyword(this.filter(), toSearch);
    });
  });

  override get hideErrorProps(): boolean {
    return !!this.props()?.hideError;
  }

  override get hintProps(): boolean {
    return !!this.props()?.hint;
  }

  ngOnInit(): void {
    const fcName = this.fcName() ?? this.props()?.fcName;
    this.initFormControl(fcName as string, this.props()?.validators);

    if (this.fControl.value) {
      this.value.set(this.fControl.value);
    }

    if (this.disabled()) {
      this.fControl.disable();
    } else {
      this.fControl.enable();
    }

    const sampleOption = this.options()[0];
    if (this.isObject(sampleOption) && !this.props().labelKey) {
      throw new Error(
        'props.labelKey must be provided for options array objects',
      );
    }
  }

  ngAfterViewInit(): void {
    this.setupDropdownWidth();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  }

  updateFormControlValue(): void {
    this.fControl.patchValue(this.value());
    this.fControl.markAsDirty();
    this.fControl.markAsTouched();
    this.filter.set('');
  }

  protected onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.set(input.value);
    this.focusedChipIndex.set(-1);
  }

  protected onInputFocus(): void {
    this.comboboxRef().openDropdown();
  }

  protected onInputKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = this.value();

    if (event.key === 'Backspace') {
      if (input.value === '' && currentValue.length > 0) {
        event.preventDefault();
        const currentFocusedIndex = this.focusedChipIndex();

        if (currentFocusedIndex === -1) {
          this.focusedChipIndex.set(currentValue.length - 1);
        } else {
          const optionToRemove = currentValue[currentFocusedIndex];
          this.removeOption(optionToRemove);
          this.focusedChipIndex.set(-1);
          this.inputElement()?.nativeElement.focus();
        }
      } else {
        this.focusedChipIndex.set(-1);
      }
      return;
    }
    this.focusedChipIndex.set(-1);
  }

  protected resetOnClose(open: boolean): void {
    if (open) {
      return;
    }
    this.filter.set('');
    this.focusedChipIndex.set(-1);
  }

  protected isSelected(option: T): boolean {
    return this.value().includes(option);
  }

  protected removeOption(option: T): void {
    const currentValue = this.value();
    const updatedValue = currentValue.filter((item) => item !== option);
    this.value.set(updatedValue);
    this.focusedChipIndex.set(-1);

    this.updateFormControlValue();
  }

  protected isObject(item: string | object): item is object {
    return typeof item === 'object' && item !== null;
  }

  private setupDropdownWidth(): void {
    const hostElement = this.comboboxHost().nativeElement;
    const setWidth = (width: number) => {
      hostElement.style.setProperty('--ngp-combobox-width', `${width}px`);
    };

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        if (this.updateTimer) {
          clearTimeout(this.updateTimer);
        }

        this.updateTimer = setTimeout(() => {
          for (const entry of entries) {
            if (entry.target === hostElement) {
              setWidth(entry.contentRect.width);
              break;
            }
          }
          this.updateTimer = null;
        }, 0);
      });

      this.resizeObserver.observe(hostElement);
    }
  }
}
