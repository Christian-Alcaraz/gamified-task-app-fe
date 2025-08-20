import { Component, inject, Input, OnInit } from '@angular/core';
import { BaseInputProps } from '@core/interfaces/base-input.interface';
import { ThemeService } from '@shared/services/theme/theme.service';
import { BaseInput } from '../base-input.class';
import { Checkbox } from './checkbox';

@Component({
  selector: 'app-checkbox-field',
  imports: [Checkbox],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent extends BaseInput implements OnInit {
  //Todo: Hey, do this with input field boiler fields
  @Input() props!: BaseInputProps;
  @Input() disabled = false;
  @Input() fcName!: string;

  readonly theme = inject(ThemeService).theme();

  ngOnInit(): void {
    this.fcName = this.fcName ?? this.props.fcName;
    console.assert(!!this.fcName, 'fcName must be provided');

    this.initFormControl(this.fcName as string, this.props.validators);
  }
}
