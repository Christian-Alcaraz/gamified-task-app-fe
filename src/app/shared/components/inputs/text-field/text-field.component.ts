import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SizeType } from '@core/constants';
import { BaseInputProps } from '@core/interfaces/base-input.interface';
import { ThemeService } from '@shared/services/theme/theme.service';
import { BaseInput } from '../base-input.class';
import { InputErrorComponent } from '../input-error/input-error.component';

type LabelLocation = 'top' | 'hide';
type TextFieldType = 'text' | 'number' | 'email';

export interface TextFieldProps extends BaseInputProps {
  type: TextFieldType;
  labelLoc?: LabelLocation;
  size?: SizeType;
  hideError?: boolean;
}

// Todo: Enhancement Show Error after user is done typing or onBlur

@Component({
  selector: 'app-text-field',
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
})
export class TextFieldComponent extends BaseInput implements OnInit {
  @Input({ required: true }) props!: TextFieldProps;
  @Input() fcName!: string;
  @Input() disabled = false;

  readonly theme = inject(ThemeService).theme();

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props.fcName;
    this.initFormControl(this.fcName, this.props?.validators);

    if (this.props.type === 'number' && this.fControl) {
      this.fControl.valueChanges.subscribe((value) => {
        if (value === '') {
          this.fControl.setValue(null, { emitEvent: false });
        } else if (!isNaN(value)) {
          this.fControl.setValue(Number(value), { emitEvent: false });
        }
      });
    }
  }

  get showError(): boolean {
    return this.props?.hideError
      ? false
      : !!this.fControl.errors &&
          (this.fControl.dirty || this.fControl.touched);
  }

  get showHint() {
    return (
      this.props.hint && (this.fControl.pristine ? true : !this.fControl.errors)
    );
  }
}
