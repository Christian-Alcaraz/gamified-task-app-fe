import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '@shared/services/theme/theme.service';
import { BaseInput } from '../base-input.class';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-select-field',
  imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
})
export class SelectFieldComponent extends BaseInput implements OnInit {
  @Input() props!: any;
  @Input() fcName!: string;

  readonly theme = inject(ThemeService).theme();

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props.fcName;
    this.initFormControl(this.fcName as string, this.props.validators);
  }

  get showError(): boolean {
    return (
      !this.props?.hideError || (!!this.fControl.errors && this.fControl.dirty)
    );
  }

  get showHint() {
    return (
      this.props?.hint &&
      (this.fControl.pristine ? true : !this.fControl.errors)
    );
  }
}
