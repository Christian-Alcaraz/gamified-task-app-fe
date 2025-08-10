import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SizeType } from '@core/constants';
import { BaseInputProps } from '@core/interfaces/base-input.interface';
import { NgIcon } from '@ng-icons/core';
import { ThemeService } from '@shared/services/theme/theme.service';
import { BaseInput } from '../base-input.class';
import { InputErrorComponent } from '../input-error/input-error.component';

type LabelLocation = 'top' | 'hide';

export interface PasswordFieldProps extends BaseInputProps {
  labelLoc?: LabelLocation;
  size?: SizeType;
  hideError?: boolean;
}

@Component({
  selector: 'app-password-field',
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent, NgIcon],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
})
export class PasswordFieldComponent extends BaseInput implements OnInit {
  @Input() props!: PasswordFieldProps;
  @Input() fcName!: string;
  @Input() disabled = false;

  readonly theme = inject(ThemeService).theme();

  showPassword = signal(false);
  showPasswordIcon = computed(() =>
    this.showPassword() ? 'saxEyeSlashOutline' : 'saxEyeOutline',
  );

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props.fcName;
    this.initFormControl(this.fcName, this.props?.validators);
  }

  get showError(): boolean {
    return this.props?.hideError
      ? false
      : !!this.fControl.errors && this.fControl.dirty;
  }

  get showHint() {
    return (
      this.props.hint && (this.fControl.pristine ? true : !this.fControl.errors)
    );
  }
}
