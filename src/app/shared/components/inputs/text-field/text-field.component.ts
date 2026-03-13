import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ESize } from '@core/constants';
import { IBaseInputProps } from '@core/interfaces/base-input.interface';
import { ThemeService } from '@shared/services/theme/theme.service';
import { provideNgxMask } from 'ngx-mask';
import { BaseInput } from '../base-input.class';
import { InputErrorComponent } from '../input-error/input-error.component';
import { NumberInputDirective } from './number-input.directive';

type LabelLocation = 'top' | 'hide';
type TextFieldType = 'text' | 'number' | 'email' | 'currency';

export interface ITextFieldProps extends IBaseInputProps {
  type: TextFieldType;
  labelLoc?: LabelLocation;
  size?: ESize;
  hideError?: boolean;
  disableHelperText?: boolean; //Where lies the error and hint
  disableHoverEffect?: boolean;
  // mask?: string; //Todo: ngx-mask is finicky as hell
}

const NUMBER_MAX_VALUE = 999999999999;
@Component({
  selector: 'app-text-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    NumberInputDirective,
  ],
  providers: [provideNgxMask()],
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class TextFieldComponent extends BaseInput implements OnInit {
  @Input({ required: true }) props!: ITextFieldProps;
  @Input() fcName!: string;
  @Input() disabled = false;

  readonly theme = inject(ThemeService).theme;

  inputType = 'text';

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props?.fcName;
    this.initFormControl(this.fcName, this.props?.validators);

    this.evaluateInputType();

    if (this.props?.type === 'number' && this.fControl) {
      this.fControl.valueChanges.subscribe((value) => {
        if (value === '') {
          this.fControl.setValue(null, { emitEvent: false });
        } else if (!isNaN(value)) {
          // ! Error: Number has max value in js
          // * Bandaid fix number input max with 999999999999
          this.fControl.setValue(
            Number(value) > NUMBER_MAX_VALUE ? NUMBER_MAX_VALUE : Number(value),
            { emitEvent: false },
          );
        }
      });
    }
  }

  override get hideErrorProps(): boolean {
    return !!this.props?.hideError;
  }
  override get hintProps(): boolean {
    return !!this.props?.hint;
  }

  private evaluateInputType() {
    if (this.props.type === 'number' || this.props.type === 'text') {
      this.inputType = 'text';
    }

    if (this.props.type === 'email') {
      this.inputType = 'email';
    }
  }
}
