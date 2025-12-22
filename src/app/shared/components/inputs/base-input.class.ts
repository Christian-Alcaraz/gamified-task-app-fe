import { inject } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IValidator } from '@core/interfaces/base-input.interface';
import {
  atleastHasOneLowercase,
  atleastHasOneNumeric,
  atleastHasOneUppercase,
  valueMustMatchWithControlName,
} from '@shared/validators/custom-validators';

type FormType = FormControl | FormArray;

export abstract class BaseInput {
  protected fControl!: FormType;
  protected fGroup!: FormGroup;
  //Todo: Try to make a shadow property for this; create private getter function so we lessen the boilerplate of overrides
  abstract get hideErrorProps(): boolean;
  abstract get hintProps(): boolean;
  private readonly _controlContainer = inject(ControlContainer);
  private _props: any; //eslint-disable-line @typescript-eslint/no-explicit-any

  protected initFormControl(fcName: string, validators?: Validators) {
    this.fGroup = this._controlContainer.control as FormGroup;
    this.fControl = this.fGroup.get(fcName) as FormType;

    if (!this.fControl) {
      throw new Error(`${fcName} is not a valid form control`);
    }

    if (validators) {
      this._setFormValidators(validators);
    }
  }

  get fControlAsFA(): FormArray | null {
    if (this.fControl instanceof FormArray) return this.fControl;
    return null;
  }

  get fControlAsFC(): FormControl | null {
    if (this.fControl instanceof FormControl) return this.fControl;
    return null;
  }

  get showError(): boolean {
    return this.hideErrorProps
      ? false
      : !!this.fControl.errors &&
          (this.fControl.dirty || this.fControl.touched);
  }

  get showHint(): boolean {
    return (
      this.hintProps && (this.fControl.pristine ? true : !this.fControl.errors)
    );
  }

  private _setFormValidators(validators: IValidator): void {
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
        case 'mustMatchWithControl': {
          const matchingFormControl = this.fGroup.get(
            value as string,
          ) as FormControl;

          requirements.push(
            valueMustMatchWithControlName(matchingFormControl, value as string),
          );
          return;
        }
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
      this.fControl.updateValueAndValidity();
    }
  }
}
