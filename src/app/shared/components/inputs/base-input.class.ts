import { inject } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidatorType } from '@core/interfaces/base-input.interface';
import {
  atleastHasOneLowercase,
  atleastHasOneNumeric,
  atleastHasOneUppercase,
  valueMustMatchWithControlName,
} from '@shared/validators/custom-validators';

export class BaseInput {
  protected fControl!: FormControl;
  protected fGroup!: FormGroup;
  private readonly _controlContainer = inject(ControlContainer);

  protected initFormControl(fcName: string, validators?: Validators) {
    this.fGroup = this._controlContainer.control as FormGroup;
    this.fControl = this.fGroup.get(fcName) as FormControl;

    if (!this.fControl) {
      throw new Error(`${fcName} is not a valid form control`);
    }

    if (validators) {
      this._setFormValidators(validators);
    }
  }

  private _setFormValidators(validators: ValidatorType): void {
    const requirements = [];
    for (const [key, value] of Object.entries(validators)) {
      if (!value) continue;

      switch (key) {
        case 'required':
          requirements.push(Validators.required);
          break;
        case 'minlength':
          requirements.push(Validators.minLength(value as number));
          break;
        case 'maxlength':
          requirements.push(Validators.maxLength(value as number));
          break;
        case 'min':
          requirements.push(Validators.min(value as number));
          break;
        case 'max':
          requirements.push(Validators.max(value as number));
          break;
        case 'email':
          requirements.push(Validators.email);
          break;
        case 'mustMatchWithControl':
          //eslint-disable-next-line no-case-declarations
          const matchingFormControl = this.fGroup.get(
            value as string,
          ) as FormControl;

          requirements.push(
            valueMustMatchWithControlName(matchingFormControl, value as string),
          );
          break;
        case 'atleastHasOneUppercase':
          requirements.push(atleastHasOneUppercase);
          break;
        case 'atleastHasOneLowercase':
          requirements.push(atleastHasOneLowercase);
          break;
        case 'atleastHasOneNumeric':
          requirements.push(atleastHasOneNumeric);
          break;
      }
    }

    if (requirements.length) {
      this.fControl.setValidators(Validators.compose(requirements));
      this.fControl.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    }
  }
}
